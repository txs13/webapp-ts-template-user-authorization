import { ZodSchema } from "zod";

export const validateResourceAsync = async (
  schema: ZodSchema,
  objectToCheck: Object
) => {
  try {
    // try to parse schema
    await schema.parseAsync(objectToCheck);
    return null;
  } catch (e: any) {
    // process parse error
    return e.errors;
  }
};