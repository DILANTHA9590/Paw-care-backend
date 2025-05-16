import express from "express";
import {
  createUser,
  deleteSelectedUsers,
  deleteUser,
  getUsers,
  loginUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.delete("/selectusers", deleteSelectedUsers);

userRouter.get("/", getUsers);
userRouter.delete("/:email", deleteUser);

export default userRouter;
