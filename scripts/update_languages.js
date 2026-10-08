const fs = require('fs');
const path = require('path');

// Read the existing languageService.js
const targetFile = path.resolve(__dirname, '../client/src/services/languageService.js');

// We will build clean, complete dictionaries for all 16 languages.
// Let's load the current file and parse MASTER_TRANSLATIONS
const { MASTER_TRANSLATIONS, SUPPORTED_LANGUAGES } = require(targetFile);

// New keys to add across languages:
const commonNewKeys = {
  gu: {
    ribbonDoctorTitle: "૬. ડૉક્ટર ડિરેક્ટરી",
    ribbonDoctorSub: "ગુજરાત • ભારત • વિશ્વ",
    ribbonGuideTitle: "૭. સરળ ઍપ ગાઈડ",
    ribbonGuideSub: "🔊 બોલીને સાંભળો",
    loginSignUp: "🔑 લૉગિન / સાઇન અપ",
    switchAccount: "બદલો",
    signOut: "સાઇન આઉટ"
  },
  en: {
    ribbonDoctorTitle: "6. Doctor Directory",
    ribbonDoctorSub: "Gujarat • India • Global",
    ribbonGuideTitle: "7. Easy App Guide",
    ribbonGuideSub: "🔊 Listen in Voice",
    loginSignUp: "🔑 Login / Sign Up",
    switchAccount: "Switch",
    signOut: "Sign Out"
  },
  hi: {
    ribbonDoctorTitle: "६. डॉक्टर निर्देशिका",
    ribbonDoctorSub: "गुजरात • भारत • विश्व",
    ribbonGuideTitle: "७. आसान ऐप गाइड",
    ribbonGuideSub: "🔊 बोलकर सुनें",
    loginSignUp: "🔑 लॉगिन / साइन अप",
    switchAccount: "बदलें",
    signOut: "साइन आउट"
  },
  ku: {
    ribbonDoctorTitle: "૬. ડૉક્ટર ડિરેક્ટરી",
    ribbonDoctorSub: "ગુજરાત • ભારત • વિશ્વ",
    ribbonGuideTitle: "૭. સરળ ઍપ ગાઈડ",
    ribbonGuideSub: "🔊 બોલીને સાંભળો",
    loginSignUp: "🔑 લૉગિન / સાઇન અપ",
    switchAccount: "બદલો",
    signOut: "સાઇન આઉટ"
  },
  mr: {
    ribbonDoctorTitle: "६. डॉक्टर निर्देशिका",
    ribbonDoctorSub: "गुजरात • भारत • जागतिक",
    ribbonGuideTitle: "७. सोपे ॲप मार्गदर्शक",
    ribbonGuideSub: "🔊 आवाजात ऐका",
    loginSignUp: "🔑 लॉगिन / साइन अप",
    switchAccount: "बदला",
    signOut: "साइन आउट"
  },
  bn: {
    ribbonDoctorTitle: "৬. ডাক্তার ডিরেক্টরি",
    ribbonDoctorSub: "গুজরাট • ভারত • বৈশ্বিক",
    ribbonGuideTitle: "৭. সহজ অ্যাপ গাইড",
    ribbonGuideSub: "🔊 ভয়েসে শুনুন",
    loginSignUp: "🔑 লগইন / সাইন আপ",
    switchAccount: "পরিবর্তন",
    signOut: "সাইন আউট"
  },
  ta: {
    ribbonDoctorTitle: "6. மருத்துவர் அடைவு",
    ribbonDoctorSub: "குஜராத் • இந்தியா • உலகம்",
    ribbonGuideTitle: "7. எளிய ஆப் வழிகாட்டி",
    ribbonGuideSub: "🔊 குரலில் கேளுங்கள்",
    loginSignUp: "🔑 உள்நுழைவு / பதிவு",
    switchAccount: "மாற்று",
    signOut: "வெளியேறு"
  },
  te: {
    ribbonDoctorTitle: "6. డాక్టర్ డైరెక్టరీ",
    ribbonDoctorSub: "గుజరాత్ • భారతదేశం • ప్రపంచం",
    ribbonGuideTitle: "7. సులభమైన యాప్ గైడ్",
    ribbonGuideSub: "🔊 వాయిస్‌లో వినండి",
    loginSignUp: "🔑 లాగిన్ / సైన్ అప్",
    switchAccount: "మార్చండి",
    signOut: "సైన్ అవుట్"
  },
  pa: {
    ribbonDoctorTitle: "੬. ਡਾਕਟਰ ਡਾਇਰੈਕਟਰੀ",
    ribbonDoctorSub: "ਗੁਜਰਾਤ • ਭਾਰਤ • ਵਿਸ਼ਵ",
    ribbonGuideTitle: "੭. ਆਸਾਨ ਐਪ ਗਾਈਡ",
    ribbonGuideSub: "🔊 ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ",
    loginSignUp: "🔑 ਲੌਗਇਨ / ਸਾਈਨ ਅੱਪ",
    switchAccount: "ਬਦਲੋ",
    signOut: "ਸਾਈਨ ਆਉਟ"
  },
  es: {
    ribbonDoctorTitle: "6. Directorio Médico",
    ribbonDoctorSub: "Gujarat • India • Global",
    ribbonGuideTitle: "7. Guía Rápida",
    ribbonGuideSub: "🔊 Escuchar por voz",
    loginSignUp: "🔑 Iniciar sesión / Registro",
    switchAccount: "Cambiar",
    signOut: "Cerrar sesión"
  },
  fr: {
    ribbonDoctorTitle: "6. Annuaire Médecins",
    ribbonDoctorSub: "Gujarat • Inde • Mondial",
    ribbonGuideTitle: "7. Guide Simple",
    ribbonGuideSub: "🔊 Écouter en voix",
    loginSignUp: "🔑 Connexion / Inscription",
    switchAccount: "Changer",
    signOut: "Déconnexion"
  },
  de: {
    ribbonDoctorTitle: "6. Ärzteverzeichnis",
    ribbonDoctorSub: "Gujarat • Indien • Weltweit",
    ribbonGuideTitle: "7. Einfache Anleitung",
    ribbonGuideSub: "🔊 Sprachausgabe",
    loginSignUp: "🔑 Anmelden / Registrieren",
    switchAccount: "Wechseln",
    signOut: "Abmelden"
  },
  ar: {
    ribbonDoctorTitle: "6. دليل الأطباء",
    ribbonDoctorSub: "غوجارات • الهند • عالمي",
    ribbonGuideTitle: "7. دليل التطبيق",
    ribbonGuideSub: "🔊 استمع بالصوت",
    loginSignUp: "🔑 تسجيل الدخول / التسجيل",
    switchAccount: "تبديل",
    signOut: "تسجيل الخروج"
  },
  ru: {
    ribbonDoctorTitle: "6. Справочник врачей",
    ribbonDoctorSub: "Гуджарат • Индия • Весь мир",
    ribbonGuideTitle: "7. Простое руководство",
    ribbonGuideSub: "🔊 Голосовая озвучка",
    loginSignUp: "🔑 Войти / Регистрация",
    switchAccount: "Сменить",
    signOut: "Выйти"
  },
  zh: {
    ribbonDoctorTitle: "6. 医生名录",
    ribbonDoctorSub: "古吉拉特 • 印度 • 全球",
    ribbonGuideTitle: "7. 应用操作指南",
    ribbonGuideSub: "🔊 语音收听",
    loginSignUp: "🔑 登录 / 注册",
    switchAccount: "切换",
    signOut: "退出"
  },
  ja: {
    ribbonDoctorTitle: "6. 医師名簿",
    ribbonDoctorSub: "グジャラート • インド • 世界",
    ribbonGuideTitle: "7. アプリガイド",
    ribbonGuideSub: "🔊 音声で聞く",
    loginSignUp: "🔑 ログイン / 新規登録",
    switchAccount: "切替",
    signOut: "ログアウト"
  }
};

