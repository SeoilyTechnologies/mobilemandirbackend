const express = require("express");
const router = express.Router();

const {
  addTirthData,
  getAllTirthData,
  getTirthById,
} = require("../controllers/tirth_controller");

// 🔹 Add tirth data (array)
router.post("/add-tirth", addTirthData);

// 🔹 Get all tirth
router.get("/all-tirth", getAllTirthData);

// 🔹 Get tirth by id
router.get("/tirth/:id", getTirthById);

module.exports = router;
