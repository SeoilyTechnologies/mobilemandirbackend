const router = require("express").Router();

const {
  addAmavasya,
  getAmavasya,
  getAmavasyaByDate
} = require("../controllers/amavasya_controller");

// Add Amavasya (single or multiple)
router.post("/add-amavasya", addAmavasya);

// Get all Amavasya
router.get("/all-amavasya", getAmavasya);

// Get by date
router.get("/date/:date", getAmavasyaByDate);

module.exports = router;
