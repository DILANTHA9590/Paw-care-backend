import Doctor from "../modules/doctor.js";
import { isAdmin, isDoctor } from "../utils.js/adminAndCustomerValidation.js";

// UPDATE DOCTOR DETAILS---------------------------------------------------->
export async function updateDoctor(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. please login to admin account.",
      });
    }

    const email = req.params.email;

    const userData = req.body;

    const updatedUser = await Doctor.findOneAndUpdate(
      { email: email },
      { $set: userData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User update successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        "An error occurred while updating the user. Please try again later. ⚠️",
    });
  }
}

//GET ALL DOCTORS DETAILS---------------------------------------------------->
export async function getAllDoctors(req, res) {
  console.log("inside this");

  try {
    if (isAdmin(req)) {
      const { searchQuery = "", page = 1, limit = 10 } = req.query;

      const query = {
        $or: [
          { doctorId: { $regex: searchQuery, $options: "i" } },
          { type: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
          { name: { $regex: searchQuery, $options: "i" } },
        ],
      };

      const skip = (page - 1) * limit;

      const userData = await Doctor.find(query)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Doctor.countDocuments(query);

      if (userData.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "Data retrieved successfully",
        userData,
        pagination: {
          totalItems: total,
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          pageSize: parseInt(limit),
        },
      });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong. Please try again.",
      error: error.message,
    });
  }
}

// GET LOGIN DOCTOR DATA ------------------------------------------------------>
export async function getDoctor(req, res) {
  try {
    console.log("run inside");
    if (!isDoctor(req)) {
      return res.status(404).json({
        message: "Please login to doctor account view detail",
      });
    }

    const { email } = req.user;

    console.log("inside function ", email);
    const userdata = await Doctor.findOne({ email });

    if (!userdata) {
      return res.status(404).json({
        message: "No found user",
      });
    }

    res.status(200).json({
      userdata,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went a wrong please again",
      error: error.message,
    });
  }
}

// Delete a doctor profile by ID------------------------------------------------------------->

export async function deleteDoctor(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "Unautherized Access,Please login to admin account",
      });
    }

    const { doctorId } = req.params;

    const result = await Doctor.findOneAndDelete({ doctorId });

    if (!result) {
      return res.status(200).json({
        message: "Doctor Id  not Found",
      });
    }

    res.status(200).json({
      message: "Delete completed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went a wrong please again",
      error: error.message,
    });
  }
}

//Create functtion for get doctors bydays-------------------------------------------->

export async function getDoctorsByDays(req, res) {
  console.log(req.user);
  try {
    const today = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // get today day name
    const dayName = days[today.getDay()];

    const doctors = await Doctor.find();

    ///filtered  doctors by days
    const filteredDoctors = doctors.filter((val) => {
      const days = val.availabledays.split(",");
      return days.includes(dayName);
    });

    if (filteredDoctors.length == 0) {
      res.status(200).json({
        message: "No doctors found",
      });
    } else {
      res.status(200).json({
        filteredDoctors,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went a wrong please try again ",
      error: error.message,
    });
  }
}
