const router = require("express").Router();

const {
  addGrahGochar,
  getGrahGochar,
  getGrahGocharByDate,
} = require("../controllers/grah_gochar_controller");

router.post("/add-grah-gochar", addGrahGochar);          // Add single or array
router.get("/all-grah-gochar", getGrahGochar);           // Get all
router.get("/date/:dat", getGrahGocharByDate); // Get by date

module.exports = router;
