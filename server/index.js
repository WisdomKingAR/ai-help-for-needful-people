require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const aiRoutes = require('./routes/ai');
const accessibilityRoutes = require('./routes/accessibility');

const app = express();
const PORT = process.env.PORT || 5000;

// Request/Response Logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        // Allow any localhost origin or no origin (postman/mobile)
        if (!origin || origin.match(/^http:\/\/localhost:\d+$/) || origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Proxy for Gesture Detection (Python Backend)
app.post('/api/accessibility/detect-gesture', async (req, res) => {
    try {
        const response = await fetch('http://localhost:5001/api/accessibility/detect-gesture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("[Gesture Proxy] Error:", error);
        res.status(500).json({ error: 'Gesture detection service unavailable' });
    }
});

// Root level aliases for TestSprite
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/ai', aiRoutes);
app.use('/accessibility', accessibilityRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/accessibility', accessibilityRoutes);

// Fallback for dashboard
app.get('/api/dashboard', (req, res) => {
    res.redirect('/api/dashboard/stats');
});
app.get('/dashboard/realtime-stats', (req, res) => {
    res.redirect(307, '/api/dashboard/stats');
});

// Alias for gesture detection without /api
app.post('/accessibility/detect-gesture', (req, res) => {
    res.redirect(307, '/api/accessibility/detect-gesture');
});

// Fallback for AI
app.get('/api/ai', (req, res) => {
    res.status(200).json({ message: 'AI endpoint active. Use POST /api/ai/process' });
});
app.get('/ai/process', (req, res) => {
    res.redirect(307, '/api/ai/process');
});

app.get('/', (req, res) => {
    res.json({
        message: 'Accessibility AI Backend API',
        status: 'active',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            dashboard: '/api/dashboard',
            ai: '/api/ai',
            accessibility: '/api/accessibility',
            health: '/health'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`[Accessibility AI Server] Secure server running on port ${PORT}`);
    // Keep alive check
    setInterval(() => {
        // console.log('Server is heartbeat');
    }, 5000);
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});
