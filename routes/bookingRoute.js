import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBooking,
  getBookingByCustomer,
  getBookingsByDoctorId,
  updateBooking,
  updateCompletedBooking,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getAllBooking);
bookingRouter.get("/customer", getBookingByCustomer);
bookingRouter.delete("/:bookingId", deleteBooking);
bookingRouter.put("/:bookingId", updateBooking);
bookingRouter.get("/doctor/:bookingId", getBookingsByDoctorId);
bookingRouter.get("/doctor/status/:bookingId", updateCompletedBooking);

export default bookingRouter;
