const express = require('express');
const { verifyToken } = require('../middleware/security');
const aiService = require('../services/aiService');
const router = express.Router();

router.post('/process', verifyToken, async (req, res) => {
    const { feature, action, message } = req.body;
    const targetFeature = feature || "Conversational AI";
    const targetAction = action || message || "General Inquiry";

    try {
        const response = await aiService.processAccessibilityRequest(targetFeature, targetAction);
        res.json({ response, reply: response });
    } catch (error) {
        console.error("[AI Route] Error:", error);
        res.status(500).json({ message: 'Error processing AI request' });
    }
});

// Alias for converse
router.post('/converse', verifyToken, async (req, res) => {
    const { message } = req.body;
    try {
        const response = await aiService.processAccessibilityRequest("Conversational AI", message || "Hello");
        res.json({ response, reply: response });
    } catch (error) {
        console.error("[AI Converse] Error:", error);
        res.status(500).json({ message: 'Error processing AI request' });
    }
});

module.exports = router;
