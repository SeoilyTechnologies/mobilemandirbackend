const Upanayan = require("../models/upanayan_schema");

// ➤ Add Upanayan Muhurat (single or array)
const addUpanayan = async (req, res) => {
  try {
    const data = req.body.upanayan;

    if (Array.isArray(data)) {
      const inserted = await Upanayan.insertMany(data);
      return res.status(201).json({ message: "Upanayan Muhurats added", data: inserted });
    }

    const newUpanayan = new Upanayan(data);
    const saved = await newUpanayan.save();

    res.status(201).json({ message: "Upanayan Muhurat added", data: saved });

  } catch (err) {
    res.status(500).json({ message: "Failed to add data", error: err.message });
  }
};

// ➤ Get all Upanayan Muhurats
const getAllUpanayan = async (req, res) => {
  try {
    const data = await Upanayan.find().sort({ date: 1 });
    res.status(200).json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

// ➤ Get Upanayan Muhurat by date
const getUpanayanByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const data = await Upanayan.findOne({ date });

    if (!data) {
      return res.status(404).json({ message: "No Upanayan Muhurat found for this date" });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

module.exports = {
  addUpanayan,
  getAllUpanayan,
  getUpanayanByDate,
};
