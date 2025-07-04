import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrdersByAdmin,
  getOrdersByCustomerId,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrdersByCustomerId);
orderRouter.get("/admin", getOrdersByAdmin);
orderRouter.put("/:orderId", updateOrderStatus);
orderRouter.delete("/:orderId", deleteOrder);

export default orderRouter;
