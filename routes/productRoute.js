import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getAllProductByAdmin,
  getProductDetails,
  getProductForCart,
  getQuote,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);
productRouter.get("/getproduct", getAllProduct);
productRouter.get("/getproductbyadmin", getAllProductByAdmin);
productRouter.get("/productoverview/:productId", getProductDetails);
productRouter.post("/quote", getQuote);
productRouter.get("/productcart/:productId", getProductForCart);

export default productRouter;
