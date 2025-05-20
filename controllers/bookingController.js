import Booking from "../modules/booking.js";
import moment from "moment";
import {
  isAdmin,
  isCustomer,
  isDoctor,
} from "../utils.js/adminAndCustomerValidation.js";

//create booking----------------------------------------------------------->
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

//getAll booking for Admin------------------------------------------------------------------->

export async function getAllBooking(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(200).json({
        message: "Access denied. Please log in as an admin to continue.",
      });
    }

    const { searchQuery = "" } = req.query;

    // Search bookings by bookingId, email, status, or date`

    const bookingData = await Booking.find({
      $or: [
        { bookingId: { $regex: searchQuery } },
        { email: { $regex: searchQuery, $options: "i" } },
        { status: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    if (bookingData.length == 0) {
      return res.status(404).json({
        message: " No found",
      });
    }

    res.status(200).json({
      bookingData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went awrong please try again",
      error: error.message,
    });
  }
}

//delete booking for admin------------------------------------------>

export async function deleteBooking(req, res) {
  console.log("inside delete function");
  try {
    // Check admin access
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "Access denied. Only admins can delete bookings.",
      });
    }

    const bookingId = req.params.bookingId.trim();

    console.log(bookingId);

    const deletedBooking = await Booking.findOneAndDelete({
      bookingId: bookingId,
    });

    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    res.status(200).json({
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
}
// update booking details------------------------------------------>

export async function updateBooking(req, res) {
  console.log("inside update function");
  try {
    if (!isAdmin(req)) {
      return res.status(404).json({
        message: "Access denied. Please log in as an admin to continue.",
      });
    }

    //get bookingid and updated data
    const bookingId = req.params.bookingId.trim();
    const bookingData = req.body;

    if (!bookingId || bookingId.trim() === "") {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const updateBooking = await Booking.findOneAndUpdate(
      { bookingId },
      bookingData
    );

    if (!updateBooking) {
      return res.status(404).json({
        message: "Booking id not found",
      });
    }

    res.status(200).json({
      message: "Booking updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
}

// get bookings for the logged-in doctor by doctor ID------------------------------------------------->

export async function getBookingsByDoctorId(req, res) {
  try {
    if (!isDoctor(req)) {
      return res.status(403).json({
        message: "Access denied. Please log in as an doctor to continue.",
      });
    }

    const doctorBookings = await Booking.find(
      { doctorId: req.user.doctorId },
      { status: "confirm" }
    );

    if (doctorid.length == 0) {
      return res.status(404).json({
        message: "No Booking Found",
      });
    }

    res.status(200).json({
      doctorBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
}

// Doctor can mark the booking as 'Completed' after the appointment----------------------------------------------------------->

export async function updateCompletedBooking(req, res) {
  try {
    if (!isDoctor(req)) {
      return res.status(403).json({
        message: "Access denied. Please log in as an doctor to continue.",
      });
    }

    //get booking id
    const bookingId = req.params.bookingId.trim();
    // get  update data
    const bookingData = req.body;

    console.log("bookingId", bookingId);
    console.log("bookingData", bookingData);

    const updateBookig = await Booking.findOneAndUpdate(
      { bookingId },
      { $set: bookingData },
      { new: true }
    );

    if (!updateBookig) {
      return res.status(404).json({
        message: "Booking id not found",
      });
    }

    res.status(200).json({
      message: "Booking updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
}
//doctor id

//doctor can find booking history  it completd always it come  doctor id
//on;y acces doctor id
