const express = require("express");
const router = express.Router();
const verifyToken = require("../token_middleware/verifyToken");

const { addManyQuotes, getAllQuotes } = require("../controllers/vivekandQuotes.controller");

router.post("/add-many", addManyQuotes);
router.post("/all-vivekanadQuotes",verifyToken, getAllQuotes);

module.exports = router;
