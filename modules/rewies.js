import mongoose from "mongoose";

const RewiesSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
    unique: true,
  },

  doctorId: {
    type: String,
    required: true,
  },
  reviewId: {
    type: String,
    required: true,
    unique: true,
  },

  customerId: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },

  reviewDate: {
    type: Date,
    default: Date.now,
  },
});

const Rewies = mongoose.model("Rewies", RewiesSchema);

export default Rewies;
