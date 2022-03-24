import { Request, Response } from "express";
import { CreateUserInput } from "../schemas/user.schema";
import { createUser, validatePasswordAndGetUser } from "../services/user.service";
import log from "../utils/logger";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).send(user);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
};

