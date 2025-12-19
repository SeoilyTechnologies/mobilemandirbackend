const express = require("express");
const router = express.Router();
const verifyToken = require('../token_middleware/verifyToken')

const { addQuotes, getQuotes } = require("../controllers/today_thought_controller");

// Insert many
router.post("/add-auotes", addQuotes);

// Get all
router.post("/all-thoughts",verifyToken, getQuotes);

module.exports = router;