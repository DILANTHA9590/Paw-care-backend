import express from "express";
import {
  createOrder,
  getOrdersByAdmin,
  getOrdersByCustomerId,
  tryTest,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrdersByCustomerId);
orderRouter.get("/admin", getOrdersByAdmin);
orderRouter.get("/test", tryTest);

export default orderRouter;
