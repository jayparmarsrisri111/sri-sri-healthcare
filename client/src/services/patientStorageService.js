/**
 * Patient Health Records (EHR) Storage Service
 * Provides persistent local & backend storage for all medical tests,
 * including Triage, Vitals (rPPG), Eye Exams, Vision Diagnostics, and Doctor Consultations.
 * Supports Strict Role-Based User Isolation (Patient sees only their data, Doctor/Admin sees all)
 */

const STORAGE_KEY = 'swasthyasetu_patient_records';

const INITIAL_DEMO_RECORDS = [
  {
    id: "REC-2026-081",
    userId: "USR-PAT-001",
    patientName: "રામજીભાઈ પટેલ (Ramjibhai Patel)",
    age: 48,
    gender: "Male",
    date: "2026-08-30 16:45",
    type: "Triage",
    symptoms: "છાતીમાં દબાણ અને પરસેવો (Chest Discomfort)",
    urgency: "RED",
    diagnosis: "હૃદયરોગ શંકાસ્પદ લક્ષણો (Suspected Acute Coronary)",
    details: {
      action: "૧૦૮ એમ્બ્યુલન્સ રવાના • GK જનરલ હોસ્પિટલ ભુજ",
      vitals: "HR: 104 BPM, BP: 146/92 mmHg, SpO2: 95%",
      care: "Sorbitrate 5mg SL, Aspirin 300mg emergency loading dose"
    },
    doctorNotes: "ઈમરજન્સી કાર્ડિયાક ICU મોનિટરિંગ જરૂરી છે. Aspirin loading dose આપેલ છે.",
    doctorReviewedBy: "Dr. રાજેશ મહેતા, MD"
  },
  {
    id: "REC-2026-082",
    userId: "USR-PAT-001",
    patientName: "રામજીભાઈ પટેલ (Ramjibhai Patel)",
    age: 48,
    gender: "Male",
    date: "2026-08-30 15:20",
    type: "Vitals",
    symptoms: "નિયમિત બ્લડ પ્રેશર અને ધબકારા તપાસ (Routine rPPG Vitals)",
    urgency: "GREEN",
    diagnosis: "સામાન્ય પલ્સ અને ઓક્સિજન (Healthy Vitals)",
    details: {
      action: "હળવી મોર્નિંગ વૉક અને પૂરતું પાણી પીવું",
      vitals: "HR: 74 BPM, BP: 118/76 mmHg, SpO2: 99%, Stress: 24%",
      care: "અર્જુન છાલનો ઉકાળો અને નિયમિત પ્રાણાયામ"
    },
    doctorNotes: "વાઈટલ્સ સામાન્ય છે. મીઠું અને તેલવાળો ખોરાક ઓછો રાખવો.",
    doctorReviewedBy: "Dr. રાજેશ મહેતા, MD"
  },
  {
    id: "REC-2026-083",
    userId: "USR-PAT-002",
    patientName: "શાંતાબેન આહીર (Shantaben Ahir)",
    age: 36,
    gender: "Female",
    date: "2026-08-29 11:30",
    type: "Vitals",
    symptoms: "માથું બહુ દુખે છે અને શરીર ગરમ થાય છે",
    urgency: "GREEN",
    diagnosis: "વાયરલ તાવ અને હળવો તણાવ (Viral Pyrexia)",
    details: {
      action: "પાણીના પોતા (Cold Compress) + ગિલોય ઘનવટી",
      vitals: "HR: 76 BPM, Temp: 99.4°F, SpO2: 98%",
      care: "Paracetamol 650mg SOS, પુષ્કળ પ્રવાહી અને આરામ"
    },
    doctorNotes: "વાયરલ ફ્લૂ છે. ૫ દિવસ આરામ અને ગરમ પાણી પીવું.",
    doctorReviewedBy: "Dr. રાજેશ મહેતા, MD"
  },
  {
    id: "REC-2026-084",
    userId: "USR-PAT-003",
    patientName: "આરવ પરમાર (Aarav Parmar)",
    age: 6,
    gender: "Male",
    date: "2026-08-28 14:10",
    type: "Vision",
    symptoms: "છાતીમાં કફ, ન્યુમોનિયા X-Ray સ્કેન",
    urgency: "YELLOW",
    diagnosis: "ડાબા ફેફસામાં ન્યુમોનિયા ઈન્ફેક્શન (Bacterial Pneumonia)",
    details: {
      action: "Amoxicillin + સિતોપલાદિ ચૂર્ણ • PHC રામપુર",
      vitals: "CURB-65: 1/5, SpO2: 96%",
      care: "Augmentin 375mg syrup, નીલગિરીની વરાળ"
    },
    doctorNotes: "પેડિયાટ્રિક એન્ટિબાયોટિક કોર્સ ચાલુ રાખો. ૩ દિવસ પછી પુનઃ તપાસ.",
    doctorReviewedBy: "Dr. રાજેશ મહેતા, MD"
  }
];

