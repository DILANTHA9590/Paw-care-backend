import express from "express";
import {
  deleteDoctor,
  getAllDoctors,
  getDoctor,
  getDoctorsByDays,
  updateDoctor,
} from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.get("/", getAllDoctors);
doctorRouter.get("/getdoctor", getDoctor);
doctorRouter.put("/:email", updateDoctor);
doctorRouter.delete("/:doctorId", deleteDoctor);
doctorRouter.get("/getbydays", getDoctorsByDays);

export default doctorRouter;
