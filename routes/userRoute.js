import express from "express";
import {
  AddUserImage,
  createUser,
  deleteSelectedUsers,
  deleteUser,
  getDetailsForUserProfile,
  getUsers,
  loginUser,
  UpdateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/add-image", AddUserImage);
userRouter.get("/user-data", getDetailsForUserProfile);
userRouter.delete("/selectusers", deleteSelectedUsers);
userRouter.put("/:email", UpdateUser);
userRouter.get("/", getUsers);
userRouter.delete("/:email", deleteUser);

export default userRouter;
