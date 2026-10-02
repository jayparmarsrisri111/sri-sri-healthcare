"""
Configuration and Localization for Sri Sri ❤️ HealthCare
White & Mint Green Theme & Multilingual Support (Gujarati, Kutchi, Hindi, English)
"""

# App Constants
APP_NAME = "Sri Sri ❤️ HealthCare"
APP_TAGLINE = "શ્રી શ્રી ❤️ હેલ્થકેર – ગ્રામીણ AI હેલ્થકેર કોઓર્ડિનેટર અને સ્માર્ટ ડાયગ્નોસ્ટિક્સ"
APP_VERSION = "3.0.0"

# Color Palette (Mint Green & Pure White Theme)
THEME_COLORS = {
    "primary": "#00C48C",        # Vibrant Mint Green (Primary)
    "primary_dark": "#009F70",   # Forest Mint
    "primary_light": "#E0F8EE",  # Soft Mint Green background
    "secondary": "#2684FF",      # Clinical Sky Blue
    "background": "#EBFBF3",     # Soothing Mint Light
    "card_bg": "#FFFFFF",        # Pure White
    "text_dark": "#0A1128",      # Deep Midnight Navy
    "text_muted": "#4A5568",     # Muted Slate
    "border": "#D1F2E3",         # Soft Mint Border
    "alert_red": "#E53E3E",      # Critical Red
    "alert_yellow": "#DD6B20",   # Urgent Amber
    "alert_green": "#00C48C",    # Routine Green
    "ayurveda_green": "#22543D", # Herbal Forest Green
    "allopathy_blue": "#2B6CB0", # Medical Cyan Blue
}

