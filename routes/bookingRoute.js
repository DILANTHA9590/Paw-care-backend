import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBooking,
  getBookingByCustomer,
  getBookingsByDoctorId,
  getPastBookingsByDoctorId,
  updateBooking,
  updateCompletedBooking,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getAllBooking);
bookingRouter.get("/customer", getBookingByCustomer);
bookingRouter.delete("/:bookingId", deleteBooking);
bookingRouter.put("/:bookingId", updateBooking);
bookingRouter.get("/doctor", getBookingsByDoctorId);
bookingRouter.get("/doctor/status/:bookingId", updateCompletedBooking);
bookingRouter.get("/getpastbooking", getPastBookingsByDoctorId);

export default bookingRouter;
