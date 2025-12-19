// routes/bannerRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../token_middleware/verifyToken");

const {
  createBanner,
  getAllBanners,
  getBannerDetail,
} = require("../controllers/bannerController");

// 🔹 Admin
router.post("/create", verifyToken, createBanner);

// 🔹 Home screen
router.get("/list", getAllBanners);

// 🔹 Banner click
router.get("/detail/:bannerId", getBannerDetail);

module.exports = router;
