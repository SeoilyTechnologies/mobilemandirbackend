const router = require("express").Router();

const {
  addGrahan,
  getAllGrahan,
  getGrahanByDate,
} = require("../controllers/grahan_controller");

// Add single or multiple grahan
router.post("/add-grahan", addGrahan);

// Get all
router.get("/all-grahan", getAllGrahan);

// Get by date
router.get("/date/:date", getGrahanByDate);

module.exports = router;
