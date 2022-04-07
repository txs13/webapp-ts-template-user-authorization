import request from "supertest";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import RoleModel, { RoleDocument, RoleInput } from "../models/role.model";
import UserModel, { UserInput } from "../models/user.model";
import AdminModel, { AdminInput } from "../models/admin.model";
import SessionModel from "../models/session.model";
import app from "../app";
import getEnvVars from "../config/config";

const adminRoleName = "test case admin role 00001";
const adminEmail = "testadmin2@example.com";
const adminPassword = "qwerty12345";
const userAgentContent = "user agent content";

const { dbUri, testDbName } = getEnvVars();

describe("role api tests", () => {
  let mockToken: string;

  beforeAll(async () => {
    await mongoose.connect(dbUri, { dbName: testDbName });
    // create admin user role
    const adminUserRole: RoleInput = {
      role: adminRoleName,
    };
    const dbAdminRole: RoleDocument = await RoleModel.create(adminUserRole);
    expect(dbAdminRole).toBeTruthy();
    // create admin user
    const adminUser: UserInput = {
      email: adminEmail,
      password: adminPassword,
      userrole_id: dbAdminRole._id,
      name: "admin name",
    };
    const dbAdmin = await UserModel.create(adminUser);
    expect(dbAdmin).toBeTruthy();
    //grant admin rights to the admin user
    const adminInputRecord: AdminInput = {
      userId: dbAdmin._id,
    };
    const dbAdminRecord = AdminModel.create(adminInputRecord);
    expect(dbAdminRecord).toBeTruthy();

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
    mockToken = loginResult.body.accessToken;
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

  test("create role test - complete correct dataset", async () => {
    const input = {
      role: "test user role 0003",
      description: "test user description",
    };
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", mockToken)
      .send(input);
    const dbRole = await RoleModel.findById(result.body._id);
    expect(dbRole).toBeTruthy();
    if (dbRole) {
      expect(result.statusCode).toBe(201);
      expect(result.body.role).toBe(dbRole.role);
      expect(result.body.role).toBe(input.role);
      expect(result.body.description).toBe(dbRole.description);
      expect(result.body.description).toBe(input.description);
    }
    await RoleModel.deleteOne({ role: input.role });
  });

  test("create role test - correct obligatory dataset", async () => {
    const input = {
      role: "test user role 0003",
    };
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", mockToken)
      .send(input);
    const dbRole = await RoleModel.findOne({ _id: result.body._id });
    expect(dbRole).toBeTruthy();
    if (dbRole) {
      expect(result.statusCode).toBe(201);
      expect(result.body.role).toBe(dbRole.role);
      expect(result.body.role).toBe(input.role);
      expect(result.body.description).toBeFalsy();
      expect(dbRole.description).toBeFalsy();
    }
    await RoleModel.deleteOne({ role: input.role });
  });

  test("create role test - short description", async () => {
    const input = {
      role: "test user role 0003",
      description: "abc",
    };
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", mockToken)
      .send(input);
    const dbRole = await RoleModel.findOne({ role: input.role });
    expect(dbRole).toBeFalsy();
    if (dbRole) {
      await RoleModel.deleteOne({ role: input.role });
    }
    expect(result.status).toBe(400);
    expect(result.body[0].code).toBe("too_small");
    expect(result.body[0].message).toBe(
      "role description should be 6 chars minimum"
    );
    expect(result.body[0].minimum).toBe(6);
  });

  test("create role test - undefined role name", async () => {
    const input = {
      role: "",
    };
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", mockToken)
      .send(input);
    const dbRole = await RoleModel.findOne({ role: input.role });
    expect(dbRole).toBeFalsy();
    expect(result.status).toBe(400);
    expect(result.body[0].code).toBe("too_small");
    expect(result.body[0].message).toBe("role should be 4 chars minimum");
    expect(result.body[0].minimum).toBe(4);
  });

  test("create role test - role name with special symbols", async () => {
    const input = {
      role: "abc! a+",
    };
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", mockToken)
      .send(input);
    const dbRole = await RoleModel.findOne({ role: input.role });
    expect(dbRole).toBeFalsy();
    expect(result.status).toBe(400);
    expect(result.body[0].code).toBe("invalid_string");
    expect(result.body[0].message).toBe("wrong format");
  });

  test("create role test - role description is number", async () => {
    const input = {
      role: "test role 00003",
      description: 34567833,
    };
    const result = await request(app)
      .post("/api/v1/role")
      .set("User-agent", userAgentContent)
      .set("Authorization", mockToken)
      .send(input);
    const dbRole = await RoleModel.findOne({ role: input.role });
    expect(dbRole).toBeFalsy();
    expect(result.status).toBe(400);
    expect(result.body[0].code).toBe("invalid_type");
  });

  test("get empty roles list with one admin role in list", async () => {
    const dbRoles = await RoleModel.find({});
    expect(dbRoles.length).toBe(1);
    expect(dbRoles[0].role.toLowerCase()).toContain("admin");

    const result = await request(app)
      .get("/api/v1/role")
      .set("User-agent", userAgentContent);

    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBe(0);
  });

  test("get public roles array with one admin role in list, one public role", async () => {
    // create public role
    const publicRole: RoleInput = {
      role: "pretty standard user",
    };
    const dbRole = await RoleModel.create(publicRole);
    // check that there are 2 roles now in the DB
    const dbRoles = await RoleModel.find({});
    expect(dbRoles.length).toBe(2);
    // api call
    const result = await request(app)
      .get("/api/v1/role")
      .set("User-agent", userAgentContent);
    // result check
    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBe(1);
    expect(result.body[0].role).toBe(publicRole.role)
    expect(result.body[0]._id).toBe(dbRole._id.toString());

    // clean up DB
    await RoleModel.deleteOne({_id: dbRole._id})
  });
});
