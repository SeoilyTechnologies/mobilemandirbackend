const router = require("express").Router();

const {
  addGrihaPravesh,
  getAllGrihaPravesh,
  getGrihaPraveshByDate
} = require("../controllers/grihpravesh_controller");

// Add Griha Pravesh (single or multiple)
router.post("/add-grihpravesh", addGrihaPravesh);

// Get all Griha Pravesh Muhurats
router.get("/all-grihpravesh", getAllGrihaPravesh);

// Get Griha Pravesh by date
router.get("/date/:date", getGrihaPraveshByDate);

module.exports = router;
