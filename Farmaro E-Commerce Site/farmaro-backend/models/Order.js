const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: Array,
    total: Number,
    status: {
      type: String,
      default: "Placed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);