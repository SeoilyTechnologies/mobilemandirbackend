const GrihaPravesh = require("../models/grihpravesh_schema");

// ➤ Add Griha Pravesh Muhurat (single or array)
const addGrihaPravesh = async (req, res) => {
  try {
    const data = req.body.grihpravesh;

    if (Array.isArray(data)) {
      const inserted = await GrihaPravesh.insertMany(data);
      return res.status(201).json({ message: "Griha Pravesh data added", data: inserted });
    }

    const newGrihaPravesh = new GrihaPravesh(data);
    const saved = await newGrihaPravesh.save();

    res.status(201).json({ message: "Griha Pravesh added", data: saved });

  } catch (err) {
    res.status(500).json({ message: "Failed to add data", error: err.message });
  }
};

// ➤ Get all Griha Pravesh data
const getAllGrihaPravesh = async (req, res) => {
  try {
    const data = await GrihaPravesh.find().sort({ date: 1 });
    res.status(200).json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

// ➤ Get Griha Pravesh by date
const getGrihaPraveshByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const data = await GrihaPravesh.findOne({ date });

    if (!data) {
      return res.status(404).json({ message: "No Griha Pravesh Muhurat found for this date" });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

module.exports = {
  addGrihaPravesh,
  getAllGrihaPravesh,
  getGrihaPraveshByDate,
};
