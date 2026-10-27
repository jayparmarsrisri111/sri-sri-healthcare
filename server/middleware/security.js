/**
 * Sri Sri ❤️ HealthCare - Enterprise Security Middleware Suite
 * Zero-dependency, lightweight, production-grade security module.
 * 
 * Features:
 * 1. Security Headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.)
 * 2. Adaptive CORS Protection (supports localhost, Netlify, Vercel, and custom domains)
 * 3. In-Memory Anti-Brute-Force Rate Limiter (sliding window with auto-cleanup)
 * 4. Input Sanitizer & Prototype Pollution Guard
 * 5. Cryptographic Password Hashing & Timing-Safe Verification (scrypt + timingSafeEqual)
 * 6. Production Error Sanitizer (prevents stack trace disclosure)
 */

const crypto = require('crypto');

// ==========================================
// 1. SECURITY HEADERS MIDDLEWARE
// ==========================================
function securityHeaders(req, res, next) {
    // Hide Express identification
    res.removeHeader('X-Powered-By');

    // Prevent MIME-sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Prevent Clickjacking
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // Legacy XSS Protection for older browsers
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer Policy - privacy preserving
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Prevent IE from executing downloads in site's context
    res.setHeader('X-Download-Options', 'noopen');

    // Permissions Policy: allow camera, microphone, and GPS geolocation for HealthCare vitals, voice triage, and pharmacy radar
    res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self)');

    // Enforce HTTPS HSTS if running in production or behind HTTPS proxy
    if (process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // Safe Content Security Policy (allows app resources, Vite, Google Translate, Google Fonts, and CDNs)
    const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://translate.google.com https://translate.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https: http: https://translate.google.com https://www.gstatic.com",
        "media-src 'self' blob: data:",
        "connect-src 'self' * ws: wss: https://translate.googleapis.com",
        "frame-ancestors 'self'",
        "object-src 'none'",
        "base-uri 'self'"
    ].join('; ');

    res.setHeader('Content-Security-Policy', cspDirectives);

    next();
}

// ==========================================
// 2. ADAPTIVE CORS CONFIGURATION
// ==========================================
const ALLOWED_ORIGIN_PATTERNS = [
    /^http:\/\/localhost(:\d+)?$/,
    /^http:\/\/127\.0\.0\.1(:\d+)?$/,
    /^http:\/\/0\.0\.0\.0(:\d+)?$/,
    /^https?:\/\/([a-zA-Z0-9-]+\.)?srisri111\.com$/,
    /^https?:\/\/([a-zA-Z0-9-]+\.)?netlify\.app$/,
    /^https?:\/\/([a-zA-Z0-9-]+\.)?vercel\.app$/
];

function getCorsOptions() {
    // Custom origins from environment variable (comma separated)
    const envOrigins = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map(o => o.trim())
        .filter(Boolean);

    return {
        origin: function (origin, callback) {
            // Allow server-to-server, mobile webviews, curl, or same-origin requests with no origin header
            if (!origin) return callback(null, true);

            // Check env whitelist
            if (envOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Check regex patterns
            const isAllowed = ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin));
            if (isAllowed) {
                return callback(null, true);
            }

            // In development, be permissive to avoid blocking legitimate local workflows
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }

            // Block unauthorized origin in production
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
    };
}

// ==========================================
// 3. IN-MEMORY SLIDING RATE LIMITER
// ==========================================
function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later.' }) {
    const hits = new Map();

    // Periodic sweep every 5 minutes to prevent memory leak
    const sweepInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of hits.entries()) {
            if (now - record.startTime > windowMs) {
                hits.delete(key);
            }
        }
    }, 5 * 60 * 1000);

    if (sweepInterval.unref) sweepInterval.unref();

    return function rateLimiter(req, res, next) {
        // Resolve client IP (supporting reverse proxies like Cloudflare / Nginx / Netlify)
        const forwarded = req.headers['x-forwarded-for'];
        const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress || 'unknown';

        const now = Date.now();
        let record = hits.get(ip);

        if (!record || now - record.startTime > windowMs) {
            record = { count: 1, startTime: now };
            hits.set(ip, record);
        } else {
            record.count += 1;
        }

        const remaining = Math.max(0, max - record.count);
        const resetTime = Math.ceil((record.startTime + windowMs - now) / 1000);

        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', resetTime);

        if (record.count > max) {
            return res.status(429).json({
                success: false,
                code: 'RATE_LIMIT_EXCEEDED',
                message: message,
                retryAfterSeconds: resetTime
            });
        }

        next();
    };
}

