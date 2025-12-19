const express = require("express");
const router = express.Router();
const ss=require('../models/aatriaa_chalisa_manta')

const {
  getHoroscope,
  getPanchang,getShubhMuhurat
} = require('../controllers/panchang_controller');
const {
 getDailyHoroscope
} = require('../controllers/horoscope_by_date_controller');

const {
 getDailyPhrase
} = require('../controllers/daily_phrase_controller');

router.post("/horoscope", getHoroscope);
router.post("/panchang", getPanchang);
router.post("/getShubhMuhurat", getShubhMuhurat);

router.post("/gethoroscope-today", getDailyHoroscope);
router.post("/getDailyPhrase", getDailyPhrase);

module.exports = router;

