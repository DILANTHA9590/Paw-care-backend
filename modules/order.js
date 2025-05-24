import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
  },

  mobileNumber: {
    type: String,
    required: true,
  },

  orderedItems: [
    {
      productId: { type: String },
      prodcutImage: { type: String },
      productName: { type: String },
      quantity: { type: String, default: 1 },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },

  paymentId: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Completed", "Cancelled"],
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
