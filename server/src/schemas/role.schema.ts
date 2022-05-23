import { object, optional, string, TypeOf } from "zod";
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
