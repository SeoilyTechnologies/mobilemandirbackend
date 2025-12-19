// routes/rashi.routes.js
const express = require("express");
const router = express.Router();

const {
  createRashi,
  getAllRashi,
  getRashiById,
  updateRashi,
  deleteRashi,
} = require("../controllers/rashi_name_controller");

// Create Rashi
router.post("/add-rashi", createRashi);

// Get all Rashi
router.get("/", getAllRashi);

// Get single Rashi by ID
router.post("/get-rashi-by-id", getRashiById);

// Update Rashi
router.post("/update-rashi", updateRashi);

// Delete Rashi
router.delete("/:id", deleteRashi);

module.exports = router;
