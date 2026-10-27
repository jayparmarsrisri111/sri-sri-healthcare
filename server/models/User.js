const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    phone: { type: String, default: '' },
    // Patient specific fields
    age: { type: Number, default: 35 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    village: { type: String, default: 'ભુજ ગ્રામીણ' },
    district: { type: String, default: 'કચ્છ (Kutch)' },
    bloodGroup: { type: String, default: 'B+' },
    emergencyContact: { type: String, default: '108' },
    // Doctor specific fields
    specialization: { type: String, default: 'જનરલ મેડિસિન (General Medicine)' },
    regNumber: { type: String, default: '' },
    qualification: { type: String, default: 'MBBS, MD' },
    councilName: { type: String, default: 'Gujarat Medical Council (GMC)' },
    hospitalAffiliation: { type: String, default: 'GK જનરલ સિવિલ હોસ્પિટલ, ભુજ' },
    certificateImage: { type: String, default: '' },
    doctorVerified: { type: Boolean, default: false },
    certificateVerified: { type: Boolean, default: false },
    // Admin specific fields
    adminBadge: { type: String, default: 'DISTRICT-HEALTH-OFFICER' },
    department: { type: String, default: 'ગુજરાત આરોગ્ય કમિશનરેટ (Dept of Health)' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