// Translations for the 41 keys that were missing in other languages
const missingKeysDictionary = {
  mr: {
    tabDoctorDirectory: "🌍 जागतिक व भारत डॉक्टर निर्देशिका",
    installAppPrompt: "Sri Sri ❤️ HealthCare ॲप इन्स्टॉल करण्यासाठी ब्राऊझर मेन्यू (⋮) वर टॅप करा आणि 'Add to Home screen' निवडा.",
    hudBpm: "सामान्य नाडी (BPM)",
    hudRag: "ICMR वैद्यकीय अचूकता",
    hudSavings: "जन औषधी बचत",
    hudPhc: "सक्रिय १०८ व ICU बेड्स",
    realCaseBtn: "✨ रिअल-केस सिम्युलेटर",
    emergencyCallTitle: "🚨 १०८ रुग्णवाहिका आणीबाणी सेवा",
    emergencyCallBody: "१०८ रुग्णवाहिका नियंत्रण कक्षाशी संपर्क साधला जात आहे... कृपया शांत राहा आणि अचूक स्थान सांगा.",
    sosAlertTitle: "📲 तात्काळ SOS अलर्ट पाठवला",
    sosAlertBody: "रुग्णाचे थेट स्थान आणि आणीबाणी संदेश कुटुंब आणि आशा सेविकेला पाठवला गेला आहे!",
    okBtn: "ठीक आहे",
    closeBtn: "बंद करा",
    triageTagHeadache: "🤕 तीव्र डोकेदुखी (Headache)",
    triageTagHeadacheText: "माझे डोके खूप दुखत आहे आणि अंग तापत आहे.",
    triageTagFever: "🌡️ उच्च ताप व थंडी (Fever)",
    triageTagFeverText: "अंग गरम तापत आहे, थंडी वाजत आहे आणि अंगदुखी आहे.",
    triageTagAcidity: "🔥 ॲसिडिटी व छातीत जळजळ",
    triageTagAcidityText: "मला खूप ॲसिडिटी, आंबट ढेकर आणि छातीत जळजळ होत आहे.",
    triageTagCold: "🤧 सर्दी, खोकला व घसा खवखवणे",
    triageTagColdText: "मला सतत खोकला, वाहणारे नाक आणि घशात खवखव होत आहे.",
    triageTagChestPain: "💔 छातीत दाब व घाम (Emergency)",
    triageTagChestPainText: "मला छातीत तीव्र दाब, डाव्या हाताला वेदना आणि थंड घाम येत आहे.",
    triageAnalyzing: "AI वैद्यकीय इंजिन लक्षणांचे विश्लेषण करत आहे...",
    triageMic: "माईक",
    triageMicListening: "ऐकत आहे...",
    urgencyLevel: "ट्रायज निकड पातळी:",
    recommendedAction: "वैद्यकीय शिफारस:",
    allopathicCare: "💊 ॲलोपॅथिक प्रथमोपचार (पुरावा-आधारित)",
    ayurvedicCare: "🌿 १००% औषधमुक्त आयुष व आयुर्वेदिक घरगुती उपाय",
    dietCare: "🥗 पथ्य, आहार व जलसंजीवनी मार्गदर्शन",
    disclaimerText: "⚠️ वैद्यकीय सूचना: ही AI प्रणाली प्राथमिक सल्ला आणि मार्गदर्शनासाठी आहे. औषध सुरू करण्यापूर्वी नोंदणीकृत डॉक्टरांचा सल्ला घ्या.",
    chatbotInitialMsg: "नमस्कार! मी **Sri Sri ❤️ HealthCare** चा २४/७ AI डॉक्टर आहे. आजार, लक्षणे किंवा औषधांबद्दल मला विचारा:",
    visionHeader: "📷 वैद्यकीय व्हिजन स्कॅनर व लॅब रिपोर्ट तपासणी",
    visionSubheader: "वैद्यकीय स्कॅन मोड निवडा किंवा तुमचा क्ष-किरण / लॅब रिपोर्ट अपलोड करा:",
    encyclopediaHeader: "💊 जन औषधी स्वस्त औषधे व आयुष ज्ञानकोश",
    encyclopediaSubheader: "८५% स्वस्त औषधे, डोस माहिती आणि १००% आयुर्वेदिक घरगुती उपाय शोधा:",
    vitalsHeader: "💓 संपर्कविरहित कॅमेरा नाडी व व्हायटल्स स्कॅनर (rPPG)",
    vitalsSubheader: "चेहरा चांगल्या प्रकाशात कॅमेऱ्यासमोर ठेवा. कॉम्प्युटर व्हिजन तुमच्या नाडीचे मोजमाप करेल:",
    vitalsStart: "थेट नाडी स्कॅन सुरू करा",
    vitalsStop: "स्कॅनर थांबवा"
  },
  bn: {
    tabDoctorDirectory: "🌍 গ্লোবাল ও ভারত ডাক্তার ডিরেক্টরি",
    installAppPrompt: "Sri Sri ❤️ HealthCare ইনস্টল করতে ব্রাউজার মেনু (⋮) থেকে 'Add to Home screen' নির্বাচন করুন।",
    hudBpm: "স্বাভাবিক হৃদস্পন্দন (BPM)",
    hudRag: "ICMR ক্লিনিকাল নির্ভুলতা",
    hudSavings: "জন ঔষধি জেনেরিক সাশ্রয়",
    hudPhc: "সক্রিয় ১০৮ ও আইসিইউ বেড",
    realCaseBtn: "✨ রিয়েল-কেস সিমুলেটর",
    emergencyCallTitle: "🚨 ১০৮ অ্যাম্বুলেন্স জরুরি সেবা",
    emergencyCallBody: "১০৮ অ্যাম্বুলেন্স নিয়ন্ত্রণ কক্ষের সাথে সংযোগ স্থাপন হচ্ছে... শান্ত থাকুন ও সঠিক অবস্থান জানান।",
    sosAlertTitle: "📲 তাত্ক্ষণিক এসওএস অ্যালার্ট প্রেরিত",
    sosAlertBody: "রোগীর লাইভ লোকেশন ও জরুরি বার্তা পরিবার এবং আশা কর্মীকে পাঠানো হয়েছে!",
    okBtn: "ঠিক আছে",
    closeBtn: "বন্ধ করুন",
    triageTagHeadache: "🤕 তীব্র মাথাব্যথা",
    triageTagHeadacheText: "আমার মাথা খুব ব্যথা করছে এবং শরীর গরম লাগছে।",
    triageTagFever: "🌡️ তীব্র জ্বর ও কাঁপুনি",
    triageTagFeverText: "তীব্র জ্বর, কাঁপুনি ও সারা শরীরে ব্যথা হচ্ছে।",
    triageTagAcidity: "🔥 অ্যাসিডিটি ও বুকজ্বালা",
    triageTagAcidityText: "তীব্র অ্যাসিড রিফ্লাক্স, টক ঢেঁকুর ও বুকে জ্বালাপোড়া হচ্ছে।",
    triageTagCold: "🤧 সর্দি, কাশি ও গলাব্যথা",
    triageTagColdText: "ক্রমাগত কাশি, সর্দি ও গলায় তীব্র জ্বালা করছে।",
    triageTagChestPain: "💔 বুকে চাপ ও ঘাম (জরুরি)",
    triageTagChestPainText: "বুকে তীব্র চাপ, বাম হাতে ব্যথা ও ঠান্ডা ঘাম বের হচ্ছে।",
    triageAnalyzing: "ক্লিনিকাল এআই লক্ষণ বিশ্লেষণ করছে...",
    triageMic: "মাইক",
    triageMicListening: "শুনছি...",
    urgencyLevel: "ট্রায়াজ জরুরি মাত্রা:",
    recommendedAction: "চিকিৎসা পরামর্শ:",
    allopathicCare: "💊 অ্যালোপ্যাথিক প্রাথমিক চিকিৎসা (প্রমাণ-ভিত্তিক)",
    ayurvedicCare: "🌿 আয়ুষ ও আয়ুর্বেদিক ভেষজ ঘরোয়া প্রতিকার",
    dietCare: "🥗 খাদ্য ও হাইড্রেশন প্রোটোকল",
    disclaimerText: "⚠️ সতর্কতা: এই এআই ব্যবস্থা প্রাথমিক ট্রায়াজের জন্য। ওষুধ সেবনের আগে নিবন্ধিত চিকিৎসকের পরামর্শ নিন।",
    chatbotInitialMsg: "নমস্কার! আমি **Sri Sri ❤️ HealthCare** এর ২৪/৭ এআই চিকিৎসক। যেকোনো রোগ, লক্ষণ বা ওষুধ সম্পর্কে জিজ্ঞাসা করুন:",
    visionHeader: "📷 মেডিকেল ভিশন ডায়াগনস্টিকস ও রিপোর্ট স্ক্যানার",
    visionSubheader: "ক্লিনিকাল মোড বেছে নিন বা এক্স-রে / ল্যাব রিপোর্ট আপলোড করুন:",
    encyclopediaHeader: "💊 জন ঔষধি জেনেরিক মেডিসিন এনসাইক্লোপিডিয়া",
    encyclopediaSubheader: "৮৫% সাশ্রয়ী ওষুধ ও ভেষজ প্রতিকার খুঁজুন:",
    vitalsHeader: "💓 কন্ট্যাক্টলেস ক্যামেরা পালস ও ভাইটালস স্ক্যানার",
    vitalsSubheader: "ভালো আলোতে মুখ রাখুন, এআই আপনার নাড়ি স্পন্দন গণনা করবে:",
    vitalsStart: "পালস স্ক্যান শুরু করুন",
    vitalsStop: "বন্ধ করুন"
  },
  ta: {
    tabDoctorDirectory: "🌍 உலகளாவிய & இந்திய மருத்துவர் அடைவு",
    installAppPrompt: "Sri Sri ❤️ HealthCare செயலியை நிறுவ உலாவி மெனுவில் (⋮) 'Add to Home screen' என்பதை தேர்ந்தெடுக்கவும்.",
    hudBpm: "சாதாரண இதய துடிப்பு (BPM)",
    hudRag: "ICMR மருத்துவ துல்லியம்",
    hudSavings: "ஜன ஔஷதி மருந்து சேமிப்பு",
    hudPhc: "செயலில் உள்ள 108 & ஐசியூ படுக்கைகள்",
    realCaseBtn: "✨ நேரடி மருத்துவ மாதிரி",
    emergencyCallTitle: "🚨 108 ஆம்புலன்ஸ் அவசர சேவை",
    emergencyCallBody: "108 ஆம்புலன்ஸ் கட்டுப்பாட்டு அறை இணைக்கப்படுகிறது... தயவுசெய்து அமைதியாக இருங்கள்.",
    sosAlertTitle: "📲 அவசர SOS எச்சரிக்கை அனுப்பப்பட்டது",
    sosAlertBody: "நோயாளியின் நேரடி இருப்பிடம் குடும்பத்தினருக்கும் ஆஷா பணியாளருக்கும் அனுப்பப்பட்டது!",
    okBtn: "சரி",
    closeBtn: "மூடு",
    triageTagHeadache: "🤕 கடுமையான தலைவலி",
    triageTagHeadacheText: "எனக்கு கடுமையான தலைவலி மற்றும் காய்ச்சல் உள்ளது.",
    triageTagFever: "🌡️ கடுமையான காய்ச்சல் & குளிர்",
    triageTagFeverText: "அதிக காய்ச்சல், நடுக்கம் மற்றும் உடல் வலி உள்ளது.",
    triageTagAcidity: "🔥 அசிடிட்டி & நெஞ்செரிச்சல்",
    triageTagAcidityText: "அதிக அசிடிட்டி மற்றும் நெஞ்சில் கடுமையான எரிச்சல் உள்ளது.",
    triageTagCold: "🤧 சளி, இருமல் & தொண்டை வலி",
    triageTagColdText: "தொடர் இருமல் மற்றும் சளி தொல்லை உள்ளது.",
    triageTagChestPain: "💔 மார்பு வலி & வியர்வை (அவசரம்)",
    triageTagChestPainText: "மார்பில் கடுமையான அழுத்தம் மற்றும் இடது கையில் வலி உள்ளது.",
    triageAnalyzing: "AI மருத்துவ நுண்ணறிவு அறிகுறிகளை பகுப்பாய்வு செய்கிறது...",
    triageMic: "மைக்",
    triageMicListening: "கேட்கிறது...",
    urgencyLevel: "அவசர நிலை:",
    recommendedAction: "மருத்துவ பரிந்துரை:",
    allopathicCare: "💊 அலோபதி முதலுதவி",
    ayurvedicCare: "🌿 ஆயுர்வேத & பாரம்பரிய மூலிகை பராமரிப்பு",
    dietCare: "🥗 உணவு & நீரேற்ற வழிகாட்டுதல்",
    disclaimerText: "⚠️ மறுப்பு: இந்த AI முறை முதற்கட்ட உதவிக்கானது. மருந்து உட்கொள்ளும் முன் மருத்துவரை அணுகவும்.",
    chatbotInitialMsg: "வணக்கம்! நான் **Sri Sri ❤️ HealthCare** 24/7 AI மருத்துவர். அறிகுறிகள் அல்லது மருந்துகள் பற்றி என்னிடம் கேளுங்கள்:",
    visionHeader: "📷 மருத்துவ விஷன் ஸ்கேனர் & லேப் ரிப்போர்ட்",
    visionSubheader: "எக்ஸ்-ரே அல்லது மருத்துவ அறிக்கையை பதிவேற்றவும்:",
    encyclopediaHeader: "💊 ஜன ஔஷதி பொது மருந்துகள் & ஆயுஷ் கலைக்களஞ்சியம்",
    encyclopediaSubheader: "85% குறைந்த விலை மருந்துகள் மற்றும் மூலிகை சிகிச்சைகளை கண்டறியவும்:",
    vitalsHeader: "💓 காண்டாக்ட்லெஸ் கேமரா பல்ஸ் ஸ்கேனர் (rPPG)",
    vitalsSubheader: "முகத்தை கேமரா முன் வைக்கவும், AI உங்கள் இதய துடிப்பை அளவிடும்:",
    vitalsStart: "துடிப்பு ஸ்கேனை தொடங்கு",
    vitalsStop: "நிறுத்து"
  },
  te: {
    tabDoctorDirectory: "🌍 గ్లోబల్ & భారతీయ వైద్యుల డైరెక్టరీ",
    installAppPrompt: "Sri Sri ❤️ HealthCare యాప్‌ని ఇన్‌స్టాల్ చేయడానికి బ్రౌజర్ మెనూలో (⋮) 'Add to Home screen' ఎంచుకోండి.",
    hudBpm: "సాధారణ నాడి రేటు (BPM)",
    hudRag: "ICMR క్లినికల్ ఖచ్చితత్వం",
    hudSavings: "జన ఔషధి మందుల పొదుపు",
    hudPhc: "యాక్టివ్ 108 & ICU బెడ్లు",
    realCaseBtn: "✨ రియల్-కేస్ సిమ్యులేటర్",
    emergencyCallTitle: "🚨 108 అంబులెన్స్ అత్యవసర సేవ",
    emergencyCallBody: "108 అంబులెన్స్ కంట్రోల్ రూమ్‌తో కనెక్ట్ అవుతోంది... దయచేసి ప్రశాంతంగా ఉండండి.",
    sosAlertTitle: "📲 తక్షణ SOS హెచ్చరిక పంపబడింది",
    sosAlertBody: "రోగి లైవ్ లొకేషన్ మరియు సమాచారం కుటుంబానికి పంపబడింది!",
    okBtn: "సరే",
    closeBtn: "మూసివేయి",
    triageTagHeadache: "🤕 తీవ్రమైన తలనొప్పి",
    triageTagHeadacheText: "నాకు చాలా తలనొప్పిగా ఉంది మరియు ఒళ్లు వెచ్చగా ఉంది.",
    triageTagFever: "🌡️ తీవ్రమైన జ్వరం & చలి",
    triageTagFeverText: "తీవ్రమైన జ్వరం, వణుకు మరియు ఒళ్లు నొప్పులు ఉన్నాయి.",
    triageTagAcidity: "🔥 ఎసిడిటీ & ఛాతీలో మంట",
    triageTagAcidityText: "కడుపులో మంట, పుల్లటి తేన్పులు మరియు ఎసిడిటీ ఉన్నాయి.",
    triageTagCold: "🤧 జలుబు, దగ్గు & గొంతు నొప్పి",
    triageTagColdText: "ఎడతెగని దగ్గు మరియు జలుబు ఉన్నాయి.",
    triageTagChestPain: "💔 ఛాతీలో ఒత్తిడి & చెమటలు (అత్యవసరం)",
    triageTagChestPainText: "ఛాతీలో తీవ్రమైన నొప్పి, ఎడమ చేతికి నొప్పి పాకుతోంది.",
    triageAnalyzing: "AI క్లినికల్ ఇంజిన్ విశ్లేషిస్తోంది...",
    triageMic: "మైక్",
    triageMicListening: "వింటోంది...",
    urgencyLevel: "అత్యవసర స్థాయి:",
    recommendedAction: "వైద్య సిఫార్సు:",
    allopathicCare: "💊 అల్లోపతి ప్రథమ చికిత్స",
    ayurvedicCare: "🌿 ఆయుష్ & ఆయుర్వేద గృహ చికిత్స",
    dietCare: "🥗 ఆహార నియమాలు & హైడ్రేషన్",
    disclaimerText: "⚠️ క్లినికల్ నిరాకరణ: ఇది ప్రాథమిక సహాయం కోసం మాత్రమే. మందులు వాడే ముందు డాక్టర్‌ను సంప్రదించండి.",
    chatbotInitialMsg: "నమస్కారం! నేను **Sri Sri ❤️ HealthCare** 24/7 AI డాక్టర్. వ్యాధులు, లక్షణాలు లేదా మందుల గురించి అడగండి:",
    visionHeader: "📷 మెడికల్ విజన్ డయాగ్నస్టిక్స్ & రిపోర్ట్ స్కానర్",
    visionSubheader: "ఎక్స్-రే లేదా ల్యాబ్ రిపోర్ట్ అప్‌లోడ్ చేయండి:",
    encyclopediaHeader: "💊 జన ఔషధి జెనెరిక్ మందుల సమాచారం",
    encyclopediaSubheader: "85% తగ్గింపు మందులు & ఆయుర్వేద నివారణలు కనుగొనండి:",
    vitalsHeader: "💓 కాంటాక్ట్‌లెస్ కెమెరా పల్స్ స్కానర్ (rPPG)",
    vitalsSubheader: "కెమెరా ముందు ముఖం ఉంచండి, AI మీ నాడిని లెక్కిస్తుంది:",
    vitalsStart: "పల్స్ స్కాన్ ప్రారంభించు",
    vitalsStop: "ఆపివేయి"
  },
  pa: {
    tabDoctorDirectory: "🌍 ਗਲੋਬਲ ਅਤੇ ਭਾਰਤ ਡਾਕਟਰ ਡਾਇਰੈਕਟਰੀ",
    installAppPrompt: "Sri Sri ❤️ HealthCare ਐਪ ਇੰਸਟਾਲ ਕਰਨ ਲਈ ਬ੍ਰਾਊਜ਼ਰ ਮੀਨੂ (⋮) ਤੋਂ 'Add to Home screen' ਚੁਣੋ।",
    hudBpm: "ਆਮ ਨਬਜ਼ (BPM)",
    hudRag: "ICMR ਡਾਕਟਰੀ ਸ਼ੁੱਧਤਾ",
    hudSavings: "ਜਨ ਔਸ਼ਧੀ ਬੱਚਤ",
    hudPhc: "ਸਰਗਰਮ 108 ਅਤੇ ਆਈਸੀਯੂ ਬੈੱਡ",
    realCaseBtn: "✨ ਰੀਅਲ-ਕੇਸ ਸਿਮੂਲੇਟਰ",
    emergencyCallTitle: "🚨 108 ਐਂਬੂਲੈਂਸ ਐਮਰਜੈਂਸੀ ਸੇਵਾ",
    emergencyCallBody: "108 ਐਂਬੂਲੈਂਸ ਕੰਟਰੋਲ ਰੂਮ ਨਾਲ ਸੰਪਰਕ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ... ਕਿਰਪਾ ਕਰਕੇ ਸ਼ਾਂਤ ਰਹੋ।",
    sosAlertTitle: "📲 ਤਤਕਾਲ SOS ਅਲਰਟ ਭੇਜਿਆ ਗਿਆ",
    sosAlertBody: "ਮਰੀਜ਼ ਦੀ ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਪਰਿਵਾਰ ਅਤੇ ਆਸ਼ਾ ਵਰਕਰ ਨੂੰ ਭੇਜੀ ਗਈ ਹੈ!",
    okBtn: "ਠੀਕ ਹੈ",
    closeBtn: "ਬੰਦ ਕਰੋ",
    triageTagHeadache: "🤕 ਤੇਜ਼ ਸਿਰਦਰਦ",
    triageTagHeadacheText: "ਮੈਨੂੰ ਬਹੁਤ ਤੇਜ਼ ਸਿਰਦਰਦ ਹੈ ਅਤੇ ਸਰੀਰ ਗਰਮ ਹੈ।",
    triageTagFever: "🌡️ ਤੇਜ਼ ਬੁਖਾਰ ਅਤੇ ਕੰਬਣੀ",
    triageTagFeverText: "ਤੇਜ਼ ਬੁਖਾਰ, ਕੰਬਣੀ ਅਤੇ ਸਰੀਰ ਵਿੱਚ ਦਰਦ ਹੈ।",
    triageTagAcidity: "🔥 ਐਸੀਡਿਟੀ ਅਤੇ ਛਾਤੀ ਵਿੱਚ ਜਲਣ",
    triageTagAcidityText: "ਖੱਟੇ ਡਕਾਰ ਅਤੇ ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਜਲਣ ਹੋ ਰਹੀ ਹੈ।",
    triageTagCold: "🤧 ਜ਼ੁਕਾਮ, ਖੰਘ ਅਤੇ ਗਲੇ ਵਿੱਚ ਖਰਾਸ਼",
    triageTagColdText: "ਲਗਾਤਾਰ ਖੰਘ ਅਤੇ ਨੱਕ ਵਹਿ ਰਿਹਾ ਹੈ।",
    triageTagChestPain: "💔 ਛਾਤੀ ਵਿੱਚ ਦਬਾਅ ਅਤੇ ਪਸੀਨਾ (ਐਮਰਜੈਂਸੀ)",
    triageTagChestPainText: "ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ ਅਤੇ ਖੱਬੀ ਬਾਂਹ ਵਿੱਚ ਖਿੱਚ ਪੈ ਰਹੀ ਹੈ।",
    triageAnalyzing: "AI ਕਲੀਨਿਕਲ ਇੰਜਣ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰ ਰਿਹਾ ਹੈ...",
    triageMic: "ਮਾਈਕ",
    triageMicListening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
    urgencyLevel: "ਐਮਰਜੈਂਸੀ ਪੱਧਰ:",
    recommendedAction: "ਡਾਕਟਰੀ ਸਲਾਹ:",
    allopathicCare: "💊 ਐਲੋਪੈਥਿਕ ਮੁੱਢਲੀ ਸਹਾਇਤਾ",
    ayurvedicCare: "🌿 ਆਯੁਸ਼ ਅਤੇ ਆਯੁਰਵੈਦਿਕ ਘਰੇਲੂ ਉਪਚਾਰ",
    dietCare: "🥗 ਖੁਰਾਕ ਅਤੇ ਹਾਈਡਰੇਸ਼ਨ ਨਿਯਮ",
    disclaimerText: "⚠️ ਡਾਕਟਰੀ ਸੂਚਨਾ: ਇਹ AI ਸਿਰਫ਼ ਮੁੱਢਲੇ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਹੈ। ਦਵਾਈ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।",
    chatbotInitialMsg: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ **Sri Sri ❤️ HealthCare** ਦਾ 24/7 AI ਡਾਕਟਰ ਹਾਂ। ਕਿਸੇ ਵੀ ਬਿਮਾਰੀ ਜਾਂ ਦਵਾਈ ਬਾਰੇ ਪੁੱਛੋ:",
    visionHeader: "📷 ਮੈਡੀਕਲ ਵਿਜ਼ਨ ਡਾਇਗਨੌਸਟਿਕਸ ਅਤੇ ਰਿਪੋਰਟ ਸਕੈਨਰ",
    visionSubheader: "ਐਕਸ-ਰੇ ਜਾਂ ਲੈਬ ਰਿਪੋਰਟ ਅੱਪਲੋਡ ਕਰੋ:",
    encyclopediaHeader: "💊 ਜਨ ਔਸ਼ਧੀ ਜੈਨੇਰਿਕ ਦਵਾਈਆਂ ਦਾ ਵਿਸ਼ਵਕੋਸ਼",
    encyclopediaSubheader: "85% ਸਸਤੀਆਂ ਦਵਾਈਆਂ ਅਤੇ ਆਯੁਰਵੈਦਿਕ ਇਲਾਜ ਲੱਭੋ:",
    vitalsHeader: "💓 ਕੈਮਰਾ ਪਲਸ ਅਤੇ ਵਾਈਟਲਸ ਸਕੈਨਰ (rPPG)",
    vitalsSubheader: "ਚੰਗੀ ਰੌਸ਼ਨੀ ਵਿੱਚ ਚਿਹਰਾ ਕੈਮਰੇ ਸਾਹਮਣੇ ਰੱਖੋ:",
    vitalsStart: "ਪਲਸ ਸਕੈਨ ਸ਼ੁਰੂ ਕਰੋ",
    vitalsStop: "ਰੋਕੋ"
  },
  es: {
    tabDoctorDirectory: "🌍 Directorio Médico Global e Indio",
    installAppPrompt: "Para instalar Sri Sri ❤️ HealthCare, toque el menú del navegador (⋮) y elija 'Agregar a pantalla principal'.",
    hudBpm: "Pulso Normal (LPM)",
    hudRag: "Precisión Clínica ICMR",
    hudSavings: "Ahorro en Genéricos",
    hudPhc: "Camas UCI y 108 Activas",
    realCaseBtn: "✨ Simulador de Casos Reales",
    emergencyCallTitle: "🚨 Servicio de Emergencias 108",
    emergencyCallBody: "Conectando con la central 108... Mantenga la calma y comparta su ubicación.",
    sosAlertTitle: "📲 Alerta SOS Enviada",
    sosAlertBody: "¡La ubicación GPS y el reporte médico se enviaron a la familia y al personal de salud!",
    okBtn: "Aceptar",
    closeBtn: "Cerrar",
    triageTagHeadache: "🤕 Dolor de Cabeza Intenso",
    triageTagHeadacheText: "Tengo un dolor de cabeza severo y sensación febril.",
    triageTagFever: "🌡️ Fiebre Alta y Escalofríos",
    triageTagFeverText: "Siento el cuerpo ardiendo con fiebre alta, escalofríos y dolores musculares.",
    triageTagAcidity: "🔥 Acidez y Reflujo",
    triageTagAcidityText: "Tengo acidez estomacal severa, ardor en el pecho y gases.",
    triageTagCold: "🤧 Resfriado, Tos y Garganta",
    triageTagColdText: "Tengo tos persistente, congestión nasal e irritación de garganta.",
    triageTagChestPain: "💔 Dolor en el Pecho y Sudoración",
    triageTagChestPainText: "Tengo opresión aguda en el pecho, dolor en el brazo izquierdo y sudor frío.",
    triageAnalyzing: "El motor de IA clínica está analizando los síntomas...",
    triageMic: "Micrófono",
    triageMicListening: "Escuchando...",
    urgencyLevel: "Nivel de Urgencia del Triaje:",
    recommendedAction: "Recomendación Clínica:",
    allopathicCare: "💊 Primeros Auxilios Alopáticos (Basados en Evidencia)",
    ayurvedicCare: "🌿 Remedios Caseros Ayurvédicos y AYUSH 100% Naturales",
    dietCare: "🥗 Protocolos Dietéticos e Hidratación",
    disclaimerText: "⚠️ Aviso Clínico: Este sistema de IA es para orientación y triaje. Consulte a un médico colegiado antes de tomar medicamentos.",
    chatbotInitialMsg: "¡Hola! Soy el médico virtual con IA 24/7 de **Sri Sri ❤️ HealthCare**. Pregúntame sobre cualquier síntoma o medicamento:",
    visionHeader: "📷 Diagnóstico Visual Médico y Escaneo de Informes",
    visionSubheader: "Seleccione un modo clínico o suba su radiografía / informe de laboratorio:",
    encyclopediaHeader: "💊 Enciclopedia de Medicamentos Genéricos Jan Aushadhi",
    encyclopediaSubheader: "Encuentre genéricos con hasta 85% de ahorro y remedios herbales:",
    vitalsHeader: "💓 Escáner de Pulso y Signos Vitales por Cámara (rPPG)",
    vitalsSubheader: "Coloque su rostro frente a la cámara con buena luz:",
    vitalsStart: "Iniciar Escaneo de Pulso",
    vitalsStop: "Detener Escáner"
  },
  fr: {
    tabDoctorDirectory: "🌍 Répertoire Mondial des Médecins",
    installAppPrompt: "Pour installer Sri Sri ❤️ HealthCare, ouvrez le menu (⋮) et choisissez 'Ajouter à l'écran d'accueil'.",
    hudBpm: "Pouls Normal (BPM)",
    hudRag: "Précision Médicale ICMR",
    hudSavings: "Économies Génériques",
    hudPhc: "Lits Réanimation & 108 Actifs",
    realCaseBtn: "✨ Simulateur de Cas Cliniques",
    emergencyCallTitle: "🚨 Service d'Urgence SAMU 108",
    emergencyCallBody: "Connexion avec la régulation des urgences... Gardez votre calme et donnez votre position.",
    sosAlertTitle: "📲 Alerte SOS Immédiate Envoyée",
    sosAlertBody: "La géolocalisation et le rapport d'urgence ont été transmis à vos proches et aux soignants!",
    okBtn: "D'accord",
    closeBtn: "Fermer",
    triageTagHeadache: "🤕 Céphalée Sévère (Maux de tête)",
    triageTagHeadacheText: "J'ai un violent mal de tête lancinant et une sensation de fièvre.",
    triageTagFever: "🌡️ Forte Fièvre & Frissons",
    triageTagFeverText: "J'ai une forte fièvre avec frissons et courbatures.",
    triageTagAcidity: "🔥 Brûlures d'Estomac & Reflux",
    triageTagAcidityText: "J'ai des brûlures d'estomac intenses et des aigreurs.",
    triageTagCold: "🤧 Rhume, Toux & Gorge Irritée",
    triageTagColdText: "J'ai une toux persistante et le nez qui coule.",
    triageTagChestPain: "💔 Douleur Thoracique & Sueurs (Urgence)",
    triageTagChestPainText: "J'ai une oppression thoracique aiguë irradiant vers le bras gauche.",
    triageAnalyzing: "L'IA clinique analyse vos symptômes...",
    triageMic: "Micro",
    triageMicListening: "Écoute en cours...",
    urgencyLevel: "Niveau d'Urgence du Triage :",
    recommendedAction: "Recommandation Clinique :",
    allopathicCare: "💊 Premiers Soins Allopathiques (Basés sur les preuves)",
    ayurvedicCare: "🌿 Remèdes Naturels Ayurvédiques et AYUSH",
    dietCare: "🥗 Conseils Diététiques & Hydratation",
    disclaimerText: "⚠️ Avertissement : Ce système IA est destiné au triage d'orientation. Consultez un médecin agréé avant tout traitement.",
    chatbotInitialMsg: "Bonjour ! Je suis le médecin virtuel IA 24/7 de **Sri Sri ❤️ HealthCare**. Posez-moi vos questions médicales :",
    visionHeader: "📷 Diagnostic Visuel Médical & Analyse d'Imagerie",
    visionSubheader: "Sélectionnez un mode clinique ou téléversez votre radiographie / analyse :",
    encyclopediaHeader: "💊 Encyclopédie des Médicaments Génériques Jan Aushadhi",
    encyclopediaSubheader: "Trouvez des équivalents génériques à -85% et des soins naturels :",
    vitalsHeader: "💓 Scanner Sans Contact du Pouls par Caméra (rPPG)",
    vitalsSubheader: "Placez votre visage face à la caméra sous un bon éclairage :",
    vitalsStart: "Démarrer l'Analyse du Pouls",
    vitalsStop: "Arrêter"
  },
  de: {
    tabDoctorDirectory: "🌍 Weltweites & Indisches Ärzteverzeichnis",
    installAppPrompt: "Um Sri Sri ❤️ HealthCare zu installieren, tippen Sie auf (⋮) und wählen Sie 'Zum Startbildschirm hinzufügen'.",
    hudBpm: "Normaler Puls (BPM)",
    hudRag: "ICMR Klinische Genauigkeit",
    hudSavings: "Generika-Ersparnis",
    hudPhc: "Aktive 108 & Intensivbetten",
    realCaseBtn: "✨ Reallabor-Simulator",
    emergencyCallTitle: "🚨 108 Notruf-Ambulanzdienst",
    emergencyCallBody: "Verbindung zur 108-Notrufzentrale wird hergestellt... Bitte Ruhe bewahren.",
    sosAlertTitle: "📲 Sofortiger SOS-Notruf gesendet",
    sosAlertBody: "GPS-Standort und Notfallmeldung wurden an Angehörige und medizinisches Personal übermittelt!",
    okBtn: "OK",
    closeBtn: "Schließen",
    triageTagHeadache: "🤕 Starke Kopfschmerzen",
    triageTagHeadacheText: "Ich habe starke pochende Kopfschmerzen und fühle mich fiebrig.",
    triageTagFever: "🌡️ Hohes Fieber & Schüttelfrost",
    triageTagFeverText: "Mein Körper glüht vor hohem Fieber mit Schüttelfrost und Gliederschmerzen.",
    triageTagAcidity: "🔥 Sodbrennen & Übersäuerung",
    triageTagAcidityText: "Ich habe starkes Sodbrennen und brennende Schmerzen in der Brust.",
    triageTagCold: "🤧 Erkältung, Husten & Halsschmerzen",
    triageTagColdText: "Ich habe ständigen Husten, Schnupfen und Halskratzen.",
    triageTagChestPain: "💔 Brustschmerzen & Kaltschweiß (Notfall)",
    triageTagChestPainText: "Ich habe ein Engegefühl in der Brust und ausstrahlende Schmerzen in den linken Arm.",
    triageAnalyzing: "Klinische KI analysiert Symptome...",
    triageMic: "Mikrofon",
    triageMicListening: "Hört zu...",
    urgencyLevel: "Triage-Dringlichkeitsstufe:",
    recommendedAction: "Klinische Empfehlung:",
    allopathicCare: "💊 Allopathische Ersthilfe (Evidenzbasiert)",
    ayurvedicCare: "🌿 100% Natürliche Ayurvedische Hausmittel",
    dietCare: "🥗 Ernährungs- und Flüssigkeitsprotokoll",
    disclaimerText: "⚠️ Klinischer Hinweis: Dieses KI-System dient der Ersteinschätzung. Konsultieren Sie vor der Einnahme von Medikamenten einen approbierten Arzt.",
    chatbotInitialMsg: "Guten Tag! Ich bin Ihr 24/7 KI-Arzt von **Sri Sri ❤️ HealthCare**. Fragen Sie mich zu Symptomen oder Medikamenten:",
    visionHeader: "📷 Medizinische Bilddiagnostik & Berichtsscan",
    visionSubheader: "Wählen Sie einen Modus oder laden Sie Ihr Röntgenbild / Laborbefund hoch:",
    encyclopediaHeader: "💊 Jan Aushadhi Generika-Lexikon & Naturheilkunde",
    encyclopediaSubheader: "Finden Sie Generika mit bis zu 85% Ersparnis und Naturheilmittel:",
    vitalsHeader: "💓 Kontaktlose Kamera-Pulsmessung (rPPG)",
    vitalsSubheader: "Positionieren Sie Ihr Gesicht bei gutem Licht vor der Kamera:",
    vitalsStart: "Puls-Scan starten",
    vitalsStop: "Beenden"
  },
  ar: {
    tabDoctorDirectory: "🌍 دليل الأطباء العالمي وفي الهند",
    installAppPrompt: "لتثبيت تطبيق Sri Sri ❤️ HealthCare، اضغط على قائمة المتصفح (⋮) واختر 'إضافة إلى الشاشة الرئيسية'.",
    hudBpm: "نبض القلب الطبيعي (BPM)",
    hudRag: "دقة طبية وفق معايير ICMR",
    hudSavings: "توفير الأدوية الجنيسة",
    hudPhc: "أسرّة العناية و 108 النشطة",
    realCaseBtn: "✨ محاكي الحالات الواقعية",
    emergencyCallTitle: "🚨 خدمة طوارئ الإسعاف 108",
    emergencyCallBody: "جارٍ الاتصال بغرفة عمليات الإسعاف 108... يرجى التزام الهدوء ومشاركة موقعك الدقيق.",
    sosAlertTitle: "📲 تم إرسال تنبيه SOS الفوري",
    sosAlertBody: "تم إرسال موقع المريض والتقرير الطبي الطارئ إلى العائلة والفريق الصحي!",
    okBtn: "موافق",
    closeBtn: "إغلاق",
    triageTagHeadache: "🤕 صداع حاد",
    triageTagHeadacheText: "أعاني من صداع نابض شديد وشعور بالحرارة.",
    triageTagFever: "🌡️ حمى شديدة وقشعريرة",
    triageTagFeverText: "جسمي شديد الحرارة مع قشعريرة وآلام في الجسم.",
    triageTagAcidity: "🔥 حموضة وحرقة في المعدة",
    triageTagAcidityText: "أعاني من ارتداد حمضي حاد وحرقة في الصدر.",
    triageTagCold: "🤧 زكام وسعال والتهاب الحلق",
    triageTagColdText: "لدي سعال مستمر وسيلان في الأنف والتهاب في الحلق.",
    triageTagChestPain: "💔 ألم وضغط في الصدر (طوارئ)",
    triageTagChestPainText: "أشعر بضغط حاد في الصدر وألم يمتد للذراع الأيسر وعرق بارد.",
    triageAnalyzing: "محرك الذكاء الاصطناعي الطبي يحلل الأعراض...",
    triageMic: "الميكروفون",
    triageMicListening: "جارٍ الاستماع...",
    urgencyLevel: "مستوى الإلحاح الطبي:",
    recommendedAction: "التوصية السريرية:",
    allopathicCare: "💊 الإسعافات الأولية الصيدلانية (القائمة على الأدلة)",
    ayurvedicCare: "🌿 العلاجات المنزلية العشبية الطبيعية 100%",
    dietCare: "🥗 إرشادات التغذية وشرب السوائل",
    disclaimerText: "⚠️ إخلاء مسؤولية: هذا النظام مخصص للفرز الطبي والإرشاد. استشر طبيباً مرخصاً قبل تناول الأدوية.",
    chatbotInitialMsg: "أهلاً بك! أنا طبيب الذكاء الاصطناعي الطبي على مدار الساعة من **Sri Sri ❤️ HealthCare**. اسألني عن أي مرض أو دواء:",
    visionHeader: "📷 التشخيص البصري الطبي وفحص التقارير",
    visionSubheader: "اختر وضع الفحص أو ارفع صورة الأشعة / التقرير الطبي:",
    encyclopediaHeader: "💊 موسوعة الأدوية الجنيسة Jan Aushadhi والطب العشبي",
    encyclopediaSubheader: "اعثر على الأدوية الجنيسة بتوفير 85% والعلاجات الطبيعية:",
    vitalsHeader: "💓 مسح النبض والعلامات الحيوية عبر الكاميرا (rPPG)",
    vitalsSubheader: "ضع وجهك أمام الكاميرا في إضاءة جيدة لحساب النبض تلقائياً:",
    vitalsStart: "بدء فحص النبض الحي",
    vitalsStop: "إيقاف"
  },
  ru: {
    tabDoctorDirectory: "🌍 Международный и индийский справочник врачей",
    installAppPrompt: "Чтобы установить Sri Sri ❤️ HealthCare, нажмите (⋮) в браузере и выберите 'Добавить на главный экран'.",
    hudBpm: "Нормальный пульс (УД/МИН)",
    hudRag: "Точность по стандартам ICMR",
    hudSavings: "Экономия на дженериках",
    hudPhc: "Активные койки 108 и реанимации",
    realCaseBtn: "✨ Симулятор клинических случаев",
    emergencyCallTitle: "🚨 Скорая помощь 108",
    emergencyCallBody: "Соединение с диспетчером скорой помощи 108... Пожалуйста, сохраняйте спокойствие.",
    sosAlertTitle: "📲 Экстренный сигнал SOS отправлен",
    sosAlertBody: "GPS-координаты пациента и экстренное уведомление отправлены семье и медработникам!",
    okBtn: "Понятно",
    closeBtn: "Закрыть",
    triageTagHeadache: "🤕 Сильная головная боль",
    triageTagHeadacheText: "У меня сильная пульсирующая головная боль и жар.",
    triageTagFever: "🌡️ Высокая температура и озноб",
    triageTagFeverText: "Тело горит, высокая температура, сильный озноб и ломота.",
    triageTagAcidity: "🔥 Изжога и повышенная кислотность",
    triageTagAcidityText: "У меня сильный кислотный рефлюкс, жжение в груди и вздутие.",
    triageTagCold: "🤧 Простуда, кашель и боль в горле",
    triageTagColdText: "У меня постоянный кашель, насморк и сильное першение в горле.",
    triageTagChestPain: "💔 Боль в груди и потливость (Экстренно)",
    triageTagChestPainText: "Острая давящая боль в груди, отдающая в левую руку, и холодный пот.",
    triageAnalyzing: "Клинический ИИ анализирует симптомы...",
    triageMic: "Микрофон",
    triageMicListening: "Слушаю...",
    urgencyLevel: "Уровень срочности триажа:",
    recommendedAction: "Клиническая рекомендация:",
    allopathicCare: "💊 Первая аллопатическая помощь (доказательная медицина)",
    ayurvedicCare: "🌿 Натуральные растительные и аюрведические средства",
    dietCare: "🥗 Диетические рекомендации и регидратация",
    disclaimerText: "⚠️ Отказ от ответственности: Система предназначена для первичной сортировки. Перед приемом лекарств проконсультируйтесь с врачом.",
    chatbotInitialMsg: "Здравствуйте! Я круглосуточный ИИ-врач **Sri Sri ❤️ HealthCare**. Задайте мне вопрос о симптомах, анализах или лекарствах:",
    visionHeader: "📷 Медицинская диагностика по фото и сканирование анализов",
    visionSubheader: "Выберите режим или загрузите снимок рентгена / бланк анализов:",
    encyclopediaHeader: "💊 Энциклопедия доступных дженериков Jan Aushadhi",
    encyclopediaSubheader: "Найдите дженерики со скидкой до 85% и растительные средства:",
    vitalsHeader: "💓 Бесконтактное измерение пульса через камеру (rPPG)",
    vitalsSubheader: "Расположите лицо перед камерой при хорошем освещении:",
    vitalsStart: "Начать измерение пульса",
    vitalsStop: "Остановить"
  },
  zh: {
    tabDoctorDirectory: "🌍 全球及印度名医名录",
    installAppPrompt: "安装 Sri Sri ❤️ HealthCare，请点击浏览器菜单 (⋮) 并选择“添加到主屏幕”。",
    hudBpm: "正常静息心率 (BPM)",
    hudRag: "ICMR 临床精准循证",
    hudSavings: "普惠仿制药节省",
    hudPhc: "活跃 108 急救与 ICU 床位",
    realCaseBtn: "✨ 真实诊疗案例模拟器",
    emergencyCallTitle: "🚨 108 急救中心调度通道",
    emergencyCallBody: "正在接通 108 急救指挥中心……请保持冷静并说明准确位置。",
    sosAlertTitle: "📲 紧急 SOS 求救信号已发出",
    sosAlertBody: "患者实时定位和紧急医疗信息已同步发送至家属和社区医护！",
    okBtn: "确认",
    closeBtn: "关闭",
    triageTagHeadache: "🤕 剧烈头痛",
    triageTagHeadacheText: "我感到剧烈胀痛，头部沉重并伴有低热。",
    triageTagFever: "🌡️ 高热寒战",
    triageTagFeverText: "身体滚烫伴有高烧、发冷打颤和全身酸痛。",
    triageTagAcidity: "🔥 胃酸反流与烧心",
    triageTagAcidityText: "胃酸严重反流，胸骨后有灼烧感和腹胀。",
    triageTagCold: "🤧 感冒咳嗽与咽痛",
    triageTagColdText: "持续性咳嗽、流涕伴有咽喉肿痛不适。",
    triageTagChestPain: "💔 胸部压迫与冷汗（紧急）",
    triageTagChestPainText: "胸口剧烈压榨感，向左臂放射，并伴有冷汗。",
    triageAnalyzing: "临床 AI 引擎正在严密分析症状……",
    triageMic: "麦克风",
    triageMicListening: "正在聆听……",
    urgencyLevel: "分诊紧急程度：",
    recommendedAction: "临床处理建议：",
    allopathicCare: "💊 现代循证医学应急方案",
    ayurvedicCare: "🌿 100% 天然植物与传统医学调理方案",
    dietCare: "🥗 临床饮食与补水指南",
    disclaimerText: "⚠️ 临床声明：本 AI 系统用于分诊指导。用药前请务必咨询执业医师。",
    chatbotInitialMsg: "您好！我是 **Sri Sri ❤️ HealthCare** 24/7 全天候全科 AI 医生。您可以向我咨询任何症状、疾病或药品：",
    visionHeader: "📷 医学视觉影像诊断与报告解读",
    visionSubheader: "选择临床诊断模式或上传您的 X 光片 / 检验报告：",
    encyclopediaHeader: "💊 Jan Aushadhi 惠民仿制药与草本百科",
    encyclopediaSubheader: "查询节省高达 85% 的正规平价药品与天然草本疗法：",
    vitalsHeader: "💓 非接触式摄像头脉搏与生命体征监测 (rPPG)",
    vitalsSubheader: "在光线充足的环境下面对摄像头，计算机视觉将自动测算心率：",
    vitalsStart: "开始实时脉搏监测",
    vitalsStop: "停止监测"
  },
  ja: {
    tabDoctorDirectory: "🌍 グローバル＆インド医師名簿",
    installAppPrompt: "Sri Sri ❤️ HealthCare をインストールするには、ブラウザメニュー（⋮）から「ホーム画面に追加」を選択してください。",
    hudBpm: "正常安静時脈拍 (BPM)",
    hudRag: "ICMR基準の臨床精度",
    hudSavings: "公認ジェネリック削減効果",
    hudPhc: "稼働中の救急108＆ICU病床",
    realCaseBtn: "✨ 実臨床ケースシミュレーター",
    emergencyCallTitle: "🚨 108 救急要請ホットライン",
    emergencyCallBody: "救急指令センターに接続しています… 落ち着いて現在地をお伝えください。",
    sosAlertTitle: "📲 緊急SOSアラートを発信しました",
    sosAlertBody: "患者の位置情報と緊急医療通知がご家族と地域の医療スタッフに送信されました！",
    okBtn: "了解",
    closeBtn: "閉じる",
    triageTagHeadache: "🤕 激しい頭痛",
    triageTagHeadacheText: "激しいズキズキする頭痛があり、体が熱っぽいです。",
    triageTagFever: "🌡️ 高熱と悪寒",
    triageTagFeverText: "体が熱く高熱があり、悪寒と全身の関節痛があります。",
    triageTagAcidity: "🔥 胃酸過多・胸やけ",
    triageTagAcidityText: "胃酸の逆流がひどく、みぞおちから胸にかけて焼けるような痛みがあります。",
    triageTagCold: "🤧 風邪・咳・喉の痛み",
    triageTagColdText: "止まらない咳、鼻水、激しい喉の腫れがあります。",
    triageTagChestPain: "💔 胸部圧迫感と冷や汗（緊急）",
    triageTagChestPainText: "胸が締め付けられるような激痛があり、左腕に放散して冷や汗が出ます。",
    triageAnalyzing: "AI臨床エンジンが症状を診断中...",
    triageMic: "マイク",
    triageMicListening: "聞き取り中...",
    urgencyLevel: "トリアージ緊急度:",
    recommendedAction: "臨床推奨処置:",
    allopathicCare: "💊 標準医療応急処置（エビデンス準拠）",
    ayurvedicCare: "🌿 100% 天然ハーブ＆アーユルヴェーダ家庭療法",
    dietCare: "🥗 食事療法および水分補給プロトコル",
    disclaimerText: "⚠️ 免責事項：このAIは初期トリアージを目的としています。服薬前に必ず医師にご相談ください。",
    chatbotInitialMsg: "こんにちは！私は **Sri Sri ❤️ HealthCare** の24時間365日対応AI医師です。気になる症状や薬について何でもご質問ください：",
    visionHeader: "📷 医用画像診断＆検査結果スキャナー",
    visionSubheader: "診断モードを選択するか、X線画像・検査報告書をアップロードしてください：",
    encyclopediaHeader: "💊 Jan Aushadhi 公認ジェネリック医薬品＆伝統医学百科",
    encyclopediaSubheader: "最大85%削減できる安全な医薬品と自然療法を検索：",
    vitalsHeader: "💓 非接触カメラ脈拍・バイタルスキャナー (rPPG)",
    vitalsSubheader: "明るい場所でカメラに顔を向けてください。AIが自動的に脈拍を測定します：",
    vitalsStart: "脈拍スキャンを開始",
    vitalsStop: "停止"
  }
};

