import request from "supertest";
import mongoose from "mongoose";
import RoleModel, { RoleDocument } from "../models/role.model";
import UserModel, { UserInput } from "../models/user.model";
import AdminModel, { AdminInput } from "../models/admin.model";
import SessionModel from "../models/session.model";
import app from "../app";
import getEnvVars from "../config/config";

const { dbUri, testDbName } = getEnvVars();
const userAgentContent = "user agent content";

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

    expect(dbUser?.isConfirmed).toBeFalsy();

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

    expect(dbUser?.isConfirmed).toBeFalsy();

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

  test("isConfirmed added property should be rejected", async () => {
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
      isConfirmed: true,
    };

    // pure api call
    const result = await request(app)
      .post("/api/v1/user/register")
      .send(userInput);
    // check api call status
    expect(result.status).toBe(400);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe(
      "you are submitting to many parameters"
    );

    //clean up database
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("get all users without authorization", async () => {
    // pure api call
    const result = await request(app)
      .get("/api/v1/user/allusers")
      .set("User-agent", userAgentContent);
    // no user data provided
    expect(result.status).toBe(401);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("token is required");
  });

  test("get all users without admin rights", async () => {
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
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };
    // create "existing" user record in the database
    let dbUser = await UserModel.create(userInput);

    // perform login in order to get access token
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .send({ email: userInput.email, password: userInput.password })
      .set("User-agent", userAgentContent);

    expect(loginResult.status).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();

    const accessToken = loginResult.body.accessToken;

    const result = await request(app)
      .get("/api/v1/user/allusers")
      .set("Authorization", accessToken)
      .set("User-agent", userAgentContent);

    // no user data provided
    expect(result.status).toBe(401);
    expect(result.body.length).toBe(1);
    expect(result.body[0].message).toBe("no admin rights granted");

    //clean up database
    await UserModel.deleteOne({ _id: dbUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("successfully get all users with admin rights", async () => {
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
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };
    // create "existing" user record in the database
    let dbUser = await UserModel.create(userInput);

    let adminInput: AdminInput = {
      userId: dbUser._id,
      description: "test case admin user record",
    };
    let adminRecord = await AdminModel.create(adminInput);

    // perform login in order to get access token
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .send({ email: userInput.email, password: userInput.password })
      .set("User-agent", userAgentContent);

    expect(loginResult.status).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();

    const accessToken = loginResult.body.accessToken;

    const result = await request(app)
      .get("/api/v1/user/allusers")
      .set("Authorization", accessToken)
      .set("User-agent", userAgentContent);

    expect(result.status).toBe(200);
    expect(result.body.length).toBe(1);
    expect(result.body[0]._id).toBe(dbUser?._id.toString());
    expect(result.body[0].password).toBeFalsy();

    //clean up database
    await UserModel.deleteOne({ _id: dbUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
    await AdminModel.deleteOne({ _id: adminRecord?._id });
  });

  test("check password - correct password attached", async () => {
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
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };
    // create "existing" user record in the database
    let dbUser = await UserModel.create(userInput);

    // perform login in order to get access token
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .send({ email: userInput.email, password: userInput.password })
      .set("User-agent", userAgentContent);

    expect(loginResult.status).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();

    const accessToken = loginResult.body.accessToken;

    // perform api request
    const result = await request(app)
      .post("/api/v1/user/checkpassword")
      .send({ password: userInput.password })
      .set("User-agent", userAgentContent)
      .set("Authorization", accessToken);

    // checking correctness of the response
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("password is OK");

    //clean up database
    await UserModel.deleteOne({ _id: dbUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("check password - not correct password attached", async () => {
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
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };
    // create "existing" user record in the database
    let dbUser = await UserModel.create(userInput);

    // perform login in order to get access token
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .send({ email: userInput.email, password: userInput.password })
      .set("User-agent", userAgentContent);

    expect(loginResult.status).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();

    const accessToken = loginResult.body.accessToken;

    // perform api request
    const result = await request(app)
      .post("/api/v1/user/checkpassword")
      .send({ password: "wrong password" })
      .set("User-agent", userAgentContent)
      .set("Authorization", accessToken);

    // checking correctness of the response
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("password is NOT OK");

    //clean up database
    await UserModel.deleteOne({ _id: dbUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("check password - no password attached", async () => {
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
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };
    // create "existing" user record in the database
    let dbUser = await UserModel.create(userInput);

    // perform login in order to get access token
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .send({ email: userInput.email, password: userInput.password })
      .set("User-agent", userAgentContent);

    expect(loginResult.status).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();

    const accessToken = loginResult.body.accessToken;

    // perform api request
    const result = await request(app)
      .post("/api/v1/user/checkpassword")
      .send()
      .set("User-agent", userAgentContent)
      .set("Authorization", accessToken);

    // checking correctness of the response
    expect(result.status).toBe(400);
    expect(result.body[0].message).toBe("password is required");

    //clean up database
    await UserModel.deleteOne({ _id: dbUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
  });

  test("get user - admin user reads his record and other user's one with correct userIDs", async () => {
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
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };
    const secondUserInput = {
      email: "testCaseEmail@example.com",
      password: "qwerty12345",
      name: "Ignat",
      familyname: "Bubkin",
      phone: "+1 254 456 23 41",
      address: "USA, Philadelphia, Linkoln Str. 26",
      company: "Roga i Kopyta Corp.",
      position: "test case role",
      description: "test case second user",
      isConfirmed: false,
      userrole_id: dbRole._id.toString(),
    };

    // create "existing" user record in the database
    let dbUser = await UserModel.create(userInput);
    let dbSecondUser = await UserModel.create(secondUserInput);

    let adminInput: AdminInput = {
      userId: dbUser._id,
      description: "test case admin user record",
    };
    let adminRecord = await AdminModel.create(adminInput);

    // perform login in order to get access token
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .send({ email: userInput.email, password: userInput.password })
      .set("User-agent", userAgentContent);

    expect(loginResult.status).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();

    const accessToken = loginResult.body.accessToken;

    // get himself
    let result = await request(app)
      .get(`/api/v1/user/getuser/${dbUser._id.toString()}`)
      .set("Authorization", accessToken)
      .set("User-agent", userAgentContent);

    expect(result.status).toBe(200);
    let userRecord: any = result.body;
    expect(userRecord.email).toBe(userInput.email);
    expect(userRecord.password).toBeFalsy();
    expect(userRecord.name).toBe(userInput.name);
    expect(userRecord.familyname).toBe(userInput.familyname);
    expect(userRecord.phone).toBe(userInput.phone);
    expect(userRecord.address).toBe(userInput.address);
    expect(userRecord.company).toBe(userInput.company);
    expect(userRecord.position).toBe(userInput.position);
    expect(userRecord.description).toBe(userInput.description);
    expect(userRecord.isConfirmed).toBeTruthy();
    expect(userRecord.userrole_id).toBe(dbRole._id.toString());

    // get other user details
    result = await request(app)
      .get(`/api/v1/user/getuser/${dbSecondUser._id.toString()}`)
      .set("Authorization", accessToken)
      .set("User-agent", userAgentContent);

    expect(result.status).toBe(200);
    userRecord = result.body;
    expect(userRecord.email).toBe(dbSecondUser.email);
    expect(userRecord.password).toBeFalsy();
    expect(userRecord.name).toBe(dbSecondUser.name);
    expect(userRecord.familyname).toBe(dbSecondUser.familyname);
    expect(userRecord.phone).toBe(dbSecondUser.phone);
    expect(userRecord.address).toBe(dbSecondUser.address);
    expect(userRecord.company).toBe(dbSecondUser.company);
    expect(userRecord.position).toBe(dbSecondUser.position);
    expect(userRecord.description).toBe(dbSecondUser.description);
    expect(userRecord.isConfirmed).toBeFalsy();
    expect(userRecord.userrole_id).toBe(dbRole._id.toString());

    //clean up database
    await UserModel.deleteOne({ _id: dbUser?._id });
    await UserModel.deleteOne({ _id: dbSecondUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
    await AdminModel.deleteOne({ _id: adminRecord?._id });
  });

  test("get user - admin user NOT correct userID", async () => {
    // TODO: get user - admin user NOT correct userID case
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
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };
    const secondUserInput = {
      email: "testCaseEmail@example.com",
      password: "qwerty12345",
      name: "Ignat",
      familyname: "Bubkin",
      phone: "+1 254 456 23 41",
      address: "USA, Philadelphia, Linkoln Str. 26",
      company: "Roga i Kopyta Corp.",
      position: "test case role",
      description: "test case second user",
      isConfirmed: false,
      userrole_id: dbRole._id.toString(),
    };

    // create "existing" user record in the database
    let dbUser = await UserModel.create(userInput);
    let dbSecondUser = await UserModel.create(secondUserInput);

    let adminInput: AdminInput = {
      userId: dbUser._id,
      description: "test case admin user record",
    };
    let adminRecord = await AdminModel.create(adminInput);

    // perform login in order to get access token
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .send({ email: userInput.email, password: userInput.password })
      .set("User-agent", userAgentContent);

    expect(loginResult.status).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();

    const accessToken = loginResult.body.accessToken;

    // trying to get wrong userID
    let result = await request(app)
      .get(`/api/v1/user/getuser/628b94fdd44228x40566450`)
      .set("Authorization", accessToken)
      .set("User-agent", userAgentContent);
    expect(result.status).toBe(409);
    expect(result.body.message).toBe("wrong user id");

    //clean up database
    await UserModel.deleteOne({ _id: dbUser?._id });
    await UserModel.deleteOne({ _id: dbSecondUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
    await AdminModel.deleteOne({ _id: adminRecord?._id });
  });

  test("get user - standard user correct own, other user's userID", async () => {
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
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };
    const secondUserInput = {
      email: "testCaseEmail@example.com",
      password: "qwerty12345",
      name: "Ignat",
      familyname: "Bubkin",
      phone: "+1 254 456 23 41",
      address: "USA, Philadelphia, Linkoln Str. 26",
      company: "Roga i Kopyta Corp.",
      position: "test case role",
      description: "test case second user",
      isConfirmed: true,
      userrole_id: dbRole._id.toString(),
    };

    // create "existing" user record in the database
    let dbUser = await UserModel.create(userInput);
    let dbSecondUser = await UserModel.create(secondUserInput);

    let adminInput: AdminInput = {
      userId: dbUser._id,
      description: "test case admin user record",
    };
    let adminRecord = await AdminModel.create(adminInput);

    // perform login in order to get access token
    const loginResult = await request(app)
      .post("/api/v1/user/login")
      .send({
        email: secondUserInput.email,
        password: secondUserInput.password,
      })
      .set("User-agent", userAgentContent);

    expect(loginResult.status).toBe(200);
    expect(loginResult.body.accessToken).toBeTruthy();

    const accessToken = loginResult.body.accessToken;

    
    // get himself
    let result = await request(app)
      .get(`/api/v1/user/getuser/${dbSecondUser._id.toString()}`)
      .set("Authorization", accessToken)
      .set("User-agent", userAgentContent);

    expect(result.status).toBe(200);
    let userRecord: any = result.body;
    expect(userRecord.email).toBe(dbSecondUser.email);
    expect(userRecord.password).toBeFalsy();
    expect(userRecord.name).toBe(dbSecondUser.name);
    expect(userRecord.familyname).toBe(dbSecondUser.familyname);
    expect(userRecord.phone).toBe(dbSecondUser.phone);
    expect(userRecord.address).toBe(dbSecondUser.address);
    expect(userRecord.company).toBe(dbSecondUser.company);
    expect(userRecord.position).toBe(dbSecondUser.position);
    expect(userRecord.description).toBe(dbSecondUser.description);
    expect(userRecord.isConfirmed).toBeTruthy();
    expect(userRecord.userrole_id).toBe(dbRole._id.toString());
    
    // get other user details
    result = await request(app)
      .get(`/api/v1/user/getuser/${dbUser._id.toString()}`)
      .set("Authorization", accessToken)
      .set("User-agent", userAgentContent);
    
      
    expect(result.status).toBe(401);
    userRecord = result.body;
    expect(result.body.message).toBe("access denied");

    //clean up database
    await UserModel.deleteOne({ _id: dbUser?._id });
    await UserModel.deleteOne({ _id: dbSecondUser?._id });
    await RoleModel.deleteOne({ _id: dbRole?._id });
    await AdminModel.deleteOne({ _id: adminRecord?._id });
  });

});
