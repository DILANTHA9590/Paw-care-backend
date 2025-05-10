import Doctor from "../modules/doctor.js";
import { isAdmin } from "../utils.js/adminAndCustomerValidation.js";

export async function updateDoctor(req, res) {
  try {
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

export async function getDoctors(req, res) {
  console.log("inside this");

  try {
    if (isAdmin(req)) {
      const { email = "", name = "", type = "" } = req.body;
      console.log(email);

      // const userData = await Doctor.find();
      const userData = await Doctor.find({
        type: { $regex: type, $options: "i" }, // Matches doctorId with a case-insensitive regex
        email: { $regex: email, $options: "i" }, // Matches email with a case-insensitive regex
        name: { $regex: name, $options: "i" }, // Matches name with a case-insensitive regex
      });

      if (userData.length === 0) {
        return res.status(404).json({
          message: "User not found ",
        });
      }

      if (userData) {
        return res.status(200).json({
          message: "data retrive succesfully",
          userData,
        });
      }
    } else {
    }
  } catch {}
}
