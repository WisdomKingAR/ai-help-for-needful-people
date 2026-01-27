const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { accountLockout, handleFailedLogin, resetLockout, authLimiter } = require('../middleware/security');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

// Mock DB
const users = [];

// Register
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    users.push({ email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
});

// Login with lockout logic
router.post('/login', [
    authLimiter,
    accountLockout,
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        handleFailedLogin(email);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const status = handleFailedLogin(email);
        const remaining = 5 - status.attempts;
        return res.status(401).json({
            message: `Invalid credentials. ${remaining} attempts left before account lock.`
        });
    }

    // Success: Clear lockout status
    resetLockout(email);

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Login successful' });
});

module.exports = router;
