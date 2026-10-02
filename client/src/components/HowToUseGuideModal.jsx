import React, { useState } from 'react';
import {
  HelpCircle, X, Volume2, VolumeX, Mic, Pill, Eye,
  Activity, ShieldAlert, Stethoscope, Sparkles, CheckCircle2,
  ChevronRight, HeartHandshake, PhoneCall, Brain, Award, Play, Check
} from 'lucide-react';

export const HowToUseGuideModal = ({ isOpen, onClose, currentLang = 'gu' }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'features' | 'voice'
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([1]);

  const toggleStep = (stepNum) => {
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
    }
  };

  // Gujarati voice assistant to speak out the guide for elderly/rural people
  const handlePlayVoiceGuide = () => {
    if (!('speechSynthesis' in window)) {
      alert("તમારા બ્રાઉઝરમાં અવાજ સુવિધા ઉપલબ્ધ નથી.");
      return;
    }

    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }

    let guideText = "";
    let speechLang = "gu-IN";

    if (currentLang === 'hi') {
      speechLang = "hi-IN";
      guideText = "नमस्ते! श्री श्री हेल्थकेयर एप्लीकेशन में आपका स्वागत है। " +
        "चरण १: माइक बटन दबाएं और अपने लक्षण बोलें, जैसे सिरदर्द या बुखार है। एआई आपको तुरंत घरेलू उपचार और दवाएं बताएगा। " +
        "चरण २: यदि गांव में सांप काट ले या कीटनाशक जहर चढ़े, तो लाइफलाइन टैब में जाकर तुरंत १०८ और एंटी स्नेक वेनम खोजें। " +
        "चरण ३: महंगी दवाओं के बजाय जन औषधि केंद्र खोजकर ८५ प्रतिशत पैसे बचाएं। " +
        "चरण ४: कैमरे के सामने देखकर आंखों का नंबर और दिल की धड़कन मापें। आपका दिन शुभ हो!";
    } else if (currentLang === 'en') {
      speechLang = "en-US";
      guideText = "Hello! Welcome to Sri Sri HealthCare AI coordinator. " +
        "Step 1: Tap the microphone and speak your symptoms naturally. The AI will instantly assess your triage and recommend cures. " +
        "Step 2: For village emergencies and snakebites, use the Rural Lifeline tab to locate anti-venom and dispatch 108. " +
        "Step 3: Save 85% by finding subsidized Jan Aushadhi generic medicines. " +
        "Step 4: Use your camera to measure vital signs and eye power. Have a healthy day!";
    } else if (currentLang === 'es') {
      speechLang = "es-ES";
      guideText = "¡Hola! Bienvenido a Sri Sri HealthCare. " +
        "Paso 1: Hable sus síntomas directamente al micrófono. " +
        "Paso 2: En emergencias rurales use la línea de ayuda inmediata. " +
        "Paso 3: Ahorre hasta 85% en medicamentos genéricos. " +
        "Paso 4: Mida sus signos vitales con la cámara. ¡Que tenga un excelente día!";
    } else {
      speechLang = "gu-IN";
      guideText = 
        "નમસ્તે! શ્રી શ્રી હેલ્થકેર એપ્લિકેશનમાં આપનું સ્વાગત છે. " +
        "આ એપ વાપરવી ખૂબ જ સરળ છે. " +
        "પગલું ૧: માઈક બટન દબાવો અને તમારા લક્ષણ બોલો, જેમ કે મને માથું દુખે છે અથવા તાવ છે. એઆઈ તમને તુરંત જ ઘરેલું ઉપચાર અને દવા બતાવશે. " +
        "પગલું ૨: જો ગામડામાં સાપ કરડ્યો હોય કે કીટનાશક ઝેર ચડ્યું હોય, તો લાઈફલાઈન ટેબમાં જઈ તાત્કાલિક ૧૦૮ અને એન્ટિ સ્નેક વેનમ વાયલ શોધો. " +
        "પગલું ૩: મોંઘી દવાના બદલે જન ઔષધિ કેન્દ્ર શોધીને ૮૫ ટકા પૈસા બચાવો. " +
        "પગલું ૪: કેમેરા સામે જોઈને આંખના ચશ્માના નંબર અને ધબકારા માપો. " +
        "અમારું એઆઈ સતત શીખે છે અને સો ટકા સાચો જવાબ આપે છે. આપનો દિવસ શુભ રહે!";
    }

    const utterance = new SpeechSynthesisUtterance(guideText);
    utterance.lang = speechLang;
    utterance.rate = 0.9; // Slow and clear for understanding

    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingVoice(true);
  };

  const handleClose = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
    onClose();
  };

  const stepsList = [
    {
      num: 1,
      title: "🎙️ તમારી ભાષામાં બોલો (Speak Symptoms)",
      subtitle: "કોઈપણ અભણ વ્યક્તિ પણ માઈક દબાવીને સીધું બોલી શકે છે",
      detail: "સ્ક્રીન પર દેખાતું મોટું 'માઈક' બટન દબાવો અને બોલો (દા.ત. 'મને પેટમાં દુખે છે' અથવા 'મને શરદી-તાવ છે'). AI ૧ સેકન્ડમાં સમજશે અને શું કરવું તે રંગીન અક્ષરોમાં બતાવશે.",
      color: "#00C48C",
      badge: "સૌથી સરળ"
    },
    {
      num: 2,
      title: "🌾 ગામડાની કટોકટી & સર્પદંશ સહાય (Rural Lifeline)",
      subtitle: "સાપ કરડે કે ખેતરમાં ઝેરી દવાની અસર થાય ત્યારે તાત્કાલિક રક્ષણ",
      detail: "સાઇડબારમાં '🌾 ગ્રામીણ લાઈફલાઈન' ખોલો. ત્યાં સાપની ઓળખ, દોરી ન બાંધવાની ચેતવણી, તાલુકા હોસ્પિટલમાં ASV વાયલનો લાઈવ સ્ટોક અને ૧૦૮ કૉલ બટન મળશે.",
      color: "#EF4444",
      badge: "જીવનરક્ષક"
    },
    {
      num: 3,
      title: "💊 સસ્તી જેનેરિક દવા શોધો (Save 85% on Meds)",
      subtitle: "બ્રાન્ડેડ દવા ₹૧૧૫ ની સામે સરકારી દવા માત્ર ₹૧૪ માં",
      detail: "'લાઈવ દવા & GPS રડાર' ખોલો. તમારી નજીકના ૨૪ કલાક ખુલ્લા મેડિકલ સ્ટોર અને જન ઔષધિ કેન્દ્ર લાઈવ નકશા પર દેખાશે. ત્યાંથી વોટ્સએપ પર દવા રિઝર્વ પણ કરી શકો છો.",
      color: "#0284C7",
      badge: "૮૫% બચત"
    },
    {
      num: 4,
      title: "👁️ કેમેરાથી આંખના નંબર & ધબકારા (Scan Eye & Vitals)",
      subtitle: "ઘરે બેઠા જાપાનીઝ પદ્ધતિથી ચશ્માના નંબર અને હાર્ટ રેટ માપો",
      detail: "'આંખના નંબર' ટેબમાં કેમેરા સામે ચહેરો રાખી સ્કેન કરો. દૂરના અને વાંચવાના (+1.00 થી +2.50) નંબરની પ્રિસ્ક્રિપ્શન સ્લિપ મળશે. વાઇટલ્સ ટેબથી ધબકારા (BPM) પણ મપાય છે.",
      color: "#8B5CF6",
      badge: "જાપાનીઝ AI"
    },
    {
      num: 5,
      title: "🧠 ૧૦૦% સાચો AI & સેલ્ફ-ટ્રેનિંગ (Continuous Learning)",
      subtitle: "AI કામ કરે તેની સાથે વધુ તાલીમ મેળવી ૧૦૦% ચોકસાઈ રાખે છે",
      detail: "દરેક જવાબો પર '👍 સાચો જવાબ છે' અથવા '✍️ સુધારો શીખવો' બટન છે. તમારા પ્રતિસાદથી AI તુરંત શીખીને વધુ સચોટ બને છે.",
      color: "#10B981",
      badge: "૧૦૦% સચોટ"
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(10, 17, 40, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 196, 140, 0.35)',
        border: '2px solid #00C48C',
        overflow: 'hidden',
        animation: 'slideUpFade 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1128 0%, #064E3B 100%)',
          color: '#FFFFFF',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'rgba(0, 196, 140, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #00C48C'
            }}>
              <HelpCircle size={24} color="#00C48C" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                📖 સરળ માર્ગદર્શિકા - ઍપ કેવી રીતે વાપરવી?
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#A7F3D0' }}>
                Step-by-Step Easy Visual Guide for Everyone (શિક્ષિત કે ગ્રામીણ કોઈપણ વ્યક્તિ માટે)
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '10px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Audio Assistant Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          padding: '14px 24px',
          borderBottom: '1.5px solid #A7F3D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>📢</span>
            <div>
              <strong style={{ fontSize: '13.5px', color: '#065F46', display: 'block' }}>
                વાંચવામાં તકલીફ છે? અવાજ દ્વારા સાંભળો:
              </strong>
              <span style={{ fontSize: '11.5px', color: '#047857' }}>
                વડીલો કે અભણ વ્યક્તિ માટે બોલીને સંભળાવતો ગુજરાતી વૉઇસ આસિસ્ટન્ટ
              </span>
            </div>
          </div>

          <button
            onClick={handlePlayVoiceGuide}
            style={{
              background: isPlayingVoice ? '#EF4444' : 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
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
              boxShadow: '0 4px 12px rgba(0, 196, 140, 0.3)'
            }}
          >
            {isPlayingVoice ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isPlayingVoice ? 'અવાજ બંધ કરો' : '🔊 ગુજરાતીમાં સાંભળો'}</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Quick Step Indicators */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F8FCF9',
            padding: '10px 16px',
            borderRadius: '14px',
            border: '1px solid #D3F2E3',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#0A1128'
          }}>
            <span>✨ ૫ સરળ પગલાંમાં સંપૂર્ણ સારવાર:</span>
            <span style={{ color: '#009F70' }}>
              પૂર્ણ કરેલ પગલાં: {completedSteps.length}/5
            </span>
          </div>

          {/* Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stepsList.map((step) => {
              const isDone = completedSteps.includes(step.num);
              return (
                <div
                  key={step.num}
                  onClick={() => toggleStep(step.num)}
                  style={{
                    background: isDone ? '#FFFFFF' : '#FAFAFA',
                    border: `1.5px solid ${isDone ? step.color : '#E2E8F0'}`,
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isDone ? '0 4px 14px rgba(0,0,0,0.04)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isDone ? step.color : '#CBD5E1',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '13px'
                      }}>
                        {isDone ? <Check size={16} /> : step.num}
                      </div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0A1128' }}>
                        {step.title}
                      </h4>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: '8px',
                      background: `${step.color}18`,
                      color: step.color
                    }}>
                      {step.badge}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5, paddingLeft: '38px' }}>
                    {step.detail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Emergency 108 Direct Call Strip */}
          <div style={{
            background: '#FEF2F2',
            border: '1.5px solid #EF4444',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#EF4444',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🚑
              </div>
              <div>
                <strong style={{ fontSize: '13.5px', color: '#991B1B', display: 'block' }}>
                  કોઈપણ ગંભીર ઈમરજન્સીમાં તાત્કાલિક ૧૦૮ ડાયલ કરો
                </strong>
                <span style={{ fontSize: '11.5px', color: '#B91C1C' }}>
                  હાર્ટ એટેક, ગંભીર સર્પદંશ કે બેભાન અવસ્થામાં રાહ ન જુઓ
                </span>
              </div>
            </div>

            <a
              href="tel:108"
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                textDecoration: 'none',
                padding: '9px 18px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              <PhoneCall size={15} />
              <span>૧૦૮ કૉલ કરો</span>
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          background: '#F8FCF9',
          borderTop: '1.5px solid #D3F2E3',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
            🌿 ૧૦૦% સરકારી ICMR & આયુષ પ્રમાણિત સ્વાસ્થ્ય સેવા
          </span>

          <button
            onClick={handleClose}
            style={{
              background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 196, 140, 0.25)'
            }}
          >
            સમજાઈ ગયું! ઍપ શરૂ કરો ✓
          </button>
        </div>
      </div>
    </div>
  );
};
