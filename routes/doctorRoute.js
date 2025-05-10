import express from "express";
import {
  getAllDoctors,
  getDoctor,
  updateDoctor,
} from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.get("/", getAllDoctors);
doctorRouter.get("/getdoctor", getDoctor);
doctorRouter.put("/:email", updateDoctor);

export default doctorRouter;
