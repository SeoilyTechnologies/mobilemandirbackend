const mongoose = require('mongoose');

const godSchema = new mongoose.Schema({
    god_name: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnail: {
        type: String,
        default: ''
    },
    related_month: {
        type: [String],
        default: [],
    },
    related_days: {
        type: [String],
        default: [],
    },
    detail_hi: {
        type: String,
        default: ''
    },
    detail_en: {
        type: String,
        default: ''
    },
    godimage: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model("goddata", godSchema);
