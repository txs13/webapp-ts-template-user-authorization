import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import getEnvVars from "../config/config";
import AdminModel, { AdminDocument, AdminInput } from "../models/admin.model";
import RoleModel, { RoleDocument, RoleInput } from "../models/role.model";
import SessionModel, { SessionInput } from "../models/session.model";
import UserModel, { UserDocument, UserInput } from "../models/user.model";

const { dbUri, testDbName, refreshTokenTtl, privKey } = getEnvVars();

const userRoleName = "test case role 00003";
const adminRoleName = "test case admin role 00001";
const userEmail = "test3@example.com";
const adminEmail = "testadmin2@example.com";
const userPassword = "qwerty12345";
const adminPassword = "qwerty12345";
const userAgentContent = "user agent content";
const newUserRoleInput1: RoleInput = {
  role: "New test role to be created 1",
};
const newUserRoleInput2: RoleInput = {
  role: "New test role to be created 2",
};


describe("authorization and admin access tests", () => {
  beforeAll(async () => {
    await mongoose.connect(dbUri, { dbName: testDbName });
    // create user and admin: user roles, users, granting admin rights for one of them
    const adminUserRole: RoleInput = {
      role: adminRoleName,
    };
    const userRole: RoleInput = {
      role: userRoleName,
    };
    const dbUserRole: RoleDocument = await RoleModel.create(userRole);
    const dbAdminRole: RoleDocument = await RoleModel.create(adminUserRole);
    expect(dbUserRole).toBeTruthy();
    expect(dbAdminRole).toBeTruthy();
    const adminUser = {
      email: adminEmail,
      password: adminPassword,
      userrole_id: dbAdminRole._id,
      name: "admin name",
      isConfirmed: true
    };
    const user = {
      email: userEmail,
      password: userPassword,
      userrole_id: dbUserRole._id,
      name: "user name",
      isConfirmed: true,
    };
    const dbAdmin = await UserModel.create(adminUser);
    const dbUser = await UserModel.create(user);
    expect(dbAdmin).toBeTruthy();
    expect(dbUser).toBeTruthy();
    const adminInputRecord: AdminInput = {
      userId: dbAdmin._id,
    };
    const dbAdminRecord = AdminModel.create(adminInputRecord);
    expect(dbAdminRecord).toBeTruthy();
  });

  afterAll(async () => {
    // clean up users, roles, admin records
    await UserModel.deleteMany({});
    await RoleModel.deleteMany({});
    await AdminModel.deleteMany({});
    await SessionModel.deleteMany({});
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  test("authorized new role creation admin user - it requires successfull admin rights", async () => {
    // login as admin
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .set("User-agent", userAgentContent)
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    expect(loginResult.statusCode).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();
    const accessToken = loginResult.body.accessToken;

    // create new role under admin user
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", accessToken)
      .send(newUserRoleInput1);
    // api call should be successful
    expect(result.statusCode).toBe(201);
    const dbRole = await RoleModel.findOne({ role: newUserRoleInput1.role });
    expect(dbRole).toBeTruthy();
    // check correct action record in the DB
    const dbSession = await SessionModel.findOne({
      userId: loginResult.body.user._id,
    });
    expect(dbSession).toBeTruthy();
    expect(dbSession?.userActions.length).toBe(1);
    expect(dbSession?.userActions[0].apiRoute).toBe("/api/v1/role");
    expect(dbSession?.userActions[0].apiMethod).toBe("POST");
    expect(dbSession?.userActions[0].successful).toBeTruthy();
    // clean up database
    await SessionModel.deleteOne({ _id: dbSession?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("authorized new role creation standard user - it requires successfull admin rights", async () => {
    // login as user
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .set("User-agent", userAgentContent)
      .send({
        email: userEmail,
        password: userPassword,
      });

    expect(loginResult.statusCode).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();
    const accessToken = loginResult.body.accessToken;

    // create new role under user rights
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", accessToken)
      .send(newUserRoleInput1);

    // api call should be NOT successful
    expect(result.statusCode).toBe(401);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("no admin rights granted");
    const dbRole = await RoleModel.findOne({ role: newUserRoleInput1.role });
    expect(dbRole).toBeFalsy();
    const dbSession = await SessionModel.findOne({
      userId: loginResult.body.user._id,
    });
    expect(dbSession).toBeTruthy();
    expect(dbSession?.userActions.length).toBe(1);
    expect(dbSession?.userActions[0].apiRoute).toBe("/api/v1/role");
    expect(dbSession?.userActions[0].apiMethod).toBe("POST");
    expect(dbSession?.userActions[0].successful).toBeFalsy();

    // clean up database
    await SessionModel.deleteOne({ _id: dbSession?._id });
  });

  test("logout - resource which required standard user rights with expired session", async () => {
    // login as admin
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .set("User-agent", userAgentContent)
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    expect(loginResult.statusCode).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();
    const accessToken = loginResult.body.accessToken;

    // logout as admin
    const logoutResult = await request(app)
      .post("/api/v1/user/logout")
      .set("User-agent", userAgentContent)
      .set("Authorization", accessToken);

    expect(logoutResult.statusCode).toBe(200);

    // create new role under admin user
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", accessToken)
      .send(newUserRoleInput1);
    // api call should be NOT successful
    expect(result.statusCode).toBe(409);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("session is closed");
    const dbRole = await RoleModel.findOne({ role: newUserRoleInput1.role });
    expect(dbRole).toBeFalsy();
    // check correct action record in the DB
    const dbSession = await SessionModel.findOne({
      userId: loginResult.body.user._id,
    });
    expect(dbSession).toBeTruthy();
    expect(dbSession?.userActions.length).toBe(2);
    let userActions: any = [];
    if (dbSession) {
      userActions = [...dbSession.userActions];
    }
    expect(userActions[0].apiRoute).toBe("/api/v1/user/logout");
    expect(userActions[0].apiMethod).toBe("POST");
    expect(userActions[0].successful).toBeTruthy();
    expect(userActions[1].apiRoute).toBe("/api/v1/role");
    expect(userActions[1].apiMethod).toBe("POST");
    expect(userActions[1].successful).toBeFalsy();

    // clean up database
    await SessionModel.deleteOne({ _id: dbSession?._id });
  });

  test("logout - resource which required standard user rights with expired token", async () => {
    const dbUser = await UserModel.findOne({ email: adminEmail });
    // maually create correct session
    const sessionInput: SessionInput = {
      userId: dbUser?._id,
      userAgent: userAgentContent,
      ipAddress: "::ffff:127.0.0.1",
      sessionTTL: refreshTokenTtl,
    };
    const dbSession = await SessionModel.create(sessionInput);
    // create correct expired token
    const payloadObject = {
      userId: dbUser?._id.toString(),
      sessionId: dbSession._id.toString(),
    };
    const token: string = jwt.sign(payloadObject, privKey, {
      expiresIn: -1000,
      algorithm: "RS256",
    });
    const sessionToken = "Bearer " + token;

    // create new role under admin user
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", sessionToken)
      .send(newUserRoleInput1);

    // api call should be NOT successful
    expect(result.statusCode).toBe(401);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("wrong token");

    const dbRole = await RoleModel.findOne({ role: newUserRoleInput1.role });
    expect(dbRole).toBeFalsy();

    await SessionModel.deleteOne({ _id: dbSession._id });
  });

  test("resource request with empty string", async () => {

    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", "")
      .send(newUserRoleInput1);

    expect(result.statusCode).toBe(401);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("token is required");

    const dbRole = await RoleModel.findOne({ role: newUserRoleInput1.role });
    expect(dbRole).toBeFalsy();
  }, 10000);

  test("resource request without auth token", async () => {
    
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .send(newUserRoleInput1);

    expect(result.statusCode).toBe(401);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("token is required");

    const dbRole = await RoleModel.findOne({ role: newUserRoleInput1.role });
    expect(dbRole).toBeFalsy();
  });

  test("access resourses with refresh token", async () => {
    // login as admin
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .set("User-agent", userAgentContent)
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    expect(loginResult.statusCode).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();
    const refreshToken = loginResult.body.refreshToken;

    // create new role under admin user
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", refreshToken)
      .send(newUserRoleInput1);
    // api call should be successful
    expect(result.statusCode).toBe(409);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("wrong session");

    const dbRole = await RoleModel.findOne({ role: newUserRoleInput1.role });
    expect(dbRole).toBeFalsy();
    // check correct action record in the DB
    const dbSession = await SessionModel.findOne({
      userId: loginResult.body.user._id,
    });
    expect(dbSession).toBeTruthy();
    expect(dbSession?.userActions.length).toBe(1);
    expect(dbSession?.userActions[0].apiRoute).toBe("/api/v1/role");
    expect(dbSession?.userActions[0].apiMethod).toBe("POST");
    expect(dbSession?.userActions[0].successful).toBeFalsy();
    expect(dbSession?.closedAt).toBeTruthy();
    // clean up database
    await SessionModel.deleteOne({ _id: dbSession?._id });
  })
});
