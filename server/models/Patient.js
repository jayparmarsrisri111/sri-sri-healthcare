const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    village: { type: String, default: 'ભુજ ગ્રામીણ' },
    district: { type: String, default: 'કચ્છ (Kutch)' },
    phone: { type: String },
    ashaWorkerId: { type: String },
    triageHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TriageRecord' }],
    vitalsLogs: [{
        heartRateBpm: Number,
        respirationRate: Number,
        stressIndex: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);
