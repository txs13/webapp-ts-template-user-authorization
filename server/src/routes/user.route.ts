import express from "express";
import { loginUserHandler } from "../controllers/session.controller";
import { createUserHandler } from "../controllers/user.controller";
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

export default userRouter;
