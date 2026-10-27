/**
 * Sri Sri ❤️ HealthCare - Express.js & MongoDB Backend Gateway
 * Serves both API endpoints and Production React Web App
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const {
    securityHeaders,
    getCorsOptions,
    apiRateLimiter,
    sanitizeInput,
    secureErrorHandler
} = require('./middleware/security');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (with safe offline fallback)
connectDB();

// Security Middlewares
app.disable('x-powered-by');
app.use(securityHeaders);
app.use(cors(getCorsOptions()));
app.use('/api', apiRateLimiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(sanitizeInput);

// Health Route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Sri Sri ❤️ HealthCare Express API Gateway',
        version: '3.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/triage', require('./routes/triageRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/pharmacies', require('./routes/pharmacyRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/ai', require('./routes/aiProxyRoutes'));

// Serve Production React Frontend
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Google Search Console Verification Endpoint
app.get('/google225ea9313318883b.html', (req, res) => {
    res.type('html').send('google-site-verification: google225ea9313318883b.html');
});

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    }
});

// Centralized Secure Error Handler
app.use(secureErrorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏥 Sri Sri ❤️ HealthCare Gateway running on port ${PORT}`);
    console.log(`🔗 Web App: http://localhost:${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
});

// Also listen on standard HTTP port 80 for direct domain access (e.g. www.srisri111.com)
try {
    const server80 = app.listen(80, '0.0.0.0', () => {
        console.log(`🌐 Sri Sri ❤️ HealthCare also active on standard Port 80 (http://www.srisri111.com)`);
    });
    server80.on('error', (err) => {
        console.warn('Port 80 fallback notice:', err.message);
    });
} catch (err) {
    console.warn('Port 80 fallback notice:', err.message);
}
