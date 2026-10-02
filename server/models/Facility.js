const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema({
    facilityId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['PHC', 'CHC', 'Civil Hospital', 'Sub-Center'], default: 'PHC' },
    district: { type: String, required: true },
    taluka: { type: String },
    locationCoordinates: {
        lat: Number,
        lng: Number
    },
    totalBeds: { type: Number, default: 10 },
    availableBeds: { type: Number, default: 6 },
    icuBeds: { type: Number, default: 0 },
    hasAmbulance108: { type: Boolean, default: true },
    doctorOnDuty: { type: String },
    doctorTimings: { type: String },
    contactPhone: { type: String },
    emergencyHotline: { type: String, default: "108" },
    availableMedicines: [String],
    isAyushmanEmpanelled: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Facility', FacilitySchema);
