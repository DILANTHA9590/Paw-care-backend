import Booking from "../modules/booking.js";
import Rewies from "../modules/rewies.js";
import {
  isAdmin,
  isCustomer,
  isDoctor,
} from "../utils.js/adminAndCustomerValidation.js";
import { checkRequredField } from "../utils.js/checkRequiredField.js";

export async function createReview(req, res) {
  try {
    if (!isCustomer(req) && !isAdmin(req)) {
      return res.status(401).json({
        message: "Please login first to add a review",
      });
    }

    const reviewsData = req.body;

    console.log(req.body);
    const requiredFields = ["doctorId", "customerId", "rating", "comment"];

    reviewsData.customerId = req.user.id;

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

    // const

    const id = req.body.bookingId.trim();
    console.log("bookingid", id);

    const newj = await Booking.findOne({ bookingId: id });

    const data = await Booking.findOneAndUpdate(
      { bookingId: id },
      { isConfirm: "yes" },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({
        message: "no booking find this booking id",
      });
    }

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

export async function getReviewsByDoctorId(req, res) {
  try {
    const { doctorId } = req.params;
    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 5; // default limit = 5
    const skip = (page - 1) * limit;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const total = await Rewies.countDocuments({ doctorId }); // total review count
    const reviews = await Rewies.find({ doctorId })
      .skip(skip)
      .limit(limit)
      .sort({ reviewDate: -1 }); // newest first

    res.status(200).json({
      message: "Reviews retrieved successfully",
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllReviews(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query; // default page 1, limit 10
    console.log(page);
    console.log(limit);

    const skip = (page - 1) * limit;

    const reviewData = await Rewies.find()
      .sort({ reviewDate: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const totalReviews = await Rewies.countDocuments();

    res.status(200).json({
      reviews: reviewData,
      total: totalReviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
}
