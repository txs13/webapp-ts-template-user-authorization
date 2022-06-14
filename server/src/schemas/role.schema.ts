import { isValidObjectId } from "mongoose";
import { number, object, optional, string, TypeOf } from "zod";
import { checkRoleById } from "../services/role.service";
import { nameRegex, longTextRegex } from "../utils/regexes";

export const createRoleSchema = object({
  body: object({
    role: string({ required_error: "role name is required" })
      .min(4, "role should be 4 chars minimum")
      .regex(nameRegex, "wrong format"),
    description: optional(
      string()
        .min(6, "role description should be 6 chars minimum")
        .regex(longTextRegex, "wrong format")
    ),
  }).strict({ message: "you are submitting to many parameters" }),
});

export type CreateRoleInput = TypeOf<typeof createRoleSchema>;

export const putRoleSchema = object({
  body: object({
    _id: string({ required_error: "user id is required" }).refine(
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
      { message: "role id is not valid" }
    ),
    role: string({ required_error: "role name is required" })
      .min(4, "role should be 4 chars minimum")
      .regex(nameRegex, "wrong format"),
    description: optional(
      string()
        .min(6, "role description should be 6 chars minimum")
        .regex(longTextRegex, "wrong format")
    ),
    __v: number({ required_error: "this is fake user" }),
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
  }).strict({ message: "you are submitting to many parameters" }),
});

export type PutRoleInput = TypeOf<typeof putRoleSchema>;
