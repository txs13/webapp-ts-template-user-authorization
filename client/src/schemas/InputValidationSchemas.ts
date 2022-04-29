// this file contains copies from front end input input validation schemas with some modifications.
// at this phase I have decided not to organize anything like sharing
// types / interfaces between front end and back end and just copied them to this file

// IF SOMETHING IS NOT WORKING WITH API CALL PLEASE CHECK THIS FIRST

import { object, string, TypeOf, optional } from "zod";
import store from "../app/store";
import {
  addressTextRegex,
  longTextRegex,
  nameRegex,
  phoneNumberTextRegex,
} from "../utils/regexes";
import getTextResources from "../res/textResourcesFunction";

// gett global app language settings from the store and get localized text resources
const storeState = store.getState();
const {
  minOneCharEmailMessage,
  minOneCharPasswordMessage,
  emailIsNeededMessage,
  emailNotValidMessage,
  passwordIsRequiredMessage,
  min6CharsPasswordMessage,
} = getTextResources(storeState.appSettings.value.language);

// schema for checking login data
export const loginDataSchema = object({
  objectToCheck: object({
    email: string({ required_error: "email is required" }).min(
      1,
      `${minOneCharEmailMessage}`
    ),
    password: string({ required_error: "password is required" }).min(
      1,
      `${minOneCharPasswordMessage}`
    ),
  }),
});
export type LoginDataInput = TypeOf<typeof loginDataSchema>;

export const createUserSchema = object({
  objectToCheck: object({
    email: string({ required_error: `${emailIsNeededMessage}` }).email(
      `${emailNotValidMessage}`
    ),
    password: string({ required_error: `${passwordIsRequiredMessage}` }).min(
      6,
      `${min6CharsPasswordMessage}`
    ),
    confirmPassword: string({
      required_error: `${passwordIsRequiredMessage}`,
    }).min(6, `${min6CharsPasswordMessage}`),
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
      (id) => {
        if (
          storeState.role.value.filter((role) => role._id === id).length === 0
        ) {
          return false;
        } else {
          return true;
        }
      },
      { message: "wrong role id" }
    ),
  }).refine(
    (it) => {
      if (it.password !== it.confirmPassword) {
        return false;
      } else {
        return true;
      }
    },
    { message: "entered passwords do not match" }
  ),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;

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
  }),
});

export type CreateRoleInput = TypeOf<typeof createRoleSchema>;
