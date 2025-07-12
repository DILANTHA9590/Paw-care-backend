import express from "express";
import { getDashboardSummary } from "../controllers/AdminController.js";

const adminRouter = express.Router();

adminRouter.get("/", getDashboardSummary);

export default adminRouter;
