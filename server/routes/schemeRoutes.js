const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8005';

const loadLocalMeds = () => {
    try {
        const filePath = path.join(__dirname, '..', '..', 'data', 'generic_medicines.json');
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    } catch (e) {}
    return { medicines: [], government_schemes: [] };
};

// GET /api/schemes/medicines
router.get('/medicines', async (req, res) => {
    try {
        const { query } = req.query;
        try {
            const response = await axios.get(`${AI_ENGINE_URL}/api/ai/medicines`, {
                params: { query }
            });
            return res.json({ success: true, data: response.data });
        } catch (aiErr) {
            const data = loadLocalMeds();
            return res.json({ success: true, data: { medicines: data.medicines, schemes: data.government_schemes } });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
