const express = require('express');
const { verifyToken } = require('../middleware/security');
const aiService = require('../services/aiService');
const router = express.Router();

router.post('/process', verifyToken, async (req, res) => {
    const { feature, action } = req.body;

    if (!feature || !action) {
        return res.status(400).json({ message: 'Feature and action are required' });
    }

    try {
        const response = await aiService.processAccessibilityRequest(feature, action);
        res.json({ response });
    } catch (error) {
        console.error("[AI Route] Error:", error);
        res.status(500).json({ message: 'Error processing AI request' });
    }
});

module.exports = router;
