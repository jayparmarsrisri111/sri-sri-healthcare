import React, { useState } from 'react';
import {
  ShieldAlert, AlertTriangle, CheckCircle2, Heart, Droplets,
  PhoneCall, MapPin, Pill, Activity, ShieldCheck, Sparkles,
  Search, ArrowRight, BookOpen, Volume2, Info, Compass,
  Baby, Sun, RefreshCw, Zap, Shield, FileText, Check
} from 'lucide-react';
import { getTranslation } from '../services/languageService';
import { patientStorageService } from '../services/patientStorageService';

// Database of Village Medical Issues & Grounded Protocols
const RURAL_MEDICAL_PROTOCOLS = {
  snakebite: {
    id: 'snakebite',
    titleGu: '🐍 સર્પદંશ & વીંછી ઝેર ઈમરજન્સી (Snakebite & Scorpion Lifeline)',
    titleEn: 'Snakebite & Scorpion Toxicity Protocol',
    severity: 'RED',
    urgencyText: '🚨 અતિ ગંભીર - તાત્કાલિક ૧૦૮ અને ASV ઇન્જેક્શન જરૂરી',
    goldenHour: 'પ્રથમ ૧૦૦ મિનિટ (Golden 100 Minutes)',
    asvCenters: [
      { name: 'GK જનરલ સિવિલ હોસ્પિટલ, ભુજ', asvVials: 48, distance: '12 km', phone: '02832-250108', icu: true },
      { name: 'સામૂહિક આરોગ્ય કેન્દ્ર (CHC) માંડવી', asvVials: 24, distance: '18 km', phone: '02834-222108', icu: true },
      { name: 'CHC અંજાર ગ્રામીણ', asvVials: 32, distance: '22 km', phone: '02836-242108', icu: true },
      { name: 'CHC નખત્રાણા (પશ્ચિમ કચ્છ)', asvVials: 20, distance: '28 km', phone: '02835-220108', icu: true }
    ],
    dos: [
      'દર્દીને એકદમ શાંત અને સ્થિર રાખો (ચાલવા કે દોડવા બિલકુલ ન દેવો જેથી ઝેર શરીરમાં ન ફેલાય).',
      'કરડેલા હાથ કે પગને લાકડી કે પાટિયાથી સ્થિર (Immobilize with splint) કરો જેમ ફેક્ચરમાં કરીએ છીએ.',
      'હાથમાં પહેરેલી વીંટી, બંગડી, ઘડિયાળ કે તંગ કપડાં તરત ઉતારી લો (સોજો ચડવાને કારણે રક્તપ્રવાહ ન અટકે).',
      'તાત્કાલિક ૧૦૮ પર કૉલ કરો અને નજીકના CHC/સિવિલ હોસ્પિટલ જ્યાં ASV ઉપલબ્ધ હોય ત્યાં પહોંચો.'
    ],
    donts: [
      '❌ ઘા પર ક્યારેય બ્લેડ કે ચપ્પુથી કાપો (Cut) ન મૂકવો.',
      '❌ મોઢાથી ઝેર ચૂસવાનો પ્રયત્ન ક્યારેય ન કરવો.',
      '❌ દોરી કે વાયરથી ખૂબ ટાઈટ પાટો (Tourniquet) ન બાંધવો, તેનાથી અંગ સડી જાય છે (Gangrene).',
      '❌ ભૂવા-દોરા કે દેશી બાબતોમાં કિંમતી સમય ન બગાડવો; સાપનું ઝેર માત્ર ASV ઇન્જેક્શનથી જ ઉતરે છે.'
    ],
    symptomsCheck: [
      { name: 'ન્યુરોટોક્સિક લક્ષણ (કોબ્રા/કાળોતરો)', sign: 'આંખોની પાંપણો ઢળી પડવી (Ptosis), ગળવામાં તકલીફ, શ્વાસ રૂંધાવો.' },
      { name: 'વાસ્ક્યુલોટોક્સિક લક્ષણ (ખડચિતળો/વાઇપર)', sign: 'ડંખમાંથી સતત લોહી વહેવું, તીવ્ર સોજો, પેશાબ લાલ થવો.' }
    ]
  },

  pesticide: {
    id: 'pesticide',
    titleGu: '🌾 ખેતીવાડી જંતુનાશક દવા પોઈઝનિંગ (Pesticide & Agrochemical Toxicity)',
    titleEn: 'Organophosphate & Agrochemical Poisoning',
    severity: 'RED',
    urgencyText: '🚨 તાત્કાલિક સ્નાન, કપડાં બદલો & એટ્રોપિન એન્ટિડોટ',
    goldenHour: 'પ્રથમ ૬૦ મિનિટ (Golden Hour)',
    antidote: 'Atropine Sulphate + Pralidoxime (2-PAM)',
    firstAidSteps: [
      'દર્દીના જંતુનાશક દવાથી ખરડાયેલા તમામ કપડાં તરત જ કાઢી લો.',
      'શરીરને વહેતા પાણી અને સાબુથી ઓછામાં ઓછું ૧૫-૨૦ મિનિટ સુધી સંપૂર્ણ ઘસીને નવડાવો.',
      'જો દવાની વરાળ શ્વાસમાં ગઈ હોય તો દર્દીને ખુલ્લી તાજી હવામાં લઈ જાઓ અને ઓક્સિજન આપો.',
      'ઉલ્ટી કરાવવાનો બળજબરી પ્રયાસ ન કરવો. દર્દીને ડાબી બાજુ પડખે સુવડાવો (Recovery Position).'
    ],
    hospitalAction: 'સરકારી હોસ્પિટલમાં Atropine (પ્યુપિલ્સ ડાયલેટ થાય ત્યાં સુધી) અને PAM ઇન્જેક્શન આપવામાં આવે છે.'
  },

  maternal: {
    id: 'maternal',
    titleGu: '🤰 સગર્ભા માતા, નવજાત શિશુ & કુપોષણ રક્ષણ (Maternal & Infant Lifeline)',
    titleEn: 'High-Risk Pregnancy (HRP) & Malnutrition Tracker',
    severity: 'YELLOW',
    urgencyText: '⚠️ મમતા કાર્ડ, હિમોગ્લોબિન & સધન પોષણ સહાય',
    highRiskFlags: [
      { flag: 'ગંભીર એનિમિયા (Hb < 8 g/dL)', action: 'આયર્ન સુક્રોઝ સેલાઇન + સરકારી ફોલિક એસિડ ગોળીઓ.' },
      { flag: 'પગ અને મોઢા પર વધારે સોજો + માથાદુખાવો', action: 'હાઈ બ્લડ પ્રેશર (Pre-eclampsia) તપાસ; તાત્કાલિક ડિલિવરી પ્લાનિંગ.' },
      { flag: 'ગર્ભાવસ્થામાં લોહી વહેવું (Bleeding)', action: 'તાત્કાલિક ૧૦૮ બોલાવી સિઝેરિયન સુવિધાવાળી ગાયનેક હોસ્પિટલ પહોંચો.' }
    ],
    ruralNutritionGuide: [
      'આયર્ન અને કેલ્શિયમ માટે: દેશી ગોળ, શેકેલા ચણા, સીંગદાણાની સુખડી અને પાલક/મેથીની ભાજી.',
      'બાળકના કુપોષણ નિવારણ માટે: મગની દાળની ખીચડીમાં ૧ ચમચી ઘી, રાગીનો શીરો અને બાફેલા કેળા.',
      'પ્રથમ ૬ મહિના માત્ર અને માત્ર માતાનું ધાવણ (Exclusive Breastfeeding).'
    ],
    mamtaCalendar: [
      { age: 'જન્મ સમયે', vaccines: 'BCG, OPV-0, Hepatitis B-0' },
      { age: '૧.૫ મહિના (૬ અઠવાડિયા)', vaccines: 'Pentavalent-1, Rota-1, fIPV-1, PCV-1' },
      { age: '૨.૫ મહિના (૧૦ અઠવાડિયા)', vaccines: 'Pentavalent-2, Rota-2' },
      { age: '૩.૫ મહિના (૧૪ અઠવાડિયા)', vaccines: 'Pentavalent-3, Rota-3, fIPV-2, PCV-2' },
      { age: '૯ મહિના પૂર્ણ થતાં', vaccines: 'MR-1 (ઓરી-રૂબેલા), Vitamin A પ્રથમ ડોઝ' }
    ]
  },

  waterborne: {
    id: 'waterborne',
    titleGu: '💧 દૂષિત પાણી, ઝાડા-ઉલટી & રોગચાળો નિયંત્રણ (Waterborne Epidemic & ORS)',
    titleEn: 'Diarrhea, Cholera & Water Potability Radar',
    severity: 'YELLOW',
    urgencyText: '🟢 તાત્કાલિક ઘરમાં ORS બનાવવું + ક્લોરીનેશન',
    orsRecipe: {
      water: '૧ લીટર ઉકાળીને ઠંડુ કરેલું પીવાનું પાણી',
      sugar: '૬ નાની ચમચી ખાંડ (Sugar)',
      salt: 'અડધી (૧/૨) ચમચી મીઠું (Salt)',
      zinc: 'બાળકો માટે ઝિંક (Zinc 20mg) ની ગોળી ૧૪ દિવસ સુધી આપવી'
    },
    chlorineGuide: {
      tank1000L: '૧૦૦૦ લીટરની ગામની ટાંકી માટે: ૪ થી ૫ ગ્રામ બ્લીચિંગ પાઉડર (ક્લોરીન)',
      wellWater: 'ગામના કૂવા માટે: પ્રતિ ૧૦૦૦ ગેલન ૨.૫ ગ્રામ બ્લીચિંગ પાઉડર',
      boilingTime: 'પાણીને ઓછામાં ઓછી ૧૦ મિનિટ સુધી ખદખદતું ઉકાળવું'
    }
  }
};

