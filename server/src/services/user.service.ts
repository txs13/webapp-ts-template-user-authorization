import { FilterQuery } from 'mongoose'
import { omit } from "lodash";
import UserModel, { UserDocument, UserInput } from "../models/user.model";

// create user service
export const createUser = async (input: UserInput) => {
  try {
    const user: UserDocument = await UserModel.create(input);
    return user;
  } catch (e: any) {
    throw new Error(e);
  }
};

// check role service - to check that user with tested email exists in the database
export const checkUserByEmail = async (email: string) => {
  try {
    const dbUser = await UserModel.findOne({ email: email });
    if (dbUser) {
      return false;
    } else {
      return true;
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// validate password for the login process
export const validatePasswordAndGetUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const dbUser = await UserModel.findOne({ email: email });

    if (!dbUser) {
      return false;
    }
    const isValid = await dbUser.comparePassword(password);

    if (!isValid) {
      return false;
    }
    return dbUser;
  } catch (e: any) {
    throw new Error(e);
  }
};

// get user by Id
export const getUserById = async (userId: string): Promise<UserDocument> => {
  try {
    const dbUser = await UserModel.findById(userId);
    if (dbUser) {
      return dbUser;
    } else {
      throw new Error("wrong user id");
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// get user by filter
export const findUser = async(query: FilterQuery<UserDocument>) => {
  try {
    return await UserModel.findOne(query)
  } catch (e: any) {
    throw new Error(e);
  }
}