// Now let's assemble the entire MASTER_TRANSLATIONS with updated values
const updatedTranslations = {};

for (const lang of SUPPORTED_LANGUAGES) {
  const code = lang.code;
  const existing = MASTER_TRANSLATIONS[code] || {};
  const newKeys = commonNewKeys[code] || commonNewKeys['en'];
  const missingForCode = missingKeysDictionary[code] || {};
  
  // Merge:
  // 1. English fallback (to ensure no key is missing anywhere)
  // 2. Existing language translations
  // 3. Specific missing translations
  // 4. New keys (ribbonDoctorTitle, loginSignUp, etc.)
  updatedTranslations[code] = {
    ...MASTER_TRANSLATIONS['en'],
    ...existing,
    ...missingForCode,
    ...newKeys
  };
}

// Generate the new file content
const outputCode = `/**
 * Master Multilingual Localization & Translation System
 * Provides 100% complete UI translation for all supported world & Indian languages
 */

export const SUPPORTED_LANGUAGES = ${JSON.stringify(SUPPORTED_LANGUAGES, null, 2)};

export const MASTER_TRANSLATIONS = ${JSON.stringify(updatedTranslations, null, 2)};

/**
 * Robust getter that never fails, supporting all 16 world & Indian languages
 * Uses ES6 Proxy for seamless fallback to English if any specific key is missing!
 */
export const getTranslation = (langCode) => {
  const code = (langCode || 'gu').toLowerCase();
  const selected = MASTER_TRANSLATIONS[code] || MASTER_TRANSLATIONS['gu'] || MASTER_TRANSLATIONS['en'];
  const fallback = MASTER_TRANSLATIONS['en'] || {};

  return new Proxy(selected, {
    get(target, prop) {
      if (typeof prop === 'string' && prop in target && target[prop] !== undefined && target[prop] !== '') {
        return target[prop];
      }
      if (typeof prop === 'string' && prop in fallback && fallback[prop] !== undefined && fallback[prop] !== '') {
        return fallback[prop];
      }
      return target[prop] || fallback[prop] || '';
    }
  });
};

/**
 * Universal global language switch helper
 * Updates localStorage, dispatches window events, and syncs Google Translate
 */
export const applyGlobalLanguage = (langCode) => {
  if (!langCode) return;
  try {
    localStorage.setItem('preferred_language', langCode);
  } catch (e) {}

  // Sync Google Translate cookie for full web-app translation
  try {
    const host = window.location.hostname;
    document.cookie = 'googtrans=/auto/' + langCode + '; path=/; domain=' + host + ';';
    document.cookie = 'googtrans=/auto/' + langCode + '; path=/;';
    
    // If Google Translate select box is mounted in DOM, trigger its change
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
    }
  } catch (e) {}

  // Dispatch custom event for real-time reactivity
  try {
    window.dispatchEvent(new CustomEvent('app_language_changed', { detail: { lang: langCode } }));
  } catch (e) {}
};
`;

fs.writeFileSync(targetFile, outputCode, 'utf8');
console.log('✅ languageService.js successfully written with 100% translation coverage for all 16 languages!');
