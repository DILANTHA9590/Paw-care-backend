import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", deleteProduct);
productRouter.get("/getproduct", getAllProduct);

export default productRouter;
