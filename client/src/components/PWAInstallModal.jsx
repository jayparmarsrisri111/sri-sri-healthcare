import React from 'react';
import { Smartphone, Download, CheckCircle, Share, PlusSquare, Monitor, X, Shield, Sparkles } from 'lucide-react';

export const PWAInstallModal = ({
  isOpen,
  onClose,
  deferredPrompt,
  isInstalled,
  onNativeInstall,
  currentLang = 'gu'
}) => {
  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);
  const isDesktop = !isIOS && !isAndroid;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 11000 }}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          background: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 196, 140, 0.25)',
          border: '2px solid #D3F2E3'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1128 0%, #064E3B 100%)',
          color: '#FFFFFF',
          padding: '22px 24px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1.5px solid #00C48C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img src="/logo.png" alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              {currentLang === 'gu' ? 'શ્રી શ્રી ❤️ હેલ્થકેર એપ ઇન્સ્ટોલ કરો' : currentLang === 'hi' ? 'श्री श्री ❤️ हेल्थकेयर ऐप इंस्टॉल करें' : 'Install Sri Sri ❤️ HealthCare App'}
            </h3>
            <span style={{ fontSize: '12px', color: '#34D399', fontWeight: 600 }}>
              {currentLang === 'gu' ? 'મોબાઇલ અને કમ્પ્યુટર બંને માટે ઉપલબ્ધ (PWA)' : currentLang === 'hi' ? 'मोबाइल और कंप्यूटर दोनों के लिए उपलब्ध (PWA)' : 'Available for Mobile, Tablet & PC (PWA)'}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px' }}>
          {isInstalled ? (
            <div style={{
              textAlign: 'center',
              padding: '24px 16px',
              background: '#F0FDF4',
              borderRadius: '16px',
              border: '1.5px solid #86EFAC'
            }}>
              <CheckCircle size={48} color="#16A34A" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#166534', margin: '0 0 6px 0' }}>
                {currentLang === 'gu' ? 'એપ સફળતાપૂર્વક ઇન્સ્ટોલ કરેલી છે!' : currentLang === 'hi' ? 'ऐप सफलतापूर्वक इंस्टॉल है!' : 'App is Successfully Installed!'}
              </h4>
              <p style={{ fontSize: '13px', color: '#15803D', margin: 0 }}>
                {currentLang === 'gu' ? 'તમે તમારા હોમ સ્ક્રીન કે ડેસ્કટોપ આઇકોન પરથી સીધી જ એપ ચલાવી શકો છો.' : currentLang === 'hi' ? 'आप अपनी होम स्क्रीन या डेस्कटॉप से सीधे ऐप चला सकते हैं।' : 'You can run it directly from your home screen or desktop.'}
              </p>
            </div>
          ) : isIOS ? (
            /* Apple iOS Safari Instructions */
            <div>
              <div style={{
                background: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Smartphone size={20} color="#2563EB" />
                  <strong style={{ color: '#1E40AF', fontSize: '14px' }}>
                    {currentLang === 'gu' ? 'iPhone / iPad પર ઇન્સ્ટોલ કરવાની રીત:' : currentLang === 'hi' ? 'iPhone / iPad पर इंस्टॉल करने का तरीका:' : 'How to Install on iPhone / iPad:'}
                  </strong>
                </div>

                <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: '#1E3A8A', lineHeight: 1.7 }}>
                  <li>
                    {currentLang === 'gu' ? 'સફારી બ્રાઉઝરમાં નીચે આપેલ ' : currentLang === 'hi' ? 'सफारी में नीचे दिया गया ' : 'Tap the '}
                    <strong>📤 Share (શેર)</strong>
                    {currentLang === 'gu' ? ' બટન દબાવો.' : currentLang === 'hi' ? ' बटन दबाएं।' : ' button in Safari.'}
                  </li>
                  <li>
                    {currentLang === 'gu' ? 'મેનુમાં નીચે સ્ક્રોલ કરીને ' : currentLang === 'hi' ? 'नीचे स्क्रॉल करके ' : 'Scroll down and tap '}
                    <strong>➕ Add to Home Screen (હોમ સ્ક્રીન પર ઉમેરો)</strong>
                    {currentLang === 'gu' ? ' પસંદ કરો.' : currentLang === 'hi' ? ' चुनें।' : '.'}
                  </li>
                  <li>
                    {currentLang === 'gu' ? 'ઉપર જમણી બાજુ ' : currentLang === 'hi' ? 'ऊपर दाईं ओर ' : 'Tap '}
                    <strong>'Add'</strong>
                    {currentLang === 'gu' ? ' બટન દબાવો.' : currentLang === 'hi' ? ' दबाएं।' : ' on top right.'}
                  </li>
                </ol>
              </div>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748B' }}>
                {currentLang === 'gu' ? 'આટલું કરતાં જ એપ તમારા iPhone ની હોમ સ્ક્રીન પર એપ સ્ટોરની જેમ ઇન્સ્ટોલ થઈ જશે!' : currentLang === 'hi' ? 'इसके बाद ऐप आपकी होम स्क्रीन पर ऐप स्टोर की तरह इंस्टॉल हो जाएगी!' : 'The app will appear directly on your home screen like an App Store app!'}
              </div>
            </div>
          ) : (
            /* Android / Windows / Mac Chrome & Edge One-Click Install */
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                background: '#F0FAF5',
                borderRadius: '16px',
                border: '1.5px solid #D3F2E3',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#00C48C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>
                  {isAndroid ? <Smartphone size={22} /> : <Monitor size={22} />}
                </div>

                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: 800, color: '#0A1128' }}>
                    {isAndroid
                      ? (currentLang === 'gu' ? 'Android મોબાઇલ એપ તરીકે ઇન્સ્ટોલ' : currentLang === 'hi' ? 'Android मोबाइल ऐप के रूप में इंस्टॉल' : 'Install as Android Mobile App')
                      : (currentLang === 'gu' ? 'Windows / Mac ડેસ્કટોપ એપ તરીકે ઇન્સ્ટોલ' : currentLang === 'hi' ? 'Windows / Mac डेस्कटॉप ऐप के रूप में इंस्टॉल' : 'Install as Windows / Mac Desktop App')}
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#5A6A85' }}>
                    {currentLang === 'gu' ? 'ઇન્ટરનેટ વગર પણ ઝડપી ઓપન થશે અને કોઈ જાહેરાત નહિ આવે.' : currentLang === 'hi' ? 'बिना इंटरनेट भी तेज़ खुलेगा और कोई विज्ञापन नहीं आएगा।' : 'Works offline, opens instantly, and occupies almost zero storage space.'}
                  </p>
                </div>
              </div>

              {deferredPrompt ? (
                <button
                  onClick={onNativeInstall}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 24px rgba(0, 196, 140, 0.35)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Download size={20} />
                  <span>{currentLang === 'gu' ? '📲 હવે ઇન્સ્ટોલ કરો (૧-ક્લિક)' : currentLang === 'hi' ? '📲 अभी इंस्टॉल करें (1-क्लिक)' : '📲 Install Now (1-Click)'}</span>
                </button>
              ) : (
                <div>
                  <div style={{
                    padding: '14px',
                    background: '#FFFBEB',
                    border: '1.5px solid #FDE68A',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: '#B45309',
                    marginBottom: '14px',
                    lineHeight: 1.6
                  }}>
                    {isDesktop ? (
                      currentLang === 'gu'
                        ? '💡 ડેસ્કટોપ બ્રાઉઝર (Chrome / Edge) ના ઉપરના એડ્રેસ બારમાં જમણી બાજુ રહેલા ➕ અથવા 📲 "Install" બટન પર ક્લિક કરીને પણ તમે એપ ઇન્સ્ટોલ કરી શકો છો.'
                        : currentLang === 'hi'
                        ? '💡 डेस्कटॉप ब्राउज़र (Chrome / Edge) के ऊपर एड्रेस बार में दाईं ओर ➕ या 📲 "Install" बटन पर क्लिक करके भी आप ऐप इंस्टॉल कर सकते हैं।'
                        : '💡 You can also install by clicking the ➕ or 📲 "Install App" icon in your browser address bar on the top right.'
                    ) : (
                      currentLang === 'gu'
                        ? '💡 તમારા બ્રાઉઝર મેનુ (ત્રણ ટપકાં ⋮) પર ક્લિક કરો અને "Add to Home screen" (હોમ સ્ક્રીન પર ઉમેરો) પસંદ કરો.'
                        : currentLang === 'hi'
                        ? '💡 अपने ब्राउज़र मेनू (तीन बिंदु ⋮) पर क्लिक करें और "Add to Home screen" चुनें।'
                        : '💡 Tap your browser menu (⋮) and tap "Add to Home screen" or "Install App".'
                    )}
                  </div>

                  <button
                    onClick={onClose}
                    style={{
                      width: '100%',
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '11px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#334155'
                    }}
                  >
                    {currentLang === 'gu' ? 'સમજાઈ ગયું (Close)' : currentLang === 'hi' ? 'समझ आ गया (Close)' : 'Got it (Close)'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3 Key Benefits */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #E2E8F0',
            textAlign: 'center'
          }}>
            <div>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                {currentLang === 'gu' ? 'સુપરફાસ્ટ' : currentLang === 'hi' ? 'सुपरफास्ट' : 'Lightning Fast'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '18px' }}>📴</span>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                {currentLang === 'gu' ? 'ઓફલાઇન સપોર્ટ' : currentLang === 'hi' ? 'ऑफलाइन सपोर्ट' : 'Offline Support'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '18px' }}>💾</span>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                {currentLang === 'gu' ? 'માત્ર 1 MB સાઈઝ' : currentLang === 'hi' ? 'सिर्फ 1 MB साइज' : 'Lightweight (1MB)'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
