import express from "express";
import {
  createOrder,
  getOrdersByAdmin,
  getOrdersByCustomerId,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrdersByCustomerId);
orderRouter.get("/admin", getOrdersByAdmin);

export default orderRouter;
