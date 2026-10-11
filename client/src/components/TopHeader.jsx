import React from 'react';
import { PhoneCall, Globe, Cpu, Smartphone, LogOut, LogIn, Menu, RefreshCw, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/languageService';

// Format user name cleanly without awkward parenthetical cutoffs (e.g. "રામજીભાઈ પટેલ (Ramjib...")
const formatUserName = (fullName, lang) => {
  if (!fullName) return '';
  const match = fullName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    const gujPart = match[1].trim();
    const engPart = match[2].trim();
    return lang === 'en' ? engPart : gujPart;
  }
  return fullName;
};

// Format location / designation subtitle cleanly
const formatUserLocation = (villageOrSpec, role, lang) => {
  if (role === 'doctor') {
    return lang === 'gu' ? 'તબીબ (ડૉક્ટર)' : 'Medical Specialist';
  }
  if (role === 'admin') {
    return lang === 'gu' ? 'મુખ્ય પ્રશાસક' : 'Chief Health Admin';
  }
  if (!villageOrSpec) return lang === 'gu' ? 'દર્દી' : 'Patient';
  const match = villageOrSpec.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return lang === 'en' ? match[2].trim() : match[1].trim();
  }
  return villageOrSpec;
};

// Localized role badge label with white-space nowrap guarantee
const getRoleBadgeLabel = (role, lang) => {
  if (role === 'doctor') return lang === 'gu' ? 'તબીબ' : 'DOCTOR';
  if (role === 'admin') return lang === 'gu' ? 'એડમિન' : 'ADMIN';
  return lang === 'gu' ? 'દર્દી' : 'PATIENT';
};

export const TopHeader = ({
  currentLang,
  setLang,
  selectedModel,
  setSelectedModel,
  onEmergencyClick,
  onSOSClick,
  onInstallClick,
  onOpenLangModal,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onToggleSidebar
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
  const t = getTranslation(currentLang);


  return (
    <header className="top-header">
      {/* Left: Mobile Menu + Brand Logo + Emergency 108 Call + SOS */}
      <div className="header-left">
        {onToggleSidebar && (
          <button
            className="mobile-hamburger-btn"
            onClick={onToggleSidebar}
            title="મેનુ ખોલો"
          >
            <Menu size={22} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/logo.png"
            alt="SRI SRI Logo"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1.5px solid #00C48C',
              boxShadow: '0 2px 8px rgba(0, 196, 140, 0.2)',
              flexShrink: 0
            }}
          />
          <div className="brand-logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#0A1128', lineHeight: 1.1 }}>SRI SRI ❤️</span>
            <span style={{ fontSize: '10px', color: '#009F70', fontWeight: 700 }}>AI HealthCare</span>
          </div>
        </div>

        <button className="btn-emergency" onClick={onEmergencyClick} style={{ padding: '8px 14px', fontSize: '12.5px' }}>
          <PhoneCall size={15} />
          <span>{t.call108}</span>
        </button>

        <button
          onClick={onSOSClick}
          className="header-hide-mobile"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#EF4444',
            border: '1.5px solid #EF4444',
            fontWeight: 800,
            padding: '8px 12px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
        >
          {t.sosAlert}
        </button>
      </div>

      {/* Right: AI Router, PWA Install, Language Selector & User Profile */}
      <div className="header-right">
        {/* Multi-Model AI Router Dropdown */}
        {/* Multi-Model AI Router Dropdown (Structured, Responsive & Clean) */}
        <div className="header-ai-router header-hide-mobile">
          <Cpu size={15} color="#00C48C" style={{ flexShrink: 0 }} />
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <select
              value={selectedModel || 'auto'}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="header-ai-router-select"
              aria-label="Multi-Model AI Router"
            >
              <option value="auto">Auto-AI Router</option>
              <option value="gemini">Gemini 1.5 Vision</option>
              <option value="perplexity">Perplexity Research</option>
              <option value="gpt4o">Claude 3.5 &amp; GPT-4o</option>
            </select>
            <ChevronDown size={14} color="#0A1128" style={{ position: 'absolute', right: '0px', pointerEvents: 'none', flexShrink: 0 }} />
          </div>
        </div>

        {/* PWA Install Button */}
        <button
          onClick={onInstallClick}
          className="header-tool-btn header-hide-mobile"
          style={{
            background: '#E0F8EE',
            color: '#009F70',
            border: '1.5px solid #00C48C',
            flexShrink: 0
          }}
          title={t.installApp}
        >
          <Smartphone size={15} />
          <span className="header-btn-label">{t.installApp}</span>
        </button>

        {/* Global World Languages Trigger Button */}
        <button
          onClick={onOpenLangModal}
          className="header-tool-btn"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #00C48C',
            color: '#009F70',
            boxShadow: '0 2px 8px rgba(0, 196, 140, 0.08)',
            flexShrink: 0
          }}
          title={currentLangObj.name}
        >
          <Globe size={15} color="#00C48C" />
          <span>{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</span>
          <span className="header-btn-label">({t.worldLang})</span>
        </button>

        {/* User Account & Role Badge Pill (100% Responsive on All Screen Sizes) */}
        {currentUser ? (
          <div
            className="header-user-pill"
            style={{
              background: currentUser.role === 'doctor' ? '#F0F9FF' : currentUser.role === 'admin' ? '#FAF5FF' : '#F0FDF4',
              border: `1.5px solid ${currentUser.role === 'doctor' ? '#7DD3FC' : currentUser.role === 'admin' ? '#D8B4FE' : '#86EFAC'}`,
            }}
          >
            <span className="header-user-avatar">
              {currentUser.avatar || (currentUser.role === 'doctor' ? '👨‍⚕️' : currentUser.role === 'admin' ? '🛡️' : '👨‍🦰')}
            </span>

            <div
              className="header-user-info"
              onClick={onOpenAuthModal}
              title={`${currentUser.name} - ${currentUser.village || currentUser.specialization || ''} (${t.switchAccount || 'Switch Profile'})`}
            >
              <div className="header-user-row">
                <span className="header-user-name" title={currentUser.name}>
                  {formatUserName(currentUser.name, currentLang)}
                </span>
                <span
                  className="header-user-role-badge"
                  style={{
                    background: currentUser.role === 'doctor' ? '#0284C7' : currentUser.role === 'admin' ? '#7C3AED' : '#00C48C'
                  }}
                >
                  {getRoleBadgeLabel(currentUser.role, currentLang)}
                </span>
              </div>
              <span className="header-user-subtext" title={currentUser.village || currentUser.specialization || ''}>
                {formatUserLocation(currentUser.village || currentUser.specialization, currentUser.role, currentLang)}
              </span>
            </div>

            <button
              onClick={onOpenAuthModal}
              title={t.switchAccount || 'Switch Account'}
              className="header-user-switch-btn"
            >
              <RefreshCw size={12} />
              <span className="header-btn-label-desktop">{t.switchAccount || 'Switch'}</span>
            </button>

            <button
              onClick={onLogout}
              title={t.signOut || 'Sign Out'}
              className="header-user-logout-btn"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            style={{
              background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0, 196, 140, 0.25)',
              flexShrink: 0
            }}
          >
            <LogIn size={15} />
            <span>{t.loginSignUp || '🔑 Login / Sign Up'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
