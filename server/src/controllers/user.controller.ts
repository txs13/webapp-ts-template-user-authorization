import { omit } from "lodash";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { UserDocument, UserInput } from "../models/user.model";
import { CreateUserInput, PutUserInput } from "../schemas/user.schema";
import {
  createUser,
  getAllusers,
  deleteUser,
  putUser,
} from "../services/user.service";
import log from "../utils/logger";
import { SessionDocument } from "../models/session.model";
import { checkAdminByUserId } from "../services/admin.service";

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

// put / patch user handler is supposed to work in two "modes":
// 1st mode: admin mode - admin is entitled to update / change any user
// 2nd mode: user mode - user is entitled to update only him(her)self
// both "modes" are implemented within the same handler without admin middlware
export const patchUserHandler = async (
  req: Request<{}, {}, PutUserInput["body"]>,
  res: Response
) => {
  try {
    // first to get user deciphered after auth middlware and check its admin status
    const updatedUser: PutUserInput["body"] = req.body;
    const user: UserDocument = res.locals.user;
    const isAdmin = await checkAdminByUserId(user._id);
    if (isAdmin) {
      // if current user is admin we simply call the user update / put service
      await putUser(updatedUser);
      return res
        .status(200)
        .send([{ message: "user is successfully updated" }]);
    } else {
      // if user is not admin, we have to check if user is trying to update him(her)self
      if (user._id.toString() === updatedUser._id) {
        // to call user update / put service
        await putUser(updatedUser);
        return res
          .status(200)
          .send([{ message: "user is successfully updated" }]);
      } else {
        // to reject the api request
        const session: SessionDocument = res.locals.session;
        session.addUserAction(req.originalUrl, req.method, false);
        await session.save();

        return res.status(409).send([{ message: "no access" }]);
      }
    }
  } catch (e: any) {
    log.error(e);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, false);
    await session.save();

    return res.status(409).send(e.message);
  }
};

// delete user handler is supposed to work in two "modes":
// 1st mode: admin mode - admin is entitled to delete any user
// 2nd mode: user mode - user is entitled to delete only him(her)self
// both "modes" are implemented within the same handler without admin middlware
export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    // first to get user deciphered after auth middlware and check its admin status
    const user: UserDocument = res.locals.user;
    const isAdmin = await checkAdminByUserId(user._id);
    const userIdToDelete: string = req.params.userid;
    if (isAdmin) {
      // if current user is admin we simply call the user delete service
      await deleteUser(userIdToDelete);
      const session: SessionDocument = res.locals.session;
      session.addUserAction(req.originalUrl, req.method, true);
      await session.save();

      return res
        .status(200)
        .send([{ message: "user is successfully deleted" }]);
    } else {
      // if user is not admin, we have to check if user is trying to delete him(her)self
      if (user._id.toString() === userIdToDelete) {
        // to call user delete service
        await deleteUser(userIdToDelete);
        const session: SessionDocument = res.locals.session;
        session.addUserAction(req.originalUrl, req.method, true);
        await session.save();

        return res
          .status(200)
          .send([{ message: "user is successfully deleted" }]);
      } else {
        // to reject the api request
        const session: SessionDocument = res.locals.session;
        session.addUserAction(req.originalUrl, req.method, false);
        await session.save();

        return res.status(409).send([{ message: "no access" }]);
      }
    }
  } catch (e: any) {
    log.error(e);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, false);
    await session.save();

    return res.status(409).send(e.message);
  }
};
