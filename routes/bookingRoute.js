import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBooking,
  updateBooking,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getAllBooking);
bookingRouter.delete("/:bookingId", deleteBooking);
bookingRouter.put("/:bookingId", updateBooking);

export default bookingRouter;
