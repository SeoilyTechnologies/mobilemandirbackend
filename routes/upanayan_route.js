const router = require("express").Router();

const {
  addUpanayan,
  getAllUpanayan,
  getUpanayanByDate
} = require("../controllers/upanayan_controller");

// Add Upanayan Muhurat (single or multiple)
router.post("/add-upanayan", addUpanayan);

// Get all Upanayan Muhurats
router.get("/all-upanayan", getAllUpanayan);

// Get by date
router.get("/date/:date", getUpanayanByDate);

module.exports = router;
