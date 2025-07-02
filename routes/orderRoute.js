import express from "express";
import {
  createOrder,
  getOrdersByAdmin,
  getOrdersByCustomerId,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrdersByCustomerId);
orderRouter.get("/admin", getOrdersByAdmin);
orderRouter.put("/:orderId", updateOrderStatus);

export default orderRouter;
