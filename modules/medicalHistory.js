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
  doctorId: {
    type: String,
    required: true,
  },
  diagnosis: [
    {
      type: String,
      required: true,
    },
  ],
  treatment: [
    {
      type: String,
      required: true,
    },
  ],
  prescription: {
    type: String,
  },
  notes: {
    type: String,
  },
  nextVisit: {
    type: Date,
  },
});

const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);

export default MedicalHistory;
