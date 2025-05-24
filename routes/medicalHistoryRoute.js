import express from "express";
import { createMedicalHistory } from "../controllers/medicalHistoryController.js";

const medicalHistoryRouter = express.Router();

medicalHistoryRouter.post("/", createMedicalHistory);

export default medicalHistoryRouter;
