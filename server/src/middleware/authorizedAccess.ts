import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { decodeJwt } from "../utils/jwt.utils";
import { getUserById } from "../services/user.service";
import { getSessionById } from "../services/session.service";

const authorizedAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  // decode token
  const decoded = decodeJwt(accessToken);
  if (!decoded) {
    // if token is wrong or expired
    return res.status(401).send([{ message: "wrong token" }]);
  } else {
    // get proper user and session records
    const user = await getUserById(decoded.userId);
    const session = await getSessionById(decoded.sessionId);
    // if somehow wrong id is coded into jwt
    if (!user || !session) {
      return res.status(409).send([{ message: "wrong id" }]);
    }
    // if session is already closed
    if (session.closedAt) {
      // add user action
      session.addUserAction(req.originalUrl, req.method, false);
      await session.save();
      return res.status(409).send([{ message: "session is closed" }]);
    }
    
    // if user uses different IP or browser
    // getting and comparing user IP and browser info for further checking
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    if (session.ipAddress !== ip || session.userAgent !== userAgent) {
      // update session closed field
      session.closedAt = new Date();
      // add user action
      session.addUserAction(req.originalUrl, req.method, false);
      await session.save();
      return res.status(409).send([{ message: "session is closed" }]);
    }

    // attach proper user and session documents
    res.locals.user = user;
    res.locals.session = session;
    return next();
  }
};

export default authorizedAccess;
