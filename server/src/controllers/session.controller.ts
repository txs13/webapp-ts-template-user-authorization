import { Request, Response } from "express";
import { LoginDataInput } from "../schemas/login.schema";
import { validatePasswordAndGetUser } from "../services/user.service";
import log from "../utils/logger";
import { signJwt } from "../utils/jwt.utils";
import SessionModel from "../models/session.model";
import getEnvVars from "../config/config";
import { omit } from "lodash";

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
      return res.status(401).send([{message: "Invalid email or password"}]);
    }
    // getting user IP and browser info for further checking
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    // handling suspicious requests without proper user info
    if (!ip || !userAgent) {
      return res
        .status(401)
        .send([{message: "Wrong network settings. Please contact admin"}]);
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

    // sending successful login confirmation data
    const userData = omit(user.toJSON(), "password");
    return res.status(200).send({
      user: userData,
      sessionTtl: refreshTokenTtl,
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    });
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
};
