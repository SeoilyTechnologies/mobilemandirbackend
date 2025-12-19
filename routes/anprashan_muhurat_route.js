const router = require("express").Router();

const {
  addAnprashanMuhurat,
  getAllAnprashanMuhurat,
  getAnprashanMuhuratByDate
} = require("../controllers/anprashan_muhurat_controller");

// Add multiple muhurats
router.post("/add-anprashan", addAnprashanMuhurat);

// Get all muhurats
router.get("/all-anprashan", getAllAnprashanMuhurat);

// Get by date
router.get("/date/:date", getAnprashanMuhuratByDate);

module.exports = router;
