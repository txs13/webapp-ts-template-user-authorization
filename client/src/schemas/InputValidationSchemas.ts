// this file contains copies from front end input input validation schemas with few modifications.
// at this phase I have decided not to organize anything like sharing
// types / interfaces between front end and back end and just copied them to this file
// besides, validation schemas were tangibly adjusted for the front-end purposes, so please do not copy it

// IF SOMETHING IS NOT WORKING WITH API CALL PLEASE CHECK THIS FIRST

import { object, string, TypeOf, optional } from "zod";
import store from '../app/store'
import {
  addressTextRegex,
  longTextRegex,
  nameRegex,
  phoneNumberTextRegex,
} from "../utils/regexes";
import getTextResources from "../res/textResourcesFunction";

// gett global app language settings from the store and get localized text resources
const storeState = store.getState()
const { minOneCharEmailMessage, minOneCharPasswordMessage } = getTextResources(
  storeState.appSettings.value.language
);

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
  body: object({
    email: string({ required_error: "email is required" }).email(
      "not a valid email"
    ),
    // at this phase we do not check whether email is already registered in frontend
    // validatin schema
    //.refine(async (email) => await checkUserByEmail(email), {
    //  message: "this email is already registered",
    //}),
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
    userrole_id: string({ required_error: "role id is required" }),
    // at this phase we do not check whether id is valid in frontend
    // validatin schema
    //.refine(
    //  async (id) => {
    //    if (!isValidObjectId(id)) {
    //      return false;
    //    } else {
    //      const checkResult = await checkRoleById(id);
    //      if (checkResult) {
    //        return true;
    //      } else {
    //        return false;
    //      }
    //    }
    //  },
    //  {
    //    message: "wrong role id",
    //  }
    //),
  }),
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
