import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewsByDoctorId,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("/", getAllReviews);
// routes/reviewRouter.js
reviewRouter.get("/:doctorId", getReviewsByDoctorId);

export default reviewRouter;
