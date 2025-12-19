const router = require("express").Router();

const {
  addVivahMuhurat,
  getVivahMuhurat,
  getVivahMuhuratByDate,
} = require("../controllers/vivah_muhurat_controller");

// Add single / multiple
router.post("/add-vivah-muhurat", addVivahMuhurat);

// Get all
router.get("/all-vivah-muhurat", getVivahMuhurat);

// Get by date
router.get("/date/:date", getVivahMuhuratByDate);

module.exports = router;
