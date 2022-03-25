import request from "supertest";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import RoleModel from "../models/role.model";
import app from "../app";
import getEnvVars from "../config/config";

jest.mock("../middleware/authorizedAccess", () =>
  jest.fn((req: Request, res: Response, next: NextFunction) => {
    return next();
  })
);

jest.mock("../middleware/adminAccess", () =>
  jest.fn((req: Request, res: Response, next: NextFunction) => {
    return next();
  })
);

const { dbUri, dbName } = getEnvVars();

describe("role api tests", () => {
  beforeAll(async () => {
    await mongoose.connect(dbUri, { dbName: dbName });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  test("create role test - complete correct dataset", async () => {
    const input = {
      role: "test user role 0003",
      description: "test user description",
    };
    const preTestRoleInDb = await RoleModel.findOne({ role: input.role });
    if (preTestRoleInDb) {
      await RoleModel.deleteOne({ role: input.role });
    }
    const result = await request(app).post("/api/v1/role").send(input);
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
    const preTestRoleInDb = await RoleModel.findOne({ role: input.role });
    if (preTestRoleInDb) {
      await RoleModel.deleteOne({ role: input.role });
    }
    const result = await request(app).post("/api/v1/role").send(input);
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
    const preTestRoleInDb = await RoleModel.findOne({ role: input.role });
    if (preTestRoleInDb) {
      await RoleModel.deleteOne({ role: input.role });
    }
    const result = await request(app).post("/api/v1/role").send(input);
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
    const preTestRoleInDb = await RoleModel.findOne({ role: input.role });
    if (preTestRoleInDb) {
      await RoleModel.deleteOne({ role: input.role });
    }
    const result = await request(app).post("/api/v1/role").send(input);
    const dbRole = await RoleModel.findOne({ role: input.role });
    expect(dbRole).toBeFalsy();
    if (dbRole) {
      await RoleModel.deleteOne({ role: input.role });
    }
    expect(result.status).toBe(400);
    expect(result.body[0].code).toBe("too_small");
    expect(result.body[0].message).toBe("role should be 4 chars minimum");
    expect(result.body[0].minimum).toBe(4);
  });

  test("create role test - role name with special symbols", async () => {
    const input = {
      role: "abc! a+",
    };
    const preTestRoleInDb = await RoleModel.findOne({ role: input.role });
    if (preTestRoleInDb) {
      await RoleModel.deleteOne({ role: input.role });
    }
    const result = await request(app).post("/api/v1/role").send(input);
    const dbRole = await RoleModel.findOne({ role: input.role });
    expect(dbRole).toBeFalsy();
    if (dbRole) {
      await RoleModel.deleteOne({ role: input.role });
    }
    expect(result.status).toBe(400);
    expect(result.body[0].code).toBe("invalid_string");
    expect(result.body[0].message).toBe("wrong format");
  });

  test("create role test - role description is number", async () => {
    const input = {
      role: "test role 00003",
      description: 34567833,
    };
    const preTestRoleInDb = await RoleModel.findOne({ role: input.role });
    if (preTestRoleInDb) {
      await RoleModel.deleteOne({ role: input.role });
    }
    const result = await request(app).post("/api/v1/role").send(input);
    const dbRole = await RoleModel.findOne({ role: input.role });
    expect(dbRole).toBeFalsy();
    if (dbRole) {
      await RoleModel.deleteOne({ role: input.role });
    }
    expect(result.status).toBe(400);
    expect(result.body[0].code).toBe("invalid_type");
  });
});
