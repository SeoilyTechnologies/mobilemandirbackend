const mongoose = require("mongoose");

const GrihaPraveshSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },

    date: {
      type: String,
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
      type: String,
      required: true,
    },

    muhurat_end: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GrihaPravesh", GrihaPraveshSchema);
