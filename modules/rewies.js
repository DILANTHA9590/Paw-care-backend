import mongoose from "mongoose";

  // accept: {
  //   type: Boolean,const RewiesSchema = new mongoose.Schema({

  //   required: true,

  // },

  doctorId: {
    type: String,
    required: true,
  },

  customerId: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },

  reviewDate: {
    type: Date,
    default: Date.now,
  },
});

const Rewies = mongoose.model("Rewies", RewiesSchema);

export default Rewies;
