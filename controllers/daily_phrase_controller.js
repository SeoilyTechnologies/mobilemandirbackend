const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const RAPID_API_HOST = "horoscope-astrology.p.rapidapi.com";
const RAPID_API_KEY = "c40f33ffecmsh511157be17dd5a9p149debjsne9955643a19d";

const CACHE_PATH = path.join(__dirname, "../cache/daily_phrase_cache.json");
const DUMMY_DAILY_PHRASE = require("../dummy/daily_phrase.json");


// ----------------------------------------------------------------
//   FUNCTION: READ CACHE
// ----------------------------------------------------------------
function readCache() {
  try {
    const raw = fs.readFileSync(CACHE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return { date: "", data: null };
  }
}

// ----------------------------------------------------------------
//   FUNCTION: WRITE CACHE
// ----------------------------------------------------------------
function writeCache(date, data) {
  fs.writeFileSync(
    CACHE_PATH,
    JSON.stringify({ date, data }, null, 2),
    "utf8"
  );
}


// ----------------------------------------------------------------
//  GET DAILY PHARASE
// ----------------------------------------------------------------
async function getDailyPhrase(req, res) {
  const { apiHit } = req.body || {};

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const cache = readCache();

  // 1️⃣ RETURN CACHE IF ALREADY FETCHED TODAY
  if (cache.date === today && cache.data) {
    return res.status(200).json({
      success: true,
      from: "cache",
      data: cache.data,
    });
  }

  // 2️⃣ IF apiHit = false => return dummy (no cache update)
  if (apiHit === false) {
    return res.status(200).json({
      success: true,
      from: "dummy",
      data: DUMMY_DAILY_PHRASE,
    });
  }

  // 3️⃣ CALL API (first hit of the day)
  const options = {
    method: "GET",
    url: `https://${RAPID_API_HOST}/dailyphrase`,
    headers: {
      "x-rapidapi-host": RAPID_API_HOST,
      "x-rapidapi-key": RAPID_API_KEY,
    },
    timeout: 10000,
  };

  try {
    const response = await axios.request(options);

    // Save to cache
    writeCache(today, response.data);

    return res.status(200).json({
      success: true,
      from: "api",
      data: response.data,
    });

  } catch (error) {
    console.error("Daily Phrase API Error:", error.message);

    return res.status(200).json({
      success: false,
      from: "dummy-fallback",
      data: DUMMY_DAILY_PHRASE,
    });
  }
}

// ----------------------------------------------------------------
//  DAILY HOROSCOPE
// ----------------------------------------------------------------

module.exports = { getDailyPhrase };
