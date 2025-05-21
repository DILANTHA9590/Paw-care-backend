import Product from "../modules/product.js";
import { isAdmin } from "../utils.js/adminAndCustomerValidation.js";
import { checkRequredField } from "../utils.js/checkRequiredField.js";

export async function createProduct(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(200).json({
        message: "Access denied, Please loging to admin account",
      });
    }

    const productData = req.body;

    const requiredFields = [
      "productId",
      "productName",
      "petType",
      "price",
      "lastPrice",
      "image",
    ];

    const validationErrors = checkRequredField(productData, requiredFields);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const newProductData = new Product(productData);

    await newProductData.save();

    return res.status(200).json({
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    // Check admin access
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({
        message: `Product with ID '${productId}' not found`,
      });
    }

    // Delete the product
    await Product.deleteOne({ productId });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
