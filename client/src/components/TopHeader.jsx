import React from 'react';
import { PhoneCall, Globe, Cpu, Smartphone, LogOut, LogIn, Menu } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/languageService';

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
        <div className="header-hide-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#FFFFFF',
          border: '1.5px solid #D3F2E3',
          padding: '7px 12px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 196, 140, 0.05)',
          flexShrink: 0
        }}>
          <Cpu size={15} color="#00C48C" />
          <select
            value={selectedModel || 'auto'}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0A1128',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
              fontSize: '12.5px',
              padding: 0,
              maxWidth: '180px'
            }}
          >
            <option value="auto">🤖 Auto-AI Router</option>
            <option value="gemini">🩻 Gemini 1.5 Vision</option>
            <option value="perplexity">🔍 Perplexity Research</option>
            <option value="gpt4o">🧠 Claude 3.5 & GPT-4o</option>
          </select>
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

        {/* User Account & Role Badge Pill */}
        {currentUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: currentUser.role === 'doctor' ? '#F0F9FF' : currentUser.role === 'admin' ? '#FAF5FF' : '#F0FDF4',
            border: `1.5px solid ${currentUser.role === 'doctor' ? '#7DD3FC' : currentUser.role === 'admin' ? '#D8B4FE' : '#86EFAC'}`,
            padding: '6px 12px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '18px' }}>{currentUser.avatar || (currentUser.role === 'doctor' ? '👨‍⚕️' : currentUser.role === 'admin' ? '🛡️' : '👨‍🦰')}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  background: currentUser.role === 'doctor' ? '#0284C7' : currentUser.role === 'admin' ? '#7C3AED' : '#00C48C',
                  color: '#FFFFFF'
                }}>
                  {currentUser.role}
                </span>
              </div>
              <span style={{ fontSize: '10px', color: '#64748B' }}>
                {currentUser.role === 'doctor' ? (currentUser.specialization ? currentUser.specialization.slice(0, 18) + '...' : 'Doctor') : currentUser.role === 'admin' ? 'Master Admin' : (currentUser.village || 'Patient')}
              </span>
            </div>

            <button
              onClick={onOpenAuthModal}
              title={t.switchAccount || 'Switch Account'}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                color: '#334155',
                marginLeft: '4px'
              }}
            >
              {t.switchAccount || 'Switch'}
            </button>

            <button
              onClick={onLogout}
              title={t.signOut || 'Sign Out'}
              style={{
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                padding: '4px 6px',
                cursor: 'pointer',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center'
              }}
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
