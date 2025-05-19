import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBooking,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getAllBooking);
bookingRouter.delete("/:bookingId", deleteBooking);

export default bookingRouter;
