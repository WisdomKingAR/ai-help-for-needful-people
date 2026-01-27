const express = require('express');
const { verifyToken } = require('../middleware/security');
const router = express.Router();

// Mock data for the dashboard graph
const getAccessibilityScoreTrend = () => [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 72 },
    { name: 'Wed', score: 68 },
    { name: 'Thu', score: 85 },
    { name: 'Fri', score: 82 },
    { name: 'Sat', score: 90 },
    { name: 'Sun', score: 95 },
];

router.get('/stats', verifyToken, (req, res) => {
    res.json({
        totalScans: 1240,
        issuesFixed: 856,
        complianceLevel: '92%',
        scoreTrend: getAccessibilityScoreTrend(),
        user: req.user
    });
});

module.exports = router;
