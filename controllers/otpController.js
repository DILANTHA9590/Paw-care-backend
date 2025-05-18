import Otp from "../modules/otp.js";
import User from "../modules/user.js";

// Function to verify user email using OTP----------------------------------------->
export async function VerifyEmail(req, res) {
  try {
    const { otp, email } = req.body;
    console.log(email);
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
    const isverify = {
      isverify: true,
    };
    const newdata = await User.updateOne({ email }, isverify);
    console.log(newdata);

    return res.status(200).json({
      message: "Email verified successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during OTP verification. Please try again.",
    });
  }
}
