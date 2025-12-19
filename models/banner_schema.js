// models/banner_schema.js
const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    banner_image: {
      type: String,
      required: true,
    },

    // 👇 kis collection se related hai
    relatedModel: {
      type: String,
      required: true,
      enum: [
        "aartichalisadata",
        "Ekadashi",
        "goddata",
        "kabirdohadata",
        "VivekanandQuote",
      ],
    },

    // 👇 us collection ka _id
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "relatedModel", // 🔥 dynamic populate
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    priority: {
      type: Number,
      default: 0, // banner order
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);
