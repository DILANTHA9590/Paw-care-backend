import argon2 from "argon2";
import User from "../modules/user.js";
import jwt from "jsonwebtoken";
import { isAdmin, isCustomer } from "../utils.js/adminAndCustomerValidation.js";
import Doctor from "../modules/doctor.js";
import nodemailer from "nodemailer";
import Otp from "../modules/otp.js";

//create user account(ADMIN/CUSTOMER/DOCTOR)--------->
export async function createUser(req, res) {
  try {
    const userdata = req.body;

    if (!userdata.password || userdata.password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password is required (min 6 chars)" });
    }

    // Only an admin is allowed to create admin or doctor accounts
    if (userdata.type == "admin" || userdata.type == "doctor") {
      if (!isAdmin(req)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. please login to admin account.",
        });
      }
    }
    // If this is a doctor account, create it and send back the result

    if (userdata.type == "doctor") {
      const result = await createDoctor(userdata);
      return res.json({
        message: result,
      });
    }

    // this is admin admin and customer account creation part------------------------------->

    const email = req.body.email;

    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(404).json({
        message: "invalid email format",
      });
    }

    const isHave = await User.findOne({ email });

    if (isHave) {
      return res.status(403).json({
        message: "An account with this email already exists",
      });
    }

    const hashPassword = await argon2.hash(userdata.password);

    userdata.password = hashPassword;

    const newUser = new User(userdata);

    newUser.save();

    //send user account create  email for Otp database for email veryfication
    await saveOtpAndEmail(email);

    res.status(200).json({
      message: " User created success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
      message: error.message,
    });
  }
}

//login user ----------------------------------------->
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.includes("@")
    ) {
      return res.status(400).json({ message: "Invalid input types" });
    }

    if (!user) {
      user = await Doctor.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        message: "Invalid email🚫",
      });
    }

    if (user.disabled) {
      return res.status(403).json({
        message: "Your account has block. please contact admin ",
      });
    }

    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      res.statu(401).json({
        message: "Inavlid Password",
      });
    } else {
      const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        type: user.type,
        doctorId: user?.doctorId,
      };

      // Create a JWT token
      const token = jwt.sign(payload, process.env.SECRET_KEY);

      res.status(200).json({
        message: "Login successfully",
        payload,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "An unexpected error occurred while login the user. Please try again later.",
    });
  }
}

//DELETE ONE USER------------------------------------->
export async function deleteUser(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "Access denied. You are not an admin user.",
    });
  }

  try {
    const email = req.params.email;

    const result = await User.findOneAndDelete({ email });
    console.log(result);

    if (!result) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      res.status(200).json({
        message: `User deleted successfully`,
      });
    }
  } catch (error) {}
}

// GET ALL USERS-------------------------------------->
export async function getUsers(req, res) {
  console.log("run this");

  const { searchQuery = "", page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  console.log("Search:", searchQuery);
  console.log("Page:", pageNumber, "Limit:", limitNumber);

  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "Access denied. You are not an admin user.",
      });
    }

    const searchFilter = {
      $or: [
        { email: { $regex: searchQuery, $options: "i" } },
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const users = await User.find(searchFilter)
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const totalUsers = await User.countDocuments(searchFilter);

    if (users.length === 0) {
      return res.status(200).json({
        message: "No Users Found",
        users: [],
        page: pageNumber,
        totalPages: 0,
        totalUsers: 0,
      });
    }

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
      page: pageNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error. Unable to retrieve users.",
      errorDetails: error.message,
    });
  }
}

//DELETE SELECTED  MULTIPLE USERS--------------------->
export async function deleteSelectedUsers(req, res) {
  try {
    const userArrey = req.body.emails;

    console.log(userArrey);

    console.log(req);

    if (!userArrey || userArrey.length === 0) {
      return res.status(400).json({
        message: "No emails provided for deletion",
      });
    }

    const ishave = await User.deleteMany({ email: { $in: userArrey } });

    // Check if any users were deleted
    if (ishave.deletedCount === 0) {
      return res.status(404).json({
        message: "No users found with the provided emails",
      });
    }

    res.status(200).json({
      message: `${ishave.deletedCount} users deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while deleting users",
      error: error.message,
    });
  }
}

//CREATE DOCOTOR-------------------------------------->
export async function createDoctor(user) {
  const { email } = user;
  console.log("doctor email", email);
  try {
    console.log("inside function", user);
    if (typeof email !== "string" || !email.includes("@")) {
      return { message: "Invalid imail format" };
    }

    const isHave = await Doctor.findOne({ email });
    console.log(isHave);

    if (isHave) {
      return { message: "An account with this email already exists" };
    }

    const hashPassword = await argon2.hash(user.password);

    user.password = hashPassword;

    const newUser = await new Doctor(user);

    newUser.save();

    return { message: "Doctor account created successfully" };
  } catch (error) {
    console.log(error);
    return { message: "Server error while creating doctor" };
  }
}

// Function to generate a random 4-digit OTP and save it to the database with the user's email----------------->
export async function saveOtpAndEmail(email) {
  const otp = Math.floor(1000 + Math.random() * 9000);

  sendOtpEmail(email, otp);

  const data = {
    otp: otp,
    email: email,
  };

  const newOtp = new Otp(data);

  await newOtp.save();
}

// Function to send OTP email using Nodemailer-------------------------------------------->
export function sendOtpEmail(email, otp) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "dilantha9590@gmail.com",
      pass: process.env.googlekey,
    },
  });

  const message = {
    from: "dilantha9590@gmail.com",
    to: email,
    subject: "Your OTP Code for Verification",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Verify Your PawCare Account</h2>
      <p>Your OTP code is:</p>
      <p style="font-size: 28px; font-weight: bold; color: #4CAF50;">${otp}</p>
      <p>This code is valid for 5 minutes.</p>
    </div>
  `,
  };

  transport.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

export async function UpdateUser(req, res) {
  console.log("inside this");
  const { email } = req.params;

  console.log(email);
  const { firstName, lastName, type, whatsApp } = req.body;
  console.log(whatsApp, email);
  console.log(req.body);

  // Simple validation
  if (!firstName || !lastName || !type || !whatsApp) {
    return res.status(400).json({ message: "All fields are required." });
  }

  console.log("pass this");
  try {
    console.log("inside this");
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export async function getDetailsForUserProfile(req, res) {
  console.log(req.user);
  try {
    if (!isCustomer(req)) {
      return res
        .status(403)
        .json({ message: "Access denied. Only customers allowed." });
    }

    const email = req.user.email;

    const userData = await User.findOne({ email: email });

    if (!userData) {
      // If user data is not found, send a 404 response
      return res.status(404).json({ message: "User not found." });
    }

    // If user data is found, send it back
    return res.status(200).json({ user: userData });
  } catch (error) {
    // If an unexpected error occurs, send a 500 response
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
}
