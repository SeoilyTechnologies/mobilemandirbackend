const Amavasya = require("../models/amavasya_schema");

// ➤ Add Amavasya data (single or array)
const addAmavasya = async (req, res) => {
  try {
    const data = req.body.amavasya;

    if (Array.isArray(data)) {
      const inserted = await Amavasya.insertMany(data);
      return res.status(201).json({ message: "Amavasya data added", data: inserted });
    }

    const newAmavasya = new Amavasya(data);
    const saved = await newAmavasya.save();

    res.status(201).json({ message: "Amavasya added", data: saved });

  } catch (err) {
    res.status(500).json({ message: "Failed to add data", error: err.message });
  }
};

// ➤ Get all Amavasya data
const getAmavasya = async (req, res) => {
  try {
    const data = await Amavasya.find();
    res.status(200).json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

// ➤ Get Amavasya by date
const getAmavasyaByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const data = await Amavasya.findOne({ date });

    if (!data) {
      return res.status(404).json({ message: "No Amavasya found for this date" });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

module.exports = {
  addAmavasya,
  getAmavasya,
  getAmavasyaByDate,
};
