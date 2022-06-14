// this file contains copies from front end input data types / interfaces.
// at this phase I have decided not to organize anything like sharing
// types / interfaces between front end and back end and just copied them to this file

// IF SOMETHING IS NOT WORKING WITH API CALL PLEASE CHECK THIS FIRST

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginError {
  errorMessage: string;
}

export interface TokensInterface {
  accessToken: String;
  refreshToken: String;
  sessionTtl: Number;
  isAdmin?: Boolean;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
  familyname?: string;
  phone?: string;
  address?: string;
  company?: string;
  position?: string;
  description?: string;
  userrole_id: string; // Types.ObjectId; - this item is different from UserInput in back-end
}

export interface UserDocument extends Omit<UserInput, "password"> {
  _id: string; // Types.ObjectId; - this item is different from UserDocument in back-end
  createdAt: Date;
  updatedAt: Date;
  isConfirmed?: Boolean;
  __v: number;
  password?: string;
}

export interface RoleInput {
  role: string;
  description?: string;
}

export interface RoleDocument extends RoleInput {
  _id: string; // Types.ObjectId; - this item is different from UserDocument in back-end
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}