const express = require("express");
const router = express.Router();

const {
  upsertHoroscope,
  getAllHoroscopes,
  getHoroscopeByDate,
  getHoroscopeByDateAndRashi,
  getSingleRashiForDate,
} = require("../controllers/horoscopeController");

// Create / Update horoscope for a date
router.post("/add-horscope", upsertHoroscope);

// Get all horoscopes (with pagination)
router.get("/", getAllHoroscopes);

// Get all rashis for a specific date
router.post("/horscope-date", getHoroscopeByDate);

// Get a specific rashi for a specific date
router.post("/date-rashi", getHoroscopeByDateAndRashi);

router.post("/single", getSingleRashiForDate);

module.exports = router;
