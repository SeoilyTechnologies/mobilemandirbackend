const express = require("express");
const router = express.Router();
const verifyToken = require('../token_middleware/verifyToken')

const {
  toggleWishlist,
  getWishlist,
} = require("../controllers/wishlist_controller");

// ⚠️ अगर auth middleware use करते हो तो import करके बीच में लगा देना
// const auth = require("../middleware/auth");

// ✅ Add / Remove (Toggle Wishlist)
// POST /api/wishlist/toggle
router.post("/add-remove-wishlist",verifyToken, toggleWishlist);

// ✅ Get wishlist for logged-in user (auth से user आएगा)
// GET /api/wishlist/my
router.get("/get-wishlist", verifyToken, getWishlist);

// ✅ Get wishlist for specific userId (useful for admin / debug)
// GET /api/wishlist/:userId
router.get("/:userId", getWishlist);

module.exports = router;
