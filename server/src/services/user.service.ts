import { FilterQuery, isValidObjectId } from "mongoose";
import UserModel, { UserDocument, UserInput } from "../models/user.model";
import { LoginInput } from "../models/login.model";
import { PutUserInput } from "../schemas/user.schema";
import RoleModel from "../models/role.model";

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
}: LoginInput) => {
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
export const getUserById = async (userId: string): Promise<UserDocument | undefined> => {
  try {
    if (!isValidObjectId(userId)) {
      return undefined
    }
    const dbUser = await UserModel.findOne({ _id: userId });
    if (dbUser) {
      return dbUser;
    } else {
      return undefined;
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// get user by filter
export const findUser = async (query: FilterQuery<UserDocument>) => {
  try {
    return await UserModel.findOne(query);
  } catch (e: any) {
    throw new Error(e);
  }
};

// get all users
export const getAllusers = async () => {
  try {
    return await UserModel.find();
  } catch (e: any) {
    throw new Error(e);
  }
};

// check user service - to check that user ID exists in the database
export const checkUserById = async (id: string) => {
  try {
    const user = await UserModel.findById(id);
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// delete user service
export const deleteUser = async (id: string) => {
  try {
    const user = await UserModel.findById(id);
    if (user) {
      await user.delete();
      return true;
    } else {
      throw new Error("wrong user id");
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// put / update user service
// password should be updated only if new password is submitted, otherwise
// we are not going to change it
// another general rule is that if updated record does not contain some
// not obligatory property, we are going to delete it
export const putUser = async (updatedUser: PutUserInput["body"]) => {
  try {
    const user = await UserModel.findById(updatedUser._id);
    if (user) {
      user.email = updatedUser.email;
      user.name = updatedUser.name;
      // this is completely stupid step - the correctness of the updated role id is
      // already done in zod schema - I did not simply find better way to convert
      // string to RoleModel _id datatype
      const role = await RoleModel.findById(updatedUser.userrole_id);
      if (role) {
        user.userrole_id = role._id;
      }
      user.isConfirmed = updatedUser.isConfirmed;
      if (updatedUser.password) {
        user.password = updatedUser.password;
      }
      if (updatedUser.familyname) {
        user.familyname = updatedUser.familyname;
      } else {
        user.familyname = undefined;
      }
      if (updatedUser.phone) {
        user.phone = updatedUser.phone;
      } else {
        user.phone = undefined;
      }
      if (updatedUser.address) {
        user.address = updatedUser.address;
      } else {
        user.address = undefined;
      }
      if (updatedUser.company) {
        user.company = updatedUser.company;
      } else {
        user.company = undefined;
      }
      if (updatedUser.position) {
        user.position = updatedUser.position;
      } else {
        user.position = undefined;
      }
      if (updatedUser.description) {
        user.description = updatedUser.description;
      } else {
        user.description = undefined;
      }
      await user.save()
      return true
    } else {
      throw new Error("wrong user id");
    }
  } catch (e: any) {
    throw new Error(e);
  }
};
