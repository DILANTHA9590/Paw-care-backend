import express from "express";
import {
  createOrder,
  getOrdersByCustomerId,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrdersByCustomerId);

export default orderRouter;
