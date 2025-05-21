import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },

  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    // ex: "Royal Canin", "Pedigree"
  },

  petType: {
    type: String,
    required: true,
  },

  altNames: {
    type: String,
  },

  description: {
    type: String,
  },

  price: {
    type: String,
    required: true,
  },

  lastPrice: {
    type: String,
    required: true,
  },

  image: [
    {
      type: String,
      required: true,
    },
  ],

  quantityInStock: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