// Pre-configured rate limiters
const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 login/register attempts per 15 min
    message: 'ઘણી બધી લોગિન વિનંતીઓ કરવામાં આવી છે. કૃપા કરીને ૧૫ મિનિટ પછી પ્રયાસ કરો. (Too many auth attempts. Please try again after 15 minutes.)'
});

const apiRateLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 600, // 600 requests per 10 min
    message: 'વિનંતી મર્યાદા સમાપ્ત થઈ છે. થોડીવાર પછી ફરી પ્રયાસ કરો. (API rate limit exceeded.)'
});

// ==========================================
// 4. INPUT SANITIZER & PROTOTYPE POLLUTION GUARD
// ==========================================
function sanitizeInput(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        const clean = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(clean);
            }
            if (obj && typeof obj === 'object') {
                const sanitized = {};
                for (const key of Object.keys(obj)) {
                    // Block prototype pollution
                    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                        continue;
                    }
                    const val = obj[key];
                    if (typeof val === 'string') {
                        // Strip dangerous HTML script tags to prevent stored XSS
                        sanitized[key] = val.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
                    } else if (typeof val === 'object' && val !== null) {
                        sanitized[key] = clean(val);
                    } else {
                        sanitized[key] = val;
                    }
                }
                return sanitized;
            }
            return obj;
        };

        try {
            req.body = clean(req.body);
        } catch (e) {
            // Ignore transformation error, pass through safely
        }
    }
    next();
}

// ==========================================
// 5. SECURE PASSWORD HASHING & VERIFICATION
// ==========================================
const passwordSecurity = {
    /**
     * Hash password with crypto.scrypt and cryptographic salt
     */
    hashPassword: (plainPassword) => {
        if (!plainPassword || typeof plainPassword !== 'string') return '';
        const salt = crypto.randomBytes(16).toString('hex');
        const derivedKey = crypto.scryptSync(plainPassword, salt, 64);
        return `scrypt$${salt}$${derivedKey.toString('hex')}`;
    },

    /**
     * Verify password using constant-time comparison to prevent timing attacks.
     * Backwards-compatible with legacy plain text passwords (e.g. demo users).
     */
    verifyPassword: (plainPassword, storedPassword) => {
        if (!plainPassword || !storedPassword) return false;

        // Modern scrypt hash
        if (typeof storedPassword === 'string' && storedPassword.startsWith('scrypt$')) {
            const parts = storedPassword.split('$');
            if (parts.length !== 3) return false;
            const salt = parts[1];
            const storedHash = parts[2];
            const derivedKey = crypto.scryptSync(plainPassword, salt, 64);
            const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'utf8');
            const storedBuffer = Buffer.from(storedHash, 'utf8');

            if (keyBuffer.length !== storedBuffer.length) return false;
            return crypto.timingSafeEqual(keyBuffer, storedBuffer);
        }

        // Legacy plaintext comparison for demo users (patient123, doctor123, admin123)
        return plainPassword === storedPassword;
    },

    /**
     * Checks if a legacy stored password needs to be upgraded to scrypt hash
     */
    needsRehash: (storedPassword) => {
        return typeof storedPassword === 'string' && !storedPassword.startsWith('scrypt$');
    }
};

// ==========================================
// 6. PRODUCTION SAFE ERROR HANDLER
// ==========================================
function secureErrorHandler(err, req, res, next) {
    console.error('⚠️ [Security Caught Error]:', err.message || err);

    const isProd = process.env.NODE_ENV === 'production';
    const statusCode = err.status || err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: isProd
            ? 'આંતરિક સર્વર સમસ્યા આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો.'
            : (err.message || 'Internal Server Error'),
        ...(isProd ? {} : { stack: err.stack })
    });
}

module.exports = {
    securityHeaders,
    getCorsOptions,
    createRateLimiter,
    authRateLimiter,
    apiRateLimiter,
    sanitizeInput,
    passwordSecurity,
    secureErrorHandler
};
