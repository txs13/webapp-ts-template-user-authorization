import { FilterQuery } from 'mongoose'
import AdminModel, { AdminDocument, AdminInput } from "../models/admin.model";

export const createAdmin = async (input: AdminInput) => {
  try {
    const newAdmin: AdminDocument = await AdminModel.create(input);
    return newAdmin;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const checkAdminByUserId = async (userId: string): Promise<Boolean> => {
  try {
    const admin = await AdminModel.findById(userId)
    if (userId) {
        return true
    } else {
        return false
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