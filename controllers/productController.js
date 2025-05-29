import Product from "../modules/product.js";
import { isAdmin } from "../utils.js/adminAndCustomerValidation.js";
import { checkRequredField } from "../utils.js/checkRequiredField.js";

// create product ---------------------------------------------------------->

export async function createProduct(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(200).json({
        message: "Access denied, Please loging to admin account",
      });
    }

    const productData = req.body;
    //validate need fileds
    const requiredFields = [
      "productId",
      "productName",
      "petType",
      "price",
      "lastPrice",
      "image",
    ];
    //field validate process
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

//delete product using product id------------------------------------------------------>
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

//update Products by id------------------------------------------------------------->

export async function updateProduct(req, res) {
  try {
    // Only allow admins
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    const { productId } = req.params;
    const updatedData = req.body;

    // Find and update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { productId },
      updatedData,
      { new: true } // return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: `Product with ID '${productId}' not found`,
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

//Get All product details------------------------------------------------------------------------>

export async function getAllProduct(req, res) {
  try {
    const { search = "", maxPrice, minPrice } = req.query;
    let products = [];

    const maximumPrice = parseInt(maxPrice);
    const minimumPrice = parseInt(minPrice);

    if (!isNaN(maximumPrice) && !isNaN(minimumPrice)) {
      products = await Product.find({
        altNames: { $regex: search, $options: "i" },
        price: { $gte: minimumPrice, $lte: maximumPrice },
      });
    } else {
      products = await Product.find({
        altNames: { $regex: search, $options: "i" },
      });
    }

    if (products.length === 0) {
      return res.status(404).json({
        message: "No product found",
      });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
}
