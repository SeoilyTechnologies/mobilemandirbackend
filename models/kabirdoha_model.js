const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  count: {
    type: Number,
    default: 0
  }
});

const KabirDohaSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true
  },
  unique_slug: {
    type: String,
    required: true,
    trim: true
  },
  couplet_hindi: {
    type: String,
    required: true,
    trim: true
  },
  couplet_english: {
    type: String,
    required: true,
    trim: true
  },
  translation_hindi: {
    type: String,
    trim: true
  },
  translation_english: {
    type: String,
    trim: true
  },
  explanation_hindi: {
    type: String,
    trim: true
  },
  explanation_english: {
    type: String,
    trim: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [TagSchema],  // array of objects
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: "kabirdohadata"
});

module.exports = mongoose.model("kabirdohadata", KabirDohaSchema);
