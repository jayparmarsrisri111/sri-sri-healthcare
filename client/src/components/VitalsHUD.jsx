import React from 'react';
import { Heart, Activity, DollarSign, Hospital } from 'lucide-react';
import { getTranslation } from '../services/languageService';

export const VitalsHUD = ({ currentLang, currentBpm = 76, totalSavings = "85%", activePhcs = 5, triageCount = 142 }) => {
  const t = getTranslation(currentLang);

  return (
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
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A1128' }}>96.8% <span style={{ fontSize: '13px', color: '#5A6A85' }}>RAG</span></div>
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
  );
};
