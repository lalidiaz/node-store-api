const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name must be provided."],
  },
  price: { type: Number, required: [true, "Product price must be provided."] },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  brand: {
    type: String,
    enum: {
      values: ["CeraVe", "Avène", "Rituals", "Biossance", "Olay"],
      message: "{VALUE} is not supported.",
    },
  },
});

module.exports = mongoose.model("Product", productSchema);
