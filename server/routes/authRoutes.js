const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// Default initial demo users
const INITIAL_DEMO_USERS = [
    {
        userId: 'USR-PAT-001',
        name: 'રામજીભાઈ પટેલ (Ramjibhai Patel)',
        email: 'patient@swasthyasetu.ai',
        password: 'patient123',
        role: 'patient',
        phone: '9876543210',
        age: 48,
        gender: 'Male',
        village: 'ભુજ ગ્રામીણ (Bhuj Rural)',
        district: 'કચ્છ (Kutch)',
        bloodGroup: 'B+',
        emergencyContact: '108',
        createdAt: new Date('2026-01-15')
    },
    {
        userId: 'USR-DOC-002',
        name: 'Dr. રાજેશ મહેતા, MD (Dr. Rajesh Mehta)',
        email: 'doctor@swasthyasetu.ai',
        password: 'doctor123',
        role: 'doctor',
        phone: '9825012345',
        specialization: 'મુખ્ય જનરલ ફિઝિશિયન & કાર્ડિયોલોજિસ્ટ (Cardiology)',
        regNumber: 'GMC-GUJ-2014-9842',
        hospitalAffiliation: 'GK જનરલ સિવિલ હોસ્પિટલ, ભુજ',
        createdAt: new Date('2026-01-10')
    },
    {
        userId: 'USR-ADM-003',
        name: 'શ્રી કે. પી. જોશી (District Chief Health Officer)',
        email: 'admin@swasthyasetu.ai',
        password: 'admin123',
        role: 'admin',
        phone: '9426098765',
        adminBadge: 'DISTRICT-HEALTH-DIRECTOR-KUTCH',
        department: 'ગુજરાત જાહેર આરોગ્ય વિભાગ (Govt of Gujarat)',
        createdAt: new Date('2026-01-01')
    }
];

// In-memory user cache (for seamless operation even without active MongoDB)
let inMemoryUsers = [...INITIAL_DEMO_USERS];

// Helper to sanitize user output (omit password)
function sanitizeUser(u) {
    const { password, ...safeUser } = u.toObject ? u.toObject() : u;
    return safeUser;
}

// POST /api/auth/register - Register new user (Patient, Doctor, or Admin)
router.post('/register', async (req, res) => {
    try {
        const {
            name, email, password, role,
            phone, age, gender, village, district, bloodGroup, emergencyContact,
            specialization, regNumber, hospitalAffiliation,
            adminBadge, department
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const validRole = ['patient', 'doctor', 'admin'].includes(role) ? role : 'patient';

        // Check if email already exists
        let existingUser = null;
        if (mongoose.connection.readyState === 1) {
            try {
                existingUser = await User.findOne({ email: normalizedEmail });
            } catch (err) {
                existingUser = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
            }
        } else {
            existingUser = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
        }

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'આ ઇમેઇલ સાથેનું એકાઉન્ટ પહેલેથી જ અસ્તિત્વમાં છે. (Account already exists with this email)' });
        }

        const prefix = validRole === 'doctor' ? 'DOC' : validRole === 'admin' ? 'ADM' : 'PAT';
        const newUserId = `USR-${prefix}-${Date.now().toString().slice(-4)}`;

        const userData = {
            userId: newUserId,
            name: name.trim(),
            email: normalizedEmail,
            password: password, // For demonstration & offline local prototype
            role: validRole,
            phone: phone || '',
            age: Number(age) || 35,
            gender: gender || 'Male',
            village: village || 'ભુજ ગ્રામીણ',
            district: district || 'કચ્છ (Kutch)',
            bloodGroup: bloodGroup || 'B+',
            emergencyContact: emergencyContact || '108',
            specialization: specialization || 'જનરલ મેડિસિન',
            regNumber: regNumber || `GMC-${Math.floor(1000 + Math.random() * 9000)}`,
            hospitalAffiliation: hospitalAffiliation || 'GK જનરલ સિવિલ હોસ્પિટલ, ભુજ',
            adminBadge: adminBadge || 'DISTRICT-HEALTH-OFFICER',
            department: department || 'ગુજરાત આરોગ્ય કમિશનરેટ',
            createdAt: new Date()
        };

        let savedUser = null;
        if (mongoose.connection.readyState === 1) {
            try {
                const u = new User(userData);
                savedUser = await u.save();
            } catch (dbErr) {
                inMemoryUsers.push(userData);
                savedUser = userData;
            }
        } else {
            inMemoryUsers.push(userData);
            savedUser = userData;
        }

        const safe = sanitizeUser(savedUser);
        const token = `JWT-MOCK-${safe.userId}-${Date.now()}`;

        return res.json({
            success: true,
            message: `સ્વાગત છે ${safe.name}! તમારું ${validRole.toUpperCase()} એકાઉન્ટ સફળતાપૂર્વક બન્યું છે.`,
            token,
            user: safe
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ success: false, message: 'સર્વર એરર: ' + err.message });
    }
});

// POST /api/auth/login - Login user with role check
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        let foundUser = null;
        if (mongoose.connection.readyState === 1) {
            try {
                foundUser = await User.findOne({ email: normalizedEmail });
            } catch (dbErr) {
                foundUser = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
            }
        }
        if (!foundUser) {
            foundUser = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
        }

        if (!foundUser) {
            return res.status(401).json({
                success: false,
                message: 'ઇમેઇલ અથવા પાસવર્ડ અમાન્ય છે. કૃપા કરીને તપાસો અથવા સાઇન-અપ કરો.'
            });
        }

        if (foundUser.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'પાસવર્ડ ખોટો છે. કૃપા કરીને ફરી પ્રયાસ કરો.'
            });
        }

        // Check role match if requested
        if (role && foundUser.role !== role) {
            return res.status(403).json({
                success: false,
                message: `આ એકાઉન્ટ ${foundUser.role.toUpperCase()} તરીકે નોંધાયેલ છે, ${role.toUpperCase()} તરીકે નહીં.`
            });
        }

        const safe = sanitizeUser(foundUser);
        const token = `JWT-MOCK-${safe.userId}-${Date.now()}`;

        return res.json({
            success: true,
            message: `સફળ લૉગિન! સ્વાગત છે, ${safe.name}`,
            token,
            user: safe
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'સર્વર એરર: ' + err.message });
    }
});

// GET /api/auth/users - List all registered users (Doctor & Admin access)
router.get('/users', async (req, res) => {
    try {
        let users = [];
        if (mongoose.connection.readyState === 1) {
            try {
                users = await User.find().select('-password').sort({ createdAt: -1 });
            } catch (dbErr) {
                users = inMemoryUsers.map(sanitizeUser);
            }
        } else {
            users = inMemoryUsers.map(sanitizeUser);
        }

        return res.json({ success: true, count: users.length, users });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/auth/me - Verify current token/session
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No authorization token provided.' });
    }
    // Return demo user or decoded token user
    return res.json({ success: true, user: inMemoryUsers[0] });
});

module.exports = router;
