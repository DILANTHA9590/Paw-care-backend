import { disconnect } from "mongoose";
import Product from "../modules/product.js";
import { isAdmin } from "../utils.js/adminAndCustomerValidation.js";
import { checkRequredField } from "../utils.js/checkRequiredField.js";

// create product ---------------------------------------------------------->

export async function createProduct(req, res) {
  try {
    // if (!isAdmin(req)) {
    //   return res.status(200).json({
    //     message: "Access denied, Please loging to admin account",
    //   });
    // }

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

    const maximumPrice = parseInt(maxPrice);
    const minimumPrice = parseInt(minPrice);

    // 🎯 Build the dynamic query
    const query = {
      $and: [
        {
          $or: [
            { altNames: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } },
            { productName: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };

    if (!isNaN(minimumPrice) && !isNaN(maximumPrice)) {
      query.$and.push({ price: { $gte: minimumPrice, $lte: maximumPrice } });
    }

    console.log("Final Query:", query);

    const products = await Product.find(query);

    if (products.length === 0) {
      return res
        .status(200)
        .json({ message: "No product found", products: [] });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
}

export async function getAllProductByAdmin(req, res) {
  console.log("inside this");
  try {
    const { searchQuery = "", page = 1, limit = 10 } = req.query;
    console.log("search query", searchQuery);

    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let filter = {
      $or: [
        { productId: { $regex: searchQuery } },
        { altNames: { $regex: searchQuery, $options: "i" } },
      ],
    };

    // Fetch paginated products
    const products = await Product.find(filter).skip(skip).limit(limitNumber);

    const totalCount = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNumber);

    if (products.length === 0) {
      return res.status(404).json({
        message: "No product found",
        products: [],
        currentPage: pageNumber,
        totalPages,
        totalCount,
      });
    }

    res.status(200).json({
      products,
      currentPage: pageNumber,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

// export async function getAlslProductByAdmin(req, res) {
//   console.log("inside this");
//   try {
//     const { searchQuery = "", price } = req.query;

//     let filter = {};

//     // Add search query filter if provided
//     if (searchQuery.trim() !== "") {
//       filter.$or = [
//         { productId: { $regex: searchQuery, $options: "i" } },
//         { altNames: { $regex: searchQuery, $options: "i" } },
//       ];
//     }

//     // Add price filter if provided
//     if (price) {
//       filter.price = price;
//     }

//     console.log("filter =>", filter);

//     const products = await Product.find(filter);

//     if (products.length === 0) {
//       return res.status(404).json({
//         message: "No product found",
//         products: [],
//       });
//     }

//     res.status(200).json({ products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// }
export async function getProductDetails(req, res) {
  try {
    const { productId } = req.params;

    // Check if productId is provided
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // Find the product by productId
    const productData = await Product.findOne({ productId });

    // If product not found, send 404 Not Found
    if (!productData) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // If found, send product data with 200 status
    return res.status(200).json({ productData });
  } catch (error) {
    console.error("Error in getProductDetails:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getProductForCart(req, res) {
  try {
    console.log("run this");
    const id = req.params.productId;

    console.log(id);
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const productData = await Product.findOne({ productId: id });

    if (!productData) {
      res.status(200).json({
        productData: null,
      });
    }

    res.status(200).json({
      productData,
    });
  } catch (error) {
    console.error("Error in getProductDetails:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// calculate product  total prices and discounts---------------------------------->

export async function getQuote(req, res) {
  try {
    const orderedItems = req.body.orderedItems; // get ordered item arrey inside body

    let total = 0;
    let discount = 0;

    for (const item of orderedItems) {
      const id = item.productId;

      // get product data using product id-------->
      const productData = await Product.findOne({ productId: id });

      if (!productData) {
        //check null
        continue;
      }

      const lastPrice = parseInt(productData.lastPrice);

      // calculate discount price
      if (productData.price > productData.lastPrice) {
        const price = parseInt(productData.price);

        discount = discount + (price - lastPrice) * item.qty;
      }

      //calculate total prce

      total = total + lastPrice * item.qty;
    }

    console.log("total", total);
    console.log("discount", discount);

    const paymentDetails = {
      total: total,
      discount: discount,
    };

    res.status(200).json({
      paymentDetails,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Internal Server Error",
    });
  }
}
