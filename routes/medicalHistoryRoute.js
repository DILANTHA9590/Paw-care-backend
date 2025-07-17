import express from "express";
import {
  createMedicalHistory,
  deleteMedicalHistoryById,
  getMedicalHistoryByPetId,
} from "../controllers/medicalHistoryController.js";

const medicalHistoryRouter = express.Router();

medicalHistoryRouter.post("/", createMedicalHistory);
medicalHistoryRouter.get("/:petId", getMedicalHistoryByPetId);
medicalHistoryRouter.delete("/:id", deleteMedicalHistoryById);

export default medicalHistoryRouter;
