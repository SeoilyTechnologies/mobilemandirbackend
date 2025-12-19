const GrahGochar = require("../models/grah_gochar_schema");

// ➤ Add Grah Gochar (single or array)
const addGrahGochar = async (req, res) => {
  try {
    const body = req.body.grahgocahr;

    // If array, insertMany
    if (Array.isArray(body)) {
      const inserted = await GrahGochar.insertMany(body);
      return res.status(201).json({
        message: "Grah Gochar data added successfully",
        data: inserted,
      });
    }

    // Single insert
    const newEntry = new GrahGochar(body);
    const saved = await newEntry.save();

    res.status(201).json({
      message: "Grah Gochar added successfully",
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add Grah Gochar", error: err.message });
  }
};

// ➤ Get all Grah Gochar data
const getGrahGochar = async (req, res) => {
  try {
    const data = await GrahGochar.find().sort({ dat: 1 });
    res.status(200).json({
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Grah Gochar data", error: err.message });
  }
};

// ➤ Get Grah Gochar by Date
const getGrahGocharByDate = async (req, res) => {
  try {
    const { dat } = req.params;

    const data = await GrahGochar.findOne({ dat });

    if (!data) {
      return res.status(404).json({ message: "No Grah Gochar found for this date" });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch Grah Gochar", error: err.message });
  }
};

module.exports = {
  addGrahGochar,
  getGrahGochar,
  getGrahGocharByDate,
};
