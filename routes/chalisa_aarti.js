// routes/aartiChalisaRoutes.js

const router = require("express").Router();
const verifyToken = require("../token_middleware/verifyToken");

const {
  uploadChalisaAarti,
  getAllChalisaMantra,
  getFilteredChalisaMantra,
  getExploreDetail,
  getDayWiseChalisaAarti,
  updateChalisaAartiById
} = require("../controllers/aartiChalisaController");

// 🔹 Upload all Aarti/Chalisa/Mantra (protected)
router.post("/upload-chalisa-aarti", verifyToken, uploadChalisaAarti);

// 🔹 Get all (with god populate) – protected
router.get("/all-chalisa-manta", verifyToken, getAllChalisaMantra);

// 🔹 Filter by type (aarti/chalisa/mantra/baan/katha)
router.post("/all-filter-chalisa-manta",verifyToken, getFilteredChalisaMantra);

// 🔹 Explore detail by godId + type
router.post("/explore-detail", getExploreDetail);

// 🔹 Day-wise aarti/chalisa/mantra/baan (no type required)
router.post("/day-wise-chalisa-aarti",verifyToken, getDayWiseChalisaAarti);
router.post("/update-chalisa-aarti", updateChalisaAartiById);

module.exports = router;

