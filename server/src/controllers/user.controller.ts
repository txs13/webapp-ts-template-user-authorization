import { omit } from "lodash";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { UserDocument, UserInput } from "../models/user.model";
import { CreateUserInput, PutUserInput } from "../schemas/user.schema";
import { createUser, getAllusers } from "../services/user.service";
import log from "../utils/logger";
import { SessionDocument } from "../models/session.model";

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
    return res.status(201).send(omit(user.toJSON(), "password", "isConfirmed"));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
};

export const getAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const allDBUsers = await getAllusers();
    const userListToSend = allDBUsers.map((it) =>
      omit(it.toJSON(), "password")
    );
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, true);
    await session.save();
    return res.status(200).send(userListToSend);
  } catch (e: any) {
    log.error(e);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, false);
    await session.save();

    return res.status(409).send(e.message);
  }
};

export const patchUserHandler = async (
  req: Request<{}, {}, PutUserInput["body"]>,
  res: Response
) => {
  // TODO: process user data changes and return right user / status back
  const user: UserDocument = res.locals.user;
  res.status(200).send(omit(user.toJSON(), "password"));
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  // TODO: process user deletion and return right status
  res.status(200).send({ id: req.params.userid });
};
