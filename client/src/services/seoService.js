/**
 * Sri Sri ❤️ HealthCare - Dynamic SEO & Multilingual Metadata Service
 * Deployment Domain: https://srisrihealthcare111.netlify.app
 * Manages document title, meta descriptions, Open Graph tags, Twitter cards,
 * canonical URLs, and seamless deep-linking query parameters across Gujarati, Hindi, and English.
 */

const CANONICAL_BASE = 'https://srisrihealthcare111.netlify.app';

const MULTILINGUAL_SEO = {
  gu: {
    triage: {
      title: 'Sri Sri ❤️ HealthCare | ૨૪ કલાક AI મેડિકલ ડૉક્ટર & વોઇસ સિમ્પ્ટમ ટ્રાયેજ',
      description: 'શ્રી શ્રી હેલ્થકેર AI મેડિકલ ડૉક્ટર - ૨૦૦% સાચું વોઇસ નિદાન, આયુર્વેદિક અને એલોપેથિક ઉપચાર, ૮૫% સસ્તી જન ઔષધિ દવાઓ.',
      keywords: 'ai doctor gujarat, voice symptom triage, free online doctor gujarati, telemedicine gujarat, srisrihealthcare111, swasthya setu'
    },
    ruralCare: {
      title: 'ગ્રામીણ સર્પદંશ સંજીવની (ASV) & ૧૦૮ ઇમરજન્સી લાઈફલાઈન | Sri Sri ❤️ HealthCare',
      description: 'ગ્રામીણ વિસ્તારો માટે તાત્કાલિક સાપ કરડવાની સારવાર, એન્ટિ સ્નેક વેનમ (ASV) સ્ટોક ટ્રેકર અને ૧૦૮ એમ્બ્યુલન્સ ઇમરજન્સી સેતુ.',
      keywords: 'snakebite emergency, asv anti snake venom, rural healthcare gujarat, 108 ambulance lifeline, snake bite treatment gujarat'
    },
    medLocator: {
      title: 'જન ઔષધિ કેન્દ્ર ૮૫% સસ્તી દવા રડાર | Sri Sri ❤️ HealthCare',
      description: 'નજીકના પ્રધાનમંત્રી જન ઔષધિ કેન્દ્રો શોધો અને બ્રાન્ડેડ દવાઓની સામે ૮૫% સુધી સસ્તી જેનરિક દવાઓની તાત્કાલિક માહિતી મેળવો.',
      keywords: 'jan aushadhi kendra near me, generic medicine radar, cheap medicines gujarat, dolo 650 generic price, pmjay medicine'
    },
    chatbot: {
      title: '૨૪ કલાક AI મેડિકલ ડૉક્ટર કન્સલ્ટેશન | Sri Sri ❤️ HealthCare',
      description: 'તમારા રોગના લક્ષણો પૂછો અને AI સુપર-ડૉક્ટર પાસેથી ચોક્કસ ક્લિનિકલ માર્ગદર્શન, ઘરેલું ઉપચાર અને દવાઓની સલાહ મેળવો.',
      keywords: 'ai doctor chat, 24/7 medical consultation, free healthcare chatbot, clinical ai doctor'
    },
    encyclopedia: {
      title: 'સંપૂર્ણ દવા માર્ગદર્શિકા (Medicine Encyclopedia) | Sri Sri ❤️ HealthCare',
      description: 'હજારો દવાઓની ઉપયોગિતા, ડોઝ, આડઅસરો (Side Effects) અને જેનરિક વિકલ્પોની સરળ ગુજરાતી અને અંગ્રેજીમાં માહિતી.',
      keywords: 'medicine encyclopedia, drug side effects, medicine dose guide, paracetamol dosage, generic substitute gujarati'
    },
    eye: {
      title: 'ઓનલાઇન આંખ પાવર તપાસ (AI Eye Power Scanner) | Sri Sri ❤️ HealthCare',
      description: 'ઘરે બેઠા સ્માર્ટફોન કે કોમ્પ્યુટરથી આંખની દ્રષ્ટિ ક્ષમતા (Visual Acuity) અને પાવર તપાસો - તદ્દન ફ્રી AI ઓપ્ટોમેટ્રી ટેસ્ટ.',
      keywords: 'online eye power check, eye test gujarati, visual acuity test, vision check, refractive error test'
    },
    vision: {
      title: 'AI વિઝન મેડિકલ ડાયગ્નોસ્ટિક્સ (Medical Image Scan) | Sri Sri ❤️ HealthCare',
      description: 'ચામડીના રોગ, એક્સ-રે, પ્રિસ્ક્રિપ્શન અને લેબ રિપોર્ટના ફોટો અપલોડ કરીને AI આધારિત ક્લિનિકલ વિશ્લેષણ મેળવો.',
      keywords: 'ai medical vision, skin disease ai, prescription scanner, lab report analysis, x-ray scan ai'
    },
    vitals: {
      title: 'રીઅલ-ટાઇમ વાઇટલ્સ અને હાર્ટ રેટ સ્કેનર | Sri Sri ❤️ HealthCare',
      description: 'કેમેરા પલ્સ ડિટેક્શન ટેકનોલોજી દ્વારા તમારા હાર્ટ રેટ (BPM), તણાવ અને શરીરના મહત્વના વાઇટલ્સનું ત્વરિત માપન.',
      keywords: 'heart rate scanner, vitals monitor, camera pulse rate, rppg optical pulse, contactless health monitor'
    },
    phc: {
      title: 'ગુજરાત PHC, CHC & 108 સરકારી હોસ્પિટલ નેવિગેટર | Sri Sri ❤️ HealthCare',
      description: 'ગુજરાતના તમામ જિલ્લાઓના પ્રાથમિક આરોગ્ય કેન્દ્રો (PHC), સામૂહિક આરોગ્ય કેન્દ્રો (CHC) અને સરકારી હોસ્પિટલો શોધો.',
      keywords: 'phc gujarat, chc hospital, government hospital near me, 108 emergency, free hospital gujarat'
    },
    schemes: {
      title: 'PMJAY આયુષ્માન ભારત & મા અમૃતમ યોજના ઑપ્ટિમાઇઝર | Sri Sri ❤️ HealthCare',
      description: '૫ થી ૧૦ લાખ સુધીની મફત સારવાર આપતી સરકારી સ્વાસ્થ્ય યોજનાઓ, પાત્રતા ચકાસણી અને માન્ય હોસ્પિટલોની સંપૂર્ણ યાદી.',
      keywords: 'pmjay ayushman bharat, maa amrutam card, free hospital treatment gujarat, ayushman hospital list'
    },
    homeLab: {
      title: 'ઘરે બેઠા લેબ ટેસ્ટ સેમ્પલ કલેક્શન | Sri Sri ❤️ HealthCare',
      description: 'બ્લડ ટેસ્ટ, ડાયાબિટીસ પ્રોફાઇલ, લિપિડ પ્રોફાઇલ વગેરેનું ઘરેથી ફ્રી સેમ્પલ કલેક્શન બુક કરો અને રિપોર્ટ ઓનલાઇન મેળવો.',
      keywords: 'home lab collection, blood test at home, diagnostic test gujarat, free home sample pickup'
    },
    doctorDirectory: {
      title: 'ગુજરાતના નિષ્ણાત ડૉક્ટર્સ ડિરેક્ટરી & એપોઇન્ટમેન્ટ | Sri Sri ❤️ HealthCare',
      description: 'એમ.ડી. ફિઝિશિયન, બાળરોગ નિષ્ણાત, હૃદયરોગ નિષ્ણાત અને ગાયનેકોલોજિસ્ટ ડૉક્ટરોની ચકાસાયેલ પ્રોફાઇલ અને એપોઇન્ટમેન્ટ.',
      keywords: 'doctors in gujarat, verified doctor directory, find specialist doctor, online doctor appointment'
    },
    emotion: {
      title: 'માઇન્ડ & ઇમોશન ડીકોડર AI (Mental Wellness) | Sri Sri ❤️ HealthCare',
      description: 'માનસિક તણાવ, ચિંતા (Anxiety) અને મૂડનું AI વિશ્લેષણ અને યોગ, ધ્યાન તથા સકારાત્મક માર્ગદર્શન.',
      keywords: 'mental health ai, stress decoder, emotion wellness, anxiety relief, mood tracker'
    },
    history: {
      title: 'દર્દીનો ડિજિટલ હેલ્થ રેકોર્ડ (EHR & ABHA) | Sri Sri ❤️ HealthCare',
      description: 'તમારા તમામ પ્રિસ્ક્રિપ્શન, લેબ ટેસ્ટ, વાઇટલ્સ અને આંખના પાવરના રિપોર્ટ્સ સુરક્ષિત ડિજિટલ હેલ્થ વોલેટમાં સાચવો.',
      keywords: 'electronic health records, digital prescription wallet, abha health card, medical history'
    },
    doctorPortal: {
      title: 'ડૉક્ટર ક્લિનિકલ ડેશબોર્ડ | Sri Sri ❤️ HealthCare',
      description: 'પ્રમાણિત ડૉક્ટર્સ માટે ઓનલાઇન દર્દી કન્સલ્ટેશન, ડિજિટલ પ્રિસ્ક્રિપ્શન અને ટેલિમેડિસિન પોર્ટલ.',
      keywords: 'doctor portal, telemedicine portal, clinical dashboard, verified doctor login'
    },
    adminHub: {
      title: 'સિક્યોર એડમિન મેડિકલ હબ | Sri Sri ❤️ HealthCare',
      description: 'શ્રી શ્રી હેલ્થકેર વહીવટી પોર્ટલ - ડૉક્ટર પ્રમાણીકરણ, જન ઔષધિ ઇન્વેન્ટરી અને સિસ્ટમ મેનેજમેન્ટ.',
      keywords: 'medical admin hub, healthcare management, administrative portal'
    }
  },
  en: {
    triage: {
      title: 'Sri Sri ❤️ HealthCare | 24/7 AI Clinical Doctor & Voice Symptom Triage',
      description: 'Sri Sri HealthCare AI Medical Doctor - 100% accurate voice symptom triage, Ayurvedic & Allopathic treatments, and 85% cheaper Jan Aushadhi generic medicines.',
      keywords: 'ai doctor, voice symptom triage, free online doctor, clinical telemedicine, srisrihealthcare111, generic medicines'
    },
    ruralCare: {
      title: 'Rural Snakebite ASV Lifeline & 108 Emergency | Sri Sri ❤️ HealthCare',
      description: 'Instant snakebite species recognition, Anti-Snake Venom (ASV) hospital tracker, and 108 ambulance dispatch for rural India.',
      keywords: 'snakebite emergency, anti snake venom asv, rural healthcare, 108 ambulance lifeline, snake bite protocol'
    },
    medLocator: {
      title: 'Jan Aushadhi Generic Medicine Radar (85% Savings) | Sri Sri ❤️ HealthCare',
      description: 'Find Pradhan Mantri Jan Aushadhi Kendras near you and locate generic substitutes for branded medicines with up to 85% cost savings.',
      keywords: 'jan aushadhi kendra near me, generic medicine radar, cheap medicines india, dolo 650 substitute'
    },
    chatbot: {
      title: '24/7 AI Clinical Doctor Consultation | Sri Sri ❤️ HealthCare',
      description: 'Consult with advanced multi-model AI doctors for instant clinical guidance, home remedies, prescriptions, and specialist recommendations.',
      keywords: 'ai doctor chat, 24/7 medical consultation, free healthcare chatbot, clinical ai physician'
    },
    encyclopedia: {
      title: 'Complete Medicine Encyclopedia & Dosage Guide | Sri Sri ❤️ HealthCare',
      description: 'Comprehensive drug guide detailing indications, clinical dosages, side effects, precautions, and generic alternatives.',
      keywords: 'medicine encyclopedia, drug side effects, medicine dosage guide, generic alternatives'
    },
    eye: {
      title: 'Online Eye Power & Vision Acuity Scanner | Sri Sri ❤️ HealthCare',
      description: 'Check visual acuity, myopia, hyperopia, and astigmatism from your computer or smartphone screen with AI optometry.',
      keywords: 'online eye test, eye power check, visual acuity test, refractive error test, online snellen chart'
    },
    vision: {
      title: 'AI Medical Vision Diagnostics (Derm, X-Ray & Reports) | Sri Sri ❤️ HealthCare',
      description: 'Upload photos of skin lesions, X-rays, medical prescriptions, or lab reports for clinical multi-modal AI interpretation.',
      keywords: 'ai medical vision, dermatology ai, prescription scanner, lab report interpreter, x-ray ai analysis'
    },
    vitals: {
      title: 'Contactless Camera Face Vitals & Pulse Scanner | Sri Sri ❤️ HealthCare',
      description: 'Measure real-time heart rate (BPM), heart rate variability (HRV), and stress levels via contactless rPPG facial optical scanning.',
      keywords: 'heart rate scanner, vitals monitor, contactless pulse rate, rppg optical pulse, camera vitals'
    },
    phc: {
      title: 'Government PHC, CHC & Hospital Directory | Sri Sri ❤️ HealthCare',
      description: 'Complete directory of Primary Health Centers (PHC), Community Health Centers (CHC), and 108 emergency facilities.',
      keywords: 'phc directory, chc hospital, government hospital locator, 108 emergency service'
    },
    schemes: {
      title: 'PMJAY Ayushman Bharat & Government Schemes Navigator | Sri Sri ❤️ HealthCare',
      description: 'Check eligibility, benefits, and empaneled hospitals for PMJAY Ayushman Bharat offering up to 5-10 Lakhs cashless healthcare.',
      keywords: 'pmjay ayushman bharat, government health schemes, free hospital treatment india, ayushman card check'
    },
    homeLab: {
      title: 'Home Lab Sample Collection & Diagnostics | Sri Sri ❤️ HealthCare',
      description: 'Book home blood sample collection for CBC, Lipid, Diabetes, and Kidney profiles with fast digital reports.',
      keywords: 'home lab collection, blood test at home, diagnostic test booking, home blood sample pickup'
    },
    doctorDirectory: {
      title: 'Verified Specialist Doctors Directory & Appointments | Sri Sri ❤️ HealthCare',
      description: 'Find verified General Physicians, Pediatricians, Cardiologists, and Gynecologists with verified medical council credentials.',
      keywords: 'doctor directory, verified doctors, find specialist doctor, online doctor appointment'
    },
    emotion: {
      title: 'AI Mind & Emotion Wellness Analyzer | Sri Sri ❤️ HealthCare',
      description: 'Analyze psychological stress, anxiety, and emotional state using facial action units and personalized mental wellness exercises.',
      keywords: 'mental health ai, stress decoder, emotion wellness, anxiety relief, mood tracker'
    },
    history: {
      title: 'Patient Digital Health Records (EHR & ABHA) | Sri Sri ❤️ HealthCare',
      description: 'Secure digital health locker storing prescriptions, lab results, eye prescriptions, and vitals history.',
      keywords: 'electronic health records, digital prescription wallet, abha health card, medical history'
    },
    doctorPortal: {
      title: 'Doctor Clinical Telemedicine Portal | Sri Sri ❤️ HealthCare',
      description: 'Professional healthcare provider portal for patient tele-consultations, clinical notes, and digital prescriptions.',
      keywords: 'doctor portal, telemedicine portal, clinical dashboard, verified doctor login'
    },
    adminHub: {
      title: 'Administrative Medical Hub | Sri Sri ❤️ HealthCare',
      description: 'Central healthcare administration console for doctor credential verification, medicine inventories, and system metrics.',
      keywords: 'medical admin hub, healthcare management, administrative portal'
    }
  },
  hi: {
    triage: {
      title: 'Sri Sri ❤️ HealthCare | २४ घंटे AI मेडिकल डॉक्टर और वॉयस सिम्पटम ट्राइएज',
      description: 'श्री श्री हेल्थकेयर AI मेडिकल डॉक्टर - १००% सटीक वॉयस निदान, आयुर्वेदिक व एलोपैथिक उपचार, और ८५% सस्ती जन औषधि दवाएं।',
      keywords: 'ai doctor hindi, voice symptom triage, free online doctor hindi, telemedicine india, srisrihealthcare111'
    },
    ruralCare: {
      title: 'ग्रामीण सर्पदंश संजीवनी (ASV) & १०८ इमरजेंसी हेल्पलाइन | Sri Sri ❤️ HealthCare',
      description: 'ग्रामीण क्षेत्रों के लिए तत्काल सांप के काटने का उपचार, एंटी-स्नेक वेनम (ASV) स्टॉक ट्रैकर और १०८ एम्बुलेंस सेवा।',
      keywords: 'snakebite emergency, anti snake venom asv, rural healthcare, 108 ambulance lifeline, snake bite treatment'
    },
    medLocator: {
      title: 'जन औषधि केंद्र ८५% सस्ती दवा रडार | Sri Sri ❤️ HealthCare',
      description: 'नजदीकी प्रधानमंत्री जन औषधि केंद्र खोजें और ब्रांडेड दवाओं के मुकाबले ८५% तक सस्ती जेनेरिक दवाओं की तुरंत जानकारी पाएं।',
      keywords: 'jan aushadhi kendra near me, generic medicine radar, cheap medicines hindi, dolo 650 substitute'
    },
    chatbot: {
      title: '२४ घंटे AI मेडिकल डॉक्टर परामर्श | Sri Sri ❤️ HealthCare',
      description: 'अपने रोग के लक्षण बताएं और AI सुपर-डॉक्टर से सटीक क्लिनिकल मार्गदर्शन, घरेलू उपचार और दवाओं की सलाह प्राप्त करें।',
      keywords: 'ai doctor chat, 24/7 medical consultation, free healthcare chatbot, clinical ai doctor'
    },
    encyclopedia: {
      title: 'दवा विश्वकोश एवं खुराक गाइड | Sri Sri ❤️ HealthCare',
      description: 'हजारों दवाओं के उपयोग, सटीक खुराक, दुष्प्रभाव (Side Effects) और जेनेरिक विकल्पों की विस्तृत हिंदी जानकारी।',
      keywords: 'medicine encyclopedia, drug side effects, medicine dose guide, paracetamol dosage'
    },
    eye: {
      title: 'ऑनलाइन नेत्र जांच एवं आई पावर स्कैनर | Sri Sri ❤️ HealthCare',
      description: 'घर बैठे स्मार्टफोन या कंप्यूटर स्क्रीन से आंखों की दृष्टि क्षमता (Visual Acuity) और नंबर जांचें - मुफ्त AI ऑप्टोमेट्री टेस्ट।',
      keywords: 'online eye power check, eye test hindi, visual acuity test, vision check, refractive error'
    },
    vision: {
      title: 'AI विजन मेडिकल डायग्नोस्टिक्स (त्वचा, एक्स-रे व रिपोर्ट्स) | Sri Sri ❤️ HealthCare',
      description: 'त्वचा रोग, एक्स-रे, प्रिस्क्रिप्शन और लैब रिपोर्ट की फोटो अपलोड करके AI आधारित क्लिनिकल विश्लेषण प्राप्त करें।',
      keywords: 'ai medical vision, skin disease ai, prescription scanner, lab report analysis, x-ray scan'
    },
    vitals: {
      title: 'रियल-टाइम वाइटल्स और हार्ट रेट स्कैनर | Sri Sri ❤️ HealthCare',
      description: 'कैमरा पल्स डिटेक्शन तकनीक द्वारा अपने हार्ट रेट (BPM), तनाव और शरीर के मुख्य वाइटल्स का तुरंत मापन करें।',
      keywords: 'heart rate scanner, vitals monitor, camera pulse rate, rppg optical pulse, contactless health monitor'
    },
    phc: {
      title: 'सरकारी PHC, CHC एवं अस्पताल खोजक | Sri Sri ❤️ HealthCare',
      description: 'सभी जिलों के प्राथमिक स्वास्थ्य केंद्र (PHC), सामुदायिक स्वास्थ्य केंद्र (CHC) और १०८ आपातकालीन अस्पताल खोजें।',
      keywords: 'phc directory, chc hospital, government hospital near me, 108 emergency, free hospital'
    },
    schemes: {
      title: 'PMJAY आयुष्मान भारत एवं स्वास्थ्य योजनाएं | Sri Sri ❤️ HealthCare',
      description: '५ से १० लाख रुपये तक मुफ्त इलाज देने वाली सरकारी स्वास्थ्य योजनाएं, पात्रता जांच और संबद्ध अस्पतालों की सूची।',
      keywords: 'pmjay ayushman bharat, government health schemes, free hospital treatment, ayushman card list'
    },
    homeLab: {
      title: 'घर बैठे लैब टेस्ट सैंपल कलेक्शन | Sri Sri ❤️ HealthCare',
      description: 'ब्लड टेस्ट, डायबिटीज प्रोफाइल, लिपिड प्रोफाइल आदि की घर से मुफ्त सैंपल कलेक्शन बुक करें और ऑनलाइन रिपोर्ट पाएं।',
      keywords: 'home lab collection, blood test at home, diagnostic test hindi, free home sample pickup'
    },
    doctorDirectory: {
      title: 'सत्यापित विशेषज्ञ डॉक्टर्स डायरेक्टरी | Sri Sri ❤️ HealthCare',
      description: 'एम.डी. फिजिशियन, बाल रोग विशेषज्ञ, हृदय रोग विशेषज्ञ और स्त्री रोग विशेषज्ञों की सत्यापित प्रोफाइल और अपॉइंटमेंट।',
      keywords: 'doctors in india, verified doctor directory, find specialist doctor, online doctor appointment'
    },
    emotion: {
      title: 'माइंड & इमोशन डिकोडर AI (मानसिक स्वास्थ्य) | Sri Sri ❤️ HealthCare',
      description: 'मानसिक तनाव, चिंता (Anxiety) और मूड का AI विश्लेषण तथा योग, ध्यान व सकारात्मक मार्गदर्शन।',
      keywords: 'mental health ai, stress decoder, emotion wellness, anxiety relief, mood tracker'
    },
    history: {
      title: 'मरीज का डिजिटल हेल्थ रिकॉर्ड (EHR & ABHA) | Sri Sri ❤️ HealthCare',
      description: 'अपने सभी प्रिस्क्रिप्शन, लैब टेस्ट, वाइटल्स और आई पावर रिकॉर्ड सुरक्षित डिजिटल हेल्थ लॉकर में रखें।',
      keywords: 'electronic health records, digital prescription wallet, abha health card, medical history'
    },
    doctorPortal: {
      title: 'डॉक्टर क्लिनिकल पोर्टल | Sri Sri ❤️ HealthCare',
      description: 'सत्यापित डॉक्टर्स के लिए ऑनलाइन मरीज परामर्श, डिजिटल प्रिस्क्रिप्शन और टेलीमेडिसिन पोर्टल।',
      keywords: 'doctor portal, telemedicine portal, clinical dashboard, verified doctor login'
    },
    adminHub: {
      title: 'सुरक्षित एडमिन मेडिकल हब | Sri Sri ❤️ HealthCare',
      description: 'श्री श्री हेल्थकेयर प्रशासनिक पोर्टल - डॉक्टर सत्यापन, जन औषधि इन्वेंट्री और सिस्टम प्रबंधन।',
      keywords: 'medical admin hub, healthcare management, administrative portal'
    }
  }
};

