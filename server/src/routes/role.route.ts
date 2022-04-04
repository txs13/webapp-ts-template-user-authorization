import express from "express";
import { validateResource } from "../middleware/validateResource";
import {
  createRoleHandler,
  getPublicRolesHandler,
} from "../controllers/role.controller";
import { createRoleSchema } from "../schemas/role.schema";
import authorizedAccess from "../middleware/authorizedAccess";
import adminAccess from "../middleware/adminAccess";

const roleRouter = express.Router();
// create role with rolename validation
roleRouter.post(
  "/",
  validateResource(createRoleSchema),
  authorizedAccess,
  adminAccess,
  createRoleHandler
);

// the idea is to return all the roles without word "admin"
roleRouter.get("/", getPublicRolesHandler);

export default roleRouter;
