import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  image: {
    type: String,
    default:
      "https://th.bing.com/th/id/OIP.CsrrmEmMiAk5uwQ-KFOTcgHaHa?rs=1&pid=ImgDetMain",
  },

  doctorId: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  specialization: [
    {
      type: String,
      required: true,
    },
  ],
  experience: {
    type: Number,
    required: true,
  },

  availabledays: {
    type: String,
    required: true,
  },
  profilecreated: {
    type: Date,
    default: Date.now,
  },
  availableTime: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
  },
  type: {
    type: String,
    default: "doctor",
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
