import { object, string, TypeOf, optional, number, boolean, date } from "zod";
import { isValidObjectId } from "mongoose";
import { checkRoleById } from "../services/role.service";
import {
  checkUserByEmail,
  checkUserById,
  getUserById,
} from "../services/user.service";
import {
  nameRegex,
  addressTextRegex,
  longTextRegex,
  phoneNumberTextRegex,
} from "../utils/regexes";

export const createUserSchema = object({
  body: object({
    email: string({ required_error: "email is required" })
      .email("not a valid email")
      .refine(async (email) => await checkUserByEmail(email), {
        message: "this email is already registered",
      }),
    password: string({ required_error: "password is required" }).min(
      6,
      "password should be 6 chars minimum"
    ),
    name: string({ required_error: "name is required" })
      .min(2, "name should be 2 chars minimum")
      .regex(nameRegex, "wrong format"),
    familyname: optional(
      string()
        .min(2, "familyname should be 2 chars minimum")
        .regex(nameRegex, "wrong format")
    ),
    phone: optional(
      string()
        .min(6, "phone number should be 6 chars minimum")
        .regex(phoneNumberTextRegex, "wrong format")
    ),
    address: optional(
      string()
        .min(6, "address should be 6 chars minimum")
        .regex(addressTextRegex, "wrong format")
    ),
    company: optional(
      string()
        .min(2, "company name should be 2 chars minimum")
        .regex(nameRegex, "wrong format")
    ),
    position: optional(
      string()
        .min(2, "position should be 2 chars minimum")
        .regex(nameRegex, "wrong format")
    ),
    description: optional(
      string()
        .min(6, "user description should be 6 chars minimum")
        .regex(longTextRegex, "wrong format")
    ),
    userrole_id: string({ required_error: "role id is required" }).refine(
      async (id) => {
        if (!isValidObjectId(id)) {
          return false;
        } else {
          const checkResult = await checkRoleById(id);
          if (checkResult) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        message: "wrong role id",
      }
    ),
  }).strict({ message: "you are submitting to many parameters" }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;

export const putUserSchema = object({
  body: object({
    _id: string({ required_error: "user id is required" }).refine(
      async (id) => {
        if (!isValidObjectId(id)) {
          return false;
        } else {
          const checkResult = await checkUserById(id);
          if (checkResult) {
            return true;
          } else {
            return false;
          }
        }
      },
      { message: "user id is not valid" }
    ),
    __v: number({ required_error: "this is fake user" }),
    isConfirmed: boolean({ required_error: "confirmation status is required" }),
    email: string({ required_error: "email is required" }).email(
      "not a valid email"
    ),
    password: optional(string().min(6, "password should be 6 chars minimum")),
    name: string({ required_error: "name is required" })
      .min(2, "name should be 2 chars minimum")
      .regex(nameRegex, "wrong format"),
    familyname: optional(
      string()
        .min(2, "familyname should be 2 chars minimum")
        .regex(nameRegex, "wrong format")
    ),
    phone: optional(
      string()
        .min(6, "phone number should be 6 chars minimum")
        .regex(phoneNumberTextRegex, "wrong format")
    ),
    address: optional(
      string()
        .min(6, "address should be 6 chars minimum")
        .regex(addressTextRegex, "wrong format")
    ),
    company: optional(
      string()
        .min(2, "company name should be 2 chars minimum")
        .regex(nameRegex, "wrong format")
    ),
    position: optional(
      string()
        .min(2, "position should be 2 chars minimum")
        .regex(nameRegex, "wrong format")
    ),
    description: optional(
      string()
        .min(6, "user description should be 6 chars minimum")
        .regex(longTextRegex, "wrong format")
    ),
    createdAt: string({ required_error: "this is fake user" }).refine(
      (dateString) => {
        const date = Date.parse(dateString);
        if (date) {
          return true;
        } else {
          return false;
        }
      },
      { message: "this is fake user" }
    ),
    updatedAt: string({ required_error: "this is fake user" }).refine(
      (dateString) => {
        const date = Date.parse(dateString);
        if (date) {
          return true;
        } else {
          return false;
        }
      },
      { message: "this is fake user" }
    ),
    userrole_id: string({ required_error: "role id is required" }).refine(
      async (id) => {
        if (!isValidObjectId(id)) {
          return false;
        } else {
          const checkResult = await checkRoleById(id);
          if (checkResult) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        message: "wrong role id",
      }
    ),
  })
    .strict({ message: "you are submitting to many parameters" })
    .refine(
      // the idea is the following: there are two options
      // user email is the same - then it is OK and we continue
      // user email is not the same - then we have to check that this email is available
      async (user) => {
        const dbUser = await getUserById(user._id);
        if (dbUser?.email === user.email) {
          return true;
        }
        if (await checkUserByEmail(user.email)) {
          return true;
        }
        return false;
      },
      { message: "not acceptable email" }
    ),
});

export type PutUserInput = TypeOf<typeof putUserSchema>;
