import request from "supertest";
import mongoose from "mongoose";
import RoleModel, { RoleDocument } from "../models/role.model";
import UserModel, { UserInput } from "../models/user.model";
import AdminModel from "../models/admin.model";
import SessionModel from "../models/session.model";
import app from "../app";
import getEnvVars from "../config/config";

const { dbUri, testDbName } = getEnvVars();

describe("user api tests", () => {
  beforeAll(async () => {
    await mongoose.connect(dbUri, { dbName: testDbName });
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await RoleModel.deleteMany({});
    await AdminModel.deleteMany({});
    await SessionModel.deleteMany({});
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  test("create user - complete correct dataset", async () => {
    // check and create role - because it is needed for the user registration
    const roleInput = {
      role: "test case role 00001",
    };
    let  dbRole = await RoleModel.create(roleInput);
    
    // user dataset which is supposed to be accepted by api
    const userInput = {
      email: "test@example.com",
      password: "qwerty12345",
      name: "Vasyliy",
      familyname: "Pupkin",
      phone: "+1 254 456 23 45",
      address: "USA, Philadelphia, Linkoln Str. 25",
      company: "Roga i Kopyta Ltd.",
      position: "anykey tester",
      description: "very important test case user",
      userrole_id: dbRole._id.toString(),
    };
    
    // pure api call
    const result = await request(app)
      .post("/api/v1/user/register")
      .send(userInput);
    // check api call status
    expect(result.status).toBe(201);
    let dbUser = await UserModel.findById(result.body._id);
    expect(dbUser).toBeTruthy();
    // check that corresponding fields in DB, returned object and initial request are matching
    expect(dbUser?.email).toBe(userInput.email);
    expect(result.body.email).toBe(userInput.email);
    // only hash is stored in the database - so we check the password using the dedicated
    // funtion in the DB model
    const passComparisonResult = await dbUser?.comparePassword(
      userInput.password
    );
    expect(passComparisonResult).toBe(true);

    expect(dbUser?.name).toBe(userInput.name);
    expect(result.body.name).toBe(userInput.name);

    expect(dbUser?.familyname).toBe(userInput.familyname);
    expect(result.body.familyname).toBe(userInput.familyname);

    expect(dbUser?.phone).toBe(userInput.phone);
    expect(result.body.phone).toBe(userInput.phone);

    expect(dbUser?.address).toBe(userInput.address);
    expect(result.body.address).toBe(userInput.address);

    expect(dbUser?.company).toBe(userInput.company);
    expect(result.body.company).toBe(userInput.company);

    expect(dbUser?.position).toBe(userInput.position);
    expect(result.body.position).toBe(userInput.position);

    expect(dbUser?.description).toBe(userInput.description);
    expect(result.body.description).toBe(userInput.description);

    expect(dbUser?.userrole_id.toString()).toEqual(
      userInput.userrole_id.toString()
    );
    expect(result.body.userrole_id.toString()).toEqual(
      userInput.userrole_id.toString()
    );
    // clean up the database - delete both test role and user
    await UserModel.deleteOne({ _id: dbUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("create user - minimal correct dataset", async () => {
    // check and create role - because it is needed for the user registration
    const roleInput = {
      role: "test case role 00001",
    };
    let dbRole = await RoleModel.create(roleInput);
    
    // user dataset which is supposed to be accepted by api
    const userInput = {
      email: "test@example.com",
      password: "qwerty12345",
      name: "Vasyliy",
      userrole_id: dbRole._id,
    };

    // pure api call
    const result = await request(app)
      .post("/api/v1/user/register")
      .send(userInput);
    // check api call status
    expect(result.status).toBe(201);
    let dbUser = await UserModel.findById(result.body._id);
    expect(dbUser).toBeTruthy();
    // check that corresponding fields in DB, returned object and initial request are matching
    expect(dbUser?.email).toBe(userInput.email);
    expect(result.body.email).toBe(userInput.email);
    // only hash is stored in the database - so we check the password using the dedicated
    // funtion in the DB model
    const passComparisonResult = await dbUser?.comparePassword(
      userInput.password
    );
    expect(passComparisonResult).toBe(true);

    expect(dbUser?.name).toBe(userInput.name);
    expect(result.body.name).toBe(userInput.name);

    expect(dbUser?.familyname).toBeFalsy();

    expect(dbUser?.phone).toBeFalsy();

    expect(dbUser?.address).toBeFalsy();

    expect(dbUser?.company).toBeFalsy();

    expect(dbUser?.position).toBeFalsy();

    expect(dbUser?.description).toBeFalsy();

    expect(dbUser?.userrole_id.toString()).toEqual(
      userInput.userrole_id.toString()
    );
    expect(result.body.userrole_id.toString()).toEqual(
      userInput.userrole_id.toString()
    );
    // clean up the database - delete both test role and user
    await UserModel.deleteOne({ _id: dbUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("create user - wrong role ID", async () => {
    // check and create role - because it is needed for the user registration
    const roleInput = {
      role: "test case role 00001",
    };
    let dbRole = await RoleModel.create(roleInput);
    
    // user dataset which is supposed to be accepted by api
    const userInput = {
      email: "test@example.com",
      password: "qwerty12345",
      name: "Vasyliy",
      familyname: "Pupkin",
      phone: "+1 254 456 23 45",
      address: "USA, Philadelphia, Linkoln Str. 25",
      company: "Roga i Kopyta Ltd.",
      position: "anykey tester",
      description: "very important test case user",
      userrole_id: "hjsdhfad43fsewesfwfd",
    };

    // pure api call
    const result = await request(app)
      .post("/api/v1/user/register")
      .send(userInput);

    // check api call status
    expect(result.status).toBe(400);
    expect(result.body[0].message).toBe("wrong role id");

    let dbUser = await UserModel.findById(result.body._id);
    expect(dbUser).toBeFalsy();

    // clean up the database - delete both test role and user
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("create user - wrong all the data fields", async () => {
    // check and create role - because it is needed for the user registration
    const roleInput = {
      role: "test case role 00001",
    };
    let dbRole = await RoleModel.create(roleInput);
    
    // user dataset which is supposed to be accepted by api
    const userInput = {
      email: "testexample.com",
      password: "qw",
      name: "!Vasyliy",
      familyname: " Pupkin",
      phone: "!1 254 456 23 45",
      address: "USA, Philadelphia?, Linkoln Str. 25",
      company: "Roga i^ Kopyta Ltd.",
      position: "anykey^tester",
      description: "very*important test case user",
      userrole_id: "6238f2d5b9686c6607323abf",
    };
    
    // pure api call
    const result = await request(app)
      .post("/api/v1/user/register")
      .send(userInput);

    // check api call status
    expect(result.status).toBe(400);
    expect(result.body.length).toBe(10);

    let arrayItem = result.body.filter((it: any) => it.path.includes("email"));
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("not a valid email");

    arrayItem = result.body.filter((it: any) => it.path.includes("password"));
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("password should be 6 chars minimum");

    arrayItem = result.body.filter((it: any) => it.path.includes("name"));
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("wrong format");

    arrayItem = result.body.filter((it: any) => it.path.includes("familyname"));
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("wrong format");

    arrayItem = result.body.filter((it: any) => it.path.includes("phone"));
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("wrong format");

    arrayItem = result.body.filter((it: any) => it.path.includes("address"));
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("wrong format");

    arrayItem = result.body.filter((it: any) => it.path.includes("company"));
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("wrong format");

    arrayItem = result.body.filter((it: any) => it.path.includes("position"));
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("wrong format");

    arrayItem = result.body.filter((it: any) =>
      it.path.includes("description")
    );
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("wrong format");

    arrayItem = result.body.filter((it: any) =>
      it.path.includes("userrole_id")
    );
    expect(arrayItem.length).toBe(1);
    expect(arrayItem[0].message).toBe("wrong role id");

    let dbUser = await UserModel.findById(result.body._id);
    expect(dbUser).toBeFalsy();

    // clean up the database - delete both test role and user
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("check email address to be unique", async () => {
    // check and create role - because it is needed for the user registration
    const roleInput = {
      role: "test case role 00001",
    };
    let dbRole = await RoleModel.create(roleInput);
    
    // user dataset which is supposed to be accepted by api
    const userInput: UserInput = {
      email: "test@example.com",
      password: "qwerty12345",
      name: "Vasyliy",
      familyname: "Pupkin",
      phone: "+1 254 456 23 45",
      address: "USA, Philadelphia, Linkoln Str. 25",
      company: "Roga i Kopyta Ltd.",
      position: "anykey tester",
      description: "very important test case user",
      userrole_id: dbRole._id.toString(),
    };
    // create "existing" user record in the database
    let dbUser = await UserModel.create(userInput);
    
    // pure api call
    const result = await request(app)
      .post("/api/v1/user/register")
      .send(userInput);

    // check api call status
    expect(result.status).toBe(400);
    expect(result.body[0].message).toBe("this email is already registered");

    // check that user was not added in the end
    const dbUsers = await UserModel.find({ email: userInput.email });
    expect(dbUsers.length).toBe(1);

    //clean up database
    await UserModel.deleteOne({ _id: dbUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });
});
