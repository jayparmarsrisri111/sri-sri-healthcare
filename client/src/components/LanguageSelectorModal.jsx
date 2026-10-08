import React, { useState } from 'react';
import { Globe, Search, CheckCircle2, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getTranslation, applyGlobalLanguage } from '../services/languageService';

export const LanguageSelectorModal = ({ isOpen, onClose, currentLang, setLang }) => {
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState('all'); // 'all', 'India', 'Global'
  const t = getTranslation(currentLang);

  if (!isOpen) return null;

  const filtered = SUPPORTED_LANGUAGES.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.englishName.toLowerCase().includes(search.toLowerCase()) ||
      lang.code.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = filterRegion === 'all' || lang.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(10, 17, 40, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '28px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        border: '2px solid #00C48C'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#0A1128', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 800 }}>
              <Globe color="#00C48C" size={24} />
              🌐 {t.worldLang || 'ભાષા પસંદ કરો / Select Language'}
            </h3>
            <p style={{ color: '#5A6A85', fontSize: '13px', margin: '4px 0 0 0' }}>
              Select any language for 100% instant full web app translation:
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#F0FAF5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} color="#0A1128" />
          </button>
        </div>

        {/* Search & Region Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search Language (Gujarati, Hindi, English, Spanish)..."
              style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn-secondary"
              onClick={() => setFilterRegion('all')}
              style={{ fontSize: '12px', padding: '6px 12px', background: filterRegion === 'all' ? '#E0F8EE' : '#FFFFFF', borderColor: filterRegion === 'all' ? '#00C48C' : '#D3F2E3' }}
            >
              All
            </button>
            <button
              className="btn-secondary"
              onClick={() => setFilterRegion('India')}
              style={{ fontSize: '12px', padding: '6px 12px', background: filterRegion === 'India' ? '#E0F8EE' : '#FFFFFF', borderColor: filterRegion === 'India' ? '#00C48C' : '#D3F2E3' }}
            >
              🇮🇳 India
            </button>
            <button
              className="btn-secondary"
              onClick={() => setFilterRegion('Global')}
              style={{ fontSize: '12px', padding: '6px 12px', background: filterRegion === 'Global' ? '#E0F8EE' : '#FFFFFF', borderColor: filterRegion === 'Global' ? '#00C48C' : '#D3F2E3' }}
            >
              🌍 Global
            </button>
          </div>
        </div>

        {/* Language Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', maxHeight: '45vh', overflowY: 'auto', paddingRight: '4px' }}>
          {filtered.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => {
                  if (setLang) setLang(lang.code);
                  applyGlobalLanguage(lang.code);
                  onClose();
                }}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)' : '#F8FCF9',
                  color: isSelected ? '#FFFFFF' : '#0A1128',
                  border: `1.5px solid ${isSelected ? '#009F70' : '#D3F2E3'}`,
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  <div style={{ fontSize: '11px', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                    {lang.englishName}
                  </div>
                </div>

                {isSelected && <CheckCircle2 size={18} color="#FFFFFF" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
