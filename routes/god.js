const router = require("express").Router();
const GodSchema = require("../models/god_schema");
const verifyToken = require('../token_middleware/verifyToken')

router.post("/upload-god-data", verifyToken, async (req, res) => {
    try {

        const godDataArray = req.body.gods;

        if (!Array.isArray(godDataArray) || godDataArray.length === 0) {
            return res.status(400).json({ message: "Please provide an array of god data." });
        }

        const insertedGods = await GodSchema.insertMany(godDataArray);

        res.status(201).json({
            message: "God data uploaded successfully.",
            total: insertedGods.length,
            data: insertedGods,
        });

    } catch (err) {  // FIXED
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});

router.get("/all-god-data", async (req, res) => {
    try {

        const allGodData = await GodSchema.find();
        res.status(200).json({
            success:true,
            message: "God data fetch successfully.",
            total: allGodData.length,
            data: allGodData,
        });
    } catch (err) {
        res.status(500).json({
             success:false,
            message: "Internal server error",
            error: err.message
        });
    }
})

module.exports = router;
