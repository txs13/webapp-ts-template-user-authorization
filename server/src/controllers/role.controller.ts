import { Request, Response } from "express";
import { SessionDocument } from "../models/session.model";
import { CreateRoleInput, PutRoleInput } from "../schemas/role.schema";
import {
  createRole,
  getAllRolesWithoutAdmin,
  getAllRoles,
  putRole,
  deleteRole,
} from "../services/role.service";
import log from "../utils/logger";

export const createRoleHandler = async (
  req: Request<{}, {}, CreateRoleInput["body"]>,
  res: Response
) => {
  try {
    const role = await createRole(req.body);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, true);
    await session.save();
    return res.status(201).send(role.toJSON());
  } catch (e: any) {
    log.error(e.message);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, false);
    await session.save();

    res.status(409).send(e.message);
  }
};

export const getPublicRolesHandler = async (req: Request, res: Response) => {
  try {
    const publicRoles = await getAllRolesWithoutAdmin();
    res.status(200).send(publicRoles);
  } catch (e: any) {
    log.error(e.message);
    res.status(409).send(e.message);
  }
};

export const getAllRolesHandler = async (req: Request, res: Response) => {
  try {
    const allRoles = await getAllRoles();
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, true);
    await session.save();

    res.status(200).send(allRoles);
  } catch (e: any) {
    log.error(e.message);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, false);
    await session.save();

    res.status(409).send(e.message);
  }
};

export const putRoleHandler = async (
  req: Request<{}, {}, PutRoleInput["body"]>,
  res: Response
) => {
  try {
    const updatedRole: PutRoleInput["body"] = req.body;
    await putRole(updatedRole);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, true);
    await session.save();
    return res.status(200).send([{ message: "role is successfully updated" }]);
  } catch (e: any) {
    log.error(e.message);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, false);
    await session.save();
    return res.status(409).send(e.message);
  }
};

export const deleteRoleHandler = async (req: Request, res: Response) => {
  try {
    const roleIdToDelete: string = req.params.roleid;
    await deleteRole(roleIdToDelete);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, true);
    await session.save();
    return res.status(200).send([{ message: "user is successfully deleted" }]);
  } catch (e: any) {
    log.error(e.message);
    const session: SessionDocument = res.locals.session;
    session.addUserAction(req.originalUrl, req.method, false);
    await session.save();
    return res.status(409).send(e.message);
  }
};
