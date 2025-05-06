import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  image: {
    type: String,
    default:
      "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-512.png", // Default pet image
  },
  userId: {
    type: String,
    // reference to User collection
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String, // e.g., Dog, Cat, Rabbit
    required: true,
  },
  breed: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String, // e.g., Male or Female
    default: "male",
  },
  weight: {
    type: Number, // in KG
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Pet = mongoose.model("Pet", petSchema);

export default Pet;
