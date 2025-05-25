import Order from "../modules/order.js";
import { isAdmin, isCustomer } from "../utils.js/adminAndCustomerValidation.js";
import { checkRequredField } from "../utils.js/checkRequiredField.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

// const strip_key = process.env.STRIPE_SECRET_KEY;

export const createOrder = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);
  try {
    const { name, mobileNumber, address, email, orderedItems, amount } =
      req.body;

    //  Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    //create order id
    const ordersCount = await Order.countDocuments();
    const orderId = "ORD#-" + Math.floor(Math.random() * 10000) + ordersCount;

    //  Create Order Instance
    const order = new Order({
      orderId: orderId,
      name,
      mobileNumber,
      address,
      email,
      orderedItems,
      paymentId: paymentIntent.id,
    });

    await order.save(); // Corrected

    // Send response to frontend
    res.status(200).json({
      message: "Order created. Proceed to payment.",
      clientSecret: paymentIntent.client_secret,
      orderId: order.orderId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Payment not initiated." });
  }
};
