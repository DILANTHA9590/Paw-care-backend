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

//getAll booking for Admin

export async function getAllBooking(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(200).json({
        message: "Access denied. Please log in as an admin to continue.",
      });
    }

    const { searchQuery = "" } = req.query;

    console.log(searchQuery);
    //
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

//delete booking for admin

//admin can update booking

// get booking for doctor own doctor id
// doctor id

// doctor can  update completd
//doctor id

//doctor can find booking history  it completd always it come  doctor id
//on;y acces doctor id