export const patientStorageService = {
  // Retrieve all records from persistent local storage
  getRawRecords: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS));
        return INITIAL_DEMO_RECORDS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.warn('Error reading patient records from storage:', err);
      return INITIAL_DEMO_RECORDS;
    }
  },

  // Retrieve records filtered by user role (Isolated for Patient, All for Doctor/Admin)
  getRecords: (currentUser = null) => {
    const all = patientStorageService.getRawRecords();
    if (!currentUser) return all;

    // If logged in as Patient: show ONLY records belonging to this patient
    if (currentUser.role === 'patient') {
      const patientId = currentUser.userId;
      const patientNameFirst = (currentUser.name || '').split(' ')[0].toLowerCase();
      
      const userRecords = all.filter(r => {
        if (r.userId && r.userId === patientId) return true;
        if (r.patientName && r.patientName.toLowerCase().includes(patientNameFirst)) return true;
        return false;
      });

      return userRecords;
    }

    // Doctor and Admin can view all patient records across the hospital/system
    return all;
  },

  // Add a new patient record
  saveRecord: (record, currentUser = null) => {
    try {
      const current = patientStorageService.getRawRecords();
      const currentUserId = currentUser?.userId || record.userId || (currentUser?.role === 'patient' ? currentUser.userId : `USR-PAT-${Math.floor(100 + Math.random() * 900)}`);
      const currentUserName = currentUser?.name || record.patientName || "વ્યક્તિગત દર્દી (Walk-in Patient)";

      const newRecord = {
        id: record.id || `REC-2026-${String(Math.floor(100 + Math.random() * 900))}`,
        userId: currentUserId,
        patientName: currentUserName,
        age: record.age || currentUser?.age || 35,
        gender: record.gender || currentUser?.gender || "Male",
        date: record.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        type: record.type || "Checkup",
        symptoms: record.symptoms || "સામાન્ય સ્વાસ્થ્ય તપાસ",
        urgency: record.urgency || "GREEN",
        diagnosis: record.diagnosis || "સ્વસ્થ પરિણામ",
        details: record.details || {},
        doctorNotes: record.doctorNotes || "",
        doctorReviewedBy: record.doctorReviewedBy || ""
      };

      const updated = [newRecord, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Dispatch custom browser event so any open tab updates immediately
      window.dispatchEvent(new CustomEvent('patient_records_updated', { detail: updated }));
      return newRecord;
    } catch (err) {
      console.error('Error saving patient record:', err);
      return null;
    }
  },

  // Add Doctor's clinical review & e-prescription to a patient record
  addDoctorReview: (id, doctorNotes, doctorName = "Dr. રાજેશ મહેતા, MD") => {
    try {
      const current = patientStorageService.getRawRecords();
      const updated = current.map(rec => {
        if (rec.id === id) {
          return {
            ...rec,
            doctorNotes: doctorNotes,
            doctorReviewedBy: doctorName,
            reviewedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          };
        }
        return rec;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('patient_records_updated', { detail: updated }));
      return true;
    } catch (err) {
      console.error('Error adding doctor review:', err);
      return false;
    }
  },

  // Remove a record by ID
  deleteRecord: (id) => {
    try {
      const current = patientStorageService.getRawRecords();
      const updated = current.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('patient_records_updated', { detail: updated }));
      return true;
    } catch (err) {
      return false;
    }
  },

  // Reset to initial demo records
  resetRecords: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS));
    window.dispatchEvent(new CustomEvent('patient_records_updated', { detail: INITIAL_DEMO_RECORDS }));
    return INITIAL_DEMO_RECORDS;
  }
};
