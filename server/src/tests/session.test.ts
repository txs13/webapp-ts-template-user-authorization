import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import RoleModel, { RoleDocument, RoleInput } from "../models/role.model";
import UserModel, { UserInput } from "../models/user.model";
import SessionModel from "../models/session.model";
import AdminModel from "../models/admin.model";
import app from "../app";
import getEnvVars from "../config/config";
import { DecodedItem } from "../utils/jwt.utils";

const { dbUri, testDbName, refreshTokenTtl, accessTokenTtl, pubKey } =
  getEnvVars();
// test input data
const roleName = "test case role 00002";
const userEmail = "test2@example.com";
const notConfirmedUserEmail = "test3@example.com"
const userPassword = "qwerty12345";
const userAgentContent = "user agent content";

describe("login / logout tests", () => {
  beforeAll(async () => {
    await mongoose.connect(dbUri, { dbName: testDbName });
    // create role - because it is needed for the user registration
    const roleInput: RoleInput = {
      role: roleName,
    };
    let dbRole = await RoleModel.create(roleInput);
    // user dataset
    const userInput = {
      email: userEmail,
      password: userPassword,
      name: "Vasyliy",
      familyname: "Pupkin",
      phone: "+1 254 456 23 45",
      address: "USA, Philadelphia, Linkoln Str. 25",
      company: "Roga i Kopyta Ltd.",
      position: "anykey tester",
      description: "very important test case user",
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };
    // not confirmed user dataset
    const notConfirmedUser = {
      email: notConfirmedUserEmail,
      password: userPassword,
      name: "Vasyliy",
      userrole_id: dbRole._id.toString(),
    };
    // create user db record
    await UserModel.create(userInput);
    await UserModel.create(notConfirmedUser);
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await RoleModel.deleteMany({});
    await AdminModel.deleteMany({});
    await SessionModel.deleteMany({});
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  test("login test with correct credentials", async () => {
    // api call
    const result = await request(app)
      .post("/api/v1/user/login")
      .set("User-agent", userAgentContent)
      .send({
        email: userEmail,
        password: userPassword,
      });

    // checking status and package
    expect(result.statusCode).toBe(200);
    expect(result.body.sessionTtl).toBe(refreshTokenTtl);
    expect(result.body.accessToken).toBeTruthy();
    expect(result.body.refreshToken).toBeTruthy();
    expect(result.body.user).toBeTruthy();
    expect(result.body.user.email).toBe(userEmail);
    expect(result.body.user.password).toBeFalsy();

    // checking the correctness of the session db record
    const dbUser = await UserModel.findOne({ email: userEmail });
    const sessionDb = await SessionModel.find({ userId: dbUser?.id });
    expect(sessionDb.length).toBe(1);
    expect(sessionDb[0].sessionTTL).toBe(refreshTokenTtl);
    expect(sessionDb[0].ipAddress).toContain("127.0.0.1");
    expect(sessionDb[0].userAgent).toBe(userAgentContent);
    expect(sessionDb[0].accessTokens[0].tokenTTL).toBe(accessTokenTtl);
    expect(sessionDb[0].accessTokens[0].tokenType).toBe("loginAccessToken");

    // checking decoded tokens
    const accessToken = result.body.accessToken.replace(/^Bearer\s/, "");
    const refreshToken = result.body.refreshToken.replace(/^Bearer\s/, "");

    const decodedAccessToken = jwt.verify(
      accessToken,
      pubKey as string
    ) as DecodedItem;
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      pubKey as string
    ) as DecodedItem;

    expect(decodedAccessToken.userId).toEqual(decodedRefreshToken.userId);
    expect(decodedAccessToken.sessionId).toEqual(decodedRefreshToken.sessionId);
    expect(decodedAccessToken.userId).toEqual(sessionDb[0].userId.toString());
    expect(decodedAccessToken.sessionId).toEqual(sessionDb[0]._id.toString());

    const accessTokenCalcTtl = decodedAccessToken.exp - decodedAccessToken.iat;
    const refreshTokenCalcTtl =
      decodedRefreshToken.exp - decodedRefreshToken.iat;

    expect(accessTokenCalcTtl).toBe(accessTokenTtl);
    expect(refreshTokenCalcTtl).toBe(refreshTokenTtl);

    // database cleanup for the future tests
    await SessionModel.deleteOne({ _id: sessionDb[0]._id });
  });

  test("login test with incorrect password", async () => {
    const result = await request(app).post("/api/v1/user/login").send({
      email: userEmail,
      password: "userPassword",
    });
    // check the correctness of the error message
    expect(result.statusCode).toBe(401);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("Invalid email or password");
    // check that no new session was added
    const dbUser = await UserModel.findOne({ email: userEmail });
    const dbSession = await SessionModel.find({ userId: dbUser?._id });
    expect(dbSession.length).toBe(0);
  });

  test("login test with incorrect email", async () => {
    const result = await request(app).post("/api/v1/user/login").send({
      email: "userEmail",
      password: userPassword,
    });
    // check the correctness of the error message
    expect(result.statusCode).toBe(401);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("Invalid email or password");
  });

  test("login test with incomplete credentials", async () => {
    const result = await request(app).post("/api/v1/user/login").send({});
    expect(result.statusCode).toBe(400);
    expect(result.body.length).toBe(2);
    // check the correctness of the error messages
    let bodyItem = result.body.filter((it: any) => it.path.includes("email"));
    expect(bodyItem[0].code).toBe("invalid_type");
    expect(bodyItem[0].message).toBe("email is required");
    bodyItem = result.body.filter((it: any) => it.path.includes("password"));
    expect(bodyItem[0].code).toBe("invalid_type");
    expect(bodyItem[0].message).toBe("password is required");
    // check that no new session was added
    const dbUser = await UserModel.findOne({ email: userEmail });
    const dbSession = await SessionModel.find({ userId: dbUser?._id });
    expect(dbSession.length).toBe(0);
  });

  test("normal logout", async () => {
    // check if there is somethig left after prefious not successfull test and cleaning DB
    let user = await UserModel.findOne({ email: userEmail });
    let dbSessions = await SessionModel.find({ userId: user?._id });
    if (dbSessions.length > 0) {
      await SessionModel.deleteMany({ userId: user?._id });
    }

    // implies that login procedure works in teh scope of the preceeding test
    // performing pure login through the api call
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .set("User-agent", userAgentContent)
      .send({
        email: userEmail,
        password: userPassword,
      });

    // checking status and package
    expect(loginResult.statusCode).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();
    expect(loginResult.body.refreshToken).toBeTruthy();
    // extracting accessToken for the logout call
    const accessToken = loginResult.body.accessToken;

    // performing logout - pure api call
    const logoutResult = await request(app)
      .post("/api/v1/user/logout")
      .set("Authorization", accessToken)
      .set("User-agent", userAgentContent);

    // check response content
    expect(logoutResult.statusCode).toBe(200);
    expect(logoutResult.body.length).toBe(1);
    expect(logoutResult.body[0].message).toBe("successfully logged out");

    // check correctness of the DB record
    dbSessions = await SessionModel.find({ email: userEmail });
    expect(dbSessions.length).toBe(1);
    expect(dbSessions[0].closedAt).toBeTruthy();
    expect(dbSessions[0].userActions.length).toBe(1);
    expect(dbSessions[0].userActions[0].apiRoute).toBe("/api/v1/user/logout");
    expect(dbSessions[0].userActions[0].apiMethod).toBe("POST");
    expect(dbSessions[0].userActions[0].successful).toBeTruthy();

    // clean up DB after successfull test
    await SessionModel.deleteOne({ _id: dbSessions[0].id });
  });

  test("get fresh access token using refresh token", async () => {
    // check if there is somethig left after previous not successfull test and cleaning DB
    let user = await UserModel.findOne({ email: userEmail });
    let dbSessions = await SessionModel.find({ userId: user?._id });
    if (dbSessions.length > 0) {
      await SessionModel.deleteMany({ userId: user?._id });
    }

    // implies that login procedure works in teh scope of the preceeding test
    // performing pure login through the api call
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .set("User-agent", userAgentContent)
      .send({
        email: userEmail,
        password: userPassword,
      });

    // checking status and package
    expect(loginResult.statusCode).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();
    expect(loginResult.body.refreshToken).toBeTruthy();

    // extracting accessToken for the logout call
    const refreshToken = loginResult.body.refreshToken;

    // getting fresh access token
    const refreshResult = await request(app)
      .post("/api/v1/user/refresh")
      .set("User-agent", userAgentContent)
      .set("Authorization", refreshToken);
    expect(refreshResult.statusCode).toBe(200);
    expect(refreshResult.body.accessToken).toBeTruthy();
    expect(refreshResult.body.user.email).toBe(userEmail);
    expect(refreshResult.body.isAdmin).toBeFalsy();
    const newAccessToken = refreshResult.body.accessToken;

    // check new token through passing it to logout api call
    const logoutResult = await request(app)
      .post("/api/v1/user/logout")
      .set("User-agent", userAgentContent)
      .set("Authorization", newAccessToken);
    expect(logoutResult.statusCode).toBe(200);
    expect(logoutResult.body.length).toBe(1);
    expect(logoutResult.body[0].message).toBe("successfully logged out");

    // check new AccessToken Record
    const dbUser = await UserModel.findOne({ email: userEmail });
    const dbSession = await SessionModel.findOne({ userId: dbUser?._id });
    const accessTokens: any = [...(dbSession?.accessTokens as any)];
    const userActions: any = [...(dbSession?.userActions as any)];

    expect(accessTokens[0].tokenType).toBe("loginAccessToken");
    expect(accessTokens[0].tokenTTL).toBe(accessTokenTtl);
    expect(accessTokens[1].tokenType).toBe("refreshAccessToken");
    expect(accessTokens[1].tokenTTL).toBe(accessTokenTtl);

    expect(userActions[0].apiRoute).toBe("/api/v1/user/refresh");
    expect(userActions[0].apiMethod).toBe("POST");
    expect(userActions[0].successful).toBeTruthy();
    expect(userActions[1].apiRoute).toBe("/api/v1/user/logout");
    expect(userActions[1].apiMethod).toBe("POST");
    expect(userActions[1].successful).toBeTruthy();

    // clean up database
    await SessionModel.deleteOne({ _id: dbSession?._id });
  });

  test("refresh access token using valid access token", async () => {
    // check if there is somethig left after prefious not successfull test and cleaning DB
    let user = await UserModel.findOne({ email: userEmail });
    let dbSessions = await SessionModel.find({ userId: user?._id });
    if (dbSessions.length > 0) {
      await SessionModel.deleteMany({ userId: user?._id });
    }

    // implies that login procedure works in the scope of the preceeding test
    // performing pure login through the api call
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .set("User-agent", userAgentContent)
      .send({
        email: userEmail,
        password: userPassword,
      });

    // checking status and package
    expect(loginResult.statusCode).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();
    expect(loginResult.body.refreshToken).toBeTruthy();

    // extracting accessToken for the logout call
    const accessToken = loginResult.body.accessToken;

    // getting fresh access token
    const refreshResult = await request(app)
      .post("/api/v1/user/refresh")
      .set("User-agent", userAgentContent)
      .set("Authorization", accessToken);
    expect(refreshResult.statusCode).toBe(409);
    expect(refreshResult.body.length).toBe(1);
    expect(refreshResult.body[0].message).toBe("wrong session");

    // check correctness DB
    const dbUser = await UserModel.findOne({ email: userEmail });
    const dbSession = await SessionModel.findOne({ userId: dbUser?._id });
    expect(dbSession?.accessTokens.length).toBe(1);

    const userActions: any = [...(dbSession?.userActions as any)];
    expect(userActions.length).toBe(1);
    expect(userActions[0].apiRoute).toBe("/api/v1/user/refresh");
    expect(userActions[0].apiMethod).toBe("POST");
    expect(userActions[0].successful).toBeFalsy();

    // clean up DB
    await SessionModel.deleteOne({ _id: dbSession?._id });
  });

  test("login with not confirmed user", async () => {
    // check if there is something left after previous not successful test and cleaning DB
    let user = await UserModel.findOne({ email: notConfirmedUserEmail });
    let dbSessions = await SessionModel.find({ userId: user?._id });
    if (dbSessions.length > 0) {
      await SessionModel.deleteMany({ userId: user?._id });
    }

    // implies that login procedure works in the scope of the preceding test
    // performing pure login through the api call
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .set("User-agent", userAgentContent)
      .send({
        email: notConfirmedUserEmail,
        password: userPassword,
      });

    // check the correctness of the error message
    expect(loginResult.statusCode).toBe(401);
    expect(loginResult.body.length).toBe(1);
    expect(loginResult.body[0].message).toBe(
      "Your account is not confirmed yet"
    );
    // check that no new session was added
    const dbSession = await SessionModel.find({ userId: user?._id });
    expect(dbSession.length).toBe(0);
  })
});
