import express from "express";
import {
  createPet,
  DeletePetdetails,
  getAllPets,
  getMyPets,
  updatePetdetails,
} from "../controllers/petController.js";

const petRouter = express.Router();

petRouter.post("/", createPet);
petRouter.put("/:petId", updatePetdetails);
petRouter.delete("/:petId", DeletePetdetails);
petRouter.get("/", getAllPets);
petRouter.get("/mypets", getMyPets);

export default petRouter;
