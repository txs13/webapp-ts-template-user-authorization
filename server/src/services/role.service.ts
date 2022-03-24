import Role, { RoleDocument, RoleInput } from "../models/role.model";

// create role service
export const createRole = async (input: RoleInput) => {
  try {
    const role: RoleDocument = await Role.create(input);
    return role.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
};

// check role service - to check that role ID exists in the database
export const checkRoleById = async (id: string) => {
  try {
    const role = await Role.findById(id);
    if (role) {
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    throw new Error(e);
  }
};
