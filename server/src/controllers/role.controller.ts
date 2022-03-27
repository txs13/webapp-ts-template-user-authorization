import { Request, Response } from "express";
import { CreateRoleInput } from "../schemas/role.schema";
import { createRole } from "../services/role.service";
import log from "../utils/logger";

export const createRoleHandler = async (
  req: Request<{}, {}, CreateRoleInput["body"]>,
  res: Response
) => {
  try {
    const role = await createRole(req.body);
    const session = res.locals.session
    session.addUserAction(req.originalUrl, req.method, true);
    await session.save();
    return res.status(201).send(role.toJSON());
  } catch (e: any) {
    log.error(e);
    res.status(409).send(e.message);
  }
};
