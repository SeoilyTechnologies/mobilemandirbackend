const mongoose = require('mongoose');
const { Schema } = mongoose;

const horoscopeRashiSchema = new Schema({
  rashi: {
    type: Schema.Types.ObjectId,
    ref: "Rashi",         // 👉 Rashi master ka reference
    required: true,
  },
  rashi_data: {
    type: String,
    required: true,
  },
  lucky_number: {
    type: String,
    required: true,
  },
});

const horoscopeSchema = new Schema(
  {
    date: {
      type: String, // "07-12-2026" (dd-mm-yyyy)
      required: true,
      unique: true,
    },
    rashis: [horoscopeRashiSchema], // 👉 array of rashi-wise predictions
  },
  { timestamps: true }
);

module.exports = mongoose.model("Horoscope", horoscopeSchema);
