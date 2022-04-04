import express from "express";
import {
  loginUserHandler,
  logoutUserHandler,
  refreshTokenHandler,
} from "../controllers/session.controller";
import { createUserHandler } from "../controllers/user.controller";
import authorizedAccess from "../middleware/authorizedAccess";
import { validateResourceAsync } from "../middleware/validateResource";
import { loginDataSchema } from "../schemas/login.schema";
import { createUserSchema } from "../schemas/user.schema";

const userRouter = express.Router();
// create user with data validation
userRouter.post(
  "/register",
  validateResourceAsync(createUserSchema),
  createUserHandler
);

userRouter.post(
  "/login",
  validateResourceAsync(loginDataSchema),
  loginUserHandler
);

userRouter.post("/logout", authorizedAccess, logoutUserHandler);

userRouter.post("/refresh", authorizedAccess, refreshTokenHandler);

export default userRouter;
