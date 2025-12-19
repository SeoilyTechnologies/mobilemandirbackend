const KabirDoha = require("../models/kabirdoha_model");
const Wishlist = require("../models/wishlist_schema"); 

// ➤ Add Many Doha (POST)
exports.addManyDoha = async (req, res) => {
  try {
    const dohas = req.body.kabir_doha; // expecting array of objects

    if (!Array.isArray(dohas) || dohas.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please send an array of doha objects"
      });
    }

    for (let d of dohas) {
      if (!d.couplet_hindi || !d.couplet_english) {
        return res.status(400).json({
          success: false,
          message: "doha_english & doha_hindi both required for each entry"
        });
      }
    }

    const result = await KabirDoha.insertMany(dohas);

    res.status(201).json({
      success: true,
      message: "Kabir Doha added successfully",
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


// ➤ Get All Doha (GET)
exports.getAllDoha = async (req, res) => {
  try {
        const userId = req.user?.id || req.query.userId;

    const data = await KabirDoha.find().sort({ createdAt: -1 });

    // 2️⃣ wishlist me item exist check
            const wishlistItems = await Wishlist.find({
              user: userId,
              itemModel: "kabirdohadata",
              item: { $in: data.map(q => q._id) }
            }).select("item");
        const wishlistIds = new Set(wishlistItems.map(w => String(w.item)));


  const updatekabirDohaData = data.map(q => ({
      ...q.toObject(),
      isAddedInWishlist: wishlistIds.has(String(q._id))
    }));
    res.status(200).json({
      success: true,
      count: updatekabirDohaData.length,
    data:  updatekabirDohaData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
