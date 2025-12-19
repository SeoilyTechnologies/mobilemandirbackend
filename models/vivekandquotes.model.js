const mongoose = require("mongoose");

const VivekanandQuoteSchema = new mongoose.Schema({
  quotes_hindi: {
    type: String,
    required: true,
    trim: true
  },
  quotes_english: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: "vivekandquotes" // Explicitly naming the collection
});

module.exports = mongoose.model("VivekanandQuote", VivekanandQuoteSchema);
