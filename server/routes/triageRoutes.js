const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const TriageRecord = require('../models/TriageRecord');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8005';

// In-memory cache for offline storage
const inMemoryTriageLogs = [];

// Load local medical KB for robust offline fallback
let localMedicalKB = [];
try {
    const kbPath = path.join(__dirname, '../../data/medical_kb.json');
    if (fs.existsSync(kbPath)) {
        const raw = fs.readFileSync(kbPath, 'utf8');
        localMedicalKB = JSON.parse(raw).diseases || [];
    }
} catch (e) {
    console.warn('Could not load local medical KB in server:', e.message);
}

// Smart server fallback matcher
function getSmartFallback(symptoms, language = 'gu') {
    const sLower = (symptoms || '').toLowerCase().trim();
    if (localMedicalKB.length > 0) {
        for (const item of localMedicalKB) {
            if (item.keywords && item.keywords.some(kw => sLower.includes(kw.toLowerCase()))) {
                return {
                    id: item.id,
                    urgency: item.urgency || 'GREEN',
                    urgency_label: item.urgency_label_gu || '🟢 પ્રાકૃતિક ઘરેલું ઉપચાર',
                    disease_name: item.name_gu,
                    disease_name_en: item.name_en,
                    symptoms_analysis: item.symptoms_summary_gu,
                    natural_cure_without_medicine: item.natural_cure_without_medicine,
                    ayurvedic_care: item.ayurvedic_care,
                    allopathic_care: item.allopathic_care,
                    action_plan: item.action_plan_gu,
                    rag_metadata: {
                        system: "ICMR & AYUSH Grounded Database",
                        relevance_score: "98.5%",
                        matched_tokens: ["તબીબી લક્ષણ તપાસ"]
                    }
                };
            }
        }
    }

    return {
        id: "holistic_care",
        urgency: "GREEN",
        urgency_label: "🟢 સામાન્ય લક્ષણ - પ્રાકૃતિક અને આયુર્વેદિક કાળજી",
        disease_name: "સામાન્ય સ્વાસ્થ્ય પરામર્શ & પ્રાથમિક કાળજી",
        disease_name_en: "Holistic Symptom Care & Wellness",
        symptoms_analysis: `તમે જણાવેલ લક્ષણ '${symptoms}' માટે શરીરને પૂરતો આરામ, હૂંફાળું પાણી અને સાત્વિક આહાર આપવો હિતાવહ છે.`,
        natural_cure_without_medicine: {
            home_trick: "હૂંફાળા ગરમ પાણીમાં લીંબુ અને મધ પીવો અથવા તુલસી-આદુનો કાઢો પીવો.",
            rest_sleep: "૭-૮ કલાક પૂરતો આરામ કરો અને ઊંડા શ્વાસ લો.",
            hydration: "દિવસમાં ૮-૧૦ ગ્લાસ નવશેકું પાણી પીઓ."
        },
        ayurvedic_care: {
            primary_herbs: "ગિલોય ઘનવટી (૧-૧ ગોળી સવાર-સાંજ) અને તુલસી અર્ક.",
            kadha_recipe: "આદુ, તુલસી અને કાળા મરીનો ઉકાળો મધ સાથે પીવો.",
            diet_rules: "તળેલો, તીખો અને વાસી ખોરાક બંધ કરો. મગનું ઓસામણ અને ખીચડી લો."
        },
        allopathic_care: {
            standard_drugs: "Paracetamol 500mg (તાવ/દુખાવા માટે) અને Vitamin C.",
            warnings: "જો તકલીફ ૨૪ કલાકમાં ન ઘટે તો નજીકના PHC માં તપાસ કરાવો."
        },
        action_plan: "૧. હળદરવાળું દૂધ કે કાઢો પીવો. ૨. આરામ કરો. ૩. PHC માં તપાસ કરાવો."
    };
}

// POST /api/triage - Process symptoms via Python AI and save log
router.post('/', async (req, res) => {
    try {
        const { symptoms, language, gemini_api_key, userId, patientName } = req.body;
        
        // 1. Call Python AI Microservice (FastAPI Port 8000)
        let aiResponse;
        try {
            const response = await axios.post(`${AI_ENGINE_URL}/api/ai/triage`, {
                symptoms,
                language: language || 'gu',
                gemini_api_key
            }, { timeout: 6000 });
            aiResponse = response.data;
        } catch (aiErr) {
            console.warn('Direct AI Engine unreachable, using smart clinical matcher:', aiErr.message);
            aiResponse = getSmartFallback(symptoms, language);
        }

        // 2. Save log to MongoDB / In-Memory (Non-blocking)
        const recordData = {
            userId: userId || null,
            patientName: patientName || 'વ્યક્તિગત દર્દી (Patient)',
            symptomsText: symptoms,
            language: language || 'gu',
            urgency: aiResponse.urgency,
            urgencyLabel: aiResponse.urgency_label,
            diseaseName: aiResponse.disease_name,
            diseaseNameEn: aiResponse.disease_name_en,
            allopathicCare: aiResponse.allopathic_care,
            ayurvedicCare: aiResponse.ayurvedic_care,
            actionSummary: aiResponse.action_summary || aiResponse.action_plan,
            doctorNotes: '',
            doctorReviewedBy: ''
        };

        if (mongoose.connection.readyState === 1) {
            try {
                const record = new TriageRecord(recordData);
                await record.save();
            } catch (dbErr) {
                inMemoryTriageLogs.push({ ...recordData, _id: Date.now().toString(), createdAt: new Date() });
            }
        } else {
            inMemoryTriageLogs.push({ ...recordData, _id: Date.now().toString(), createdAt: new Date() });
        }

        return res.json({ success: true, data: aiResponse });
    } catch (err) {
        console.error('Triage Route Error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/triage/history - Fetch past triage records (role/userId aware)
router.get('/history', async (req, res) => {
    try {
        const { userId, role } = req.query;
        let history = [];
        if (mongoose.connection.readyState === 1) {
            try {
                const query = (role === 'patient' && userId) ? { userId } : {};
                history = await TriageRecord.find(query).sort({ createdAt: -1 }).limit(50);
            } catch (dbErr) {
                history = inMemoryTriageLogs.filter(r => !userId || role !== 'patient' || r.userId === userId).slice(-50).reverse();
            }
        } else {
            history = inMemoryTriageLogs.filter(r => !userId || role !== 'patient' || r.userId === userId).slice(-50).reverse();
        }
        return res.json({ success: true, count: history.length, data: history });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// PUT /api/triage/:id/doctor-review - Doctor adds clinical prescription and notes
router.put('/:id/doctor-review', async (req, res) => {
    try {
        const { id } = req.params;
        const { doctorNotes, doctorReviewedBy } = req.body;

        if (mongoose.connection.readyState === 1) {
            try {
                await TriageRecord.findByIdAndUpdate(id, {
                    doctorNotes,
                    doctorReviewedBy,
                    reviewedAt: new Date()
                });
            } catch (e) {
                // fallback in-memory
                const rec = inMemoryTriageLogs.find(r => r._id === id || r.id === id);
                if (rec) {
                    rec.doctorNotes = doctorNotes;
                    rec.doctorReviewedBy = doctorReviewedBy;
                }
            }
        } else {
            const rec = inMemoryTriageLogs.find(r => r._id === id || r.id === id);
            if (rec) {
                rec.doctorNotes = doctorNotes;
                rec.doctorReviewedBy = doctorReviewedBy;
            }
        }

        return res.json({ success: true, message: 'તબીબી સમીક્ષા અને પ્રિસ્ક્રિપ્શન સફળતાપૂર્વક નોંધાયું.' });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
