import express from "express";
import {
  createOrder,
  getOrdersByAdmin,
  getOrdersByCustomerId,
  products,
  tryTest,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrdersByCustomerId);
orderRouter.get("/admin", getOrdersByAdmin);
orderRouter.get("/test", products);

export default orderRouter;
