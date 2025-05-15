import express from "express";
import {
  createPet,
  DeletePetdetails,
  getAllPets,
  updatePetdetails,
} from "../controllers/petController.js";

const petRouter = express.Router();

petRouter.post("/", createPet);
petRouter.put("/:petId", updatePetdetails);
petRouter.delete("/:petId", DeletePetdetails);
petRouter.get("/", getAllPets);

export default petRouter;
