// controllers/penchange_controller.js
//api provider https://rapidapi.com/dineshbabulankaram/api/horoscope-and-panchanga
const axios = require("axios");
require("dotenv").config();

const RAPID_API_HOST = "horoscope-and-panchanga.p.rapidapi.com";
const RAPID_API_KEY = "c40f33ffecmsh511157be17dd5a9p149debjsne9955643a19d";

// ---------------------------
//  IMPORT DUMMY RESPONSES
// ---------------------------
const DUMMY_HOROSCOPE_RESPONSE = require("../dummy/horoscope_dummy.json");
const DUMMY_PANCHANG_RESPONSE = require("../dummy/panchang_dummy.json");
const DUMMY_SHUBH_MUHURAT_RESPONSE = require("../dummy/shubh_muhurat.json");




// --------------------------------------------
//  FUNCTION: CALL HOROSCOPE FROM RAPID API
// --------------------------------------------
async function getHoroscope(req, res) {
  const { date, time, latitude, longitude, place } = req.body;

  if (!RAPID_API_KEY) {
    return res.status(200).json({
      success: true,
      message: "API Key missing. Dummy Horoscope Returned.",
      data: DUMMY_HOROSCOPE_RESPONSE,
    });
  }

  const options = {
    method: "POST",
    url: `https://${RAPID_API_HOST}/horoscope`,
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
    data: {
      date,
      time,
      latitude,
      longitude,
      place,
    },
  };

  try {
    const response = await axios.request(options);

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Horoscope API Error:", error.message);

    // return dummy when API fails
    return res.status(200).json({
      success: false,
      message: "Horoscope API failed. Dummy data returned.",
      data: DUMMY_HOROSCOPE_RESPONSE,
    });
  }
}

// --------------------------------------------
//  FUNCTION: GET PANCHANG
// --------------------------------------------
// async function getPanchang(req, res) {
//   const { date, latitude, longitude, place } = req.body;

//   if (!RAPID_API_KEY) {
//     return res.status(200).json({
//       success: true,
//       message: "API Key missing. Dummy Panchang Returned.",
//       data: DUMMY_PANCHANG_RESPONSE,
//     });
//   }
//   //https://horoscope-and-panchanga.p.rapidapi.com/zodiac/panchanga

//   const options = {
//     method: "GET",
//     url: `https://${RAPID_API_HOST}/zodiac/panchanga`,
//     params: {
//       day,
//       month,
//       year,
//       place,
//       lat,
//       lon,
//       timezoneoffset,
//     },
//     headers: {
//       "X-RapidAPI-Key": RAPID_API_KEY,
//       "X-RapidAPI-Host": RAPID_API_HOST,
//     },
//   };

//   try {
//     const response = await axios.request(options);

//     return res.status(200).json({
//       success: true,
//       data: response.data,
//     });
//   } catch (error) {
//     console.error("Panchang API Error:", error.message);

//     // fallback dummy data
//     return res.status(200).json({
//       success: false,
//       message: "Panchang API failed. Dummy data returned.",
//       data: DUMMY_PANCHANG_RESPONSE,
//     });
//   }
// }
async function getPanchang(req, res) {
  // Debug: show what came in
  // console.log("REQ BODY:", req.body);

  // Pull values safely from req.body (avoid ReferenceError)
  const {
    day,
    month,
    year,
    place,
    lat,      // you used 'lat' earlier in examples
    lon,      // used 'lon' earlier
    timezoneoffset,
    apiHit,   // boolean: false => return dummy, true => call remote API
  } = req.body || {};
console.log("THIS IS RUNNING HERE HERE HERER......");
  // Validate minimal params (optional)
  if (apiHit === false) {
    return res.status(200).json({ success: true, from: "dummy", data: DUMMY_PANCHANG_RESPONSE });
  }

  if (!day || !month || !year || !place || !lat || !lon) {
    return res.status(400).json({ success: false, message: "Missing required params: day, month, year, place, lat, lon" });
  }

  const options = {
    method: "GET",
    url: `https://${RAPID_API_HOST}/zodiac/panchanga`,
    params: {
      day,
      month,
      year,
      place,
      lat,
      lon,
      timezoneoffset: timezoneoffset || "+5.5",
    },
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
    timeout: 10000,
  };

  try {
    const response = await axios.request(options);
    console.log(response.data )
    return res.status(200).json({ success: true, from: "api", data: response.data });
  } catch (err) {
    console.error("Panchang API Error:", err.response?.status, err.message);
    return res.status(200).json({
      success: false,
      from: "dummy-fallback",
      message: "Failed to call remote API. Returning dummy data.",
      data: DUMMY_PANCHANG_RESPONSE,
    });
  }
}



// --------------------------------------------
//  FUNCTION: GET SHUBH MUHURAT
// --------------------------------------------
async function getShubhMuhurat(req, res) {
  const {
    day,
    month,
    year,
    place,
    lat,
    lon,
    timezoneoffset,
    apiHit, // false => always return dummy
  } = req.body || {};

  // If apiHit = false → return dummy immediately
  if (apiHit === false) {
    return res.status(200).json({
      success: true,
      from: "dummy",
      data: DUMMY_SHUBH_MUHURAT_RESPONSE,
    });
  }

  // Required fields
  if (!day || !month || !year || !place || !lat || !lon) {
    return res.status(400).json({
      success: false,
      message: "Missing required params: day, month, year, place, lat, lon",
    });
  }

  const options = {
    method: "GET",
    url: `https://${RAPID_API_HOST}/zodiac/muhurat`,
    params: {
      day,
      month,
      year,
      place,
      lat,
      lon,
      timezoneoffset: timezoneoffset || "+5.5",
    },
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
    timeout: 10000,
  };

  try {
    const response = await axios.request(options);

    return res.status(200).json({
      success: true,
      from: "api",
      data: response.data,
    });
  } catch (err) {
    console.error("Shubh Muhurat API Error:", err.response?.status, err.message);

    return res.status(200).json({
      success: false,
      from: "dummy-fallback",
      message: "Shubh Muhurat API failed. Dummy data returned.",
      data: DUMMY_SHUBH_MUHURAT_RESPONSE,
    });
  }
}


// --------------------------------------------
//  EXPORT CONTROLLER
// --------------------------------------------
module.exports = {
  getHoroscope,
  getPanchang,
  getShubhMuhurat
};
