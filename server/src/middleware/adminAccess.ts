import { Request, Response, NextFunction } from "express";
import { UserDocument } from "../models/user.model";
import { checkAdminByUserId } from "../services/admin.service";

const adminAccess = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user as UserDocument;
  if (!user) {
    return res
      .status(409)
      .send([
        { message: "admin check is not allowed before user authorization" },
      ]);
  }
  const isAdmin = await checkAdminByUserId(user._id.toString());
  if (!isAdmin) {
    return res.status(401).send([
      {
        message: "no admin rights granted",
      },
    ]);
  }
  next()
};

export default adminAccess;
