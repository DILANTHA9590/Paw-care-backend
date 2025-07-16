import Otp from "../modules/otp.js";
import User from "../modules/user.js";

// Function to verify user email using OTP----------------------------------------->
export async function VerifyEmail(req, res) {
  try {
    const { otp, email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid email",
      });
    }
    // Find the latest OTP entry for the given email
    const getOtp = await Otp.findOne({ email }).sort({ date: -1 });

    // If no OTP found, send error response
    if (!getOtp) {
      return res.status(404).json({
        message: "Email address not registered. Please check and try again.",
      });
    }

    // Check if provided OTP matches the latest saved OTP
    if (getOtp.otp != otp) {
      return res.status(400).json({
        message: "Invalid OTP. Please check and try again.",
      });
    }
    // 🟢 Calculate if OTP is expired
    const now = new Date();
    const otpCreatedAt = new Date(user.createdAt);
    const diffMs = now - otpCreatedAt;
    const diffMins = diffMs / 1000 / 60;

    if (diffMins > 5) {
      return res.status(400).json({
        message: "OTP expired. Please request a new one!",
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: email }, // filter
      { isverify: true }, // update
      { new: true } // return updated document
    );

    const t = await User.findOne({ email });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error during OTP verification. Please try again.",
    });
  }
}
