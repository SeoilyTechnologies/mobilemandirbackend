const Sloka = require("../models/geet_shola");
const Wishlist = require("../models/wishlist_schema");
const mongoose = require('mongoose');
// GET /slokas  → fetch all shlokas
exports.getAllSlokas = async (req, res) => {
  try {
     const userId = req.user?.id || req.query.userId;
    // Default values
    const page = parseInt(req.body.page) || 1;      // which page
    const limit = parseInt(req.body.limit) || 100;   // items per page
    const skip = (page - 1) * limit;

    // Query DB with pagination
    const slokas = await Sloka.find()
      .sort({ kanda: 1, sarga: 1, sloka: 1 })
      .skip(skip)
      .limit(limit);

  // 2️⃣ wishlist me item exist check
        const wishlistItems = await Wishlist.find({
          user: userId,
          itemModel: "geetasloka",
          item: { $in: slokas.map(q => q._id) }
        }).select("item");
const wishlistIds = new Set(wishlistItems.map(w => String(w.item)));

  const updateChalisaAartiData = slokas.map(q => ({
      ...q.toObject(),
      isAddedInWishlist: wishlistIds.has(String(q._id))
    }));
    // Total documents
    const total = await Sloka.countDocuments();



    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: updateChalisaAartiData.length,
      data: updateChalisaAartiData,
    });
  } catch (error) {
    console.error("Error fetching slokas:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching slokas",
    });
  }
};








exports.insertManySlokas = async (req, res) => {
  try {
    const payload = req.body.sloka;     

    if (!Array.isArray(payload)) {
      return res.status(400).json({
        success: false,
        message: "Input must be an array of shlokas",
      });
    }

    const inserted = await Sloka.insertMany(payload);

    res.status(201).json({
      success: true,
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    console.error("Error inserting shlokas:", error);
    res.status(500).json({
      success: false,
      message: "Server error while inserting shlokas",
    });
  }
};