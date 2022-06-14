import express from "express";
import { validateResource, validateResourceAsync } from "../middleware/validateResource";
import {
  createRoleHandler,
  getPublicRolesHandler,
  getAllRolesHandler,
  putRoleHandler,
  deleteRoleHandler,
} from "../controllers/role.controller";
import { createRoleSchema, putRoleSchema } from "../schemas/role.schema";
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

// put / update role
roleRouter.put(
  "/",
  validateResourceAsync(putRoleSchema),
  authorizedAccess,
  adminAccess,
  putRoleHandler
);

//delete role
roleRouter.delete("/:roleid", authorizedAccess, adminAccess, deleteRoleHandler);

// the idea is to return all the roles without word "admin"
roleRouter.get("/", getPublicRolesHandler);

roleRouter.get("/allroles", authorizedAccess, adminAccess, getAllRolesHandler);

export default roleRouter;