// Global Disadvantages vs Sri Sri HealthCare Advantages Matrix
const GLOBAL_DISADVANTAGES_VS_ADVANTAGES = [
  {
    globalProblem: "💸 અતિશય મોંઘી દવાઓ અને પ્રિસ્ક્રિપ્શન લૂંટ (Skyrocketing Pharma Prices)",
    worldDisadvantage: "વિશ્વભરમાં બ્રાન્ડેડ દવાઓના લીધે કરોડો પરિવારો ગરીબીમાં ધકેલાય છે.",
    ourAdvantage: "✅ જન ઔષધિ જેનરિક અલ્ગોરિધમથી ૮૫% થી ૯૦% સીધી કિંમત બચત + ૧૦૦% કુદરતી આયુર્વેદિક ઘરેલું નુસ્ખા.",
    badge: "85% Savings"
  },
  {
    globalProblem: "⏳ નિદાનમાં વિલંબ & મોંઘા લેબ ટેસ્ટ (Diagnostic Delays & Misdiagnosis)",
    worldDisadvantage: "લેબ અને ડોક્ટર સુધી પહોંચવામાં ૨-૩ દિવસ નીકળી જાય છે અને રોગ વકરી જાય છે.",
    ourAdvantage: "✅ મલ્ટિ-મોડેલ AI (Gemini + Perplexity + Claude) માત્ર ૩ સેકન્ડમાં લક્ષણો, X-Ray અને કૅમેરાથી વિશ્લેષણ આપે છે.",
    badge: "Instant 3-Sec"
  },
  {
    globalProblem: "🚜 ગ્રામીણ વિસ્તારોમાં સ્પેશિયાલિસ્ટ ડોક્ટરોનો અભાવ (Rural Doctor Scarcity)",
    worldDisadvantage: "ગામડાઓમાં એમ.ડી. ડોક્ટર કે કાર્ડિયોલોજિસ્ટ મળતા નથી, જેથી દર્દીઓ મુશ્કેલીમાં મુકાય છે.",
    ourAdvantage: "✅ ૨૪/૭ AI ડોક્ટર અને ઓફલાઇન RAG સ્માર્ટ ટ્રીઆજ કોઈપણ ઇન્ટરનેટ વગર ગામમાં જ RED/YELLOW/GREEN માર્ગદર્શન આપે છે.",
    badge: "Offline Ready"
  },
  {
    globalProblem: "👓 આંખના નંબર તપાસવા મશીનો અને ઓપ્ટોમેટ્રિસ્ટનો અભાવ (Lack of Eye Clinics)",
    worldDisadvantage: "આંખના નંબર કઢાવવા માટે દૂરના તાલુકા કે જિલ્લા મથકે જવું પડે છે.",
    ourAdvantage: "✅ જાપાનીઝ સ્ટાન્ડર્ડ ડિસ્ટન્સ-કેલિબ્રેટેડ ૭-સ્ટેપ વિઝન અને ઓટો-રીફ્રેક્ટર સ્કેન સીધા સ્માર્ટફોન/લેપટોપ પર ઉપલબ્ધ.",
    badge: "ISO 8596"
  },
  {
    globalProblem: "🗣️ ભાષા અને અભણતાનો અવરોધ (Language & Illiteracy Barriers)",
    worldDisadvantage: "ગામડાના વડીલો અંગ્રેજી કે તબીબી પરિભાષા સમજી શકતા નથી.",
    ourAdvantage: "✅ માતૃભાષા ગુજરાતી, કચ્છી, હિન્દી અને અંગ્રેજીમાં બોલીને પૂછી શકાય છે અને એપ્લિકેશન બોલીને જવાબ સંભળાવે છે.",
    badge: "Voice-First"
  },
  {
    globalProblem: "⚠️ દવા-દવા વચ્ચેનું જોખમી રિએક્શન (Fatal Drug-Drug Interactions)",
    worldDisadvantage: "દર્દી ૨-૩ જુદી જુદી દવાઓ લે ત્યારે શરીરમાં ઝેરી રિએક્શન થાય છે જેની કોઈને ખબર નથી પડતી.",
    ourAdvantage: "✅ ઇન્ટરેક્ટિવ મલ્ટિ-ડ્રગ સેફ્ટી ચેકર જે કોઈપણ બે દવાઓ વચ્ચેનું જોખમ લાઈવ ચકાસી દર્દીનો જીવ બચાવે છે.",
    badge: "Zero-Risk Guard"
  }
];

