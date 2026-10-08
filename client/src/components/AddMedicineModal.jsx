import React, { useState } from 'react';
import {
  Pill, PlusCircle, CheckCircle2, X, AlertCircle, Sparkles,
  ShieldCheck, DollarSign, Leaf, BookOpen
} from 'lucide-react';
import { customMedicinesService } from '../services/customMedicinesService';
import { getTranslation } from '../services/languageService';

export const AddMedicineModal = ({ isOpen, onClose, onMedicineAdded, currentLang = 'gu', currentUser }) => {
  if (!isOpen) return null;

  const t = getTranslation(currentLang);
  const isGu = currentLang === 'gu' || currentLang === 'ku';

  const [brandName, setBrandName] = useState('');
  const [salt, setSalt] = useState('');
  const [category, setCategory] = useState('તાવ અને દર્દ નિવારક (Antipyretic & Analgesic)');
  const [diseaseUsedFor, setDiseaseUsedFor] = useState('');
  const [howToTakeAllopathic, setHowToTakeAllopathic] = useState('જમ્યા પછી ૧ ગોળી પાણી સાથે.');
  const [ayurvedicName, setAyurvedicName] = useState('ગિલોય ઘનવટી + તુલસી-આદુ અર્ક');
  const [howToTakeAyurvedic, setHowToTakeAyurvedic] = useState('૧-૧ ગોળી સવાર-સાંજ નવશેકા પાણી સાથે.');
  const [naturalCure, setNaturalCure] = useState('પૂરતો આરામ, પુષ્કળ પ્રવાહી અને સાત્વિક ખોરાક.');
  const [precautions, setPrecautions] = useState('ડૉક્ટરના પ્રિસ્ક્રિપ્શન વગર ડોઝ ન વધારવો.');
  const [mrp, setMrp] = useState(65);
  const [janPrice, setJanPrice] = useState(10);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!brandName.trim() || !salt.trim() || !diseaseUsedFor.trim()) {
      setErrorMsg('કૃપા કરીને દવાનું નામ, સાલ્ટ અને રોગની વિગતો દાખલ કરો.');
      return;
    }

    const calculatedSavings = Math.round(((Number(mrp) - Number(janPrice)) / Number(mrp)) * 100);

    const newMed = {
      id: `med_${Date.now()}`,
      brandNames: [brandName.trim()],
      allopathicName: `${brandName.trim()} (${salt.trim()})`,
      salt: salt.trim(),
      category,
      diseaseUsedFor: diseaseUsedFor.trim(),
      howToTakeAllopathic: howToTakeAllopathic.trim(),
      ayurvedicName: ayurvedicName.trim(),
      howToTakeAyurvedic: howToTakeAyurvedic.trim(),
      naturalCure: naturalCure.trim(),
      precautions: precautions.trim(),
      mrp: Number(mrp) || 50,
      janPrice: Number(janPrice) || 8,
      savingsPct: calculatedSavings > 0 ? calculatedSavings : 80,
      tags: [brandName.toLowerCase(), salt.toLowerCase(), category.toLowerCase()],
      addedBy: currentUser?.name || (currentUser?.role === 'doctor' ? 'Verified Doctor' : 'Admin')
    };

    customMedicinesService.addCustomMedicine(newMed);
    setSuccessMsg(`🎉 દવા "${brandName}" સફળતાપૂર્વક ડેટાબેઝમાં ઉમેરાઈ ગઈ!`);

    if (onMedicineAdded) {
      onMedicineAdded(newMed);
    }

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(10, 17, 40, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '620px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0, 196, 140, 0.35)',
        border: '2px solid #00C48C'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1128 0%, #002B1D 100%)',
          color: '#FFFFFF',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #00C48C'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0, 196, 140, 0.2)', border: '1px solid #00C48C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill color="#00E599" size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900 }}>
                {isGu ? '➕ નવી દવા ડેટાબેઝમાં ઉમેરો' : '➕ Register New Medicine to Formulary'}
              </h3>
              <span style={{ fontSize: '11px', color: '#A7F3D0' }}>
                {isGu ? `અધિકૃત: ${currentUser?.name || 'Doctor / Admin'}` : 'Authorized Formulary Portal'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px' }}>
          {errorMsg && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#15803D', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Brand Name & Generic Salt */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  બ્રાન્ડ નામ (Brand Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. Augmentin 625 / Telma 40"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  જેનેરિક સાલ્ટ (Chemical Salt) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. Amoxicillin 500mg + Clavulanic 125mg"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* 2. Category & Indication */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  કેટેગરી (Therapeutic Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12.5px', background: '#FFF', boxSizing: 'border-box' }}
                >
                  <option value="તાવ અને દર્દ નિવારક (Antipyretic & Analgesic)">તાવ અને દર્દ નિવારક (Antipyretic & Analgesic)</option>
                  <option value="એન્ટિબાયોટિક્સ / ચેપ નિવારક (Antibiotic)">એન્ટિબાયોટિક્સ / ચેપ નિવારક (Antibiotic)</option>
                  <option value="એસિડિટી & ગેસ્ટ્રિક રક્ષક (Proton Pump Inhibitor)">એસિડિટી & ગેસ્ટ્રિક રક્ષક (PPI / Antacid)</option>
                  <option value="હાઈ બ્લડ પ્રેશર & કાર્ડિયાક કેર (Antihypertensive)">હાઈ બ્લડ પ્રેશર & હૃદયરોગ (Cardiology)</option>
                  <option value="ડાયાબિટીસ નિયંત્રક (Antidiabetic)">ડાયાબિટીસ નિયંત્રક (Antidiabetic)</option>
                  <option value="અસ્થમા & શ્વાસનળી વિસ્તરણ (Respiratory / Inhaler)">અસ્થમા & શ્વાસનળી વિસ્તરણ (Respiratory)</option>
                  <option value="ચામડી & એન્ટિફંગલ (Dermatology)">ચામડી & એન્ટિફંગલ (Dermatology)</option>
                  <option value="વિટામિન & મિનરલ સપ્લીમેન્ટ (Nutritional)">વિટામિન & મિનરલ સપ્લીમેન્ટ (Nutritional)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  કયા રોગ માટે વપરાય છે (Indications) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. ગળાનો સોજો, ફેફસાંનો કફ, બેક્ટેરિયલ ચેપ"
                  value={diseaseUsedFor}
                  onChange={(e) => setDiseaseUsedFor(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* 3. Dosage & Administration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  એલોપેથિક માત્રા / ડોઝ (Allopathic How to take)
                </label>
                <input
                  type="text"
                  value={howToTakeAllopathic}
                  onChange={(e) => setHowToTakeAllopathic(e.target.value)}
                  placeholder="જમ્યા પછી ૧ ગોળી સવાર-સાંજ"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#047857', marginBottom: '4px' }}>
                  🌿 આયુર્વેદિક સમકક્ષ વિકલ્પ (Ayurvedic Counterpart)
                </label>
                <input
                  type="text"
                  value={ayurvedicName}
                  onChange={(e) => setAyurvedicName(e.target.value)}
                  placeholder="દા.ત. હરિદ્રા ખંડ + સુદર્શન ઘનવટી"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #A7F3D0', fontSize: '12.5px', boxSizing: 'border-box', background: '#F0FDF8' }}
                />
              </div>
            </div>

            {/* 4. Pricing & Savings */}
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  બ્રાન્ડેડ કિંમત MRP (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 800, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>
                  જન ઔષધિ કિંમત (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={janPrice}
                  onChange={(e) => setJanPrice(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #86EFAC', fontSize: '13px', fontWeight: 800, color: '#059669', boxSizing: 'border-box', background: '#F0FDF4' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#0369A1', marginBottom: '4px' }}>
                  સરકારી બચત (%)
                </label>
                <div style={{ padding: '8px 10px', borderRadius: '8px', background: '#E0F2FE', color: '#0284C7', fontWeight: 900, fontSize: '13px', textAlign: 'center' }}>
                  {Math.round(((Number(mrp) - Number(janPrice)) / Number(mrp)) * 100)}% બચત
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                boxShadow: '0 4px 14px rgba(0, 196, 140, 0.35)'
              }}
            >
              <PlusCircle size={16} />
              {isGu ? '✓ દવા ડેટાબેઝમાં સાચવો (Save to Master Catalog)' : 'Save Medicine to Master Catalog'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
