import express from "express";
import {
  createPet,
  DeletePetdetails,
  getAllPets,
  getMyPets,
  getPetIdAndNames,
  updatePetdetails,
} from "../controllers/petController.js";

const petRouter = express.Router();

petRouter.post("/", createPet);
petRouter.put("/:petId", updatePetdetails);
petRouter.delete("/:petId", DeletePetdetails);
petRouter.get("/", getAllPets);
petRouter.get("/mypets", getMyPets);
petRouter.get("/getpetid", getPetIdAndNames);

export default petRouter;
