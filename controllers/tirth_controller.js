const Tirth = require("../models/tirth_schema");

// 🔹 ADD TIRTH DATA (ARRAY)
exports.addTirthData = async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Data array is required",
      });
    }

    const inserted = await Tirth.insertMany(data);

    return res.status(201).json({
      success: true,
      message: "Tirth data added successfully",
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    console.error("addTirthData error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 🔹 GET ALL TIRTH DATA
exports.getAllTirthData = async (req, res) => {
  try {
    const list = await Tirth.find().sort({ s_no: 1 });

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error("getAllTirthData error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔹 GET TIRTH BY ID
exports.getTirthById = async (req, res) => {
  try {
    const { id } = req.params;

    const tirth = await Tirth.findById(id);
    if (!tirth) {
      return res.status(404).json({
        success: false,
        message: "Tirth not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: tirth,
    });
  } catch (error) {
    console.error("getTirthById error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