export const updateSEOMeta = (tab, lang = 'gu') => {
  if (typeof document === 'undefined') return;

  const validLang = ['gu', 'en', 'hi'].includes(lang) ? lang : 'gu';
  const langPack = MULTILINGUAL_SEO[validLang] || MULTILINGUAL_SEO.gu;
  const seo = langPack[tab] || langPack.triage;

  const targetUrl = tab && tab !== 'triage'
    ? `${CANONICAL_BASE}/?tab=${tab}${validLang !== 'gu' ? `&lang=${validLang}` : ''}`
    : `${CANONICAL_BASE}/${validLang !== 'gu' ? `?lang=${validLang}` : ''}`;

  // 1. Update Document Title
  document.title = seo.title;

  // 2. Update Meta Title
  const metaTitle = document.querySelector('meta[name="title"]');
  if (metaTitle) metaTitle.setAttribute('content', seo.title);

  // 3. Update Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', seo.description);

  // 4. Update Meta Keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords && seo.keywords) {
    metaKeywords.setAttribute('content', `sri sri healthcare, srisrihealthcare111.netlify.app, https://srisrihealthcare111.netlify.app, ${seo.keywords}`);
  }

  // 5. Update Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', targetUrl);
  }

  // 6. Update Open Graph Tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', seo.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', seo.description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', targetUrl);

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) {
    const localeMap = { gu: 'gu_IN', en: 'en_US', hi: 'hi_IN' };
    ogLocale.setAttribute('content', localeMap[validLang] || 'gu_IN');
  }

  // 7. Update Twitter Card Tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', seo.title);

  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', seo.description);

  const twitterUrl = document.querySelector('meta[name="twitter:url"]');
  if (twitterUrl) twitterUrl.setAttribute('content', targetUrl);

  // 8. Update html lang attribute
  if (document.documentElement) {
    document.documentElement.setAttribute('lang', validLang);
  }

  // 9. Sync URL query params smoothly without reloading
  if (typeof window !== 'undefined' && window.history) {
    const currentUrl = new URL(window.location.href);
    if (tab && tab !== 'triage') {
      currentUrl.searchParams.set('tab', tab);
    } else {
      currentUrl.searchParams.delete('tab');
    }
    if (validLang && validLang !== 'gu') {
      currentUrl.searchParams.set('lang', validLang);
    } else {
      currentUrl.searchParams.delete('lang');
    }
    window.history.replaceState({}, '', currentUrl.toString());
  }
};
