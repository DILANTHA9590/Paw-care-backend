import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getAllProductByAdmin,
  getProductDetails,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);
productRouter.get("/getproduct", getAllProduct);
productRouter.get("/getproductbyadmin", getAllProductByAdmin);
productRouter.get("/productoverview/:productId", getProductDetails);

export default productRouter;
