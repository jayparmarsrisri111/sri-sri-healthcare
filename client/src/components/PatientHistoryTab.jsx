import React, { useState, useEffect } from 'react';
import { History, Search, Download, Printer, CheckCircle, Clock, ShieldCheck, User, Plus, Trash2, RotateCcw, FileText, Activity } from 'lucide-react';
import { patientStorageService } from '../services/patientStorageService';
import { getTranslation } from '../services/languageService';
import { DigitalPrescriptionModal } from './DigitalPrescriptionModal';

export const PatientHistoryTab = ({ currentLang, currentUser }) => {
  const t = getTranslation(currentLang);
  const langKey = ['en', 'gu', 'hi', 'ku'].includes(currentLang) ? currentLang : 'en';

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState(null);

  // New record form state
  const [newName, setNewName] = useState(currentUser?.name || '');
  const [newAge, setNewAge] = useState(currentUser?.age || 30);
  const [newType, setNewType] = useState('Triage');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newUrgency, setNewUrgency] = useState('GREEN');
  const [newDiagnosis, setNewDiagnosis] = useState('');

  // Load from patientStorageService with role & user filter
  const loadRecords = () => {
    const list = patientStorageService.getRecords(currentUser);
    setRecords(list);
  };

  useEffect(() => {
    loadRecords();

    const handleUpdate = () => loadRecords();
    window.addEventListener('patient_records_updated', handleUpdate);
    return () => window.removeEventListener('patient_records_updated', handleUpdate);
  }, [currentUser]);

  const filtered = records.filter(r => {
    const matchesSearch = 
      (r.patientName && r.patientName.toLowerCase().includes(search.toLowerCase())) ||
      (r.diagnosis && r.diagnosis.toLowerCase().includes(search.toLowerCase())) ||
      (r.id && r.id.toLowerCase().includes(search.toLowerCase()));

    const matchesType = selectedTypeFilter === 'ALL' || (r.type && r.type.includes(selectedTypeFilter));
    return matchesSearch && matchesType;
  });

  const handlePrint = (rec) => {
    setSelectedRecordForPrint(rec);
  };

  const handleDelete = (id) => {
    if (window.confirm(langKey === 'gu' ? "શું તમે આ રેકોર્ડ ડિલીટ કરવા માંગો છો?" : "Delete this record?")) {
      patientStorageService.deleteRecord(id);
    }
  };

  const handleReset = () => {
    if (window.confirm(langKey === 'gu' ? "ડિફોલ્ટ રેકોર્ડ્સ રીસેટ કરવા છે?" : "Reset to default demo records?")) {
      patientStorageService.resetRecords();
    }
  };

  const handleAddNewCase = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newDiagnosis.trim()) return;

    patientStorageService.saveRecord({
      patientName: newName,
      age: parseInt(newAge, 10) || 30,
      type: newType,
      symptoms: newSymptoms || "ક્લિનિકલ કન્સલ્ટેશન",
      urgency: newUrgency,
      diagnosis: newDiagnosis,
      details: {
        action: "ક્લિનિકલ પ્રિસ્ક્રિપ્શન રેકોર્ડ થયેલ",
        care: "ડૉક્ટર દ્વારા નિર્ધારિત દવાઓ"
      }
    }, currentUser);

    setShowAddModal(false);
    setNewName('');
    setNewSymptoms('');
    setNewDiagnosis('');
  };

  return (
    <div>
      <div className="medical-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo.png"
              alt="SRI SRI Logo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1.5px solid #00C48C',
                boxShadow: '0 4px 12px rgba(0, 196, 140, 0.3)'
              }}
            />
            <div>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0A1128', fontSize: '18px', fontWeight: 800 }}>
                📋 {langKey === 'gu' ? 'દર્દી હિસ્ટ્રી & ડિજિટલ પ્રિસ્ક્રિપ્શન રેકોર્ડ્સ (Live Patient EHR)' :
                     'Patient History Records & Digital EHR'}
              </h3>
              <p style={{ color: '#5A6A85', fontSize: '13px', margin: '4px 0 0 0' }}>
                {langKey === 'gu' ? 'તમામ ટેબમાંથી થયેલી તપાસ આપોઆપ અહીં સેવ થાય છે. ૧-ક્લિક પ્રિસ્ક્રિપ્શન પ્રિન્ટ કરો:' :
                 'All diagnostics, vitals, eye tests, and triage cases are automatically logged here in real time:'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '12.5px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> {langKey === 'gu' ? 'નવો કેસ ઉમેરો' : 'Add Case'}
            </button>

            <button
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} /> {langKey === 'gu' ? 'હેલ્થ પાસપોર્ટ પ્રિન્ટ' : 'Print EHR Passport'}
            </button>

            <button
              onClick={handleReset}
              className="btn-secondary"
              title="Reset Demo Records"
              style={{ padding: '8px 10px', fontSize: '12px' }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Search Bar & Type Filter Chips */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'Triage', 'Vitals', 'Eye', 'Vision', 'Mind'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedTypeFilter(type)}
                className="btn-secondary"
                style={{
                  fontSize: '11.5px',
                  padding: '5px 12px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  background: selectedTypeFilter === type ? '#E0F8EE' : '#FFFFFF',
                  borderColor: selectedTypeFilter === type ? '#00C48C' : '#D1F2E3'
                }}
              >
                {type === 'ALL' ? (langKey === 'gu' ? 'તમામ રેકોર્ડ્સ' : 'All Records') : type}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={langKey === 'gu' ? "🔍 દર્દીનું નામ અથવા રોગ શોધો..." : "Search patient, ID, disease..."}
            style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '13px', width: '220px' }}
          />
        </div>

        {/* Dynamic Records Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>કેસ ID / તારીખ</th>
                <th>દર્દીનું નામ & ઉંમર</th>
                <th>પ્રકાર (Type)</th>
                <th>લક્ષણો</th>
                <th>ગંભીરતા</th>
                <th>નિદાન & ઉપચાર</th>
                <th>એક્શન</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#5A6A85' }}>
                    કોઈ રેકોર્ડ મળ્યો નથી. નવી તપાસ શરૂ કરો!
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: '#009F70' }}>{rec.id}</div>
                      <div style={{ fontSize: '11px', color: '#5A6A85', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {rec.date}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0A1128', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} color="#00C48C" />
                        {rec.patientName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#5A6A85' }}>ઉંમર: {rec.age} વર્ષ</div>
                    </td>
                    <td>
                      <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>
                        {rec.type || 'Clinical'}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', maxWidth: '180px' }}>{rec.symptoms}</td>
                    <td>
                      <span className={rec.urgency === 'RED' ? 'badge-pill badge-red' : rec.urgency === 'YELLOW' ? 'badge-pill badge-yellow' : 'badge-pill badge-green'}>
                        {rec.urgency}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0A1128' }}>{rec.diagnosis}</div>
                      <div style={{ fontSize: '12px', color: '#009F70' }}>{rec.details?.action || rec.details?.care || rec.action || '-'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handlePrint(rec)}
                          style={{
                            background: '#E0F8EE',
                            color: '#009F70',
                            border: '1px solid #00C48C',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Print"
                        >
                          <Printer size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          style={{
                            background: '#FFF5F5',
                            color: '#EF4444',
                            border: '1px solid #FEB2B2',
                            padding: '6px 8px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add New Case Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px', width: '90%', maxWidth: '480px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#0A1128', fontSize: '18px', fontWeight: 800 }}>
                ➕ નવો દર્દી કેસ રેકોર્ડ ઉમેરો
              </h4>
              <form onSubmit={handleAddNewCase}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#4A5568' }}>દર્દીનું નામ:</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="દા.ત. રમેશભાઈ પ્રજાપતિ"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#4A5568' }}>ઉંમર:</label>
                    <input
                      type="number"
                      value={newAge}
                      onChange={(e) => setNewAge(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#4A5568' }}>તપાસ પ્રકાર:</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px' }}
                    >
                      <option value="Triage">Symptom Triage</option>
                      <option value="Vitals">Vitals (rPPG)</option>
                      <option value="Eye">Eye Power</option>
                      <option value="Vision">X-Ray / Lab</option>
                      <option value="Mind">Mind & Emotion</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#4A5568' }}>લક્ષણો / તકલીફ:</label>
                  <input
                    type="text"
                    value={newSymptoms}
                    onChange={(e) => setNewSymptoms(e.target.value)}
                    placeholder="તાવ, માથું દુખવું, કફ..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#4A5568' }}>નિદાન (Diagnosis):</label>
                  <input
                    type="text"
                    required
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    placeholder="વાયરલ ઇન્ફેક્શન..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                    style={{ padding: '9px 16px', fontWeight: 700 }}
                  >
                    રદ કરો
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '9px 20px', fontWeight: 800 }}
                  >
                    સેવ કરો
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Digital NMC Verified Prescription Modal */}
      <DigitalPrescriptionModal
        isOpen={Boolean(selectedRecordForPrint)}
        onClose={() => setSelectedRecordForPrint(null)}
        record={selectedRecordForPrint}
        doctorInfo={currentUser?.role === 'doctor' ? currentUser : null}
        currentLang={currentLang}
      />
    </div>
  );
};
