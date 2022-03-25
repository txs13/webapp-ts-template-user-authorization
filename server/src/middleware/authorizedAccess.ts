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

  const decoded = decodeJwt(accessToken);

  if (!decoded) {
    return res.status(401).send([{ message: "wrong token" }]);
  } else {
    const user = await getUserById(decoded.userId);
    const session = await getSessionById(decoded.sessionId);
    if (!user || !session) {
      return res.status(409).send([{ message: "wrong id" }]);
    }
    res.locals.user = user
    res.locals.session = session
    return next();
  }
};

export default authorizedAccess;
