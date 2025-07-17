import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema({
  petId: {
    type: String,

    required: true,
  },
  visitDate: {
    type: Date,
    required: true,
    default: Date.now,
  },

  bookingId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },

  prescription: [
    {
      medicine: String,
      dosage: String,
      duration: String,
      instructions: String,
    },
  ],
  treatment: [
    {
      type: String,
      required: true,
    },
  ],

  nextVisit: {
    type: Date,
  },
});

const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);

export default MedicalHistory;
