const Ekadashi = require("../models/ekadashi_schema");

// ➤ Add Ekadashi data (single or array)
const addEkadashi = async (req, res) => {
  try {
    const data = req.body.ekadashi;

    if (Array.isArray(data)) {
      const inserted = await Ekadashi.insertMany(data);
      return res.status(201).json({ message: "Ekadashi data added", data: inserted });
    }

    const newEkadashi = new Ekadashi(data);
    const saved = await newEkadashi.save();

    res.status(201).json({ message: "Ekadashi added", data: saved });

  } catch (err) {
    res.status(500).json({ message: "Failed to add data", error: err.message });
  }
};

// ➤ Get all Ekadashi data
const getEkadashi = async (req, res) => {
  try {
    const data = await Ekadashi.find();
    res.status(200).json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

// ➤ Get Ekadashi by date
const getEkadashiByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const data = await Ekadashi.findOne({ date });

    if (!data) {
      return res.status(404).json({ message: "No Ekadashi found for this date" });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err.message });
  }
};

module.exports = {
  addEkadashi,
  getEkadashi,
  getEkadashiByDate,
};
