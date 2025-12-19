const router = require("express").Router();

const {
  addEkadashi,
  getEkadashi,
  getEkadashiByDate
} = require("../controllers/ekadashi_controller");

// Add Ekadashi (single or multiple)
router.post("/add-ekadashi", addEkadashi);

// Get all Ekadashi
router.get("/all-ekadashi", getEkadashi);

// Get by date
router.get("/date/:date", getEkadashiByDate);

module.exports = router;
