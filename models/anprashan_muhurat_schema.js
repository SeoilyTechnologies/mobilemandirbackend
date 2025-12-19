const mongoose = require("mongoose");

const AnprashanMuhuratSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },

    date: {
      type: String,   // You are storing "2026-01-01" → keep as string
      required: true,
    },

    day_en: {
      type: String,
      required: true,
    },

    day_hi: {
      type: String,
      required: true,
    },

    muhurat_start: {
      type: String,   // "7:45"
      required: true,
    },

    muhurat_end: {
      type: String,   // "2026-01-01 10:23"
      required: true,
    },

    duration: {
      type: String,   // "2:38:00"
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnprashanMuhurat", AnprashanMuhuratSchema);
