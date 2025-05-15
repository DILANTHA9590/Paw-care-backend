import express from "express";
import { createPet } from "../controllers/petController";

const petRouter = express.Router();

userRouter.post("/", createPet);

export default petRouter;
