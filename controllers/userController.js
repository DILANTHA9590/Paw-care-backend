import argon2 from "argon2";
import User from "../moduless/user.js";

//create user account---------------------------------------
export async function createUser(req, res) {
  try {
    const userdata = req.body;

    console.log(userdata);

    const email = req.body.email;

    if (userdata.isBlock) {
      return res.status(403).json({
        message: "Your account has block. please contact admin ",
      });
    }

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

export async function logunUser(req, res) {
  try {
    const { email, password } = req.body;

    const isHave = await User.find({ email });
  } catch (error) {}
}
