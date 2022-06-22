import { object, string, TypeOf } from "zod";

export const loginDataSchema = object({
  body: object({
    email: string({ required_error: "email is required" }),
    password: string({ required_error: "password is required" }),
  }).strict({ message: "you are submitting to many parameters" }),
});

export type LoginDataInput = TypeOf<typeof loginDataSchema>;

export const passwordCheckSchema = object({
  body: object({
    password: string({ required_error: "password is required" }),
  }),
});

export type PasswordCheckInput = TypeOf<typeof passwordCheckSchema>;
