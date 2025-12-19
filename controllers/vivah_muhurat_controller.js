const VivahMuhurat = require("../models/vivah_muhurat_schema");

// ➤ Add Vivah Muhurat (single or multiple)
const addVivahMuhurat = async (req, res) => {
  try {
    const body = req.body.vivah;

    // If array → insertMany
    if (Array.isArray(body)) {
      const inserted = await VivahMuhurat.insertMany(body);
      return res.status(201).json({ message: "Vivah Muhurat added", data: inserted });
    }

    // Single Insert
    const newEntry = new VivahMuhurat(body);
    const saved = await newEntry.save();

    res.status(201).json({ message: "Vivah Muhurat added", data: saved });

  } catch (err) {
    res.status(500).json({ message: "Failed to add", error: err.message });
  }
};

// ➤ Get all Vivah Muhurat
const getVivahMuhurat = async (req, res) => {
  try {
    const data = await VivahMuhurat.find().sort({ date: 1 });
    res.status(200).json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch", error: err.message });
  }
};

// ➤ Get Vivah Muhurat by date
const getVivahMuhuratByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const data = await VivahMuhurat.findOne({ date });

    if (!data) {
      return res.status(404).json({ message: "No Vivah Muhurat found for this date" });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};

module.exports = {
  addVivahMuhurat,
  getVivahMuhurat,
  getVivahMuhuratByDate,
};
