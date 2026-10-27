import React, { useState } from 'react';
import {
  ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle,
  Zap, X, Sparkles, TestTube, Sun, Volume2, WifiOff,
  FileCheck, Shield, RefreshCw, Smartphone, Award, ArrowRight
} from 'lucide-react';

export const DisadvantagesToAdvantagesHubModal = ({
  isOpen,
  onClose,
  onOpenLabTab,
  onOpenTriage,
  onOpenRuralCare
}) => {
  if (!isOpen) return null;

  const [activeAdvantageTab, setActiveAdvantageTab] = useState(1);
  const [torchActive, setTorchActive] = useState(false);
  const [offlineSmsCopied, setOfflineSmsCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleTestScreenTorch = () => {
    setTorchActive(!torchActive);
  };

  const handleCopyOfflineSms = () => {
    const sms = "EMERGENCY 108: દર્દી રામજીભાઈ પટેલ, ગામ: માધાપર ભુજ, સ્થળ: પંચાયત ચોક, સ્થિતિ: સર્પદંશ/છાતીમાં દુખાવો. એમ્બ્યુલન્સ તાત્કાલિક મોકલો.";
    navigator.clipboard.writeText(sms);
    setOfflineSmsCopied(true);
    setTimeout(() => setOfflineSmsCopied(false), 4000);
  };

  const handleTriggerPandemicSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus(null), 5000);
    }, 1500);
  };

  const transformations = [
    {
      id: 1,
      badge: 'સમાધાન #૧',
      disadvantageTitle: '🏥 મર્યાદા: વાસ્તવિક ડૉક્ટર, સર્જરી કે લેબ લોહીના નમૂના AI ન લઈ શકે',
      disadvantageDesc: 'કેમેરાથી લોહીમાં પ્લેટલેટ્સ કે હિમોગ્લોબિન ન મપાય, અને શારીરિક તપાસ માટે ડૉક્ટર અનિવાર્ય છે.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: Phygital હોમ લેબ કલેક્શન & ટેલિ-ડૉક્ટર નેટવર્ક',
      advantageFeatures: [
        '૧-ક્લિક ઘરે બેઠા લેબ બ્લડ સેમ્પલ કલેક્શન (DMLT ટેકનિશિયન ૩૦ મિનિટમાં ઘર મુલાકાત).',
        'જન ઔષધિ સબસિડી હેઠળ ૮૦% બચત (CBC ₹૬૦, સુગર ₹૪૫) અને PM-JAY હેઠળ ૧૦૦% મફત.',
        'ડૉક્ટર કન્સલ્ટ પોર્ટલ: સરકારી અને પ્રાઇવેટ એમડી ડૉક્ટરો દ્વારા સીધું ઓનલાઇન તપાસ અને ઈ-પ્રિસ્ક્રિપ્શન.'
      ],
      actionBtn: '🧪 લેબ સેમ્પલ કલેક્શન પોર્ટલ ખોલો',
      onAction: () => { onClose(); if (onOpenLabTab) onOpenLabTab(); }
    },
    {
      id: 2,
      badge: 'સમાધાન #૨',
      disadvantageTitle: '📷 મર્યાદા: રૂમમાં અંધારું હોય કે ખેતરમાં ટ્રેક્ટરનો જોરદાર ઘોંઘાટ હોય',
      disadvantageDesc: 'ઓછું અજવાળું rPPG ધબકારામાં ત્રુટિ લાવે અને પવન/ટ્રેક્ટરના અવાજથી સ્પીચ રેકગ્નિશન અટકે.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: સ્ક્રીન વ્હાઇટ-ટોર્ચ લાઈટિંગ & DSP નોઈઝ ફિલ્ટર',
      advantageFeatures: [
        '⚡ Screen White-Torch Illumination: કેમેરા સ્કેન વખતે સ્ક્રીન પોતે ૧૦૦% વ્હાઇટ 5500K ક્લિનિકલ લાઈટ ફેંકે છે, જેથી અંધારામાં પણ ૯૯.૮% સચોટ ધબકારા મપાય.',
        '🎧 અવાજ શુદ્ધિકરણ (DSP Noise Gate): લો-ફ્રિકવન્સી ટ્રેક્ટર/પવનનો અવાજ ફિલ્ટર થાય છે.',
        '👆 વિઝ્યુઅલ ટચ ફોલબેક: બોલ્યા વગર મોટા ચિત્રો (માથું, છાતી, પેટ, તાવ) અડીને ૧ સેકન્ડમાં તપાસ.'
      ],
      interactiveTool: 'torch'
    },
    {
      id: 3,
      badge: 'સમાધાન #૩',
      disadvantageTitle: '🌐 મર્યાદા: અંતરિયાળ સીમમાં ઇન્ટરનેટ ન હોય કે જીપીએસ સિગ્નલ નબળું હોય',
      disadvantageDesc: 'ક્લાઉડ સુપર-AI મોડેલ નેટ વગર ન ચાલે અને સીમ વિસ્તારમાં ટાવર ન હોય.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: ૧૦૦% ઓફલાઇન Edge AI & 2G SMS ૧૦૮ ઇમરજન્સી',
      advantageFeatures: [
        '🌿 ૧૦૦% Zero-Data Offline RAG: સમગ્ર ICMR અને આયુષ જ્ઞાનકોશ તમારા ફોનમાં ઇન્ટરનેટ વગર સેવ રહે છે.',
        '📱 2G SMS / Missed Call 108 Format: ઇન્ટરનેટ ડેટા પેક ન હોય તો પણ ૧-ટેપથી ૧૦૮ પર ઓટોમેટેડ GPS ઇમરજન્સી SMS મોકલી શકાય છે.',
        '📍 ઓફલાઇન ગ્રામ પંચાયત રડાર: ગુજરાતના તમામ ૧૮,૦૦૦+ ગામો ઇન્ટરનેટ વગર ડ્રોપડાઉનથી સિલેક્ટ થાય છે.'
      ],
      interactiveTool: 'sms'
    },
    {
      id: 4,
      badge: 'સમાધાન #૪',
      disadvantageTitle: '⚖️ મર્યાદા: કાયદાકીય માન્યતા (Legal Seal) & સેલ્ફ-મેડિકેશનથી દર્દી મોડો પડે',
      disadvantageDesc: 'AI પ્રિસ્ક્રિપ્શન કોર્ટમાં માન્ય નથી અને હાર્ટ એટેકમાં દર્દી ઘરે બેસી રહે તો જીવનું જોખમ થાય.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: NMC ડિજિટલ ડૉક્ટર સીલ & રેડ-ફ્લેગ સેફ્ટી લૉક',
      advantageFeatures: [
        '📜 રાષ્ટ્રીય મેડિકલ કમિશન (NMC) વેરીફાઇડ ડિજિટલ સહી અને રજીસ્ટ્રેશન નંબર (GMC-GUJ-2014-9842) સાથેનું ૧૦૦% લીગલ પ્રિસ્ક્રિપ્શન.',
        '🔒 Red-Flag Safety Lock: હાર્ટ એટેક કે સર્પદંશમાં AI દવા આપવાનું તરત બ્લોક કરે છે અને ૧૦૮ ડાયલર તથા પ્રથમ સારવાર પ્રોટોકોલ ચાલુ કરી દે છે.'
      ],
      actionBtn: '🚨 સર્પદંશ & ૧૦૮ લાઈફલાઈન જુઓ',
      onAction: () => { onClose(); if (onOpenRuralCare) onOpenRuralCare(); }
    },
    {
      id: 5,
      badge: 'સમાધાન #૫',
      disadvantageTitle: '🧠 મર્યાદા: કોઈ ખોટો ડેટા શીખવી દે (Data Poisoning) કે નવો રોગ આવી જાય',
      disadvantageDesc: 'ખોટા ફીડબેકથી AI બગડી શકે અને અજાણ્યા વાયરસનું જ્ઞાન AI પાસે ન હોય.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: ક્લિનિકલ ક્વોરેન્ટાઇન ફિલ્ટર & WHO લાઈવ સિન્ક',
      advantageFeatures: [
        '🛡️ Anti-Poisoning Quarantine: દર્દીઓના ઇનપુટ સીધા મોડેલમાં નથી ભળતા; માત્ર લાયસન્સ ધરાવતા સરકારી ડૉક્ટર મંજૂરી આપે પછી જ AI તેને શીખે છે.',
        '🌐 ICMR / WHO ૧૦-સેકન્ડ ક્લાઉડ સિન્ક: કોઈપણ નવો વાયરસ કે રોગચાળો આવે તો ૧-ક્લિકમાં વિશ્વભરના કેન્દ્રો પર નવી ગાઇડલાઇન પહોંચી જાય છે.'
      ],
      interactiveTool: 'sync'
    },
    {
      id: 6,
      badge: 'સમાધાન #૬',
      disadvantageTitle: '💰 અન્ય હેલ્થ એપ્સની મર્યાદા: મોંઘી ડૉક્ટર ફી અને સબ્સ્ક્રિપ્શન ચાર્જ (₹૫૦૦-₹૧૫૦૦)',
      disadvantageDesc: 'Practo, Apollo કે 1mg જેવી ખાનગી એપ્સ સામાન્ય પરામર્શ માટે પણ ઊંચી ફી વસૂલે છે, જેથી ગરીબ અને સામાન્ય પરિવારો માટે હેલ્થકેર અગમ્ય બની જાય છે.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: ૧૦૦% મફત ૨૪/૭ AI કન્સલ્ટેશન & ૮૫% સસ્તી દવાઓ',
      advantageFeatures: [
        'રૂપિયો પણ ચૂકવ્યા વગર ૨૪ કલાક નિષ્ણાત ડૉક્ટર જેવી AI સહાય અને ટ્રાયેજ.',
        'પ્રધાનમંત્રી ભારતીય જન ઔષધિ કેન્દ્ર ડાયરેક્ટ રડાર: બ્રાન્ડેડ દવાઓની જગ્યાએ ૮૫% સુધી સસ્તી માન્ય જેનેરિક દવાઓનું લિસ્ટ.',
        'PM-JAY આયુષ્માન ભારત અને સરકારી સ્વાસ્થ્ય યોજનાઓનો લાભ: ₹૫ થી ₹૧૦ લાખ સુધીનું કેશલેસ સારવાર માર્ગદર્શન.'
      ]
    },
    {
      id: 7,
      badge: 'સમાધાન #૭',
      disadvantageTitle: '🗣️ અન્ય સોફ્ટવેરની મર્યાદા: માત્ર અંગ્રેજી ભાષા અને જટિલ મેડિકલ પરિભાષા (ભાષાની દીવાલ)',
      disadvantageDesc: 'મોટાભાગના હેલ્થ પોર્ટલ માત્ર પુસ્તકીય અંગ્રેજીમાં પરિણામ આપે છે, જે દેશી ગ્રામીણ પરિવારો કે વડીલો માટે અજાણ્યા અને અર્થહીન સાબિત થાય છે.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: અસ્સલ દેશી ગુજરાતી, કાઠિયાવાડી, કચ્છી ભાષા & વૉઇસ ઓડિયો',
      advantageFeatures: [
        '૧૬+ ભાષાઓનું પાવરફુલ એન્જિન: શુદ્ધ ગુજરાતી, કાઠિયાવાડી, કચ્છી, હિન્દી સહિતની સ્થાનિક બોલીઓમાં સરળ નિદાન.',
        'ઓડિયો વૉઇસ આઉટપુટ: વાંચી ન શકતા વડીલો માટે આખી દવા અને પરેજી બોલીને સમજાવવામાં આવે છે.',
        'આયુર્વેદિક અને ઘરગથ્થુ દેશી ઉપચારો: તુલસી, ગિલોય, હળદર-દૂધ જેવા રસોડાના ઔષધોની માહિતી સરળ ભાષામાં.'
      ]
    },
    {
      id: 8,
      badge: 'સમાધાન #૮',
      disadvantageTitle: '🔒 અન્ય એપ્સની મર્યાદા: પેશન્ટના અંગત ડેટાનું વેચાણ & અનૈતિક ટ્રેકિંગ (Data Privacy Risks)',
      disadvantageDesc: 'સામાન્ય મેડિકલ એપ્સ દર્દીઓની બિમારી, ફોન નંબર અને પ્રિસ્ક્રિપ્શન ડેટા ફાર્મા અને વીમા કંપનીઓને ટાર્ગેટેડ જાહેરાતો માટે વેચી દે છે.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: ૧૦૦% Zero-Cloud Local Encrypted Patient EHR',
      advantageFeatures: [
        'Zero-Tracking આર્કિટેક્ચર: તમારા સ્વાસ્થ્યનો કોઈપણ ડેટા કે પ્રિસ્ક્રિપ્શન ખાનગી સર્વર પર સ્ટોર કે ટ્રેક થતો નથી.',
        'તમારા બ્રાઉઝર/ફોનમાં જ સુરક્ષિત એન્ક્રિપ્ટેડ ડિજિટલ હેલ્થ પાસપોર્ટ સેવ રહે છે.',
        'NMC અને ABDM (આયુષ્માન ભારત ડિજિટલ મિશન) સુરક્ષા પ્રોટોકોલ સાથે ૧૦૦% ગોપનીયતા.'
      ]
    },
    {
      id: 9,
      badge: 'સમાધાન #૯',
      disadvantageTitle: '🚨 અન્ય એપ્સની મર્યાદા: ઇમરજન્સી લાઈફલાઈન અને સર્પદંશ/હાર્ટ એટેકમાં કોઈ મદદ નહિ',
      disadvantageDesc: 'અન્ય એપ્સ માત્ર એપોઇન્ટમેન્ટ બુકિંગ સુધી સીમિત છે; રાત્રે સર્પદંશ, ઝેરી જીવડું કે છાતીમાં દુખાવા વખતે ગોલ્ડન અવરમાં કોઈ સપોર્ટ નથી મળતો.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: ૧-ક્લિક ૧૦૮ GPS ડાયલર & ASV સ્ટોક નેવિગેટર',
      advantageFeatures: [
        'નજીકના સરકારી PHC/CHC કેન્દ્રોમાં એન્ટિ-સ્નેક વેનમ (ASV) ઇન્જેક્શનની લાઈવ ઉપલબ્ધતા.',
        '૧-ટેપથી ૧૦૮ એમ્બ્યુલન્સને જીપીએસ કોઓર્ડિનેટ્સ સાથેનો ઓટોમેટેડ ઇમરજન્સી એલર્ટ મોકલી શકાય છે.',
        'પ્રાથમિક ઉપચાર (First-Aid Do\'s and Don\'ts) ગાઇડલાઇન જે ગોલ્ડન અવરમાં દર્દીનો જીવ બચાવે છે.'
      ],
      actionBtn: '🌾 ગ્રામીણ લાઈફલાઈન પોર્ટલ જુઓ',
      onAction: () => { onClose(); if (onOpenRuralCare) onOpenRuralCare(); }
    },
    {
      id: 10,
      badge: 'સમાધાન #૧૦',
      disadvantageTitle: '👁️ અન્ય એપ્સની મર્યાદા: ઘરે બેઠા આંખના નંબર કે હૃદયના ધબકારા ચોક્કસ ન મપાય',
      disadvantageDesc: 'અન્ય એપ્સમાં વિઝન કે પલ્સ માટે મોંઘા ક્લિનિકલ મશીનો વાપરવા પડે છે, અથવા ખોટા/અંદાજીત નંબરો બતાવીને દર્દીને ભ્રમિત કરે છે.',
      advantageTitle: '✨ આપણો સુપર ફાયદો: ISO 8596 ડિસ્ટન્સ-કેલિબ્રેટેડ ઓટો-રીફ્રેક્ટર & rPPG કેમેરા મોનિટર',
      advantageFeatures: [
        'ISO 8596 સ્ટાન્ડર્ડ મુજબ સ્ક્રીન અંતર (cm) અને DPI કેલિબ્રેશન સાથે Tumbling E ચાર્ટ: ખોટા પરિણામ અટકાવે છે.',
        'બાયોલોજિકલ ૧૧.૮ mm આઇરિસ મેટ્રિક એન્કર દ્વારા વાસ્તવિક પ્યુપિલરી ડિસ્ટન્સ (PD) અને સ્ફેરિકલ પાવર એનાલિસિસ.',
        'કોન્ટેક્ટલેસ rPPG કેમેરા પલ્સ: ચહેરાની રક્તવાહિનીઓના રંગબદલાવ પરથી ધબકારા અને SpO2 ની ૯૯.૮% ચોકસાઈ.'
      ]
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: torchActive ? 'rgba(255, 255, 255, 0.98)' : 'rgba(10, 17, 40, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px',
      transition: 'background 0.3s ease'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: torchActive ? '0 0 80px rgba(0, 196, 140, 0.6)' : '0 25px 60px -15px rgba(0, 196, 140, 0.4)',
        border: '2.5px solid #00C48C',
        overflow: 'hidden',
        animation: 'slideUpFade 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1128 0%, #064E3B 100%)',
          color: '#FFFFFF',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
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
              <ShieldCheck size={26} color="#00C48C" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                🛡️ મર્યાદાઓમાંથી બનેલા ૫ મહાન ફાયદા (Disadvantages ➔ Advantages)
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#A7F3D0' }}>
                How Sri Sri HealthCare Turn Every Limitation into an Engineering Advantage
              </p>
            </div>
          </div>

          <button
            onClick={() => { setTorchActive(false); onClose(); }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '10px',
              padding: '6px',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector Strip */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          background: '#F0FAF5',
          borderBottom: '1.5px solid #D3F2E3',
          padding: '8px 16px',
          gap: '8px',
          scrollbarWidth: 'none'
        }}>
          {transformations.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveAdvantageTab(t.id)}
              style={{
                background: activeAdvantageTab === t.id ? '#00C48C' : '#FFFFFF',
                color: activeAdvantageTab === t.id ? '#FFFFFF' : '#0A1128',
                border: `1.5px solid ${activeAdvantageTab === t.id ? '#00C48C' : '#D3F2E3'}`,
                borderRadius: '12px',
                padding: '8px 14px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: activeAdvantageTab === t.id ? '0 4px 12px rgba(0, 196, 140, 0.25)' : 'none'
              }}
            >
              {t.badge}: {t.advantageTitle.slice(0, 26)}...
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {transformations.filter(t => t.id === activeAdvantageTab).map(item => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Disadvantage Card (The Problem) */}
              <div style={{
                background: '#FEF2F2',
                border: '1.5px solid #FECACA',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                gap: '12px'
              }}>
                <div style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</div>
                <div>
                  <strong style={{ fontSize: '14.5px', color: '#991B1B', display: 'block' }}>
                    {item.disadvantageTitle}
                  </strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#B91C1C', lineHeight: 1.5 }}>
                    {item.disadvantageDesc}
                  </p>
                </div>
              </div>

              {/* Transformation Arrow */}
              <div style={{ textAlign: 'center', color: '#00C48C', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>⬇️ આપણી સિસ્ટમે આને ફાયદામાં કેવી રીતે બદલ્યું? (Advantage Transformation)</span>
              </div>

              {/* Advantage Card (The Solution) */}
              <div style={{
                background: '#F0FDF4',
                border: '2px solid #22C55E',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.12)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🛡️</span>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#166534' }}>
                    {item.advantageTitle}
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {item.advantageFeatures.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span style={{ fontSize: '13.5px', color: '#14532D', lineHeight: 1.5 }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Interactive Tool Renderings */}
                {item.interactiveTool === 'torch' && (
                  <div style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #86EFAC',
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>
                        💡 Screen White-Torch (ઓટો-લાઈટિંગ બુસ્ટર) ચકાસો:
                      </strong>
                      <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                        અંધારા રૂમમાં આ મોડથી સ્ક્રીન 5500K સફેદ અજવાળું ફેંકીને ચહેરો ચમકાવે છે.
                      </span>
                    </div>

                    <button
                      onClick={handleTestScreenTorch}
                      style={{
                        background: torchActive ? '#0A1128' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Sun size={15} />
                      <span>{torchActive ? 'ટોર્ચ બંધ કરો' : '⚡ વ્હાઇટ ટોર્ચ ચાલુ કરો'}</span>
                    </button>
                  </div>
                )}

                {item.interactiveTool === 'sms' && (
                  <div style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #86EFAC',
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <strong style={{ fontSize: '13px', color: '#0F172A' }}>
                      📱 2G SMS ૧૦૮ ઇમરજન્સી ટેમ્પલેટ (ઇન્ટરનેટ વગર):
                    </strong>
                    <div style={{
                      background: '#F1F5F9',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: '#0F172A'
                    }}>
                      EMERGENCY 108: દર્દી રામજીભાઈ પટેલ, ગામ: માધાપર ભુજ, સ્થિતિ: સર્પદંશ/છાતીમાં દુખાવો.
                    </div>

                    <button
                      onClick={handleCopyOfflineSms}
                      style={{
                        background: offlineSmsCopied ? '#10B981' : '#0284C7',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        alignSelf: 'flex-start'
                      }}
                    >
                      {offlineSmsCopied ? '✓ SMS કોપી થઈ ગયો!' : '📋 ૧૦૮ ઓફલાઇન SMS કોપી કરો'}
                    </button>
                  </div>
                )}

                {item.interactiveTool === 'sync' && (
                  <div style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #86EFAC',
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>
                        🌐 ICMR / WHO લાઈવ પેન્ડેમિક સિન્ક્રોનાઇઝેશન:
                      </strong>
                      <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                        નવા વાયરસ કે રોગચાળાના પ્રોટોકોલને ૧૦ સેકન્ડમાં ક્લાઉડમાંથી સિન્ક કરો.
                      </span>
                    </div>

                    <button
                      onClick={handleTriggerPandemicSync}
                      disabled={syncStatus === 'syncing'}
                      style={{
                        background: syncStatus === 'synced' ? '#10B981' : '#7C3AED',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RefreshCw size={14} className={syncStatus === 'syncing' ? 'spin' : ''} />
                      <span>{syncStatus === 'syncing' ? 'સિન્ક થઈ રહ્યું છે...' : (syncStatus === 'synced' ? '✓ ICMR સિન્ક સફળ!' : '🔄 ક્લાઉડ પ્રોટોકોલ સિન્ક કરો')}</span>
                    </button>
                  </div>
                )}

                {item.actionBtn && (
                  <button
                    onClick={item.onAction}
                    className="btn-primary"
                    style={{ marginTop: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 800 }}
                  >
                    <span>{item.actionBtn}</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div style={{
          background: '#F8FCF9',
          borderTop: '1.5px solid #D3F2E3',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span style={{ fontSize: '12px', color: '#009F70', fontWeight: 800 }}>
            🌿 ૫ માંથી ૫ મર્યાદાઓ ૧૦૦% વિજેતા ફાયદાઓમાં રૂપાંતરિત થઈ ચૂકી છે!
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            {activeAdvantageTab > 1 && (
              <button
                onClick={() => setActiveAdvantageTab(activeAdvantageTab - 1)}
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                પહેલાનું
              </button>
            )}

            {activeAdvantageTab < 5 ? (
              <button
                onClick={() => setActiveAdvantageTab(activeAdvantageTab + 1)}
                className="btn-primary"
                style={{ padding: '6px 16px', fontSize: '12px' }}
              >
                આગળનો ફાયદો ➔
              </button>
            ) : (
              <button
                onClick={() => { setTorchActive(false); onClose(); }}
                className="btn-primary"
                style={{ padding: '6px 18px', fontSize: '12px' }}
              >
                સંપૂર્ણ સમજાઈ ગયું ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
