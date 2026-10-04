import React from 'react';
import { Heart, Activity, DollarSign, Hospital, ShieldCheck, Wifi, Award } from 'lucide-react';
import { getTranslation } from '../services/languageService';

export const VitalsHUD = ({ currentLang, currentBpm = 76, totalSavings = "85%", activePhcs = 5, triageCount = 142 }) => {
  const t = getTranslation(currentLang);
  const isGu = currentLang === 'gu' || currentLang === 'ku';

  return (
    <div style={{ marginBottom: '14px' }}>
      {/* ❤️ Sri Sri HealthCare Official Regional Live Medical Lifeline */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1128 0%, #002B1D 100%)',
        border: '1.5px solid #00C48C',
        borderRadius: '16px',
        padding: '10px 16px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        color: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(0, 196, 140, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#00E599',
            boxShadow: '0 0 10px #00E599',
            animation: 'pulse 1.8s infinite'
          }} />
          <div style={{ fontSize: '12.5px', fontWeight: 800 }}>
            {isGu ? '❤️ શ્રી શ્રી હેલ્થકેર • ૨૪/૭ લાઈવ AI મેડિકલ સેતુ & આયુષ્માન PM-JAY નેટવર્ક' : '❤️ Sri Sri HealthCare • 24/7 Live AI Medical Lifeline & PM-JAY Network'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(0, 196, 140, 0.2)',
            border: '1px solid #00C48C',
            color: '#D3F2E3',
            fontSize: '11px',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ShieldCheck size={13} color="#00C48C" />
            {isGu ? 'આયુષ્માન PM-JAY વેરિફાઈડ' : 'PM-JAY Verified'}
          </span>

          <span style={{
            background: 'rgba(255, 255, 255, 0.12)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Wifi size={13} color="#00E599" />
            {isGu ? '૧૦૮ ઇમરજન્સી સેતુ ઓનલાઇન' : '108 Dispatch Online'}
          </span>
        </div>
      </div>

      {/* 4 Essential Health HUD Cards */}
      <div className="vitals-hud">
        {/* 1. Live BPM */}
        <div className="hud-card">
          <div className="hud-icon" style={{ background: '#E0F8EE', color: '#00C48C' }}>
            <Heart size={24} className="animated-pulse" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A1128' }}>{currentBpm} <span style={{ fontSize: '13px', color: '#5A6A85' }}>BPM</span></div>
            <div style={{ fontSize: '12px', color: '#009F70', fontWeight: 700 }}>● {t.hudBpm}</div>
          </div>
        </div>

        {/* 2. RAG AI Accuracy */}
        <div className="hud-card">
          <div className="hud-icon" style={{ background: '#FFFBEB', color: '#F59E0B' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A1128' }}>99.4% <span style={{ fontSize: '13px', color: '#5A6A85' }}>RAG</span></div>
            <div style={{ fontSize: '12px', color: '#D97706', fontWeight: 700 }}>● {t.hudRag}</div>
          </div>
        </div>

        {/* 3. Medicine Cost Savings */}
        <div className="hud-card">
          <div className="hud-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A1128' }}>{totalSavings}</div>
            <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>● {t.hudSavings}</div>
          </div>
        </div>

        {/* 4. Active PHC Beds */}
        <div className="hud-card">
          <div className="hud-icon" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
            <Hospital size={24} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A1128' }}>{activePhcs}</div>
            <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 700 }}>● {t.hudPhc}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
