const Horoscope = require("../models/horoscope_model");
const Rashi = require("../models/rashi_name.model");

// Create / Update horoscope for a given date
// Body:
// {
//   "date": "07-12-2026",
//   "rashis": [
//     {
//       "rashi_id": "<Rashi _id>",
//       "rashi_data": "....",
//       "lucky_number": "7"
//     },
//     ...
//   ]
// }
exports.upsertHoroscope = async (req, res) => {
  try {
    const { date, rashis } = req.body;

    if (!date || !Array.isArray(rashis) || rashis.length === 0) {
      return res.status(400).json({
        success: false,
        message: "date और rashis[] दोनों जरूरी हैं",
      });
    }

    // Validate all rashi_id exist (optional but safe)
    const rashiIds = rashis.map((r) => r.rashi_id);
    const foundRashis = await Rashi.find({ _id: { $in: rashiIds } });

    if (foundRashis.length !== rashiIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more rashi_id are invalid",
      });
    }

    const rashisForSave = rashis.map((r) => ({
      rashi: r.rashi_id,
      rashi_data: r.rashi_data,
      lucky_number: r.lucky_number,
    }));

    const horoscope = await Horoscope.findOneAndUpdate(
      { date },
      { $set: { rashis: rashisForSave } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Horoscope saved successfully",
      data: horoscope,
    });
  } catch (error) {
    console.error("Error in upsertHoroscope:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all horoscopes (pagination optional)
exports.getAllHoroscopes = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    const [items, total] = await Promise.all([
      Horoscope.find()
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Horoscope.countDocuments(),
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
    console.error("Error in getAllHoroscopes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get horoscope for a specific date (flattened array response)
exports.getHoroscopeByDate = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date is required",
      });
    }

    const horoscope = await Horoscope.findOne({ date })
      .populate("rashis.rashi")
      .lean();

    if (!horoscope) {
      return res.status(404).json({
        success: false,
        message: "Horoscope not found for this date",
      });
    }

    const data = (horoscope.rashis || []).map((item) => ({
      rashi_id: item.rashi._id,
      rashi_name_en: item.rashi.name_en,
      rashi_name_hi: item.rashi.name_hi,
      thumbnail: item.rashi.thumbnail,
      rashi_data: item.rashi_data,
      lucky_number: item.lucky_number,
      _id: item._id,
    }));

    return res.status(200).json({
      success: true,
      date: horoscope.date,
      data,
    });
  } catch (error) {
    console.error("Error in getHoroscopeByDate:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Optionally: get single rashi for a date by rashi_id
exports.getHoroscopeByDateAndRashi = async (req, res) => {
  try {
    const { date, rashi_id } = req.body;

    if (!date || !rashi_id) {
      return res.status(400).json({
        success: false,
        message: "date और rashi_id दोनों जरूरी हैं",
      });
    }

    const horoscope = await Horoscope.findOne({ date })
      .populate("rashis.rashi")
      .lean();

    if (!horoscope) {
      return res.status(404).json({
        success: false,
        message: "Horoscope not found for this date",
      });
    }

    const item = (horoscope.rashis || []).find(
      (x) => String(x.rashi._id) === String(rashi_id)
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Rashi data not found for this date",
      });
    }

    return res.status(200).json({
      success: true,
      date: horoscope.date,
      data: {
        rashi_id: item.rashi._id,
        rashi_name_en: item.rashi.name_en,
        rashi_name_hi: item.rashi.name_hi,
        thumbnail: item.rashi.thumbnail,
        rashi_data: item.rashi_data,
        lucky_number: item.lucky_number,
        _id: item._id,
      },
    });
  } catch (error) {
    console.error("Error in getHoroscopeByDateAndRashi:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Get singal rashi with rashi id and date
exports.getSingleRashiForDate = async (req, res) => {
  try {
    const { date, rashi_id } = req.body;

    if (!date || !rashi_id) {
      return res.status(400).json({
        success: false,
        message: "date और rashi_id दोनों जरूरी हैं",
      });
    }

    const horoscope = await Horoscope.findOne({ date })
      .populate("rashis.rashi")
      .lean();

    if (!horoscope) {
      return res.status(404).json({
        success: false,
        message: "इस date के लिए Horoscope उपलब्ध नहीं है",
      });
    }

    const rashiData = horoscope.rashis.find(
      (item) => String(item.rashi?._id) === String(rashi_id)
    );

    if (!rashiData) {
      return res.status(404).json({
        success: false,
        message: "इस rashi का data इस date पर उपलब्ध नहीं है",
      });
    }

    return res.status(200).json({
      success: true,
      date,
      data: {
        rashi_id: rashiData.rashi._id,
        rashi_name_en: rashiData.rashi.name_en,
        rashi_name_hi: rashiData.rashi.name_hi,
        thumbnail: rashiData.rashi.thumbnail,
        rashi_data: rashiData.rashi_data,
        lucky_number: rashiData.lucky_number,
        _id: rashiData._id,
      }
    });

  } catch (error) {
    console.error("Error getSingleRashiForDate: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

