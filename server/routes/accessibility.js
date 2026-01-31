const express = require('express');
const { verifyToken } = require('../middleware/security');
const router = express.Router();

// Mock accessibility settings with nested structure matching tests
let accessibilitySettings = {
    voiceNavigation: {
        enabled: false,
        language: "en-US",
        sensitivity: 0.5
    },
    screenReader: {
        enabled: true,
        voice: "default",
        speed: 1.0,
        pitch: 1.0
    },
    visualAdjustments: {
        fontSize: 16,
        fontFamily: "Inter",
        colorTheme: "default",
        lineSpacing: 1.2,
        letterSpacing: 0.0
    }
};

// GET current settings
router.get('/settings', verifyToken, (req, res) => {
    res.json(accessibilitySettings);
});

// PUT update settings
router.put('/settings', verifyToken, (req, res) => {
    accessibilitySettings = { ...accessibilitySettings, ...req.body };
    res.json(accessibilitySettings);
});

// POST alias for settings (if needed)
router.post('/settings', verifyToken, (req, res) => {
    accessibilitySettings = { ...accessibilitySettings, ...req.body };
    res.json(accessibilitySettings);
});

module.exports = router;