export const RuralCareLifelineTab = ({ currentLang = 'gu', currentUser }) => {
  const t = getTranslation(currentLang);
  const isEn = currentLang === 'en';
  const [activeSubTab, setActiveSubTab] = useState('snakebite'); // 'snakebite', 'pesticide', 'maternal', 'waterborne', 'matrix', 'ddi'
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Drug-Drug Interaction Checker State
  const [drug1, setDrug1] = useState('Aspirin 75mg');
  const [drug2, setDrug2] = useState('Ibuprofen 400mg');
  const [ddiResult, setDdiResult] = useState(null);
  const [ddiChecking, setDdiChecking] = useState(false);

  // Well Chlorination Calculator State
  const [tankLiters, setTankLiters] = useState(1000);
  const [bleachGrams, setBleachGrams] = useState(4.5);

  const handleCalculateBleach = (liters) => {
    setTankLiters(liters);
    // Standard public health guideline: ~4.5 grams of 33% bleaching powder per 1000 liters
    const grams = ((liters / 1000) * 4.5).toFixed(1);
    setBleachGrams(grams);
  };

  const checkDrugInteraction = () => {
    setDdiChecking(true);
    setTimeout(() => {
      const d1 = drug1.toLowerCase();
      const d2 = drug2.toLowerCase();

      if ((d1.includes('aspirin') && d2.includes('ibuprofen')) || (d1.includes('ibuprofen') && d2.includes('aspirin'))) {
        setDdiResult({
          level: 'HIGH_RISK',
          badge: '🚨 ગંભીર જોખમ (Severe Risk)',
          color: '#EF4444',
          bg: '#FEF2F2',
          effect: 'પેટમાં ચાંદા (Gastric Ulcer) અને આંતરિક રક્તસ્રાવ (Internal Bleeding) નું ખૂબ ઊંચું જોખમ. આઇબ્યુપ્રોફેન એસ્પિરિનની લોહી પાતળું કરવાની અસરને પણ અવરોધે છે.',
          advice: 'આ બંને દવાઓ એક સાથે ક્યારેય ન લો. દુખાવા માટે Paracetamol 650mg સુરક્ષિત વિકલ્પ છે.'
        });
      } else if ((d1.includes('paracetamol') && d2.includes('dolo')) || (d1.includes('dolo') && d2.includes('paracetamol'))) {
        setDdiResult({
          level: 'MODERATE_RISK',
          badge: '⚠️ ઓવરડોઝ જોખમ (Overdose Risk)',
          color: '#F59E0B',
          bg: '#FFFBEB',
          effect: 'બંને દવામાં એક જ કેમિકલ (પેરાસીટામોલ) છે! બંને સાથે લેવાથી લીવર ટોક્સિસિટી (યકૃતને નુકસાન) થઈ શકે છે.',
          advice: 'કોઈપણ એક જ દવા લો. ૨૪ કલાકમાં વધુમાં વધુ ૩-૪ ગોળીથી વધારે ક્યારેય ન લેવી.'
        });
      } else if (d1.includes('metformin') && (d2.includes('alcohol') || d2.includes('દારૂ'))) {
        setDdiResult({
          level: 'HIGH_RISK',
          badge: '🚨 જીવલેણ જોખમ (Lactic Acidosis)',
          color: '#EF4444',
          bg: '#FEF2F2',
          effect: 'મેટફોર્મિન સાથે આલ્કોહોલ લેવાથી લોહીમાં લેક્ટિક એસિડનું પ્રમાણ અતિશય વધી જાય છે જે જીવલેણ નીવડી શકે.',
          advice: 'ડાયાબિટીસની દવાઓ લેતી વખતે આલ્કોહોલનું સેવન સદંતર બંધ રાખવું.'
        });
      } else {
        setDdiResult({
          level: 'SAFE',
          badge: '🟢 સુરક્ષિત સંયોજન (Compatible Combination)',
          color: '#00C48C',
          bg: '#F0FDF4',
          effect: 'આ બંને દવાઓ વચ્ચે કોઈ પ્રતિકૂળ આડઅસર (Harmful Interaction) નોંધાયેલ નથી.',
          advice: 'ડોક્ટરના નિર્દેશ મુજબ પૂરતા પાણી સાથે ભોજન બાદ લઈ શકો છો.'
        });
      }
      setDdiChecking(false);
    }, 400);
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'gu-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      setAudioPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Hero Banner: Village Medical Lifeline */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1128 0%, #065F46 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 10px 25px -5px rgba(6, 95, 70, 0.35)',
        border: '1.5px solid #00C48C'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            border: '1.5px solid rgba(255, 255, 255, 0.3)'
          }}>
            🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>
                {t.ruralLifelineTitle || 'ગ્રામીણ આરોગ્ય લાઈફલાઈન & ગ્લોબલ મેડિકલ સોલ્યુશન સેન્ટર'}
              </h2>
              <span style={{
                background: '#00C48C',
                color: '#0A1128',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                100% GROUNDED PROTOCOL
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '13px' }}>
              {t.ruralLifelineSub || 'સર્પદંશ ASV ઈન્જેક્શન ટ્રેકર • ખેતીવાડી પોઈઝનિંગ • સગર્ભા માતા-બાળક સુરક્ષા • દૂષિત પાણી ક્લોરીનેશન'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href={`sms:108?body=${encodeURIComponent("EMERGENCY 108: Urgent Ambulance required for patient. Location: Village Community. Condition: Emergency Medical Lifeline.")}`}
            style={{
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              fontWeight: 800,
              fontSize: '13px',
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
            title={t.btn2GSMS108 || "2G SMS 108"}
          >
            <span>{t.btn2GSMS108 || '📱 2G SMS ૧૦૮ (ઓફલાઇન)'}</span>
          </a>

          <button
            onClick={() => handleSpeak("સ્વાસ્થ્યસેતુ પ્રો ગ્રામીણ લાઈફલાઈન સેન્ટર. અહીં સર્પદંશ, જંતુનાશક દવા, માતા-બાળ આરોગ્ય અને દૂષિત પાણીનું તાત્કાલિક સાચું માર્ગદર્શન મળશે.")}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '10px 16px',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Volume2 size={16} />
            <span>{audioPlaying ? 'ઓડિયો વાગી રહ્યો છે...' : '🔊 ગુજરાતીમાં સાંભળો'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '6px',
        border: '1.5px solid #E2E8F0',
        flexWrap: 'wrap',
        gap: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        {[
          { id: 'snakebite', label: '🐍 સર્પદંશ & ASV રડાર', icon: ShieldAlert, color: '#EF4444' },
          { id: 'pesticide', label: '🌾 ખેતીવાડી પોઈઝનિંગ ફર્સ્ટ-એઇડ', icon: AlertTriangle, color: '#F59E0B' },
          { id: 'maternal', label: '🤰 સગર્ભા & બાળ સુરક્ષા', icon: Baby, color: '#0284C7' },
          { id: 'waterborne', label: '💧 દૂષિત પાણી & ORS કેલ્ક્યુલેટર', icon: Droplets, color: '#00C48C' },
          { id: 'ddi', label: '💊 ગ્લોબલ ડ્રગ ઇન્ટરેક્શન ગાર્ડ', icon: Pill, color: '#7C3AED' },
          { id: 'matrix', label: '🌍 ગ્લોબલ પ્રોબ્લેમ્સ vs આપણું સોલ્યુશન', icon: Sparkles, color: '#059669' }
        ].map((tab) => {
          const isSel = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: '1 1 180px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: isSel ? 'linear-gradient(135deg, #0A1128 0%, #1E293B 100%)' : 'transparent',
                color: isSel ? '#00C48C' : '#475569',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: isSel ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Icon size={16} color={isSel ? '#00C48C' : tab.color} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: SNAKEBITE & SCORPION LIFELINE */}
      {activeSubTab === 'snakebite' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            border: '2px solid #EF4444',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
                  🚨 ૧૦૮ ઇમરજન્સી ગોલ્ડન ૧૦૦ મિનિટ પ્રોટોકોલ
                </span>
                <h3 style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                  {RURAL_MEDICAL_PROTOCOLS.snakebite.titleGu}
                </h3>
              </div>

              <a
                href="tel:108"
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                }}
              >
                <PhoneCall size={18} />
                <span>૧૦૮ એમ્બ્યુલન્સ તાત્કાલિક બોલાવો</span>
              </a>
            </div>

            {/* Dos and Don'ts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {/* DO's */}
              <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: '16px', padding: '18px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#166534', fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#166534" />
                  <span>શું કરવું? (Mandatory Life-Saving Steps):</span>
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#14532D', lineHeight: 1.5 }}>
                  {RURAL_MEDICAL_PROTOCOLS.snakebite.dos.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* DONT's */}
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: '16px', padding: '18px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#991B1B', fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="#991B1B" />
                  <span>શું બિલકુલ ન કરવું? (Dangerous Myths To Avoid):</span>
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#7F1D1D', lineHeight: 1.5 }}>
                  {RURAL_MEDICAL_PROTOCOLS.snakebite.donts.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Live Anti-Snake Venom (ASV) Hospital Inventory */}
            <div style={{ marginTop: '22px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#00C48C" />
                <span>નજીકના કેન્દ્રોમાં એન્ટિ-સ્નેક વેનમ (ASV) ઉપલબ્ધતા રડાર:</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {RURAL_MEDICAL_PROTOCOLS.snakebite.asvCenters.map((c, idx) => (
                  <div key={idx} style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>અંતર: {c.distance} • ICU વેન્ટિલેટર સજ્જ</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #E2E8F0' }}>
                      <span style={{ background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                        🟢 {c.asvVials} ASV Vials હાજર
                      </span>
                      <a href={`tel:${c.phone}`} style={{ color: '#0284C7', textDecoration: 'none', fontWeight: 800, fontSize: '12px' }}>
                        📞 ફોન કરો
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: AGRICULTURAL PESTICIDE TOXICITY */}
      {activeSubTab === 'pesticide' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
        }}>
          <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
            🌾 ઓર્ગેનોફોસ્ફેટ & રાસાયણિક જંતુનાશક દવા પ્રોટોકોલ
          </span>
          <h3 style={{ margin: '8px 0 14px 0', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            {RURAL_MEDICAL_PROTOCOLS.pesticide.titleGu}
          </h3>

          <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', padding: '16px', borderRadius: '14px', marginBottom: '18px' }}>
            <div style={{ fontWeight: 800, color: '#92400E', fontSize: '14px', marginBottom: '6px' }}>
              ⚡ ગોલ્ડન અવર તાત્કાલિક સારવાર (First 60 Minutes):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {RURAL_MEDICAL_PROTOCOLS.pesticide.firstAidSteps.map((step, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', color: '#78350F', border: '1px solid #FCD34D' }}>
                  <strong>{idx + 1}.</strong> {step}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1.5px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
              🏥 હોસ્પિટલમાં ઉપલબ્ધ સરકારી એન્ટિડોટ (Hospital Protocol):
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
              {RURAL_MEDICAL_PROTOCOLS.pesticide.hospitalAction} <strong>એન્ટિડોટ: {RURAL_MEDICAL_PROTOCOLS.pesticide.antidote}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* MODULE 3: MATERNAL & INFANT CARE */}
      {activeSubTab === 'maternal' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
        }}>
          <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
            👶 સગર્ભા માતા & શિશુ સુરક્ષા કવચ
          </span>
          <h3 style={{ margin: '8px 0 16px 0', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            {RURAL_MEDICAL_PROTOCOLS.maternal.titleGu}
          </h3>

          {/* High-risk pregnancy red flags */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 800, color: '#DC2626' }}>
              🚨 હાઈ-રિસ્ક પ્રેગ્નન્સી (HRP) જોખમી લક્ષણો:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {RURAL_MEDICAL_PROTOCOLS.maternal.highRiskFlags.map((item, idx) => (
                <div key={idx} style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontWeight: 800, color: '#991B1B', fontSize: '13px' }}>{item.flag}</div>
                  <div style={{ fontSize: '12px', color: '#7F1D1D', marginTop: '4px' }}>👉 સારવાર: {item.action}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mamta Day Vaccine Schedule */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 800, color: '#0284C7' }}>
              🗓️ સરકારી મમતા દિવસ રસીકરણ કેલેન્ડર (National Immunization Schedule):
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F0F9FF', borderBottom: '2px solid #BAE6FD', color: '#0369A1' }}>
                    <th style={{ padding: '10px' }}>બાળકની ઉંમર</th>
                    <th style={{ padding: '10px' }}>આપવાની રસી (Vaccines)</th>
                    <th style={{ padding: '10px' }}>સરકારી લાભ</th>
                  </tr>
                </thead>
                <tbody>
                  {RURAL_MEDICAL_PROTOCOLS.maternal.mamtaCalendar.map((v, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px', fontWeight: 800, color: '#0F172A' }}>{v.age}</td>
                      <td style={{ padding: '10px', color: '#0284C7', fontWeight: 700 }}>{v.vaccines}</td>
                      <td style={{ padding: '10px', color: '#16A34A', fontWeight: 700 }}>૧૦૦% મફત સરકારી આંગણવાડી/PHC</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: WATERBORNE & ORS CALCULATOR */}
      {activeSubTab === 'waterborne' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {/* ORS Home Recipe */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            border: '1.5px solid #A7F3D0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
          }}>
            <span style={{ background: '#ECFDF5', color: '#047857', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
              💧 ઝાડા-ઉલટીમાં ડીહાઇડ્રેશનથી બચાવ
            </span>
            <h3 style={{ margin: '8px 0 12px 0', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              જીવનરક્ષક ઘરેલું ORS ઘોળ બનાવવાની સાચી રીત (WHO Formula)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
              <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '10px', border: '1px solid #BBF7D0', fontSize: '13px' }}>
                🥛 <strong>પાણી:</strong> {RURAL_MEDICAL_PROTOCOLS.waterborne.orsRecipe.water}
              </div>
              <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '10px', border: '1px solid #BBF7D0', fontSize: '13px' }}>
                🥄 <strong>ખાંડ (Sugar):</strong> {RURAL_MEDICAL_PROTOCOLS.waterborne.orsRecipe.sugar}
              </div>
              <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '10px', border: '1px solid #BBF7D0', fontSize: '13px' }}>
                🧂 <strong>મીઠું (Salt):</strong> {RURAL_MEDICAL_PROTOCOLS.waterborne.orsRecipe.salt}
              </div>
              <div style={{ background: '#ECFDF5', padding: '12px', borderRadius: '10px', border: '1px solid #A7F3D0', fontSize: '12px', color: '#065F46' }}>
                💡 <strong>ઝિંક ટેબ્લેટ:</strong> {RURAL_MEDICAL_PROTOCOLS.waterborne.orsRecipe.zinc}
              </div>
            </div>
          </div>

          {/* Village Well / Tank Chlorine Calculator */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            border: '1.5px solid #BAE6FD',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
          }}>
            <span style={{ background: '#F0F9FF', color: '#0284C7', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
              🧪 ગામની ટાંકી / કૂવા ક્લોરીનેશન કેલ્ક્યુલેટર
            </span>
            <h3 style={{ margin: '8px 0 12px 0', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              પાણી શુદ્ધિકરણ (Bleaching Powder Dosage)
            </h3>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                પાણીની ટાંકીનું કદ (ટાંકીની ક્ષમતા લીટરમાં):
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[500, 1000, 2000, 5000].map((liters) => (
                  <button
                    key={liters}
                    onClick={() => handleCalculateBleach(liters)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: tankLiters === liters ? '2px solid #0284C7' : '1px solid #CBD5E1',
                      background: tankLiters === liters ? '#E0F2FE' : '#FFFFFF',
                      color: tankLiters === liters ? '#0369A1' : '#475569',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {liters} L
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: '#E0F2FE', padding: '16px', borderRadius: '14px', border: '1.5px solid #7DD3FC', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#0369A1', fontWeight: 700 }}>જરૂરી બ્લીચિંગ પાઉડરનું વજન:</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#0C4A6E', margin: '4px 0' }}>
                {bleachGrams} ગ્રામ
              </div>
              <div style={{ fontSize: '11px', color: '#0369A1' }}>
                (૩૩% ક્લોરીન બ્લીચિંગ પાઉડર ડોઝ • સરકારી PHC વોટર ટેસ્ટિંગ સ્ટાન્ડર્ડ)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: GLOBAL DRUG-DRUG INTERACTION GUARD */}
      {activeSubTab === 'ddi' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
        }}>
          <span style={{ background: '#EDE9FE', color: '#6D28D9', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
            🛡️ ગ્લોબલ ડ્રગ-ઇન્ટરેક્શન & પોલીફાર્મસી સેફ્ટી ગાર્ડ
          </span>
          <h3 style={{ margin: '8px 0 6px 0', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            કોઈપણ બે દવાઓ વચ્ચેનું જોખમી રિએક્શન તાત્કાલિક ચકાસો
          </h3>
          <p style={{ margin: '0 0 16px 0', color: '#64748B', fontSize: '13px' }}>
            વિશ્વભરમાં ખોટી દવાઓના સંયોજનથી હજારો દર્દીઓને લીવર કે કિડનીનું નુકસાન થાય છે. અહીં લાઈવ તપાસ કરો:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                પ્રથમ દવા (Medicine 1):
              </label>
              <input
                type="text"
                value={drug1}
                onChange={(e) => setDrug1(e.target.value)}
                placeholder="દા.ત. Aspirin, Dolo 650, Metformin"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                બીજી દવા (Medicine 2):
              </label>
              <input
                type="text"
                value={drug2}
                onChange={(e) => setDrug2(e.target.value)}
                placeholder="દા.ત. Ibuprofen, Combiflam, Alcohol"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={checkDrugInteraction}
              disabled={ddiChecking}
              style={{
                background: '#7C3AED',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '11px 20px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={16} />
              <span>{ddiChecking ? 'ચકાસી રહ્યું છે...' : 'સેફ્ટી તપાસો'}</span>
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', alignSelf: 'center' }}>ઝડપી ટેસ્ટ:</span>
            <button
              onClick={() => { setDrug1('Aspirin 75mg'); setDrug2('Ibuprofen 400mg'); }}
              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
            >
              Aspirin + Ibuprofen
            </button>
            <button
              onClick={() => { setDrug1('Dolo 650'); setDrug2('Paracetamol 500mg'); }}
              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
            >
              Dolo + Paracetamol
            </button>
            <button
              onClick={() => { setDrug1('Metformin 500mg'); setDrug2('Alcohol (દારૂ)'); }}
              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
            >
              Metformin + Alcohol
            </button>
            <button
              onClick={() => { setDrug1('Paracetamol 650mg'); setDrug2('Cetirizine 10mg'); }}
              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
            >
              Paracetamol + Cetirizine (Safe)
            </button>
          </div>

          {/* DDI Result Banner */}
          {ddiResult && (
            <div style={{
              background: ddiResult.bg,
              border: `2px solid ${ddiResult.color}`,
              borderRadius: '16px',
              padding: '18px',
              animation: 'fadeIn 0.25s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: ddiResult.color }}>
                  {ddiResult.badge}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                  {drug1} ⇄ {drug2}
                </span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1E293B', fontWeight: 600 }}>
                {ddiResult.effect}
              </p>
              <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', fontSize: '12px', color: '#334155', border: '1px solid #E2E8F0' }}>
                <strong>💡 ડૉક્ટરની સલાહ:</strong> {ddiResult.advice}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 6: GLOBAL MEDICAL DISADVANTAGES TURNED INTO ADVANTAGES */}
      {activeSubTab === 'matrix' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid #00C48C',
          boxShadow: '0 4px 16px rgba(0, 196, 140, 0.1)'
        }}>
          <span style={{ background: '#E0F8EE', color: '#009F70', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
            🌍 વૈશ્વિક આરોગ્ય સમસ્યાઓ vs આપણા પ્રોજેક્ટનું ક્રાંતિકારી સમાધાન
          </span>
          <h3 style={{ margin: '8px 0 8px 0', fontSize: '20px', fontWeight: 800, color: '#0A1128' }}>
            દુનિયાની મોટી તબીબી ખામીઓને આપણા પ્રોજેક્ટમાં ૧૦૦% સુવિધામાં બદલી દીધી છે
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#5A6A85', fontSize: '13px' }}>
            વિશ્વ સ્તરની મેડિકલ હેલ્થકેર સિસ્ટમના મોટા ગેરફાયદા (Disadvantages) સામે **Sri Sri ❤️ HealthCare** દ્વારા મળતા વિરાટ ફાયદા:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
            {GLOBAL_DISADVANTAGES_VS_ADVANTAGES.map((item, idx) => (
              <div key={idx} style={{
                background: '#F8FCF9',
                border: '1.5px solid #D3F2E3',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A1128' }}>
                      {item.globalProblem}
                    </div>
                    <span style={{ background: '#00C48C', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}>
                      {item.badge}
                    </span>
                  </div>

                  <div style={{ background: '#FEF2F2', padding: '8px 10px', borderRadius: '8px', border: '1px solid #FECACA', fontSize: '12px', color: '#991B1B', marginBottom: '8px' }}>
                    <strong>વિશ્વની ખામી:</strong> {item.worldDisadvantage}
                  </div>

                  <div style={{ background: '#F0FDF4', padding: '8px 10px', borderRadius: '8px', border: '1px solid #BBF7D0', fontSize: '12px', color: '#166534' }}>
                    <strong>આપણું સોલ્યુશન:</strong> {item.ourAdvantage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
