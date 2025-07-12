import express from "express";
import {
  deleteDoctor,
  getAllDoctors,
  getAllDoctorsByCustomerUI,
  getDoctor,
  getDoctorById,
  getDoctorsByDays,
  updateDoctor,
  verifyDoctor,
} from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.get("/", getAllDoctors);
doctorRouter.get("/getdoctor", getDoctor);
doctorRouter.put("/:email", updateDoctor);
doctorRouter.delete("/:doctorId", deleteDoctor);
doctorRouter.get("/getbydays", getDoctorsByDays);
doctorRouter.get("/getbookingpage", getAllDoctorsByCustomerUI);
doctorRouter.get("/", getAllDoctors);
doctorRouter.get("/getdoctordetails/:doctorId", getDoctorById);
doctorRouter.get("/verify", verifyDoctor);

export default doctorRouter;
