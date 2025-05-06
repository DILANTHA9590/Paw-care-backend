import argon2 from "argon2";
import User from "../modules/user.js";
import jwt from "jsonwebtoken";

//create user account---------------------------------------
export async function createUser(req, res) {
  try {
    const userdata = req.body;

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

    console.log("hasoOne", userdata.password);

    const newUser = new User(userdata);

    newUser.save();

    res.status(200).json({
      message: " Usr created success",
    });

    console.log(userdata);
  } catch (error) {
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

    if (user.isBlock) {
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
  try {
    const userId = req.params.userId;

    User;
  } catch (error) {}
}
