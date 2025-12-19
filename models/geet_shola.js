const mongoose = require("mongoose");

const SlokaSchema = new mongoose.Schema({
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedBy: {
    type: String,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  script: {
    type: String,
  },
  kanda: {
    type: Number,
    required: true,
  },
  sarga: {
    type: Number,
    required: true,
  },
  sloka: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  meaning: {
    type: String,
  },
  translation: {
    type: String,
  },
  source: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("geetasloka", SlokaSchema);
