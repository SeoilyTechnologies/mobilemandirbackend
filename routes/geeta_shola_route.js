const express = require("express");
const router = express.Router();
const verifyToken = require("../token_middleware/verifyToken");

const { getAllSlokas ,insertManySlokas} = require("../controllers/geet_sloka_controller");

router.post("/get-geeta-sloakas", getAllSlokas);
router.post("/add-geeta-slokas",verifyToken, insertManySlokas);  
module.exports = router;
