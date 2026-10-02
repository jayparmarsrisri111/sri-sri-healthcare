const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    medicineId: { type: String, required: true, unique: true },
    brandName: { type: String, required: true },
    genericName: { type: String, required: true },
    desiAyurvedicName: { type: String },
    category: { type: String },
    diseaseUsedFor: { type: String },
    marketPrice: { type: Number, required: true },
    janAushadhiPrice: { type: Number, required: true },
    savingsPercentage: { type: String },
    howToTakeAllopathic: { type: String },
    howToTakeAyurvedic: { type: String },
    naturalCure: { type: String },
    precautions: { type: String },
    inStock: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medicine', MedicineSchema);
