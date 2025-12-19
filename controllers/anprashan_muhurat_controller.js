const AnprashanMuhurat = require("../models/anprashan_muhurat_schema");

// ==============================
// ADD MULTIPLE ANPRASHAN MUHURATS (ARRAY)
// ==============================
const addAnprashanMuhurat = async (req, res) => {
  try {
    const muhurats = req.body.anprashan;

    if (!Array.isArray(muhurats)) {
      return res.status(400).json({
        success: false,
        message: "Input must be an array of muhurat objects",
      });
    }

    const insertedData = await AnprashanMuhurat.insertMany(muhurats);

    res.status(201).json({
      success: true,
      message: "Anprashan Muhurats added successfully",
      data: insertedData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add muhurats",
      error: error.message,
    });
  }
};

// ==============================
// GET ALL MUHURATS
// ==============================
const getAllAnprashanMuhurat = async (req, res) => {
  try {
    const data = await AnprashanMuhurat.find().sort({ date: 1 }).limit(2);

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch muhurats",
      error: error.message,
    });
  }
};

// ==============================
// GET MUHURAT BY DATE
// ==============================
const getAnprashanMuhuratByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const data = await AnprashanMuhurat.findOne({ date });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No muhurat found for this date",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch muhurat",
      error: error.message,
    });
  }
};

module.exports = {
  addAnprashanMuhurat,
  getAllAnprashanMuhurat,
  getAnprashanMuhuratByDate,
};
