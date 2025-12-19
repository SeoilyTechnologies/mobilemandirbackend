const Grahan = require("../models/grahan_schema");

// ➤ Add Surya/Chandra Grahan (single or array)
const addGrahan = async (req, res) => {
  try {
    const body = req.body.grahan;

    if (Array.isArray(body)) {
      const inserted = await Grahan.insertMany(body);
      return res.status(201).json({ message: "Grahan data added", data: inserted });
    }

    const newGrahan = new Grahan(body);
    const saved = await newGrahan.save();

    res.status(201).json({ message: "Grahan added", data: saved });

  } catch (err) {
    res.status(500).json({ message: "Failed to add grahan", error: err.message });
  }
};

// ➤ Get all grahan data
const getAllGrahan = async (req, res) => {
  try {
    const data = await Grahan.find().sort({ date: 1 });
    res.status(200).json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch", error: err.message });
  }
};

// ➤ Get grahan by date
const getGrahanByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const data = await Grahan.findOne({ date });

    if (!data) {
      return res.status(404).json({ message: "No grahan found for this date" });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};

module.exports = {
  addGrahan,
  getAllGrahan,
  getGrahanByDate,
};
