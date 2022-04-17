import { object, string, TypeOf } from "zod";

export const loginDataSchema = object({
  body: object({
    email: string({ required_error: "email is required" }),
    password: string({ required_error: "password is required" }),
  }),
});

export type LoginDataInput = TypeOf<typeof loginDataSchema>;