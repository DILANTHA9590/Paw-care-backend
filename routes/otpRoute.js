import express from "express";
import { VerifyEmail } from "../controllers/otpController.js";
import { requestNewOtp } from "../controllers/userController.js";

const otpRouter = express.Router();

otpRouter.post("/verify", VerifyEmail);
otpRouter.post("/", requestNewOtp);

export default otpRouter;
