import express from "express";
import {
  loginUserHandler,
  logoutUserHandler,
  refreshTokenHandler,
  checkPasswordHandler,
} from "../controllers/session.controller";
import {
  createUserHandler,
  getAllUsersHandler,
  patchUserHandler,
  deleteUserHandler,
  getUserHandler
} from "../controllers/user.controller";
import authorizedAccess from "../middleware/authorizedAccess";
import adminAccess from "../middleware/adminAccess";
import { validateResourceAsync } from "../middleware/validateResource";
import { loginDataSchema, passwordCheckSchema } from "../schemas/login.schema";
import { createUserSchema, putUserSchema } from "../schemas/user.schema";

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

userRouter.post(
  "/checkpassword",
  validateResourceAsync(passwordCheckSchema),
  authorizedAccess,
  checkPasswordHandler
);

userRouter.get("/allusers", authorizedAccess, adminAccess, getAllUsersHandler);

userRouter.put(
  "/putuser",
  validateResourceAsync(putUserSchema),
  authorizedAccess,
  patchUserHandler
);

userRouter.get("/getuser/:userid", authorizedAccess, getUserHandler);

userRouter.delete("/deleteuser/:userid", authorizedAccess, deleteUserHandler);

export default userRouter;
