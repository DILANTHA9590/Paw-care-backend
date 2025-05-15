import express from "express";
import {
  createPet,
  DeletePetdetails,
  updatePetdetails,
} from "../controllers/petController";

const petRouter = express.Router();

petRouter.post("/", createPet);
petRouter.put("/:petId", updatePetdetails);
petRouter.delete("/:petId", DeletePetdetails);

export default petRouter;
