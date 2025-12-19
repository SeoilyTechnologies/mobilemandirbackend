const mongoose = require("mongoose");


const FestivalSchema = new mongoose.Schema({
  date: {
    type: String,    // e.g., "01-03-2025"
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
  },
  
  // Optional: timestamps for record keeping
}, { timestamps: true });

module.exports = mongoose.model("Festival", FestivalSchema);
