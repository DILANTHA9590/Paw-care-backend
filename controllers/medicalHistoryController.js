import Booking from "../modules/booking.js";
import MedicalHistory from "../modules/medicalHistory.js";
import {
  isAdmin,
  isCustomer,
  isDoctor,
} from "../utils.js/adminAndCustomerValidation.js";

export async function createMedicalHistory(req, res) {
  try {
    if (!isDoctor(req)) {
      return res.status(401).json({
        message: "Unauthorized access, please login to doctor account",
      });
    }

    const medicalData = req.body.formData;

    medicalData.doctorId = req.user.doctorId || medicalData.doctorId;

    const newHistory = new MedicalHistory(medicalData);
    await newHistory.save();

    const updatedBooking = await Booking.findOneAndUpdate(
      { bookingId: medicalData.bookingId },

      {
        status: "completed",
      },
      {
        new: true, // get updated doc back
      }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        message: "Medical history saved, but related Booking not found",
      });
    }
    res.status(200).json({
      message: "Medical history created successfully",
      medicalHistory: newHistory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create medical history",
      error: error.message,
    });
  }
}

export async function getMedicalHistoryByPetId(req, res) {
  try {
    const { petId } = req.params;

    const history = await MedicalHistory.find({ petId });

    if (!history || history.length === 0) {
      return res.status(404).json({
        message: "No medical history found for this pet",
      });
    }
    //methnata mama user log unama pet profu=ile ekata yanava\
    //ita passe peta adla medical history click akrama parsms valin gannava id
    // it appse medical histry tika retruve karanava
    res.status(200).json({
      message: "Medical history fetched successfully",
      medicalHistory: history,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch medical history",
      error: error.message,
    });
  }
}
