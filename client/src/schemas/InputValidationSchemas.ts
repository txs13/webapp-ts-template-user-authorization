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
  emailIsRequiredMessage,
  emailNotValidMessage,
  passwordIsRequiredMessage,
  passwordMin6CharsMessage,
  nameIsRequiredMessage,
  nameMin2CharsMessage,
  nameWrongFormatMessage,
  familynameMin2CharsMessage,
  familynameWrongFormatMessage,
  phoneMin6CharsMessage,
  phoneWrongFormatMessage,
  addressMin6CharsMessage,
  addressWrongFormatMessage,
  companyMin2CharsMessage,
  companyWrongFormatMessage,
  positionMin2CharsMessage,
  positionWrongFormatMessage,
  descriptionMin6CharsMessage,
  descriptionWrongFormatMessage,
  roleIsRequiredMessage,
  roleIsWrongMessage,
  passwordsDoNotMatchMessage,
} = getTextResources(storeState.appSettings.value.language);

// schema for checking login data
export const loginDataSchema = object({
    email: string({ required_error: "email is required" }).min(
      1,
      `${minOneCharEmailMessage}`
    ),
    password: string({ required_error: "password is required" }).min(
      1,
      `${minOneCharPasswordMessage}`
    ),
});
export type LoginDataInput = TypeOf<typeof loginDataSchema>;

export const createUserSchema = object({
  email: string({ required_error: `${emailIsRequiredMessage}` }).email(
    `${emailNotValidMessage}`
  ),
  password: string({ required_error: `${passwordIsRequiredMessage}` }).min(
    6,
    `${passwordMin6CharsMessage}`
  ),
  confirmPassword: string({
    required_error: `${passwordIsRequiredMessage}`,
  }).min(6, `${passwordMin6CharsMessage}`),
  name: string({ required_error: `${nameIsRequiredMessage}` })
    .min(2, `${nameMin2CharsMessage}`)
    .regex(nameRegex, `${nameWrongFormatMessage}`),
  familyname: optional(
    string()
      .min(2, `${familynameMin2CharsMessage}`)
      .regex(nameRegex, `${familynameWrongFormatMessage}`)
  ),
  phone: optional(
    string()
      .min(6, `${phoneMin6CharsMessage}`)
      .regex(phoneNumberTextRegex, `${phoneWrongFormatMessage}`)
  ),
  address: optional(
    string()
      .min(6, `${addressMin6CharsMessage}`)
      .regex(addressTextRegex, `${addressWrongFormatMessage}`)
  ),
  company: optional(
    string()
      .min(2, `${companyMin2CharsMessage}`)
      .regex(nameRegex, `${companyWrongFormatMessage}`)
  ),
  position: optional(
    string()
      .min(2, `${positionMin2CharsMessage}`)
      .regex(nameRegex, `${positionWrongFormatMessage}`)
  ),
  description: optional(
    string()
      .min(6, `${descriptionMin6CharsMessage}`)
      .regex(longTextRegex, `${descriptionWrongFormatMessage}`)
  ),
  userrole_id: string({ required_error: `${roleIsRequiredMessage}` }).refine(
    (id) => {
      if (
        storeState.role.value.filter((role) => role._id === id.toString()).length === 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    { message: `${roleIsWrongMessage}` }
  ),
}).refine(
  (it) => {
    if (it.password !== it.confirmPassword) {
      return false;
    } else {
      return true;
    }
  },
  { message: `${passwordsDoNotMatchMessage}` }
);

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
