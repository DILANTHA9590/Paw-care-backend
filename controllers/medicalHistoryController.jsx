import MedicalHistory from "../modules/medicalHistory";
import { isDoctor } from "../utils.js/adminAndCustomerValidation";

export async function createMedicalHistory(req, res) {
  try {
    if (!isDoctor(req)) {
      return res.status(401).json({
        message: "Unauthorized access, please login to doctor account",
      });
    }

    const medicalData = req.body;
    medicalData.doctorId = req.user.doctorId;

    const newHistory = new MedicalHistory(medicalData);
    await newHistory.save();

    res.status(201).json({
      message: "Medical history created successfully",
      medicalHistory: newHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create medical history",
      error: error.message,
    });
  }
}
