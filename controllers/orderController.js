import Order from "../modules/order.js";
import Product from "../modules/product.js";
import { isAdmin, isCustomer } from "../utils.js/adminAndCustomerValidation.js";
import { checkRequredField } from "../utils.js/checkRequiredField.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

// product creation--------------------------------------------------------------->

export const createOrder = async (req, res) => {
  console.log("run this create order");
  try {
    //user validation
    if (!isCustomer(req) && !isAdmin(req)) {
      return res.status(403).json({
        message: "Access denied. Please log in first to create an order.",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_KEY);

    const orderData = req.body;

    let { orderedItems } = orderData;

    // updateOrderStockCount(orderedItems); //pass orderitem for update order count

    //create unique order id

    const ordersCount = await Order.countDocuments();
    const oid = "ORD" + Math.floor(Math.random() * 10000) + ordersCount;

    // get  prodyct data using productid(product validate using product id);

    const newproductData = [];
    let totalAmount = 0;
    for (const item of orderedItems) {
      const productId = item.productId;

      const findproduct = await Product.findOne({ productId: productId });

      if (!findproduct) {
        console.log("No product id found", productId);
        continue;
      }

      // check  again product total amonut

      totalAmount = totalAmount + findproduct.lastPrice;

      // get product details using product id

      const product = {
        productid: findproduct.productId,
        productImage: findproduct.image[0],
        productName: findproduct.productName,
        quantity: item.quantity,

        price: findproduct.price,
      };

      newproductData.push(product);
    }

    // genaratate payment id
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    orderData.orderedItems = newproductData;

    orderData.orderId = oid;

    orderData.email = req.user.email;

    orderData.paymentId = paymentIntent.id;

    orderData.totalPrice = totalAmount;

    //create order
    const order = new Order(orderData);

    await order.save();

    // // Send response to frontend
    res.status(200).json({
      message: "Order created. Proceed to payment.",
      paymentData: {
        clientSecret: paymentIntent.client_secret,
        orderId: oid,
        totalAmount,
      },
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

export async function updateOrderStatus(req, res) {
  try {
    if (!isCustomer(req)) {
      return res.status(403).json({
        message: "Access denied. Please log in first to create an order.",
      });
    }

    const id = req.params.orderId.trim();
    const status = req.body.status;

    if (!id && !status) {
      res.status(200).json({
        message: "All field required",
      });
      return;
    }

    const updateOrder = await Order.findOneAndUpdate(
      { orderId: id },
      { status: status },
      { new: true }
    );

    if (!updateOrder) {
      return res.status(404).json({
        message: "Invalid Order Id",
      });
    }

    res.status(200).json({
      message: "✅ Payment successful! Thank you for your order.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messsage: "Server error while update Order",
    });
  }
}
