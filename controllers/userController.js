import argon2 from "argon2";
import User from "../modules/user.js";
import jwt from "jsonwebtoken";
import { isAdmin } from "../utils.js/adminAndCustomerValidation.js";

//create user account---------------------------------------
export async function createUser(req, res) {
  try {
    const userdata = req.body;
    console.log(req.user);

    if (userdata.type == "admin" || userdata.type == "doctor") {
      if (!isAdmin(req)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. please login to admin account.",
        });
      }
    }

    console.log(userdata);

    const email = req.body.email;

    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(404).json({
        message: "invalid email format",
      });
    }

    const isHave = await User.findOne({ email });
    console.log(isHave);

    if (isHave) {
      return res.status(403).json({
        message: "An account with this email already exists",
      });
    }

    const hashPassword = await argon2.hash(userdata.password);

    userdata.password = hashPassword;

    const newUser = new User(userdata);

    newUser.save();

    res.status(200).json({
      message: " Usr created success",
    });

    console.log(userdata);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
      message: error.message,
    });
  }
}

//login user -----------------------------------------

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    console.log(user.isBlock);

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
        type: user.type,
      };

      // Create a JWT token
      const token = jwt.sign(payload, process.env.SECRET_KEY);

      res.status(200).json({
        message: "Login successfully",
        payload,
        token,
      });
    }

    console.log(user);
  } catch (error) {}
}

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

export async function getUsers(req, res) {
  console.log("run this");
  const { email = "", firstName = "", lastName = "" } = req.query;
  console.log(email);
  console.log(firstName);
  console.log(lastName);

  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "Access denied. You are not an admin user.",
      });
    }
    // const users = await User.find();
    const users = await User.find({
      email: { $regex: email, $options: "i" },
      firstName: { $regex: firstName, $options: "i" },
      lastName: { $regex: lastName, $options: "i" },
    });
    if (users.length === 0) {
      return res.status(200).json({
        message: "No Users Found",
        users: [],
      });
    }
    res.status(200).json({
      message: " User retrive succsess",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error. Unable to retrieve users.",
      errorDetails: error.message,
    });
  }
}

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
