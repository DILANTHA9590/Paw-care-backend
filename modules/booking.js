import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },

  userId: {
    type: String,
    required: true,
  },

  doctorId: {
    type: String,
    required: true,
  },

  petId: {
    type: String,
    required: true,
  },

  mobileno: {
    type: String,
    required: true,
  },

  bookingNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "confirm",
  },
  // i use this handle user reviws
  isConfirm: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
