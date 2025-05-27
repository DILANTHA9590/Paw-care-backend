import Order from "../modules/order.js";
import Product from "../modules/product.js";
import { isAdmin, isCustomer } from "../utils.js/adminAndCustomerValidation.js";
import { checkRequredField } from "../utils.js/checkRequiredField.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

// product creation--------------------------------------------------------------->

export const createOrder = async (req, res) => {
  console.log(req.user.type);
  if (!isCustomer(req)) {
    return res.status(403).json({
      message: "Access denied. Please log in first to create an order.",
    });
  }

  const stripe = new Stripe(process.env.STRIPE_KEY);
  try {
    const { name, mobileNumber, address, email, orderedItems, amount } =
      req.body;

    updateOrderStockCount(orderedItems); //pass orderitem for update order count

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
      email: req.user.email,
      orderedItems,
      paymentId: paymentIntent.id,
    });

    await order.save();

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

// update stock count using orderedItems --------------------------------------------------->

async function updateOrderStockCount(orderedItems) {
  try {
    for (const item of orderedItems) {
      const productId = item.productId;
      const orderedQty = parseInt(item.quantity); // convert number

      const product = await Product.findOne({ productId });

      if (!product) {
        console.log(`Product ${productId} not found`);
        continue;
      }

      // Update product stock

      if (product.quantityInStock >= orderedQty) {
        const newQty = product.quantityInStock - orderedQty;
        await Product.updateOne(
          { productId: productId },
          {
            $set: {
              quantityInStock: newQty,
            },
          }
        );
        console.log(
          `Stock updated for ${productId}. Remaining: ${product.quantityInStock}`
        );

        const data = await Product.findOne({ productId });
        console.log("data 1", data);
      } else {
        console.log(
          `Insufficient stock for ${productId}. Available: ${product.quantityInStock}, Requested: ${orderedQty}`
        );
      }
    }
  } catch (error) {
    console.error("Error in updating stock count:", error);
  }
}

//get product by using customer Id

export async function getOrdersByCustomerId(req, res) {
  try {
    if (!isCustomer(req) && !isAdmin(req)) {
      return res.status(403).json({
        message: " Please login to  first view your Order",
      });
    }

    const email = req.user.email;
    const orderData = await Order.find({ email });

    if (orderData.length == 0) {
      return res.status(404).json({
        message: " No Orders found",
        orderData: [],
      });
    }

    res.status(200).json({
      orderData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Some thing went a wrong please try again",
      error: error.message,
    });
  }
}

// Get all orders (admin only), with optional search by orderId------------------------------------------------->

export async function getOrdersByAdmin(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "Please login to an admin account",
      });
    }

    const { searchQuery = "" } = req.query;

    // Search orders by orderId using regex
    const orderData = await Order.find({
      orderId: { $regex: searchQuery },
    }).sort({ date: -1 });
    if (!orderData || orderData.length === 0) {
      return res.status(404).json({
        message: "No orders found",
      });
    }

    return res.status(200).json({
      message: "Orders fetched successfully",
      data: orderData,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({
      message: "Server error while fetching orders",
    });
  }
}

export async function tryTest(req, res) {
  console.log("user ip xxx", req.info);
  let productdata = [];
  try {
    const { orderedItems } = req.body;

    for (const items of orderedItems) {
      const prodcutId = items.productId;
      console.log(prodcutId);
      const productbyAll = await Product.findOne({ productId: prodcutId });

      const adddata = {
        productId: productbyAll.productId,
        name: productbyAll.productName,
        price: productbyAll.price,
        image: productbyAll.image[0],
      };

      productdata.push(adddata);
    }

    const clientInfo = req.clientInfo || {};

    res.json({
      message: "Ok",
      clientInfo,
    });

    // orderedItems.map((val) => {
    //   const prodcutId = val.prodcutId;

    //   const productbyAll = await Product.findOne({productId});

    // });
    // console.log(orderedItems);

    console.log(productdata);
  } catch (error) {}
}

export async function products(req, res) {
  console.log("kl");
  try {
    const products = req.body;
    const {
      orderId,
      name,
      mobileNumber,
      address,
      email,
      orderedItems,
      date,
      paymentId,
      status,
    } = products;
    console.log(orderedItems);
    const newproductData = [];
    for (const item of orderedItems) {
      const productId = item.productId;

      const findproduct = await Product.findOne({ productId: productId });

      if (!findproduct) {
        console.log("No product id found", productId);
        continue;
      }

      const product = {
        productid: findproduct.productId,
        productImage: findproduct.image[0],
        productName: findproduct.productName,
        quantity: item.quantity,
        price: findproduct.price,
      };
      console.log(product);
      newproductData.push(product);
    }
    products.orderedItems = newproductData;
    // console.log(newproductData);

    console.log(products);
  } catch (error) {
    console.log(error);
  }
}
