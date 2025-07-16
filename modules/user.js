import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  image: {
    type: String,
    default:
      "https://th.bing.com/th/id/OIP.PKlD9uuBX0m4S8cViqXZHAHaHa?rs=1&pid=ImgDetMain",
  },

  email: { type: String, required: true, unique: true },

  password: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
    default: "customer",
  },

  whatsApp: {
    type: String,
    required: true,
  },

  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },

  isverify: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
