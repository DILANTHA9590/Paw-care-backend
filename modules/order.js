import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  email: {
    //back end can validate
    type: String,
    required: true,
  },

  orderedItems: [
    {
      productId: { type: String },
      prodcutImage: { type: String },
      productName: { type: String },
      quantity: { type: String, default: 1 },
      price: { type: Number },
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
    default: "Confirm",
  },

  totalPrice: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
