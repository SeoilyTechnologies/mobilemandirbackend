const router = require("express").Router();

const {
  addPoornima,
  getPoornima,
  getPoornimaByDate
} = require("../controllers/purnima_controller");

// Add Poornima (single or array)
router.post("/add-purnimas", addPoornima);

// Get all Poornimas
router.get("/all-purnima", getPoornima);

// Get Poornima by date
router.get("/date/:date", getPoornimaByDate);

module.exports = router;
