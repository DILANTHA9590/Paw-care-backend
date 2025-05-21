import express from "express";
import {
  createReview,
  getReviewsByDoctorId,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
// routes/reviewRouter.js
reviewRouter.get("/:doctorId", getReviewsByDoctorId);

export default reviewRouter;
