import express from "express";
import { validateResource } from "../middleware/validateResource";
import { createRoleHandler } from "../controllers/role.controller";
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

export default roleRouter;
