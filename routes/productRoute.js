import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getAllProductByAdmin,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);
productRouter.get("/getproduct", getAllProduct);
productRouter.get("/getproductbyadmin", getAllProductByAdmin);

export default productRouter;
