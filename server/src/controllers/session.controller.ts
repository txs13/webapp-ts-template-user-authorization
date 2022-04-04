import { get } from "lodash";
import { Request, Response } from "express";
import { LoginDataInput } from "../schemas/login.schema";
import { validatePasswordAndGetUser } from "../services/user.service";
import log from "../utils/logger";
import { decodeJwt, signJwt } from "../utils/jwt.utils";
import SessionModel, { SessionDocument } from "../models/session.model";
import getEnvVars from "../config/config";
import { omit } from "lodash";
import { checkAdminByUserId } from "../services/admin.service";

const { accessTokenTtl, refreshTokenTtl } = getEnvVars();

export const loginUserHandler = async (
  req: Request<{}, {}, LoginDataInput["body"]>,
  res: Response
) => {
  try {
    // checking that such a user and password are valid
    const user = await validatePasswordAndGetUser(req.body);
    // handle wrong credentials

    if (!user) {
      return res.status(401).send([{ message: "Invalid email or password" }]);
    }
    // getting user IP and browser info for further checking
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    // handling suspicious requests without proper user info
    if (!ip || !userAgent) {
      return res
        .status(401)
        .send([{ message: "Wrong network settings. Please contact admin" }]);
    }

    // TODO?: to check that user has opened sessions

    // create / start a session
    const session = await SessionModel.create({
      userId: user._id,
      ipAddress: ip,
      userAgent: userAgent,
      sessionTTL: refreshTokenTtl,
    });
    // generate tokens
    const accessToken = signJwt(user._id, session._id, "accessKey");
    const refreshToken = signJwt(user._id, session._id, "refreshKey");
    // add access token infor to the session
    session.addToken("loginAccessToken", accessTokenTtl);
    await session.save();

    // create user JSON, exclude password record
    const userData = omit(user.toJSON(), "password");
    // checking is user has admin rights
    const isAdmin = await checkAdminByUserId(userData._id);
    let confirmationJson: Object = {
      user: userData,
      sessionTtl: refreshTokenTtl,
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    };
    // add isAdmin status frontend to show admin resourses
    if (isAdmin) {
      confirmationJson = { ...confirmationJson, isAdmin: true };
    }

    return res.status(200).send(confirmationJson);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
};

export const logoutUserHandler = async (req: Request, res: Response) => {
  // get actual session
  const session: SessionDocument = res.locals.session;
  // update session closed field
  session.closedAt = new Date();
  // add user action
  session.addUserAction(req.originalUrl, req.method, true);
  await session.save();

  res.status(200).send([{ message: "successfully logged out" }]);
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  // create new access token
  const newAccessToken = signJwt(
    res.locals.user._id,
    res.locals.session._id,
    "accessKey"
  );
  // add token record to the session
  const session: SessionDocument = res.locals.session;
  session.addUserAction(req.originalUrl, req.method, true);
  session.addToken("refreshAccessToken", accessTokenTtl);
  await session.save();

  // create user JSON, exclude password record
  const userData = omit(res.locals.user.toJSON(), "password");
  // checking is user has admin rights
  const isAdmin = await checkAdminByUserId(userData._id);
  let refreshJson: Object = {
    user: userData,
    accessToken: `Bearer ${newAccessToken}`,
  };
  // add isAdmin status frontend to show admin resourses
  if (isAdmin) {
    refreshJson = { ...refreshJson, isAdmin: true };
  }

  return res.status(200).send(refreshJson);
};
