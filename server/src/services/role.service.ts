import RoleModel, { RoleDocument, RoleInput } from "../models/role.model";
import {FilterQuery} from 'mongoose'

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
export const findRole = async(query: FilterQuery<RoleDocument>) => {
  try {
    return await RoleModel.findOne(query)
  } catch (e: any) {
    throw new Error(e);
  }
}