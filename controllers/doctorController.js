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

  if (!isAdmin(req)) {
    return res.status(200).json({
      message: " Unauthorized access",
    });
  }

  try {
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

    const userData = await Doctor.find(query).skip(skip).limit(parseInt(limit));

    const total = await Doctor.countDocuments(query);

    if (userData.length === 0) {
      return res.status(200).json({
        message: "User not found",
        userData: [],
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

    console.log(doctorId);

    const result = await Doctor.findOneAndDelete({ _id: doctorId });

    if (!result) {
      return res.status(200).json({
        message: "Doctor Id  not Found",
      });
    }

    res.status(200).json({
      message: "Delete completed",
      result,
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

    const doctors = await Doctor.find(
      {},
      "name availabledays specialization availableTime image rating experience doctorId "
    );

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

// Fetches a public list of doctors without exposing sensitive information.
export async function getAllDoctorsByCustomerUI(req, res) {
  try {
    const doctors = await Doctor.find(
      {},
      "name availabledays specialization availableTime image rating experience doctorId"
    );

    if (doctors.length === 0) {
      return res.status(200).json({
        message: "No doctors available at the moment.",
        doctors: [],
      });
    }

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error occurred while fetching doctors.",
      error: error.message,
    });
  }
}

export async function getDoctorById(req, res) {
  try {
    const doctorId = req.params.doctorId; //

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const doctor = await Doctor.findOne(
      { doctorId: doctorId }, // filter by ID
      "name availabledays specialization availableTime image rating experience doctorId" // fields to select
    );

    console.log(doctor);
    if (!doctor) {
      return res.status(200).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ doctor });
  } catch (error) {
    console.error("Error getting doctor by ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function verifyDoctor(req, res) {
  try {
    if (!isDoctor(req)) {
      return res.status(403).json({
        message: "Unauthorized. Please log in as a doctor to continue.",
      });
    }

    const name = await Doctor.findOne({ email: req.user.email });

    res.status(200).json({
      result: true,
      name: name.name,
    });
  } catch (error) {
    console.error("Error getting verify doctor :", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createDoctor(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "Please loginto admin account",
    });
  }
  try {
    // Extract data from request body

    const {
      doctorId,
      email,
      phone,
      password,
      name,
      specialization,
      experience,
      availabledays,
      availableTime,
      image,
    } = req.body;

    // Basic validation
    if (
      !doctorId ||
      !email ||
      !phone ||
      !password ||
      !name ||
      !specialization ||
      !experience ||
      !availabledays ||
      !availableTime
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create new Doctor
    const newDoctor = new Doctor({
      doctorId,
      email,
      phone,
      password,
      name,
      specialization: specialization.split(",").map((s) => s.trim()),
      experience,
      availabledays,
      availableTime,
      image,
    });

    await newDoctor.save();

    res.status(201).json({
      message: "Doctor created successfully!",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create doctor.",
      error: error.message,
    });
  }
}
