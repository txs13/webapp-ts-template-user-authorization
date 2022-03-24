import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import RoleModel, { RoleDocument, RoleInput } from "../models/role.model";
import UserModel, { UserInput } from "../models/user.model";
import SessionModel from "../models/session.model";
import app from "../app";
import getEnvVars from "../config/config";

const { dbUri, dbName, refreshTokenTtl, accessTokenTtl, pubKey } = getEnvVars();
// test input data
const roleName = "test case role 00002";
const userEmail = "test2@example.com";
const userPassword = "qwerty12345";
const userAgentContent = "user agent content";

describe("login / logout tests", () => {
  beforeAll(async () => {
    await mongoose.connect(dbUri, { dbName: dbName });
    // check and create role - because it is needed for the user registration
    const roleInput: RoleInput = {
      role: roleName,
    };
    let dbRole: null | RoleDocument = await RoleModel.findOne({
      role: roleInput.role,
    });
    if (!dbRole) {
      dbRole = await RoleModel.create(roleInput);
    }
    // user dataset which is supposed to be accepted by api
    const userInput: UserInput = {
      email: userEmail,
      password: userPassword,
      name: "Vasyliy",
      familyname: "Pupkin",
      phone: "+1 254 456 23 45",
      address: "USA, Philadelphia, Linkoln Str. 25",
      company: "Roga i Kopyta Ltd.",
      position: "anykey tester",
      description: "very important test case user",
      userrole_id: dbRole._id.toString(),
    };
    // to check database - in case user was not deleted in the previous test
    let dbUser = await UserModel.findOne({ email: userInput.email });
    if (!dbUser) {
      dbUser = await UserModel.create(userInput);
    }
  });

  afterAll(async () => {
    await RoleModel.deleteOne({ role: roleName });
    await UserModel.deleteOne({ email: userEmail });
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

    interface DecodedItem {
      userId: string;
      sessionId: string;
      iat: number;
      exp: number;
    }

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
    
    const accessTokenCalcTtl = decodedAccessToken.exp - decodedAccessToken.iat
    const refreshTokenCalcTtl = decodedRefreshToken.exp - decodedRefreshToken.iat
    
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
});
