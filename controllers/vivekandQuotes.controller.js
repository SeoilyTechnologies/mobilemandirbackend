const VivekanandQuote = require("../models/vivekandquotes.model");
const Wishlist = require("../models/wishlist_schema"); 

// ➤ Add Multiple Quotes (POST - insertMany)
exports.addManyQuotes = async (req, res) => {
  try {
    const quotes = req.body.vivekanadQuotes; // expecting array of quotes objects

    if (!Array.isArray(quotes) || quotes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please send an array of quotes"
      });
    }

    // Validate fields
    for (let q of quotes) {
      if (!q.quotes_hindi || !q.quotes_english) {
        return res.status(400).json({
          success: false,
          message: "quotes_hindi & quotes_english both required in each quote"
        });
      }
    }

    const result = await VivekanandQuote.insertMany(quotes);

    res.status(201).json({
      success: true,
      message: "Quotes inserted successfully",
      count: result.length,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};


// ➤ Get All Quotes (GET)
exports.getAllQuotes = async (req, res) => {
  try {
        const userId = req.user?.id || req.query.userId;

    const data = await VivekanandQuote.find().sort({ createdAt: -1 });

     // 2️⃣ wishlist me item exist check
        const wishlistItems = await Wishlist.find({
          user: userId,
          itemModel: "VivekanandQuote",
          item: { $in: data.map(q => q._id) }
        }).select("item");
    const wishlistIds = new Set(wishlistItems.map(w => String(w.item)));

  const updatedAllQuotesData = data.map(q => ({
      ...q.toObject(),
      isAddedInWishlist: wishlistIds.has(String(q._id))
    }));

    res.status(200).json({
      success: true,
      count: updatedAllQuotesData.length,
      updatedAllQuotesData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
