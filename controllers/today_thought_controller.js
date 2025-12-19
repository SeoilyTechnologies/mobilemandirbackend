const Quote = require("../models/today_thoughts");
const Wishlist = require("../models/wishlist_schema"); // 👈 yahan sahi path lagao

// ➤ Add Multiple Quotes (POST - insertMany)
exports.addQuotes = async (req, res) => {
  try {
    const quotesArray = req.body.todayThots;  // Expecting an array of objects

    if (!Array.isArray(quotesArray) || quotesArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please send an array of quotes"
      });
    }

    // Validate each object
    for (let q of quotesArray) {
      if (!q.quotes_en || !q.quotes_hi) {
        return res.status(400).json({
          success: false,
          message: "Each quote must have quotes_en and quotes_hi"
        });
      }
    }

    const inserted = await Quote.insertMany(quotesArray);

    res.status(200).json({
      success: true,
      message: "Quotes inserted successfully",
      data: inserted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ➤ Get All Quotes (GET)
exports.getQuotes = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // 1️⃣ fetch thought quotes
    const quotes = await Quote.find().sort({ createdAt: -1 });

    // 2️⃣ wishlist me item exist check
    const wishlistItems = await Wishlist.find({
      user: userId,
      itemModel: "thoughtquote",
      item: { $in: quotes.map(q => q._id) }
    }).select("item");

    const wishlistIds = new Set(wishlistItems.map(w => String(w.item)));

    // 3️⃣ quotes + wishlist status merge
    const updatedQuotes = quotes.map(q => ({
      ...q.toObject(),
      isAddedInWishlist: wishlistIds.has(String(q._id))
    }));

    return res.status(200).json({
      success: true,
      count: updatedQuotes.length,
      data: updatedQuotes,
    });

  } catch (error) {
    console.error("Error fetching thoughts", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
