import mongoose from "mongoose";

const RewiesSchema = new mongoose.Schema({
  accept: {
    type: Boolean,
    required: true,
  },

  bookingId: {
    type: String,
    required: true,
  },

  doctorId: {
    type: String,
    required: true,
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
