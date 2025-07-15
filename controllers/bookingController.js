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
    totalCount = totalCount + 1;
    const complteId = "BID00" + totalCount; //booking id
    todayCount += 1;

    console.log("booking_id", complteId);

    bookingData.bookingId = complteId;
    bookingData.userId = req.user.email;
    bookingData.bookingNumber = todayCount;
    //it get submit from
    // bookingData.doctorId = doctorId

    console.log("full one", bookingData);
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
    // Check if the requester is an admin; if not, deny access with a message
    if (!isAdmin(req)) {
      return res.status(200).json({
        message: "Access denied. Please log in as an admin to continue.",
      });
    }

    // Extract query parameters for search, pagination (page number & limit)
    const { searchQuery = "", page = 1, limit = 10 } = req.query;
    console.log(searchQuery);

    // Parse page and limit to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate how many documents to skip based on page and limit
    const skip = (pageNumber - 1) * limitNumber;

    // Construct filter for search using regex on bookingId, email, or status (case-insensitive)
    const filter = {
      $or: [
        { bookingId: { $regex: searchQuery } },
        { email: { $regex: searchQuery, $options: "i" } },
        { status: { $regex: searchQuery, $options: "i" } },
      ],
    };

    // Get the total number of bookings matching the filter
    const totalBookings = await Booking.countDocuments(filter);

    // Retrieve the paginated bookings sorted by most recent (createdAt desc)
    const bookingData = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // If no bookings found, respond with 404 status and message
    if (bookingData.length === 0) {
      return res.status(200).json({
        message: "No bookings found.",
      });
    }

    // Respond with booking data, total count, total pages, and current page info
    res.status(200).json({
      totalBookings,
      totalPages: Math.ceil(totalBookings / limitNumber),
      currentPage: pageNumber,
      bookings: bookingData,
    });
  } catch (error) {
    // Log error and respond with 500 status and error message on failure
    console.log(error);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
      error: error.message,
    });
  }
}

//delete booking for admin------------------------------------------>

export async function deleteBooking(req, res) {
  try {
    // Check if requester is admin or customer; deny access otherwise
    if (!isAdmin(req) && !isCustomer(req)) {
      return res.status(403).json({
        message: "Access denied. Only admins can delete bookings.",
      });
    }

    // Get booking ID from request parameters and trim whitespace
    const bookingId = req.params.bookingId.trim();

    console.log(bookingId); // Log booking ID for debugging

    // Attempt to find and delete the booking by _id
    const deletedBooking = await Booking.findOneAndDelete({
      _id: bookingId,
    });

    // If no booking found to delete, return 404 error
    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    // If deleted successfully, send success response
    res.status(200).json({
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    // Log any server error and send 500 response
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
    // Check if user is admin, deny access if not
    if (!isAdmin(req)) {
      return res.status(404).json({
        message: "Access denied. Please log in as an admin to continue.",
      });
    }

    // Get booking ID from URL params and updated data from request body
    const bookingId = req.params.bookingId.trim();
    const bookingData = req.body;

    // Validate booking ID presence
    if (!bookingId || bookingId.trim() === "") {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    // Update booking document matching bookingId with new data
    const updateBooking = await Booking.findOneAndUpdate(
      { bookingId },
      bookingData
    );

    // If no booking found to update, respond with 404
    if (!updateBooking) {
      return res.status(404).json({
        message: "Booking id not found",
      });
    }

    // Success response when update is complete
    res.status(200).json({
      message: "Booking updated successfully.",
    });
  } catch (error) {
    // Log and return server error
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
    // Check if requester is a doctor
    if (!isDoctor(req)) {
      return res.status(403).json({
        message: "Access denied. Please log in as a doctor to continue.",
      });
    }

    // Find bookings for the doctor with status 'confirm'
    // Note: status filter should be inside the query object, not projection
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)); // Start of today
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)); // End of today

    console.log("ssssssssssssssssssssssss", startOfDay);

    const doctorBookings = await Booking.find({
      doctorId: req.user.doctorId,
      status: "confirm",
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).sort({ createdAt: -1 });
    // If no bookings found, return 404 error
    if (doctorBookings.length === 0) {
      return res.status(200).json({
        message: "No Booking Found",
      });
    }

    // Return the bookings data with success status
    res.status(200).json({
      doctorBookings,
    });
  } catch (error) {
    // Handle unexpected server errors
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

//get bookings by customers id------------------------------------------->
export async function getBookingByCustomer(req, res) {
  try {
    // Check if user is a customer
    if (!isCustomer(req)) {
      return res.status(403).json({
        message: "Please login to valid account view your details",
      });
    }

    const userId = req.user.email;

    // Await the Booking query (find instead of findOne if you expect multiple bookings)
    const bookings = await Booking.find({ userId: userId });

    // If no bookings found, send appropriate message
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        message: "No bookings found yet. Book a service to see it here!",
      });
    }

    // If bookings found, send them in response
    return res.status(200).json({
      bookings: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
}

export async function getPastBookingsByDoctorId(req, res) {
  try {
    // Check if the requester is a doctor; if not, deny access
    if (!isDoctor(req)) {
      return res.status(403).json({
        message: "Access denied. Please log in as a doctor to continue.",
      });
    }

    // Get the start and end time of today (used to filter bookings)
    let startOfDay = new Date(new Date().setHours(0, 0, 0, 0)); // Today at 00:00:00
    let endOfDay = new Date(new Date().setHours(23, 59, 59, 999)); // Today at 23:59:59

    // Read date range (minRange, maxRange) from query params if provided
    let { minRange, maxRange } = req.query;
    if (minRange && maxRange) {
      minRange = new Date(req.query.minRange);
      maxRange = new Date(req.query.maxRange);
    }

    let doctorBookings = null;

    // If no date range given, get all past bookings before today
    if (!minRange && !maxRange) {
      doctorBookings = await Booking.find({
        doctorId: req.user.doctorId, // For this doctor
        createdAt: { $lt: startOfDay }, // Bookings before today
      }).sort({ createdAt: -1 }); // Sort newest first
    } else {
      // If date range given, find bookings between minRange and maxRange
      doctorBookings = await Booking.find({
        doctorId: req.user.doctorId,
        createdAt: {
          $gte: minRange, // After or on minRange
          $lte: maxRange, // Before or on maxRange
        },
      }).sort({ createdAt: -1 });
    }

    // If no bookings found, return message
    if (doctorBookings.length === 0) {
      return res.status(200).json({
        message: "No Booking Found",
      });
    }

    // Return the list of bookings found
    res.status(200).json({
      doctorBookings,
    });
  } catch (error) {
    // If any error happens, log it and return server error message
    console.log(error);
    res.status(500).json({
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
}
