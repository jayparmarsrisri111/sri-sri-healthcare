const mongoose = require('mongoose');

const TriageRecordSchema = new mongoose.Schema({
    patientName: { type: String, default: 'Anonymous Rural Patient' },
    language: { type: String, default: 'gu' },
    symptomsText: { type: String, required: true },
    urgency: { type: String, enum: ['RED', 'YELLOW', 'GREEN'], default: 'YELLOW' },
    urgencyLabel: { type: String },
    diseaseName: { type: String },
    diseaseNameEn: { type: String },
    allopathicCare: { type: Object },
    ayurvedicCare: { type: Object },
    actionSummary: { type: String },
    userId: { type: String },
    doctorNotes: { type: String, default: '' },
    doctorReviewedBy: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TriageRecord', TriageRecordSchema);