# Multilingual UI Dictionary
TRANSLATIONS = {
    "gu": {
        "title": "Sri Sri ❤️ HealthCare (શ્રી શ્રી ❤️ હેલ્થકેર)",
        "subtitle": "ગ્રામીણ AI હેલ્થકેર કોઓર્ડિનેટર & સ્માર્ટ ડાયગ્નોસ્ટિક પ્લેટફોર્મ",
        "tab_triage": "🎙️ ૧. વોઇસ ટ્રીઆજ & ઈમરજન્સી",
        "tab_vision": "📷 ૨. X-Ray & લેબ રિપોર્ટ ડાયગ્નોસ્ટિક્સ",
        "tab_vitals": "💓 ૩. કેમેરા વાઈટલ્સ & પલ્સ સ્કેનર",
        "tab_phc": "🏥 ૪. PHC & હોસ્પિટલ નેવિગેશન",
        "tab_schemes": "🏛️ ૫. આયુષ્માન ભારત & જન ઔષધિ",
        "emergency_banner": "🚨 જો આ જીવલેણ ઈમરજન્સી હોય, તો તાત્કાલિક ૧૦૮ પર કૉલ કરો!",
        "btn_call_108": "📞 ૧૦૮ એમ્બ્યુલન્સ ડાયલ કરો",
        "btn_sos_sms": "📲 પરિવારજન / ASHA ને SOS એલર્ટ મોકલો",
        "voice_instruction": "નીચેનું માઇક્રોફોન દબાવો અથવા તમારા લક્ષણો બોલીને/લખીને જણાવો:",
        "input_placeholder": "દા.ત. મને માથું દુખે છે અને શરીર ગરમ થાય છે...",
        "analyze_btn": "🔍 AI વિશ્લેષણ કરો",
        "clear_btn": "🔄 સાફ કરો",
        "triage_result_title": "📊 પ્રાથમિક ટ્રીઆજ પરિણામ",
        "urgency_level": "ગંભીરતાનું સ્તર:",
        "recommended_action": "આગળનું પગલું:",
        "allopathic_title": "💊 એલોપેથિક માર્ગદર્શન (Modern Medicine)",
        "ayurvedic_title": "🌿 આયુર્વેદિક ઉપચાર અને પરહેજ (AYUSH Remedies)",
        "diet_title": "🥗 આહાર અને જીવનશૈલી (Diet & Precautions)",
        "doctor_disclaimer": "⚠️ અસ્વીકરણ: આ AI સિસ્ટમ માત્ર પ્રાથમિક સહાય અને માર્ગદર્શન માટે છે. દવા લેતા પહેલાં રજિસ્ટર્ડ મેડિકલ પ્રેક્ટિશનરની સલાહ લો.",
        "language_select": "ભાષા પસંદ કરો / Select Language:",
        "district_select": "તમારો જિલ્લો પસંદ કરો:",
    },
    "hi": {
        "title": "Sri Sri ❤️ HealthCare (श्री श्री ❤️ हेल्थकेयर)",
        "subtitle": "ग्रामीण AI स्वास्थ्य समन्वयक और स्मार्ट डायग्नोस्टिक्स",
        "tab_triage": "🎙️ १. वॉयस ट्राइएज और इमरजेंसी",
        "tab_vision": "📷 २. एक्स-रे और लैब रिपोर्ट डायग्नोस्टिक्स",
        "tab_vitals": "💓 ३. कैमरा वाइटल्स और पल्स स्कैनर",
        "tab_phc": "🏥 ४. PHC और अस्पताल नेविगेशन",
        "tab_schemes": "🏛️ ५. आयुष्मान भारत और जन औषधि",
        "emergency_banner": "🚨 यदि यह आपातकालीन स्थिति है, तो तुरंत १०८ पर कॉल करें!",
        "btn_call_108": "📞 १०८ एम्बुलेंस डायल करें",
        "btn_sos_sms": "📲 परिवार/आशा कार्यकर्ता को SOS भेजें",
        "voice_instruction": "नीचे अपना लक्षण बोलकर या लिखकर बताएं:",
        "input_placeholder": "उदा. मुझे सिरदर्द और बुखार महसूस हो रहा है...",
        "analyze_btn": "🔍 AI विश्लेषण करें",
        "clear_btn": "🔄 रीसेट करें",
        "triage_result_title": "📊 प्राथमिक ट्राइएज परिणाम",
        "urgency_level": "गंभीरता का स्तर:",
        "recommended_action": "अनुशंसित कार्रवाई:",
        "allopathic_title": "💊 एलोपैथिक मार्गदर्शन (Modern Medicine)",
        "ayurvedic_title": "🌿 आयुर्वेदिक उपचार और परहेज (AYUSH Remedies)",
        "diet_title": "🥗 आहार और जीवनशैली (Diet & Lifestyle)",
        "doctor_disclaimer": "⚠️ अस्वीकरण: यह AI प्रणाली केवल प्राथमिक सहायता के लिए है। किसी भी दवा से पहले योग्य डॉक्टर से परामर्श करें।",
        "language_select": "भाषा चुनें:",
        "district_select": "अपना जिला चुनें:",
    },
    "ku": {
        "title": "Sri Sri ❤️ HealthCare (કચ્છી બોલી)",
        "subtitle": "ગામઠી AI હેલ્થ આસિસ્ટન્ટ અને દવાખાના માર્ગદર્શન",
        "tab_triage": "🎙️ ૧. અવાજ જાંચ & ઈમરજન્સી",
        "tab_vision": "📷 ૨. X-Ray & લોહી જાંચ રિપોર્ટ",
        "tab_vitals": "💓 ૩. કેમેરા થી નાડી જાંચ",
        "tab_phc": "🏥 ૪. નજીક જો દવાખાનો",
        "tab_schemes": "🏛️ ૫. આયુષ્માન કાર્ડ & સસ્તી દવાઓ",
        "emergency_banner": "🚨 જો તાત્કાલિક મુશ્કેલી અચે, તો તુરંત ૧૦૮ તે ફોન કરિયો!",
        "btn_call_108": "📞 ૧૦૮ એમ્બ્યુલન્સ બોલાયો",
        "btn_sos_sms": "📲 ઘરવાળાં કે ASHA કે મેસેજ મોકલો",
        "voice_instruction": "કચ્છી મેં બોલી ને તંવજી તકલીફ ડીયો:",
        "input_placeholder": "દા.ત. મુકે મથો દુખે તો અને ડીલ ગરમ થી વે આય...",
        "analyze_btn": "🔍 AI જાંચ કરિયો",
        "clear_btn": "🔄 સાફ કરિયો",
        "triage_result_title": "📊 બીમારી જી ગંભીરતા",
        "urgency_level": "ગંભીરતા જો સ્તર:",
        "recommended_action": "આગ્યા જો કદમ:",
        "allopathic_title": "💊 ડૉક્ટર જી દવા જો માર્ગદર્શન",
        "ayurvedic_title": "🌿 ઘરગથ્થુ અને આયુર્વેદિક ઈલાજ",
        "diet_title": "🥗 ખાવા-પીવા જી પરહેજ",
        "doctor_disclaimer": "⚠️ સૂચના: હી AI માત્ર મદદ વાસ્તે આય. દવા ઘેંધા પેરી ડૉક્ટર કે મિલો.",
        "language_select": "ભાષા ચૂનો:",
        "district_select": "જિલ્લો ચૂનો:",
    },
    "en": {
        "title": "Sri Sri ❤️ HealthCare",
        "subtitle": "Multi-Model AI Rural Healthcare Coordinator & Diagnostic Web App",
        "tab_triage": "🎙️ 1. Voice Triage & Emergency",
        "tab_vision": "📷 2. X-Ray & Lab Report Diagnostics",
        "tab_vitals": "💓 3. Camera Vitals & Pulse Scanner",
        "tab_phc": "🏥 4. PHC & Hospital Navigation",
        "tab_schemes": "🏛️ 5. PM-JAY & Jan Aushadhi Schemes",
        "emergency_banner": "🚨 If this is a life-threatening emergency, dial 108 immediately!",
        "btn_call_108": "📞 Call 108 Ambulance",
        "btn_sos_sms": "📲 Dispatch SOS Alert to Family / ASHA",
        "voice_instruction": "Speak or type your symptoms below:",
        "input_placeholder": "e.g., I have headache and feverish body temperature...",
        "analyze_btn": "🔍 Analyze with AI",
        "clear_btn": "🔄 Clear",
        "triage_result_title": "📊 Primary Triage Assessment",
        "urgency_level": "Urgency Level:",
        "recommended_action": "Recommended Action:",
        "allopathic_title": "💊 Allopathic Care & Clinical Guidance",
        "ayurvedic_title": "🌿 Ayurvedic Remedies & Supportive Therapy (AYUSH)",
        "diet_title": "🥗 Dietary Guidelines & Lifestyle Precautions",
        "doctor_disclaimer": "⚠️ Disclaimer: This AI is for initial screening and guidance only. Always consult a registered physician before taking prescription medications.",
        "language_select": "Select Language:",
        "district_select": "Select Your District:",
    }
}
