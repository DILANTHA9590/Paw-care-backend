import express from "express";
import { VerifyEmail } from "../controllers/otpController.js";

const otpRouter = express.Router();

otpRouter.get("/", VerifyEmail);

export default otpRouter;
