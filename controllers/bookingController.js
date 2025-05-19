import Booking from "../modules/booking.js";
import moment from "moment";
import { isAdmin, isCustomer } from "../utils.js/adminAndCustomerValidation.js";
export async function createBooking(req, res) {
  try {
    if (!isAdmin(req) && !isCustomer(req)) {
      return res.status(403).json({
        message: "Please login first create booking",
      });
    }

    // Get today's start and end time
    const startOfDay = moment().startOf("day").toDate();

    const endOfDay = moment().endOf("day").toDate();
    const bookingData = req.body;

    //get booking count by day
    let todayCount = await Booking.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    //get for create booking id

    let totalCount = await Booking.countDocuments({});

    const complteId = "BID00" + totalCount + 1; //booking id
    todayCount += 1;

    bookingData.bookingId = complteId;
    bookingData.userId = req.user.email;
    bookingData.bookingNumber = todayCount;
    //it get submit from
    // bookingData.doctorId = doctorId

    const newUser = new Booking(bookingData);
    newUser.save();

    res.status(200).json({
      message: "Booking created successfully",
    });
  } catch (error) {
    res.status(200).json({
      message: "Something went a wrong please try again",
      error: error.message,
    });
  }
}
