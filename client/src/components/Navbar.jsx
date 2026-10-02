import React, { useState, useEffect } from 'react';
import { HeartPulse, PhoneCall, AlertTriangle, ShieldCheck, Globe, Cpu, Download, Smartphone } from 'lucide-react';

export const Navbar = ({ currentLang, setLang, selectedModel, setSelectedModel, onEmergencyClick, onSOSClick }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("📲 Sri Sri ❤️ HealthCare વેબ એપ ઇન્સ્ટોલ કરવા માટે બ્રાઉઝરના મેનુ (⋮) માં જઈને 'Add to Home screen' અથવા 'Install App' પસંદ કરો.");
    }
  };

  return (
    <header>
      {/* Top Main Clinical Banner */}
      <div className="main-header">
        <div>
          <h1>
            <span style={{ fontSize: '30px', display: 'flex', alignItems: 'center' }}>❤️</span>
            Sri Sri ❤️ HealthCare (શ્રી શ્રી ❤️ હેલ્થકેર)
          </h1>
          <p>Multi-Model AI Rural Healthcare Web App • Gemini + Perplexity + Claude + GPT-4o</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Install Web App Button */}
          <button
            onClick={handleInstallClick}
            style={{
              background: '#FFFFFF',
              color: '#009F70',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Smartphone size={16} />
            📲 Install Web App
          </button>

          {/* Multi-Model Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '10px' }}>
            <Cpu size={16} color="#FFFFFF" />
            <select
              value={selectedModel || 'auto'}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontWeight: 700, outline: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}
            >
              <option value="auto" style={{ color: '#0A1128' }}>🤖 Auto-AI Router (Best Model per Task)</option>
              <option value="gemini" style={{ color: '#0A1128' }}>🩻 Google Gemini 1.5 (Vision & X-Ray)</option>
              <option value="perplexity" style={{ color: '#0A1128' }}>🔍 Perplexity AI (Case Studies & Research)</option>
              <option value="gpt4o" style={{ color: '#0A1128' }}>🧠 Claude 3.5 & GPT-4o (Triage & Cures)</option>
            </select>
          </div>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '10px' }}>
            <Globe size={16} color="#FFFFFF" />
            <select
              value={currentLang}
              onChange={(e) => setLang(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontWeight: 700, outline: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}
            >
              <option value="gu" style={{ color: '#0A1128' }}>ગુજરાતી (Gujarati)</option>
              <option value="hi" style={{ color: '#0A1128' }}>हिन्दी (Hindi)</option>
              <option value="ku" style={{ color: '#0A1128' }}>કચ્છી (Kutchi Dialect)</option>
              <option value="en" style={{ color: '#0A1128' }}>English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Red Emergency Action Bar */}
      <div className="emergency-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={24} color="#E53E3E" />
          <span>જો આ ગંભીર અથવા જીવલેણ ઈમરજન્સી હોય, તો તાત્કાલિક ૧૦૮ પર કૉલ કરો!</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-emergency" onClick={onEmergencyClick}>
            <PhoneCall size={18} />
            ૧૦૮ એમ્બ્યુલન્સ
          </button>
          <button
            onClick={onSOSClick}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#E53E3E',
              border: '1.5px solid #E53E3E',
              fontWeight: 700,
              padding: '10px 16px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            📲 SOS એલર્ટ
          </button>
        </div>
      </div>
    </header>
  );
};
