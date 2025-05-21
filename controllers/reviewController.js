import Rewies from "../modules/rewies.js";
import { isAdmin, isCustomer } from "../utils.js/adminAndCustomerValidation.js";
import { checkRequredField } from "../utils.js/checkRequiredField.js";

export async function createReview(req, res) {
  try {
    // if (!isCustomer(req) && !isAdmin(req)) {
    //   return res.status(401).json({
    //     message: "Please login first to add a review",
    //   });
    // }

    const reviewsData = req.body;
    const requiredFields = ["doctorId", "customerId", "rating", "comment"];

    // Validate required fields
    const validationErrors = checkRequredField(reviewsData, requiredFields);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Save to MongoDB
    const newReview = new Rewies(reviewsData);
    const savedReview = await newReview.save();

    res.status(201).json({
      message: "Review added successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
