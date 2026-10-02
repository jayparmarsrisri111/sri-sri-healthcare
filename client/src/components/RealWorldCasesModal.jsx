import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, AlertTriangle, Shield, HeartPulse, X } from 'lucide-react';

export const RealWorldCasesModal = ({ onSelectCase, isOpen, onClose }) => {
  if (!isOpen) return null;

  const realCases = [
    {
      id: 1,
      title: "કેસ ૧: ભુજના ખેડૂતને છાતીમાં અચાનક દુખાવો (Cardiac Emergency)",
      problem: "ગામડામાં કાર્ડિયોલોજિસ્ટ નથી. ખેડૂતને સામાન્ય ગેસ સમજીને ઘરે બેસી રહેવાથી જીવ જઈ શકે છે.",
      solution: "AI શબ્દો સાંભળતાં જ RED Alert આપે છે -> તાત્કાલિક ૧૦૮ એમ્બ્યુલન્સ રવાના કરે છે -> નજીકના GK સિવિલ હોસ્પિટલ ભુજનો ICU રૂટ બતાવે છે.",
      symptoms: "મને બે કલાકથી છાતીમાં ખૂબ દુખાવો થાય છે, ડાબા હાથમાં કળતર અને ખૂબ પરસેવો વળે છે.",
      badge: "🚨 જીવનરક્ષક ઈમરજન્સી",
      badgeColor: "#DE350B"
    },
    {
      id: 2,
      title: "કેસ ૨: આશા બહેન દ્વારા બાળકનો ન્યુમોનિયા X-Ray સ્કેન",
      problem: "ગામમાં પેડિયાટ્રિશિયન ડૉક્ટર નથી. બાળકના કફ અને તાવની ગંભીરતા ઓળખાતી નથી.",
      solution: "ASHA બહેન છાતીના X-Ray નો ફોટો પાડે છે -> AI ન્યુમોનિયા કન્સોલિડેશન ઓળખીને એન્ટિબાયોટિક્સ અને સિતોપલાદિ ચૂર્ણ + સ્ટીમની સલાહ આપે છે -> નજીકના CHC નખત્રાણામાં 14 બેડ ખાલી છે તે બતાવે છે.",
      symptoms: "મારા ૫ વર્ષના દીકરાને ત્રણ દિવસથી ઊંચો તાવ, છાતીમાં કફ અને શ્વાસ લેવામાં ઘરઘરાટી થાય છે.",
      badge: "🩻 વિઝન ડાયગ્નોસ્ટિક્સ",
      badgeColor: "#DD6B20"
    },
    {
      id: 3,
      title: "કેસ ૩: ગરીબ પરિવાર માટે ડાયાબિટીસ અને BP નો દવાનો ખર્ચ",
      problem: "ખાનગી મેડિકલ સ્ટોરમાંથી દર મહિને ₹3,500 ની બ્રાન્ડેડ દવાઓ લેવાથી ગરીબ પરિવાર દેવામાં ડૂબી જાય છે.",
      solution: "AI પ્રધાનમંત્રી જન ઔષધિ કેન્દ્ર પરથી એ જ સાચી જેનેરિક દવાઓ માત્ર ₹480 માં (૮૫% ની સીધી બચત) મેળવવાનો રસ્તો અને આયુષ્માન ભારત કાર્ડની વિગતો આપે છે.",
      symptoms: "મને વારંવાર પેશાબ જવું પડે છે, થાક લાગે છે અને BP હાઈ રહે છે.",
      badge: "🏛️ ૮૫% આર્થિક બચત",
      badgeColor: "#00C48C"
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(10, 17, 40, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        border: '1.5px solid #D1F2E3'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ color: '#0A1128', fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles color="#00C48C" size={24} />
              વાસ્તવિક સમસ્યાઓ અને AI સોલ્યુશન સિમ્યુલેટર
            </h2>
            <p style={{ color: '#4A5568', fontSize: '13px', marginTop: '4px' }}>
              નીચેનામાંથી કોઈપણ વાસ્તવિક કેસ પર ક્લિક કરો અને જુઓ કે આ વેબએપ કેવી રીતે જીવ બચાવે છે:
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#EBFBF3', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} color="#0A1128" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {realCases.map((c) => (
            <div
              key={c.id}
              style={{
                border: '1.5px solid #D1F2E3',
                borderRadius: '14px',
                padding: '18px',
                background: '#F8FCF9',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                onSelectCase(c.symptoms);
                onClose();
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: '#FFFFFF', color: c.badgeColor, border: `1px solid ${c.badgeColor}`, padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                  {c.badge}
                </span>
                <span style={{ fontSize: '12px', color: '#00C48C', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  લાઈવ ટેસ્ટ કરો <ArrowRight size={14} />
                </span>
              </div>

              <h4 style={{ color: '#0A1128', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{c.title}</h4>
              <p style={{ fontSize: '13px', color: '#DE350B', margin: '4px 0' }}><b>❌ સમસ્યા:</b> {c.problem}</p>
              <p style={{ fontSize: '13px', color: '#009F70', margin: '4px 0' }}><b>✅ SwasthyaSetu AI સોલ્યુશન:</b> {c.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
