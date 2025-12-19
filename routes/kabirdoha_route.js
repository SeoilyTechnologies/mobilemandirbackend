const express = require("express");
const router = express.Router();
const verifyToken = require("../token_middleware/verifyToken");

const { addManyDoha, getAllDoha } = require("../controllers/kabirDoha.controller");

router.post("/add-kabir-doha", addManyDoha);
router.post("/get-all-kabir-doha",verifyToken, getAllDoha);

module.exports = router;
