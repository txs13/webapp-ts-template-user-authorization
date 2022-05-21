import { RoleDocument, RoleInput } from "../models/role.model";
import { UserDocument, UserInput } from "../models/user.model";
import { AdminDocument, AdminInput } from "../models/admin.model";
import { createAdmin, findAdmin } from "../services/admin.service";
import { createRole, findRole } from "../services/role.service";
import { createUser, findUser } from "../services/user.service";
import log from "./logger";

const defaultAdminRole: RoleInput = {
  role: "Default admin",
  description:
    "This is default admin role to create the initial system user and admin",
};

const defaultAdminUser = {
  email: "admin@example.com",
  password: "qwerty123",
  name: "Technical admin",
  userrole_id: "to be updated",
  isConfirmed: true,
  description:
    "This is default admin user to create the initial system user and admin",
};

const defaultAdminRecord = {
  userId: "to be updated",
  description:
    "This is default admin record to create the initial system user and admin",
};

const checkDefaultEntities = async () => {
  // check technical admin role
  let adminRole: RoleDocument | null = await findRole({
    role: defaultAdminRole.role,
  });
  if (adminRole) {
    log.info("Default admin role - OK");
  } else {
    // create one if it is not inplace
    adminRole = await createRole(defaultAdminRole);
    log.info("Default admin role is created");
  }
  // check technical admin user
  let adminUser: UserDocument | null = await findUser({
    email: defaultAdminUser.email,
  });
  if (adminUser) {
    if (adminUser.userrole_id.toString() === adminRole._id.toString()) {
      log.info("Default admin user - OK");
    } else {
      log.error("Default admin user and default admin role are not matching");
      process.exit(1);
    }
  } else {
    //create if it is not in place
    const userInput: UserInput = {
      ...defaultAdminUser,
      userrole_id: adminRole._id,
    };
    adminUser = await createUser(userInput);
    log.info("Default admin user is created");
  }
  // check default password and issue a warning when it has not been changed
  const isInitialPassword = await adminUser?.comparePassword(
    defaultAdminUser.password
  );
  if (isInitialPassword) {
    log.info("Default admin has default password!!!");
  }
  // check admin rights for technical admin

  let admin: AdminDocument | null = await findAdmin({ userId: adminUser._id });
  if (admin) {
    log.info("Default admin user has admin rights - OK");
  } else {
    // create one if it is not in place
    const adminInput: AdminInput = {
      ...defaultAdminRecord,
      userId: adminUser._id,
    };
    admin = await createAdmin(adminInput);
    log.info("Default admin record is created");
  }
};

export default checkDefaultEntities;
