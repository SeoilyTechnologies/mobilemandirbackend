const router = require("express").Router();

const {
  addMundan,
  getAllMundan,
  getMundanByDate
} = require("../controllers/mundan_controller");

// Add Mundan Muhurat (single or multiple)
router.post("/add-mundan", addMundan);

// Get all Mundan Muhurats
router.get("/all-mundan", getAllMundan);

// Get Mundan by date
router.get("/date/:date", getMundanByDate);

module.exports = router;
