// controllers/aartiChalisaController.js

const MantraChalisa = require("../models/aatriaa_chalisa_manta");
const God = require("../models/god_schema");
const Wishlist = require("../models/wishlist_schema"); 

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ✅ Upload all Aarti/Chalisa/Mantra data
// POST /api/aarti/upload-chalisa-aarti
exports.uploadChalisaAarti = async (req, res) => {
  try {
    const inputData = req.body.data;

    if (!Array.isArray(inputData) || inputData.length === 0) {
      return res.status(400).json({ message: "Please provide data array" });
    }

    const finalData = [];

    for (const item of inputData) {
      let godId = null; // default: bina god ke

      // related_god array se pehla god name lo (agar ho)
      const godName = item.related_god?.[0];

      if (godName) {
        // DB me search karo godSchema me
        const godDoc = await God.findOne({
          god_name: { $regex: new RegExp(godName, "i") }, // case-insensitive
        });

        if (!godDoc) {
          console.log(
            `⚠️ God not found for "${item.title}" — saving with god=null`
          );
        } else {
          godId = godDoc._id;
        }
      } else {
        console.log(
          `ℹ️ "${item.title}" has no related_god — saving with god=null`
        );
      }

      // NOTE: schema me title hai, isliye yahan title bhi save kar rahe hain
      finalData.push({
        god: godId, // null bhi ho sakta hai
        audioAsset: item.audioAsset,
        lyricsKey: item.lyricsKey,
        title: item.title,
        type: item.type,
      });
    }

    if (finalData.length === 0) {
      return res.status(400).json({ message: "No valid data to insert" });
    }

    const inserted = await MantraChalisa.insertMany(finalData);

    return res.status(201).json({
      message: "Chalisa/Aarti/Mantra data uploaded successfully.",
      total: inserted.length,
      data: inserted,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get all with god info
// GET /api/aarti/all-chalisa-manta
exports.getAllChalisaMantra = async (req, res) => {
  try {
    const allData = await MantraChalisa.find().populate("god");
    return res.status(200).json(allData);
  } catch (err) {
    console.error("getAllChalisaMantra error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Filter by type (aarti/chalisa/mantra/baan/katha)
// POST /api/aarti/all-filter-chalisa-manta
exports.getFilteredChalisaMantra = async (req, res) => {
    const userId = req.user?.id || req.query.userId;
  try {
    const { type } = req.body;

    const allowedTypes = ["aarti", "chalisa", "mantra", "baan", "katha"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type provided." });
    }

    const allData = await MantraChalisa.find({ type }).populate("god");

     // 2️⃣ wishlist me item exist check
        const wishlistItems = await Wishlist.find({
          user: userId,
          itemModel: "aartichalisadata",
          item: { $in: allData.map(q => q._id) }
        }).select("item");
    
const wishlistIds = new Set(wishlistItems.map(w => String(w.item)));

  const updateChalisaAartiData = allData.map(q => ({
      ...q.toObject(),
      isAddedInWishlist: wishlistIds.has(String(q._id))
    }));

    return res.status(200).json({
      success: true,
      count: updateChalisaAartiData.length,
      data: updateChalisaAartiData,
    });
  } catch (err) {
    console.error("getFilteredChalisaMantra error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Explore detail by godId + type
// POST /api/aarti/explore-detail
exports.getExploreDetail = async (req, res) => {
  try {
    const { godId, type } = req.body;

    if (!godId) {
      return res.status(400).json({
        success: false,
        message: "godId is required.",
        data: null,
      });
    }

    const allowedTypes = ["aarti", "chalisa", "mantra", "baan"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type provided.",
        data: null,
      });
    }

    // items fetch karo
    const items = await MantraChalisa.find({ god: godId, type });

    // ek baar god detail
    const godDetails = await God.findById(godId);

    const cleanedList = items.map((item) => ({
      _id: item._id,
      audioAsset: item.audioAsset,
      lyricsKey: item.lyricsKey,
      title: item.title,
      type: item.type,
    }));

    return res.status(200).json({
      success: true,
      message: "Filter data fetched successfully.",
      data: {
        god: godDetails,
        type,
        count: cleanedList.length,
        list: cleanedList,
      },
    });
  } catch (error) {
    console.error("getExploreDetail error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// ✅ Day-wise aarti/chalisa/mantra/baan – type nahi bhejna
// POST /api/aarti/day-wise-chalisa-aarti
exports.getDayWiseChalisaAarti = async (req, res) => {
  try {
    let { day } = req.body;
    const userId = req.user?.id || req.query.userId;

    // 1) agar day nahi bheja to aaj ka day (server time)
    if (!day) {
      const todayIndex = new Date().getDay(); // 0–6
      day = WEEK_DAYS[todayIndex]; // e.g. "Tuesday"
    }

    day = day.trim();

    // 2) day se related saare gods
    const gods = await God.find({
      related_days: {
        $elemMatch: {
          $regex: new RegExp(day, "i"),
        },
      },
    });

    if (!gods || gods.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No gods found for day: ${day}`,
        data: {
          day,
          count: 0,
          list: [],
        },
      });
    }

    const godIds = gods.map((g) => g._id);

    // 3) in gods ke liye saare MantraChalisa records (type filter nahi)
    const items = await MantraChalisa.find({
      god: { $in: godIds },
    }).populate("god");

    // 4) clean response
    const list = items.map((item) => ({
      _id: item._id,
      type: item.type,
      audioAsset: item.audioAsset,
      lyricsKey: item.lyricsKey,
      title: item.title,
      god: {
        _id: item.god?._id,
        god_name: item.god?.god_name,
        thumbnail: item.god?.thumbnail,
        related_month: item.god?.related_month,
        related_days: item.god?.related_days,
        detail_hi: item.god?.detail_hi,
        detail_en: item.god?.detail_en,
        godimage: item.god?.godimage,
      },
    }));
   const wishlistItems = await Wishlist.find({
          user: userId,
          itemModel: "aartichalisadata",
          item: { $in: list.map(q => q._id) }
        }).select("item");

const wishlistIds = new Set(wishlistItems.map(w => String(w.item)));
console.log(wishlistIds)  ;

const updateChalisaAartiData = list.map(q => ({
      ...q,
      isAddedInWishlist: wishlistIds.has(String(q._id))
    }));

    return res.status(200).json({
      success: true,
      message: "Day-wise data fetched successfully.",
      data: {
        day,
        count: updateChalisaAartiData.length,
       list: updateChalisaAartiData,
      },
    });
  } catch (error) {
    console.error("Day-wise chalisa/aarti error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};


exports.updateChalisaAartiById = async (req, res) => {
  try {
    const {
        id,
      godId,        // optional: अगर god change करना हो
      audioAsset,
      lyricsKey,
      title,
      type,
    } = req.body;

    // allowed types (agar type bheja ho to validate)
    const allowedTypes = ["aarti", "chalisa", "mantra", "baan", "katha"];

    const updateData = {};
if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required!",
      });
    }
    if (audioAsset !== undefined) updateData.audioAsset = audioAsset;
    if (lyricsKey !== undefined) updateData.lyricsKey = lyricsKey;
    if (title !== undefined) updateData.title = title;

    if (type !== undefined) {
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid type provided.",
        });
      }
      updateData.type = type;
    }

    // ✅ अगर godId bheja hai to verify karo
    if (godId !== undefined) {
      if (godId === null || godId === "") {
        // explicitly null / empty bheja to god remove kar do
        updateData.god = null;
      } else {
        const godDoc = await God.findById(godId);
        if (!godDoc) {
          return res.status(400).json({
            success: false,
            message: "Invalid godId provided.",
          });
        }
        updateData.god = godDoc._id;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update.",
      });
    }

    const updated = await MantraChalisa.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("god");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chalisa/Aarti/Mantra updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("updateChalisaAartiById error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

