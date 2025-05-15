import express from "express";
import {
  deleteDoctor,
  getAllDoctors,
  getDoctor,
  updateDoctor,
} from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.get("/", getAllDoctors);
doctorRouter.get("/getdoctor", getDoctor);
doctorRouter.put("/:email", updateDoctor);
doctorRouter.delete("/:doctorId", deleteDoctor);

export default doctorRouter;
