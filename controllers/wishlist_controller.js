const Wishlist = require("../models/wishlist_schema");

// 🔁 Add / Remove (Toggle Wishlist)
exports.toggleWishlist = async (req, res) => {
  try {
    // ⚠️ Assume user id aa raha hai auth middleware se (JWT वगैरह)
    // अगर नहीं है तो body se le rahe (fallback)
    const userId = req.user?.id || req.body.user;
    const { itemModel, itemId } = req.body;

    if (!userId || !itemModel || !itemId) {
      return res.status(400).json({
        success: false,
        message: "user, itemModel and itemId are required",
      });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      user: userId,
      itemModel,
      item: itemId,
    });

    // If exists → remove
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        success: true,
        action: "removed",
        message: "Item removed from wishlist",
      });
    }

    // Else → add
    const created = await Wishlist.create({
      user: userId,
      itemModel,
      item: itemId,
    });

    return res.status(201).json({
      success: true,
      action: "added",
      message: "Item added to wishlist",
      data: created,
    });
  } catch (error) {
    console.error("toggleWishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// 📥 Get Wishlist for a User
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId || req.query.user;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const items = await Wishlist.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("item"); // only populate item first

    // 🔥 Now nested populate ONLY where itemModel = aartichalisadata
    const promises = items.map(async (w) => {
      if (w.itemModel === "aartichalisadata") {
        await w.populate({
          path: "item.god",
          model: "goddata"
        });
      }
      return w;
    });

    const populatedItems = await Promise.all(promises);

    return res.status(200).json({
      success: true,
      count: populatedItems.length,
      data: populatedItems,
    });
  } catch (error) {
    console.error("Wishlist populate error =>", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
