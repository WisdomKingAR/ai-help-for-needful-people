const express = require('express');
const { verifyToken } = require('../middleware/security');
const router = express.Router();

const persistenceService = require('../services/persistenceService');

// Initial default settings
const defaultSettings = {
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

let accessibilitySettings = persistenceService.load('accessibility_settings.json', defaultSettings);

// GET current settings
router.get('/settings', verifyToken, (req, res) => {
    res.json(accessibilitySettings);
});

// PUT update settings
router.put('/settings', verifyToken, (req, res) => {
    accessibilitySettings = { ...accessibilitySettings, ...req.body };
    persistenceService.save('accessibility_settings.json', accessibilitySettings);
    res.json(accessibilitySettings);
});

// POST alias for settings (if needed)
router.post('/settings', verifyToken, (req, res) => {
    accessibilitySettings = { ...accessibilitySettings, ...req.body };
    persistenceService.save('accessibility_settings.json', accessibilitySettings);
    res.json(accessibilitySettings);
});

module.exports = router;
