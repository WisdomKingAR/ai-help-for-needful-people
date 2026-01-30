require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

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
