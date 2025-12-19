const mongoose = require("mongoose");

const GrahGocharSchema = new mongoose.Schema(
  {
    dat: {
      type: String,
      required: true,
    },

    festival_name_hi: {
      type: String,
      required: true,
    },

    festival_name_en: {
      type: String,
      required: true,
    },

    about_en: {
      type: String,
      required: true,
    },

    about_hi: {
      type: String,
      required: true,
    },

    related_god_en: {
      type: String,
      required: true,
    },

    related_god_hi: {
      type: String,
      required: true,
    },

    puja_vidhi_en: {
      type: String,
      required: true,
    },

    puja_vidhi_hi: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GrahGochar", GrahGocharSchema);
