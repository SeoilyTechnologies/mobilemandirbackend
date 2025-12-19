const mongoose = require('mongoose');

const mantraSchema = new mongoose.Schema({
 god: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "goddata", 
    required: false, 
     default: null,
  },
  audioAsset: {
    type: String,
    required: true,
  },
  lyricsKey: {
    type: String,
    required: true,
  },
   title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["aarti", "chalisa", "mantra", "baan"],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("aartichalisadata", mantraSchema);
