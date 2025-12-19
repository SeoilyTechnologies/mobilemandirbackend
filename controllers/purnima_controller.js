const Poornima = require("../models/purnima_model");

// ➤ Add Poornima data (single or array)
const addPoornima = async (req, res) => {
  try {
    const data = req.body.purnimas;

    // If array → insertMany
    if (Array.isArray(data)) {
      const saved = await Poornima.insertMany(data);
      return res.status(201).json({ message: "Poornima data added", data: saved });
    }

    // If single object → save normally
    const newPoornima = new Poornima(data);
    const saved = await newPoornima.save();

    res.status(201).json({ message: "Poornima added", data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Get all Poornima data
const getPoornima = async (req, res) => {
  try {
    const data = await Poornima.find();
    res.status(200).json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Get Poornima by date
const getPoornimaByDate = async (req, res) => {
  try {
    const date = req.params.date;
    const data = await Poornima.findOne({ date });

    if (!data) {
      return res.status(404).json({ message: "No Poornima found for this date" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addPoornima,
  getPoornima,
  getPoornimaByDate
};
