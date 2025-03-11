const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const saleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],
    discountRate: {
      type: Number, // % giảm giá
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sale", saleSchema);
