const router = require("express").Router();

const { 
  addFestivals, 
  getFestivals, 
  getFestivalByDate 
} = require("../controllers/festival_controller");

router.post("/add-festival", addFestivals);     // Add array of festivals
router.get("/all-festival", getFestivals);      // Get all
router.get("/date/:date", getFestivalByDate);  // Get by date

module.exports = router;
