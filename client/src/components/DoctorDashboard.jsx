import React, { useState, useEffect } from 'react';
import {
  Stethoscope, Users, AlertTriangle, CheckCircle2, Clock,
  FileText, Search, Pill, PhoneCall, ShieldCheck, Award,
  Sparkles, HeartPulse, Send, Edit3, Eye, Printer, Activity
} from 'lucide-react';
import { patientStorageService } from '../services/patientStorageService';
import { apiService } from '../services/api';
import { DigitalPrescriptionModal } from './DigitalPrescriptionModal';

export const DoctorDashboard = ({ currentUser, currentLang = 'gu', onSelectPatient }) => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [selectedRecordForReview, setSelectedRecordForReview] = useState(null);
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState(null);
  const [doctorNoteInput, setDoctorNoteInput] = useState('');
  const [prescribedMedicine, setPrescribedMedicine] = useState('');
  const [saveToast, setSaveToast] = useState(null);

  const loadAllPatientRecords = () => {
    // Doctors have clearance to see all patient records
    const all = patientStorageService.getRawRecords();
    setRecords(all);
  };

  useEffect(() => {
    loadAllPatientRecords();
    const handleUpdate = () => loadAllPatientRecords();
    window.addEventListener('patient_records_updated', handleUpdate);
    return () => window.removeEventListener('patient_records_updated', handleUpdate);
  }, []);

  const filteredRecords = records.filter(r => {
    const matchesSearch =
      (r.patientName && r.patientName.toLowerCase().includes(search.toLowerCase())) ||
      (r.diagnosis && r.diagnosis.toLowerCase().includes(search.toLowerCase())) ||
      (r.symptoms && r.symptoms.toLowerCase().includes(search.toLowerCase()));

    const matchesUrgency = filterUrgency === 'ALL' || r.urgency === filterUrgency;
    return matchesSearch && matchesUrgency;
  });

  const redCount = records.filter(r => r.urgency === 'RED').length;
  const yellowCount = records.filter(r => r.urgency === 'YELLOW').length;
  const greenCount = records.filter(r => r.urgency === 'GREEN').length;

  const handleOpenReview = (rec) => {
    setSelectedRecordForReview(rec);
    setDoctorNoteInput(rec.doctorNotes || '');
    setPrescribedMedicine('');
  };

  const handleSaveReview = () => {
    if (!selectedRecordForReview) return;
    const finalNote = doctorNoteInput + (prescribedMedicine ? ` | પ્રિસ્ક્રિપ્શન: ${prescribedMedicine}` : '');
    patientStorageService.addDoctorReview(
      selectedRecordForReview.id,
      finalNote,
      currentUser?.name || "Dr. રાજેશ મહેતા, MD"
    );

    // AI CONTINUOUS TRAINING FEEDBACK: Send doctor-verified clinical truth to AI engine
    try {
      apiService.submitTrainingFeedback(
        selectedRecordForReview.symptoms || selectedRecordForReview.diagnosis || 'Clinical Case',
        {
          disease_name: selectedRecordForReview.diagnosis,
          urgency: selectedRecordForReview.urgency,
          allopathic_care: { standard_drugs: prescribedMedicine || 'Doctor Approved Medicine' },
          natural_cure_without_medicine: { doctor_guidance: doctorNoteInput }
        },
        'doctor_correction',
        {
          doctor_name: currentUser?.name || 'Dr. રાજેશ મહેતા, MD',
          specialization: currentUser?.specialization || 'General Physician',
          clinical_notes: doctorNoteInput,
          rx_prescribed: prescribedMedicine,
          accuracy_boost: '100% Doctor Verified Clinical Ground Truth'
        }
      );
    } catch (e) {
      console.warn('Doctor training feedback error:', e);
    }

    setSaveToast(`✅ કેસ ${selectedRecordForReview.id} માટે ડૉક્ટરનું પ્રિસ્ક્રિપ્શન સાચવવામાં આવ્યું અને AI એ ડૉક્ટરના જ્ઞાનમાંથી તાલીમ (Continuous Training) મેળવી લીધી!`);
    setSelectedRecordForReview(null);
    setTimeout(() => setSaveToast(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Doctor Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1128 0%, #0369A1 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 10px 25px -5px rgba(3, 105, 161, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            border: '1.5px solid rgba(255, 255, 255, 0.3)'
          }}>
            👨‍⚕️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>
                {currentUser?.name || 'Dr. રાજેશ મહેતા, MD'}
              </h2>
              <span style={{
                background: '#00C48C',
                color: '#0A1128',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                🟢 ઓન-ડ્યુટી
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', opacity: 0.85, fontSize: '13px' }}>
              {currentUser?.specialization || 'મુખ્ય જનરલ ફિઝિશિયન & કાર્ડિયોલોજિસ્ટ'} • {currentUser?.hospitalAffiliation || 'GK જનરલ સિવિલ હોસ્પિટલ, ભુજ'}
            </p>
            <p style={{ margin: '2px 0 0 0', opacity: 0.7, fontSize: '11px' }}>
              મેડિકલ કાઉન્સિલ રજી. નં: {currentUser?.regNumber || 'GMC-GUJ-2014-9842'}
            </p>
          </div>
        </div>

        {/* Doctor Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '10px 16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8' }}>{records.length}</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>કુલ દર્દીઓ</div>
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            padding: '10px 16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.4)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#FCA5A5' }}>{redCount}</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>ઈમરજન્સી કેસ</div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {saveToast && (
        <div style={{
          background: '#F0FDF4',
          border: '1.5px solid #86EFAC',
          padding: '14px 18px',
          borderRadius: '14px',
          color: '#166534',
          fontWeight: 700,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} color="#166534" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Clinical Review Triage Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '1.5px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 250px' }}>
          <Search size={18} color="#64748B" />
          <input
            type="text"
            placeholder="દર્દીનું નામ, રોગ અથવા લક્ષણ શોધો..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1.5px solid #CBD5E1',
              borderRadius: '10px',
              outline: 'none',
              fontSize: '13px'
            }}
          />
        </div>

        {/* Urgency Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterUrgency('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: 'none',
              background: filterUrgency === 'ALL' ? '#0A1128' : '#F1F5F9',
              color: filterUrgency === 'ALL' ? '#FFFFFF' : '#475569',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            બધા દર્દી ({records.length})
          </button>
          <button
            onClick={() => setFilterUrgency('RED')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: 'none',
              background: filterUrgency === 'RED' ? '#EF4444' : '#FEE2E2',
              color: filterUrgency === 'RED' ? '#FFFFFF' : '#991B1B',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🚨 ૧૦૮ ઈમરજન્સી ({redCount})
          </button>
          <button
            onClick={() => setFilterUrgency('YELLOW')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: 'none',
              background: filterUrgency === 'YELLOW' ? '#F59E0B' : '#FEF3C7',
              color: filterUrgency === 'YELLOW' ? '#FFFFFF' : '#92400E',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ⚠️ મધ્યમ ({yellowCount})
          </button>
          <button
            onClick={() => setFilterUrgency('GREEN')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: 'none',
              background: filterUrgency === 'GREEN' ? '#00C48C' : '#E6F9F3',
              color: filterUrgency === 'GREEN' ? '#FFFFFF' : '#065F46',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🟢 સામાન્ય ({greenCount})
          </button>
        </div>
      </div>

      {/* Patient Consultation Grid */}
      <div className="doctor-patient-grid">
        {filteredRecords.map((rec) => {
          const isRed = rec.urgency === 'RED';
          const isYellow = rec.urgency === 'YELLOW';
          const badgeBg = isRed ? '#FEE2E2' : isYellow ? '#FEF3C7' : '#E6F9F3';
          const badgeColor = isRed ? '#991B1B' : isYellow ? '#92400E' : '#065F46';

          return (
            <div
              key={rec.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px',
                border: isRed ? '2px solid #EF4444' : '1.5px solid #E2E8F0',
                boxShadow: isRed ? '0 8px 20px rgba(239, 68, 68, 0.15)' : '0 4px 12px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>{rec.id} • {rec.date}</span>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                      {rec.patientName}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      {rec.age} વર્ષ • {rec.gender} • પ્રકાર: {rec.type}
                    </div>
                  </div>
                  <span style={{
                    background: badgeBg,
                    color: badgeColor,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '11px'
                  }}>
                    {rec.urgency}
                  </span>
                </div>

                {/* Symptoms & Diagnosis */}
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  marginTop: '10px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                    🩺 લક્ષણો: <span style={{ fontWeight: 500, color: '#475569' }}>{rec.symptoms}</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7' }}>
                    🔍 AI ડાયગ્નોસિસ: <span style={{ fontWeight: 600 }}>{rec.diagnosis}</span>
                  </div>
                </div>

                {/* Doctor Note Tag if already reviewed */}
                {rec.doctorNotes && (
                  <div style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    fontSize: '11px',
                    color: '#166534'
                  }}>
                    <strong>👨‍⚕️ ડોક્ટર સલાહ ({rec.doctorReviewedBy || 'Verified'}):</strong> {rec.doctorNotes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                <button
                  onClick={() => handleOpenReview(rec)}
                  style={{
                    flex: 1,
                    background: '#0284C7',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit3 size={14} />
                  <span>{rec.doctorNotes ? 'સમીક્ષા સુધારો' : 'તબીબી સમીક્ષા & દવા લખો'}</span>
                </button>

                <button
                  onClick={() => setSelectedRecordForPrint(rec)}
                  style={{
                    background: '#F0FDF4',
                    color: '#166534',
                    border: '1.5px solid #86EFAC',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  title="NMC સત્તાવાર પ્રિસ્ક્રિપ્શન સ્લિપ"
                >
                  <Printer size={14} />
                  <span>NMC સ્લિપ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Doctor Review / Prescription Modal */}
      {selectedRecordForReview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1.5px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0F172A', fontSize: '18px', fontWeight: 800 }}>
                  👨‍⚕️ તબીબી પ્રિસ્ક્રિપ્શન & માર્ગદર્શન
                </h3>
                <p style={{ margin: '2px 0 0 0', color: '#64748B', fontSize: '12px' }}>
                  દર્દી: <strong>{selectedRecordForReview.patientName}</strong> ({selectedRecordForReview.id})
                </p>
              </div>
              <button
                onClick={() => setSelectedRecordForReview(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div><strong>રોગ:</strong> {selectedRecordForReview.diagnosis}</div>
              <div style={{ marginTop: '4px' }}><strong>લક્ષણો:</strong> {selectedRecordForReview.symptoms}</div>
            </div>

            {/* Doctor Note */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                તબીબી સલાહ & આહાર નિયમ (Doctor's Clinical Notes)
              </label>
              <textarea
                rows={3}
                placeholder="દા.ત. ૫ દિવસ આરામ, હળવો ખોરાક અને પરેજી પાળવી..."
                value={doctorNoteInput}
                onChange={(e) => setDoctorNoteInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Generic Medicine Prescription */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                જન ઔષધિ જેનરિક દવા પ્રિસ્ક્રિપ્શન (Prescribed Medicines)
              </label>
              <input
                type="text"
                placeholder="દા.ત. Paracetamol 650mg (1-0-1), Cetirizine 10mg (0-0-1)"
                value={prescribedMedicine}
                onChange={(e) => setPrescribedMedicine(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSelectedRecordForReview(null)}
                style={{
                  flex: 1,
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                રદ કરો
              </button>
              <button
                onClick={handleSaveReview}
                style={{
                  flex: 2,
                  background: '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                }}
              >
                💾 પ્રિસ્ક્રિપ્શન સાચવો & દર્દીને મોકલો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital NMC Verified Prescription Modal */}
      <DigitalPrescriptionModal
        isOpen={Boolean(selectedRecordForPrint)}
        onClose={() => setSelectedRecordForPrint(null)}
        record={selectedRecordForPrint}
        doctorInfo={currentUser}
        currentLang={currentLang}
      />
    </div>
  );
};
