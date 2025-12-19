// controllers/rashi.controller.js
const Rashi = require("../models/rashi_name.model");

// Create new Rashi
exports.createRashi = async (req, res) => {
  try {
    const data = req.body;

    // If array -> bulk insert
    if (Array.isArray(data)) {
      // Validate each entry
      for (let rashi of data) {
        if (!rashi.name_hi || !rashi.name_en) {
          return res.status(400).json({
            success: false,
            message: "Each rashi must include name_hi and name_en",
          });
        }
      }

      const insertedRashis = await Rashi.insertMany(data, { ordered: false });

      return res.status(201).json({
        success: true,
        message: "Multiple Rashis created successfully",
        count: insertedRashis.length,
        data: insertedRashis
      });
    }

    // If single object -> single insert
    const { name_hi, name_en, thumbnail } = data;

    if (!name_hi || !name_en) {
      return res.status(400).json({
        success: false,
        message: "name_hi और name_en दोनों जरूरी हैं",
      });
    }

    const rashi = await Rashi.create({
      name_hi,
      name_en,
      thumbnail: thumbnail || "",
    });

    return res.status(201).json({
      success: true,
      message: "Rashi created successfully",
      data: rashi,
    });

  } catch (error) {
    console.error("Error in createRashi:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Get all Rashi (with optional pagination)
exports.getAllRashi = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 50;

    const [items, total] = await Promise.all([
      Rashi.find()
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Rashi.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      count: items.length,
      total,
      page,
      limit,
      data: items,
    });
  } catch (error) {
    console.error("Error in getAllRashi:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get single Rashi by ID
exports.getRashiById = async (req, res) => {
  try {
    const { id } = req.body;

    const rashi = await Rashi.findById(id);

    if (!rashi) {
      return res.status(404).json({
        success: false,
        message: "Rashi not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rashi,
    });
  } catch (error) {
    console.error("Error in getRashiById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Rashi
exports.updateRashi = async (req, res) => {
  try {
    const { id } = req.body;
    const { name_hi, name_en, thumbnail } = req.body;

    const rashi = await Rashi.findByIdAndUpdate(
      id,
      {
        ...(name_hi && { name_hi }),
        ...(name_en && { name_en }),
        ...(thumbnail !== undefined && { thumbnail }),
      },
      { new: true }
    );

    if (!rashi) {
      return res.status(404).json({
        success: false,
        message: "Rashi not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rashi updated successfully",
      data: rashi,
    });
  } catch (error) {
    console.error("Error in updateRashi:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Rashi
exports.deleteRashi = async (req, res) => {
  try {
    const { id } = req.params;

    const rashi = await Rashi.findByIdAndDelete(id);

    if (!rashi) {
      return res.status(404).json({
        success: false,
        message: "Rashi not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rashi deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteRashi:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
