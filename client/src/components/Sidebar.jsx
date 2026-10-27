import React from 'react';
import {
  Mic, Camera, Activity, Hospital, Landmark, Pill, History,
  Sparkles, ShieldCheck, Trophy, Cpu, Brain, MessageSquare,
  Stethoscope, Layers, Eye, Navigation, ShieldAlert, HelpCircle, X,
  TestTube, Shield, Smartphone, Download, Users
} from 'lucide-react';
import { getTranslation } from '../services/languageService';

// Remove leading emojis/color icons from label text so only the single Lucide outline icon appears cleanly
const cleanLabel = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/^[\p{Extended_Pictographic}\p{Emoji_Presentation}\u200d\uFE0F\uFE0E\s]+/u, '').trim();
};

export const Sidebar = ({
  activeTab,
  setActiveTab,
  currentLang,
  onOpenCasesModal,
  onOpenEnsembleModal,
  onOpenPitchModal,
  currentUser,
  onOpenAuthModal,
  onOpenContinuousLearnModal,
  isOpen = false,
  onClose,
  onOpenGuideModal,
  onOpenAdvantagesModal,
  onInstallClick
}) => {
  const t = getTranslation(currentLang);

  const roleSpecificGroup = [];
  if (currentUser?.role === 'doctor') {
    roleSpecificGroup.push({
      id: 'doctorPortal',
      label: cleanLabel(t.tabDoctorPortal || 'Doctor Portal'),
      icon: Stethoscope,
      badge: 'Doctor Hub',
      highlight: true
    });
  } else if (currentUser?.role === 'admin') {
    roleSpecificGroup.push({
      id: 'adminHub',
      label: cleanLabel(t.tabAdminHub || 'Admin Hub'),
      icon: ShieldCheck,
      badge: 'Admin Hub',
      highlight: true
    });
  }

  const primaryCareGroup = [
    ...roleSpecificGroup,
    { id: 'ruralCare', label: cleanLabel(t.tabRuralCare || 'Rural Lifeline & Snakebite'), icon: ShieldAlert, badge: 'ઈમરજન્સી', highlight: true },
    { id: 'triage', label: cleanLabel(t.tabTriage || 'Symptom Triage & Care'), icon: Mic },
    { id: 'chatbot', label: cleanLabel(t.tabChatbot || '24/7 AI Doctor Chatbot'), icon: MessageSquare, badge: '૨૪/૭ સેવા' },
    { id: 'encyclopedia', label: cleanLabel(t.tabEncyclopedia || 'Medicine Encyclopedia'), icon: Pill, badge: 'ઓર્ડર' },
    { id: 'medLocator', label: cleanLabel(t.tabMedLocator || 'Live Medicine & GPS Radar'), icon: Navigation, badge: 'GPS' },
  ];

  const advancedAIGroup = [
    { id: 'eye', label: cleanLabel(t.tabEyePower || 'Eye Power & Vision AI'), icon: Eye, badge: 'ચશ્મા નંબર' },
    { id: 'emotion', label: cleanLabel(t.tabEmotion || 'Mind & Emotion AI'), icon: Brain },
    { id: 'vision', label: cleanLabel(t.tabVision || 'X-Ray & Lab OCR'), icon: Camera, badge: 'X-Ray લેબ' },
    { id: 'vitals', label: cleanLabel(t.tabVitals || 'Camera Pulse & Vitals'), icon: Activity, badge: 'પલ્સ / BP' },
  ];

  const hospitalGroup = [
    { id: 'doctorDirectory', label: cleanLabel(t.tabDoctorDirectory || 'Global Doctor Registry'), icon: Users, badge: 'સ્પેશિયાલિસ્ટ', highlight: true },
    { id: 'homeLab', label: cleanLabel(t.tabHomeLab || 'Home Blood Test'), icon: TestTube, badge: 'બ્લડ ટેસ્ટ' },
    { id: 'phc', label: cleanLabel(t.tabPhc || 'PHC & 108 Navigation'), icon: Hospital, badge: '૧૦૮ સેવા' },
    { id: 'schemes', label: cleanLabel(t.tabSchemes || 'Government Schemes & Subsidy'), icon: Landmark, badge: 'PM-JAY' },
    { id: 'history', label: cleanLabel(currentUser?.role === 'patient' ? (t.tabMyHealthPassport || 'My Health Passport') : (t.tabHistory || 'Patient History')), icon: History, badge: currentUser?.role === 'patient' ? 'EHR' : 'રેકોર્ડ્સ' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}
      <aside className={`app-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div>
          {/* Brand Logo Card */}
          <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/logo.png"
                alt="SRI SRI Logo"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 14px rgba(0, 196, 140, 0.3)',
                  border: '1.5px solid #00C48C',
                  flexShrink: 0
                }}
              />
              <div>
                <h2>{t.appTitle}</h2>
                <span>{t.appSubtitle}</span>
              </div>
            </div>

            {onClose && (
              <button
                className="mobile-close-sidebar-btn"
                onClick={onClose}
                title="બંધ કરો"
              >
                <X size={18} />
              </button>
            )}
          </div>

        {/* Global Pitch Deck & AI MoE Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          <button
            onClick={onOpenPitchModal}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0A1128 0%, #1E293B 100%)',
              border: '1.5px solid #00C48C',
              borderRadius: '12px',
              padding: '10px 12px',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0, 196, 140, 0.15)'
            }}
          >
            <Trophy size={14} color="#00C48C" style={{ flexShrink: 0 }} />
            <span>{cleanLabel(t.pitchBtn)}</span>
          </button>

          <button
            onClick={onOpenEnsembleModal}
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: '1.5px solid #D3F2E3',
              borderRadius: '12px',
              padding: '9px 12px',
              color: '#009F70',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Cpu size={14} color="#00C48C" style={{ flexShrink: 0 }} />
            <span>{cleanLabel(t.ensembleBtn)}</span>
          </button>

          <button
            onClick={onOpenContinuousLearnModal}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '9px 12px',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Brain size={14} color="#FFFFFF" style={{ flexShrink: 0 }} />
            <span>{cleanLabel(t.btnContinuousTraining || 'AI Self-Training')}</span>
          </button>

          {onOpenAdvantagesModal && (
            <button
              onClick={() => { onOpenAdvantagesModal(); if (onClose) onClose(); }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0A1128 0%, #064E3B 100%)',
                border: '1.5px solid #10B981',
                borderRadius: '12px',
                padding: '9px 12px',
                color: '#34D399',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
              }}
            >
              <ShieldCheck size={14} color="#34D399" style={{ flexShrink: 0 }} />
              <span>{cleanLabel(t.btnAdvantages || '5 Advantages')}</span>
            </button>
          )}
        </div>

        {/* Step-by-Step Easy App Guide Button */}
        {onOpenGuideModal && (
          <button
            onClick={() => { onOpenGuideModal(); if (onClose) onClose(); }}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              border: '1.5px solid #60A5FA',
              borderRadius: '12px',
              padding: '10px 12px',
              color: '#1E40AF',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '14px',
              boxShadow: '0 2px 8px rgba(96, 165, 250, 0.2)'
            }}
          >
            <HelpCircle size={15} color="#2563EB" style={{ flexShrink: 0 }} />
            <span>{cleanLabel(t.btnAppGuide || 'App Guide')}</span>
          </button>
        )}

        {/* SECTION 1: PRIMARY CARE */}
        <div className="sidebar-section-title">
          <Stethoscope size={13} color="#00C48C" />
          <span>{t.primaryCareTitle}</span>
        </div>
        <nav className="nav-menu">
          {primaryCareGroup.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, lineHeight: 1.25 }}>{cleanLabel(item.label)}</span>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#E0F8EE',
                  color: isActive ? '#FFFFFF' : '#009F70',
                  flexShrink: 0
                }}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* SECTION 2: ADVANCED AI & VISION */}
        <div className="sidebar-section-title" style={{ marginTop: '12px' }}>
          <Brain size={13} color="#00C48C" />
          <span>{t.advancedAITitle}</span>
        </div>
        <nav className="nav-menu">
          {advancedAIGroup.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, lineHeight: 1.25 }}>{cleanLabel(item.label)}</span>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#E0F8EE',
                  color: isActive ? '#FFFFFF' : '#009F70',
                  flexShrink: 0
                }}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* SECTION 3: HOSPITAL & SCHEMES */}
        <div className="sidebar-section-title" style={{ marginTop: '12px' }}>
          <Layers size={13} color="#00C48C" />
          <span>{t.hospitalTitle}</span>
        </div>
        <nav className="nav-menu">
          {hospitalGroup.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, lineHeight: 1.25 }}>{cleanLabel(item.label)}</span>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#E0F8EE',
                  color: isActive ? '#FFFFFF' : '#009F70',
                  flexShrink: 0
                }}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* PWA App Install Button */}
      {onInstallClick && (
        <button
          onClick={onInstallClick}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 14px',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '12.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '12px',
            marginBottom: '4px',
            boxShadow: '0 4px 14px rgba(0, 196, 140, 0.25)',
            transition: 'all 0.2s'
          }}
        >
          <Smartphone size={16} style={{ flexShrink: 0 }} />
          <span>{cleanLabel(t.installApp || 'એપ ઇન્સ્ટોલ કરો')}</span>
        </button>
      )}

      {/* Sidebar Footer: System Status */}
      <div style={{
        background: '#F8FCF9',
        border: '1px solid #D3F2E3',
        borderRadius: '14px',
        padding: '12px',
        fontSize: '11px',
        marginTop: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#009F70', fontWeight: 800, marginBottom: '2px' }}>
          <ShieldCheck size={14} />
          <span>Global AI Ensemble Active</span>
        </div>
        <p style={{ color: '#5A6A85', margin: 0 }}>
          Gemini + Perplexity + Claude + RAG
        </p>
      </div>
    </aside>
    </>
  );
};
