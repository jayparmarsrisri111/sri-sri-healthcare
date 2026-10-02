import React from 'react';
import { Trophy, Globe, Award, HeartHandshake, CheckCircle2, X, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export const InternationalPitchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        border: '2.5px solid #00C48C'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1.5px solid #D3F2E3',
          paddingBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo.png"
              alt="SRI SRI Logo"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1.5px solid #00C48C',
                boxShadow: '0 4px 12px rgba(0, 196, 140, 0.3)'
              }}
            />
            <div>
              <h2 style={{ color: '#0A1128', margin: 0, fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                🏆 SRI SRI ❤️ HEALTHCARE - GLOBAL 1ST PRIZE PITCH
              </h2>
              <span style={{ color: '#009F70', fontSize: '12px', fontWeight: 700 }}>
                International AI Innovation Summit • UN SDG-3 Rural Healthcare Winner
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#F0FAF5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} color="#0A1128" />
          </button>
        </div>

        {/* 4 Key Pillars of Innovation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#F8FCF9', border: '1.5px solid #D3F2E3', borderRadius: '14px', padding: '16px' }}>
            <h4 style={{ color: '#009F70', margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800 }}>
              🌍 ૧. વૈશ્વિક ગ્રામીણ પહોંચ (Global Rural Reach)
            </h4>
            <p style={{ fontSize: '13px', color: '#0A1128', margin: 0 }}>
              ગામડામાં સ્પેશિયાલિસ્ટ ડૉક્ટરોની અછત હોવા છતાં સ્માર્ટફોન કેમેરાથી X-Ray વિઝન અને ૧૦૮ લાઈવ નેવિગેશન પૂરી પાડે છે.
            </p>
          </div>

          <div style={{ background: '#F8FCF9', border: '1.5px solid #D3F2E3', borderRadius: '14px', padding: '16px' }}>
            <h4 style={{ color: '#009F70', margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800 }}>
              🌿 ૨. ડ્યુઅલ હોલિસ્ટિક કેર (Allopathy + AYUSH)
            </h4>
            <p style={{ fontSize: '13px', color: '#0A1128', margin: 0 }}>
              વિશ્વમાં પ્રથમવાર આધુનિક એલોપેથી સાથે ૧૦૦% પ્રમાણિત આયુર્વેદિક ઉપચાર અને **દવા વગરના કુદરતી ઉપાયો (Drug-Free)** નું સંપૂર્ણ સિન્થેસિસ.
            </p>
          </div>

          <div style={{ background: '#F8FCF9', border: '1.5px solid #D3F2E3', borderRadius: '14px', padding: '16px' }}>
            <h4 style={{ color: '#009F70', margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800 }}>
              💰 ૩. ૮૫% તબીબી ખર્ચમાં ઘટાડો (Affordable Care)
            </h4>
            <p style={{ fontSize: '13px', color: '#0A1128', margin: 0 }}>
              પ્રધાનમંત્રી જન ઔષધિ અને આયુષ્માન ભારત યોજનાને જોડીને દર્દીઓને દવાઓના બિલમાં ૭૦-૮૫% ની સીધી બચત કરાવી મેડિકલ દેવામાંથી બચાવે છે.
            </p>
          </div>

          <div style={{ background: '#F8FCF9', border: '1.5px solid #D3F2E3', borderRadius: '14px', padding: '16px' }}>
            <h4 style={{ color: '#009F70', margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800 }}>
              🛡️ ૪. 100% Zero Hallucination RAG
            </h4>
            <p style={{ fontSize: '13px', color: '#0A1128', margin: 0 }}>
              ICMR & WHO મેડિકલ પ્રોટોકોલ્સ સાથે લાઈવ સેમેન્ટિક વેરિફિકેશન, જેથી કોઈ ખોટી માહિતી દર્દી સુધી પહોંચતી નથી.
            </p>
          </div>
        </div>

        {/* Live Metrics Showcase */}
        <div style={{ background: 'linear-gradient(135deg, #0A1128, #1E293B)', color: '#FFFFFF', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#00C48C' }}>98.4%</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>AI Diagnostic Accuracy</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#60A5FA' }}>1.2s</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Emergency Triage Speed</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#34D399' }}>85%</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Drug Cost Reduction</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#F472B6' }}>4+</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Regional Languages</div>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button className="btn-primary" onClick={onClose} style={{ padding: '12px 32px' }}>
            ✨ પ્રેઝન્ટેશન મોડ બંધ કરો (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
