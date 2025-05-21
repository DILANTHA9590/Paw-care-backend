import Product from "../modules/product";
import { isAdmin } from "../utils.js/adminAndCustomerValidation";
import { checkRequredField } from "../utils.js/checkRequiredField";

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

    await productData.save();

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
