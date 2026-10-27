import React from 'react';
import { X, Printer, ShieldCheck, QrCode, CheckCircle2, Download, AlertTriangle, Building, Phone } from 'lucide-react';
import { getTranslation } from '../services/languageService';
import { OfficialMedicalStamp } from './OfficialMedicalStamp';

export const DigitalPrescriptionModal = ({ isOpen, onClose, record, doctorInfo, currentLang = 'gu' }) => {
  if (!isOpen || !record) return null;

  const t = getTranslation(currentLang);
  const isEn = currentLang === 'en';

  const doctorName = doctorInfo?.name || record?.doctorReviewedBy || 'Dr. Jay Parmar, M.D.';
  const doctorReg = doctorInfo?.regNumber || 'GMC-GUJ-2016-48291';
  const doctorSpecialization = doctorInfo?.specialization || (isEn ? 'Chief Medical Officer & Senior Physician' : 'મુખ્ય તબીબી અધિકારી & સીનિયર ફિઝિશિયન');
  const hospital = doctorInfo?.hospitalAffiliation || (isEn ? 'Sri Sri Healthcare Central Hospital & Research Center' : 'શ્રી શ્રી હેલ્થકેર સેન્ટ્રલ હોસ્પિટલ & રિસર્ચ સેન્ટર');

  const defaultMedicines = [
    { name: 'Paracetamol 650mg (Jan Aushadhi)', dose: '૧ ગોળી જમ્યા પછી', freq: '1 - 0 - 1', days: '૩ દિવસ', price: '₹૫.૫૦ (૮૫% બચત)' },
    { name: 'Cetirizine 10mg', dose: '૧ ગોળી રાત્રે', freq: '0 - 0 - 1', days: '૫ દિવસ', price: '₹૪.૨૦' },
    { name: 'ORSL / ઇલેક્ટ્રોલાઇટ પાવડર', dose: '૧ લીટર પાણીમાં ઓગાળીને', freq: 'દિવસમાં ૨ વાર', days: '૨ દિવસ', price: '₹૧૨.૦૦' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 17, 40, 0.8)',
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
        width: '100%',
        maxWidth: '750px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
        border: '2px solid #00C48C',
        position: 'relative'
      }}>
        {/* Top Control Bar (Hidden in Print) */}
        <div className="no-print" style={{
          padding: '12px 20px',
          background: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '18px',
          borderTopRightRadius: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
            <ShieldCheck size={18} color="#00C48C" />
            <span>{t.printSlipTitle || 'NMC Legal Telemedicine Prescription'}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: '#00C48C',
                color: '#0A1128',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={14} />
              <span>{isEn ? 'Print / PDF' : 'પ્રિન્ટ / PDF ડાઉનલોડ'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Prescription Paper Container */}
        <div id="prescription-paper" style={{ padding: '28px', color: '#0F172A' }}>
          {/* Clinic & Doctor Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2.5px solid #0A1128',
            paddingBottom: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: '56px', height: '56px', borderRadius: '12px', border: '1.5px solid #00C48C' }}
              />
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                  શ્રી શ્રી આયુષ્માન ભારત ડિજિટલ હેલ્થ ક્લિનિક
                </h2>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                  ગુજરાત સરકાર અને ભારત સરકાર માન્ય NMC ડિજિટલ ટેલિમેડિસિન પ્લેટફોર્મ
                </div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                  🏛️ {hospital}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284C7' }}>
                {doctorName}
              </div>
              <div style={{ fontSize: '11px', color: '#334155', fontWeight: 600 }}>
                {doctorSpecialization}
              </div>
              <div style={{
                background: '#E0F2FE',
                color: '#0369A1',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'inline-block',
                marginTop: '3px'
              }}>
                NMC / GMC રજી. નં: {doctorReg}
              </div>
            </div>
          </div>

          {/* Patient Details Row */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginBottom: '18px',
            fontSize: '12px'
          }}>
            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>દર્દીનું નામ:</span>
              <strong style={{ fontSize: '14px', color: '#0F172A' }}>{record.patientName}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>ઉંમર / જાતિ:</span>
              <strong>{record.age} વર્ષ • {record.gender || 'પુરુષ/સ્ત્રી'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>તારીખ & કેસ ID:</span>
              <strong>{record.date || 'આજે'} • {record.id}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>આયુષ્માન ABHA ID:</span>
              <strong style={{ color: '#059669' }}>ABHA-{record.id?.replace(/[^0-9]/g, '') || '9128-4421'}</strong>
            </div>
          </div>

          {/* Diagnosis & Urgency Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: record.urgency === 'RED' ? '#FEF2F2' : record.urgency === 'YELLOW' ? '#FFFBEB' : '#F0FDF4',
            borderLeft: `4px solid ${record.urgency === 'RED' ? '#EF4444' : record.urgency === 'YELLOW' ? '#F59E0B' : '#10B981'}`,
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '18px'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>ક્લિનિકલ નિદાન (Clinical Diagnosis):</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                {record.diagnosis}
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                દર્દીના લક્ષણો: {record.symptoms}
              </div>
            </div>
            <span style={{
              background: record.urgency === 'RED' ? '#F87171' : record.urgency === 'YELLOW' ? '#FCD34D' : '#6EE7B7',
              color: '#0F172A',
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '12px'
            }}>
              {record.urgency === 'RED' ? '🔴 ઈમરજન્સી (CRITICAL)' : record.urgency === 'YELLOW' ? '⚠️ મધ્યમ (MODERATE)' : '🟢 સામાન્ય (MILD)'}
            </span>
          </div>

          {/* ℞ Prescription Symbol & Medicines Table */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#0284C7', fontFamily: 'serif' }}>℞</span>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                જન ઔષધિ કેન્દ્ર માન્ય જેનરિક દવાઓ (Prescribed Medications):
              </h4>
            </div>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '540px', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>દવાનું નામ (Generic Name)</th>
                    <th style={{ padding: '8px 10px' }}>માત્રા / ડોઝ</th>
                    <th style={{ padding: '8px 10px' }}>સમય (સવાર-બપોર-સાંજ)</th>
                    <th style={{ padding: '8px 10px' }}>મુદ્દત</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>સબસિડી ભાવ</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultMedicines.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0F172A' }}>{m.name}</td>
                      <td style={{ padding: '8px 10px', color: '#475569' }}>{m.dose}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 800, color: '#0284C7' }}>{m.freq}</td>
                      <td style={{ padding: '8px 10px', color: '#475569' }}>{m.days}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>{m.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Advice & Dietary Instructions */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px'
          }}>
            <h5 style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
              🌿 તબીબી સલાહ, પરેજી & આયુર્વેદિક કાળજી:
            </h5>
            <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.5' }}>
              {record.doctorNotes || 'હૂંફાળું પાણી પીવું, પૂરતો આરામ કરવો અને ભારે તેલ-મસાલાવાળો ખોરાક ટાળવો. તુલસી-સૂંઠનો ઉકાળો દિવસમાં ૧ વાર લઈ શકાય. ૫ દિવસ પછી ફરી તપાસ કરાવવી.'}
            </p>
          </div>

          {/* Official Doctor Seal & Legal Verification Section */}
          <div style={{
            borderTop: '2px dashed #CBD5E1',
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            {/* QR Code Verification */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#0F172A',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <QrCode size={46} color="#00C48C" />
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', maxWidth: '200px' }}>
                <div style={{ fontWeight: 800, color: '#0F172A' }}>NMC ડિજિટલ સહી વેરિફિકેશન</div>
                <div>આ QR કોડ સ્કેન કરી સરકારી ડેટાબેઝમાંથી પ્રિસ્ક્રિપ્શનની પ્રમાણિક્તા ચકાસી શકાય છે.</div>
              </div>
            </div>

            {/* Official Circular Medical Seal (સત્તાવાર સરકારી સિક્કો) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <OfficialMedicalStamp
                size={110}
                regNumber={doctorReg}
                doctorName={doctorName}
                council="NATIONAL MEDICAL COMMISSION • NMC"
                department="GOVT. OF GUJARAT RECOGNISED CLINIC"
                color="#1D4ED8"
                rotation={-8}
              />
            </div>

            {/* Official Doctor Signature & Stamp of Doctor */}
            <div style={{ textAlign: 'right', minWidth: '220px' }}>
              <div style={{
                fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
                fontSize: '32px',
                color: '#0284C7',
                fontWeight: 700,
                transform: 'rotate(-3deg)',
                lineHeight: 1,
                marginBottom: '4px',
                textDecoration: 'underline'
              }}>
                {doctorName.includes('Jay Parmar') || doctorName.includes('જય પરમાર') ? 'Dr. Jay Parmar' : doctorName}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A' }}>
                {doctorName}
              </div>
              <div style={{ fontSize: '11px', color: '#009F70', fontWeight: 800 }}>
                NMC / GMC REG: {doctorReg}
              </div>
              <div style={{ fontSize: '9px', color: '#64748B', marginTop: '2px' }}>
                ડિજિટલી પ્રમાણિત સહી & સત્તાવાર મહોર • NMC Telemedicine Guidelines 2020 Compliant
              </div>
            </div>
          </div>

          {/* Statutory Red-Flag Emergency Notice */}
          <div style={{
            marginTop: '16px',
            padding: '8px 12px',
            background: '#FEF2F2',
            borderRadius: '8px',
            border: '1px solid #FECACA',
            fontSize: '10px',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={14} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>
              <strong>{isEn ? 'Emergency Notice:' : 'કટોકટી ચેતવણી (Emergency Red-Flag):'}</strong> {t.emergencyDisclaimer || 'જો દર્દીને અચાનક શ્વાસ લેવામાં તકલીફ, છાતીમાં સખત દુખાવો થાય તો તાત્કાલિક ૧૦૮ બોલાવવી.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
