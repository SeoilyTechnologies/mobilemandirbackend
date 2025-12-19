const mongoose = require("mongoose");

const TirthSchema = new mongoose.Schema(
  {
    s_no: {
      type: Number,
      required: true,
      unique: true,
    },

    name_english: {
      type: String,
      required: true,
      trim: true,
    },

    name_hindi: {
      type: String,
      required: true,
      trim: true,
    },

    about_english: {
      type: String,
      default: "",
    },

    about_hindi: {
      type: String,
      default: "",
    },

    history_english: {
      type: String,
      default: "",
    },

    history_hindi: {
      type: String,
      default: "",
    },

    exact_location_english: {
      type: String,
      default: "",
    },

    exact_location_hi: {
      type: String,
      default: "",
    },

    significance_english: {
      type: String,
      default: "",
    },

    significance_hindi: {
      type: String,
      default: "",
    },

    how_to_reach_en: {
      type: String,
      default: "",
    },

    how_to_reach_hi: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tirthdata", TirthSchema);
