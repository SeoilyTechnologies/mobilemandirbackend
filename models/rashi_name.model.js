const mongoose = require('mongoose');

const rashiMasterSchema = new mongoose.Schema(
  {
    name_hi: {
      type: String, // जैसे "मेष"
      required: true,
      trim: true,
    },
    name_en: {
      type: String, // जैसे "Aries"
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String, // image URL ya path
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rashi", rashiMasterSchema);
