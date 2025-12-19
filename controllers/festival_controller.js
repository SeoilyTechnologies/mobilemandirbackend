const Festival = require("../models/festival_list_model");

// ADD MULTIPLE FESTIVALS
const addFestivals = async (req, res) => {
  try {
    const festivals = req.body.festivals;

    if (!Array.isArray(festivals)) {
      return res.status(400).json({
        success: false,
        message: "Input must be an array of festival objects",
      });
    }

    const insertedFestivals = await Festival.insertMany(festivals);

    res.status(201).json({
      success: true,
      message: "Festivals added successfully",
      data: insertedFestivals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add festivals",
      error: error.message,
    });
  }
};

// GET ALL FESTIVALS
const getFestivals = async (req, res) => {
  try {
    const festivals = await Festival.find().sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: festivals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch festivals",
      error: error.message,
    });
  }
};

// GET FESTIVAL BY DATE
const getFestivalByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const festival = await Festival.findOne({ date });

    if (!festival) {
      return res.status(404).json({
        success: false,
        message: "Festival not found for this date",
      });
    }

    res.status(200).json({
      success: true,
      data: festival,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch festival",
      error: error.message,
    });
  }
};

module.exports = {
  addFestivals,
  getFestivals,
  getFestivalByDate,
};
