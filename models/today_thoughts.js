const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  quotes_en: {
    type: String,
    required: true,
    trim: true
  },
  quotes_hi: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("thoughtquote", QuoteSchema);
