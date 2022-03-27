import { FilterQuery, Types } from 'mongoose'

import AdminModel, { AdminDocument, AdminInput } from "../models/admin.model";

export const createAdmin = async (input: AdminInput) => {
  try {
    const newAdmin: AdminDocument = await AdminModel.create(input);
    return newAdmin;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const checkAdminByUserId = async (userId: Types.ObjectId): Promise<Boolean> => {
  try {
    const admin = await AdminModel.findOne({userId: userId});

    if (admin) {
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// get admin by filter
export const findAdmin = async(query: FilterQuery<AdminDocument>) => {
  try {
    return await AdminModel.findOne(query)
  } catch (e: any) {
    throw new Error(e);
  }
}