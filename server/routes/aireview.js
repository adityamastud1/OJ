const express = require("express");
const router = express.Router();
const { generateAIReview } = require("../utils/generateAiReview");
// Example: Review a user's code submission
router.post("/review", async (req, res) => {
    const { code } = req.body;
    if(code=== undefined || code.trim() === "") {
        return res.status(400).json({ error: "Code is required for review" });
    }

    try {
        const feedback = await generateAIReview(code);
        res.status(200).json({ feedback });
    } catch (err) {
        console.error("error in AI review", err);
        res.status(500).json({ error: "Failed to get AI review" });
    }
});

module.exports = router;
