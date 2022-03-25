import { omit } from "lodash";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { UserInput } from "../models/user.model";
import { CreateUserInput } from "../schemas/user.schema";
import { createUser } from "../services/user.service";
import log from "../utils/logger";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const userInput: UserInput = {
      ...req.body,
      userrole_id: new mongoose.Types.ObjectId(req.body.userrole_id),
    };
    const user = await createUser(userInput);
    return res.status(201).send(omit(user.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
};
