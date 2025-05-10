import express from "express";
import { getAllDoctors, getDoctor } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.get("/", getAllDoctors);
doctorRouter.get("/getdoctor", getDoctor);

export default doctorRouter;
