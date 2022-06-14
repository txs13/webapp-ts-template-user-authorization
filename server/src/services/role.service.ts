import { Types } from "mongoose";

import RoleModel, { RoleDocument, RoleInput } from "../models/role.model";
import { FilterQuery } from "mongoose";
import { PutRoleInput } from "../schemas/role.schema";
import UserModel from "../models/user.model";

// create role service
export const createRole = async (input: RoleInput) => {
  try {
    const role: RoleDocument = await RoleModel.create(input);
    return role;
  } catch (e: any) {
    throw new Error(e);
  }
};

// check role service - to check that role ID exists in the database
export const checkRoleById = async (id: string) => {
  try {
    const role = await RoleModel.findById(id);
    if (role) {
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// get role by Id
export const getRoleById = async (roleId: string): Promise<RoleDocument> => {
  try {
    const dbRole = await RoleModel.findById(roleId);
    if (dbRole) {
      return dbRole;
    } else {
      throw new Error("wrong user id");
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// get role by filter
export const findRole = async (query: FilterQuery<RoleDocument>) => {
  try {
    return await RoleModel.findOne(query);
  } catch (e: any) {
    throw new Error(e);
  }
};

// get all roles and filter ones with "admin" word in name
export const getAllRolesWithoutAdmin = async () => {
  const allRoles = await RoleModel.find();
  const allPublicRoles = allRoles.filter(
    (it) => !it.role.toLowerCase().includes("admin")
  );
  return allPublicRoles.map((it) => it.toJSON());
};

// get all roles for admin control panel
export const getAllRoles = async () => {
  const allRoles = await RoleModel.find();
  return allRoles.map((it) => it.toJSON());
};

// put / update role service
export const putRole = async (updatedRole: PutRoleInput["body"]) => {
  try {
    const role = await RoleModel.findById(updatedRole._id);
    if (role) {
      role.role = updatedRole.role;
      if (updatedRole.description) {
        role.description = updatedRole.description;
      } else {
        role.description = undefined;
      }
      await role.save();
      return true;
    } else {
      throw new Error("wrong role id");
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// delete user service
export const deleteRole = async (id: string) => {
  try {
    const role = await RoleModel.findById(id);
    if (role) {
      // user can delete the role only if there are no users
      // with such a role id
      const roleUsers = await UserModel.find({
        userrole_id: id,
      });
      if (roleUsers.length === 0) {
        await role.delete();
      } else {
        throw new Error("users with this role still exist");  
      }
      return true;
    } else {
      throw new Error("wrong role id");
    }
  } catch (e: any) {
    throw new Error(e);
  }
};
