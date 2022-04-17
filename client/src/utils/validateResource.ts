import { AnyZodObject } from "zod";

export const validateResourceAsync = async (schema: AnyZodObject, objectToCheck: Object) => {
  try {
    // try to parse schema
    await schema.parseAsync({
      objectToCheck: objectToCheck,
    });
    return null
  } catch (e: any) {
    // process parse error
    return e.errors;
  }
};