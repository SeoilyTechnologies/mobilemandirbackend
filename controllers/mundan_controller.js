const Mundan = require("../models/mundan_schema");

// ➤ Add Mundan Muhurat (single or array)
const addMundan = async (req, res) => {
  try {
    const data = req.body.mundan;

    if (Array.isArray(data)) {
      const inserted = await Mundan.insertMany(data);
      return res.status(201).json({ message: "Mundan data added", data: inserted });
    }

    const newMundan = new Mundan(data);
    const saved = await newMundan.save();

    res.status(201).json({ message: "Mundan added", data: saved });

  } catch (err) {
    res.status(500).json({ message: "Failed to add data", error: err.message });
  }
};

// ➤ Get all Mundan Muhurats
const getAllMundan = async (req, res) => {
  try {
    const data = await Mundan.find().sort({ date: 1 });
    res.status(200).json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

// ➤ Get Mundan Muhurat by date
const getMundanByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const data = await Mundan.findOne({ date });

    if (!data) {
      return res.status(404).json({ message: "No Mundan Muhurat found for this date" });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

module.exports = {
  addMundan,
  getAllMundan,
  getMundanByDate,
};
