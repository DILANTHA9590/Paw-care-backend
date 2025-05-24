import express from "express";
import {
  createMedicalHistory,
  getMedicalHistoryByPetId,
} from "../controllers/medicalHistoryController.js";
import { getAllPets } from "../controllers/petController.js";

const medicalHistoryRouter = express.Router();

medicalHistoryRouter.post("/", createMedicalHistory);
medicalHistoryRouter.get("/:petId", getMedicalHistoryByPetId);

export default medicalHistoryRouter;
