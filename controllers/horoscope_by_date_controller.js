const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
//https://rapidapi.com/Alejandro99aru/api/horoscope-astrology/playground/apiendpoint_80604a3d-064a-49be-95c9-30b988819b78
const RAPID_API_HOST = "horoscope-astrology.p.rapidapi.com";
const RAPID_API_KEY = "c40f33ffecmsh511157be17dd5a9p149debjsne9955643a19d";

const CACHE_PATH = path.join(__dirname, "../cache/daily_horoscope_cache.json");
const DUMMY_DAILY_HOROSCOPE = require("../dummy/daily_horoscope.json");

// ----------------------------------------------------------------
//   READ CACHE
// ----------------------------------------------------------------
function readCache() {
  try {
    const raw = fs.readFileSync(CACHE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return { date: "", data: {} };
  }
}

// ----------------------------------------------------------------
//   WRITE CACHE
// ----------------------------------------------------------------
function writeCache(date, data) {
  fs.writeFileSync(
    CACHE_PATH,
    JSON.stringify({ date, data }, null, 2),
    "utf8"
  );
}

// ----------------------------------------------------------------
//   GET DAILY HOROSCOPE
// ----------------------------------------------------------------
async function getDailyHoroscope(req, res) {
  const { sunsign, apiHit } = req.body || {};

  if (!sunsign) {
    return res.status(400).json({
      success: false,
      message: "Missing required param: sunsign",
    });
  }

  // Today

//Yesterday

//Tomorrow

//Week

//Month

//Year
  const sign = sunsign.toLowerCase();
  const today = new Date().toISOString().slice(0, 10);

  const cache = readCache();

  // -----------------------------------------
  // 1️⃣ Return Cached (same day + same sign)
  // -----------------------------------------
  if (cache.date === today && cache.data[sign]) {
    return res.status(200).json({
      success: true,
      from: "cache",
      sunsign: sign,
      data: cache.data[sign],
    });
  }

  // -----------------------------------------
  // 2️⃣ apiHit = false → return dummy
  // -----------------------------------------
  if (apiHit === false) {
    const dummy = DUMMY_DAILY_HOROSCOPE[sign] || DUMMY_DAILY_HOROSCOPE.default;

    return res.status(200).json({
      success: true,
      from: "dummy",
      sunsign: sign,
      data: dummy, // same structure as API
    });
  }

  // -----------------------------------------
  // 3️⃣ CALL API (first hit of the day for this sign)
  // -----------------------------------------
  const options = {
    method: "GET",
    url: `https://${RAPID_API_HOST}/horoscope`,
    params: { day: "today", sunsign: sign },
    headers: {
      "x-rapidapi-host": RAPID_API_HOST,
      "x-rapidapi-key": RAPID_API_KEY,
    },
    timeout: 10000,
  };

  try {
    const response = await axios.request(options);

    // Cache init for new day
    if (cache.date !== today) {
      cache.date = today;
      cache.data = {};
    }

    // Save data for this sign
    cache.data[sign] = response.data;

    writeCache(today, cache.data);

    return res.status(200).json({
      success: true,
      from: "api",
      sunsign: sign,
      data: response.data, // exact same as RapidAPI
    });

  } catch (error) {
    console.error("Daily Horoscope API Error:", error.message);

    const dummy = DUMMY_DAILY_HOROSCOPE[sign] || DUMMY_DAILY_HOROSCOPE.default;

    return res.status(200).json({
      success: true,
      from: "dummy-fallback",
      sunsign: sign,
      data: dummy,
    });
  }
}

// ----------------------------------------------------------------
// EXPORT
// ----------------------------------------------------------------
module.exports = { getDailyHoroscope };
