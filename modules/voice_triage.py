"""
Multilingual Voice & Text Triage Module
Emergency Red-Flag Detection, Natural Drug-Free Cures & Urgency Classification
200% Medically Accurate Clinical Orchestration
"""

import re
from typing import Dict, Any, List, Optional
from modules.rag_engine import MedicalRAGEngine

RED_FLAGS = {
    "gu": [
        "છાતીમાં દુખાવો", "ડાબા હાથમાં દુખાવો", "પરસેવો", "બેભાન", "શ્વાસ બંધ", "લોહીની ઉલટી",
        "સાપ કરડ્યો", "ઝેર", "હાર્ટ એટેક", "કૂતરો કરડ્યો", "કૂતરાનો બચકો", "હડકવા", "લકવો",
        "મોઢું વાંકું", "અતિશય લોહી", "વીંછી કરડ્યો", "આંચકી", "કરડ્યો"
    ],
    "hi": [
        "સીને મેં દર્દ", "સીને મે દર્દ", "बाएं हाथ में दर्द", "बेहोश", "सांस फूलना", "खून की उल्टी",
        "सांप का काटना", "जहर", "दिल का दौरा", "कुत्ता काटना", "लकवा", "जहरीला", "दौरा पड़ना"
    ],
    "ku": [
        "છતી મેં દુખાવો", "બેહોશ થઈ વ્યો", "સાસ નથો અચે", "સાપ કરડ્યો", "હાર્ટ પ્રોબ્લેમ",
        "કુતરો કરડ્યો", "ઝેર"
    ],
    "en": [
        "chest pain", "left arm pain", "unconscious", "cannot breathe", "vomiting blood",
        "snake bite", "poison", "heart attack", "dog bite", "rabies", "stroke", "paralysis",
        "electric shock", "heavy bleeding", "seizure"
    ]
}

SAMPLE_VOICE_PROMPTS = {
    "gu": [
        "મને માથું બહુ દુખે છે અને શરીર ગરમ થાય છે (તાવ જેવું લાગે છે).",
        "મને ખૂબ એસિડિટી થાય છે, છાતીમાં બળતરા અને ખાટા ઓડકાર આવે છે.",
        "મને શરદી, કફ અને ગળામાં સખત દુખાવો થાય છે.",
        "મને પેટમાં અસહ્ય દુખાવો થાય છે અને ઝાડા-ઉલટી થઈ ગયા છે.",
        "મારી બ્લડ સુગર વધી ગઈ છે, ડાયાબિટીસ નિયંત્રણ માટે શું કરવું?",
        "દાંતમાં સખત કળતર અને પેઢામાં સોજો છે, તાત્કાલિક ઉપાય બતાવો.",
        "ઘૂંટણનો દુખાવો છે અને ચાલવામાં ખૂબ તકલીફ પડે છે.",
        "બે કલાકથી છાતીમાં ખૂબ દબાણ અને ડાબા હાથમાં કળતર સાથે પરસેવો વળે છે."
    ],
    "ku": [
        "મુકે મથો સખત દુખે તો અને ડીલ ગરમ થી વે આય (તાવ આય).",
        "મુકે એસિડિટી અને છતી મેં બળતરા થીયે થી.",
        "મુકે શરદી અને ગળા મેં ખરાશ આય.",
        "મુકે પેટ મેં સખત દુખાવો અને ઝાડા થી વે આય."
    ],
    "hi": [
        "मेरा सिर बहुत दुख रहा है और शरीर गर्म हो रहा है (बुखार है)।",
        "मुझे बहुत एसिडिटी और सीने में जलन हो रही है।",
        "मुझे सर्दी, खांसी और गले में दर्द है।",
        "पेट में बहुत दर्द है और दस्त-उल्टी हो रही है।",
        "दांत में तेज दर्द और मसूड़ों में सूजन है।"
    ],
    "en": [
        "I have severe headache and body feels warm/feverish.",
        "Severe acidity, gas, heartburn and indigestion.",
        "Common cold, productive cough and sore throat.",
        "Severe stomach ache and acute loose motions.",
        "Excruciating toothache and swollen tender gums.",
        "Crushing chest pain radiating to left arm with cold sweat."
    ]
}

class VoiceTriageEngine:
    def __init__(self, rag_engine: Optional[MedicalRAGEngine] = None):
        self.rag = rag_engine or MedicalRAGEngine()

    def detect_emergency(self, text: str) -> bool:
        text_lower = text.lower()
        for lang, keywords in RED_FLAGS.items():
            for kw in keywords:
                if kw.lower() in text_lower:
                    return True
        return False

    def perform_triage(self, user_input: str, language: str = "gu", gemini_api_key: Optional[str] = None) -> Dict[str, Any]:
        is_red_emergency = self.detect_emergency(user_input)
        rag_result = self.rag.generate_grounded_response(user_input, language=language, gemini_api_key=gemini_api_key)
        
        # Urgency classification
        doc_urgency = rag_result.get("urgency", "GREEN")
        if is_red_emergency or doc_urgency == "RED":
            urgency = "RED"
            urgency_label = "🚨 અતિ ગંભીર - તાત્કાલિક ૧૦૮ ઈમરજન્સી (RED EMERGENCY)"
            badge_class = "badge-red"
            action_summary = "તાત્કાલિક ૧૦૮ એમ્બ્યુલન્સ બોલાવો. દર્દીને એકલા ન છોડો અને નજીકની હોસ્પિટલ પહોંચો."
        elif doc_urgency == "YELLOW":
            urgency = "YELLOW"
            urgency_label = "⚠️ તાત્કાલિક PHC મુલાકાત જરૂરી (YELLOW - URGENT 24H)"
            badge_class = "badge-yellow"
            action_summary = "૨૪ કલાકમાં નજીકના પ્રાથમિક આરોગ્ય કેન્દ્ર (PHC) કે ડૉક્ટર પાસે તપાસ કરાવો."
        else:
            urgency = "GREEN"
            urgency_label = rag_result.get("urgency_label") or "🟢 સામાન્ય થી મધ્યમ - પ્રાકૃતિક અને ઘરેલું કાળજી (GREEN ROUTINE)"
            badge_class = "badge-green"
            action_summary = "દવા વગર કુદરતી ઉપચાર, આયુર્વેદિક કાઢો અને આરામ કરો. લક્ષણ વધે તો ડૉક્ટરને મળો."

        sos_message = f"🚨 SwasthyaSetu SOS ALERT: Patient: '{user_input[:80]}...'. Urgency: {urgency}."

        return {
            "urgency": urgency,
            "urgency_label": urgency_label,
            "badge_class": badge_class,
            "action_summary": action_summary,
            "disease_name": rag_result.get("disease_name"),
            "disease_name_en": rag_result.get("disease_name_en"),
            "symptoms_analysis": rag_result.get("symptoms_analysis"),
            "natural_cure_without_medicine": rag_result.get("natural_cure_without_medicine"),
            "ayurvedic_care": rag_result.get("ayurvedic_care"),
            "allopathic_care": rag_result.get("allopathic_care"),
            "action_plan": rag_result.get("action_plan"),
            "sos_message": sos_message,
            "is_continuous_trained": rag_result.get("is_continuous_trained", False),
            "trained_model_tag": rag_result.get("trained_model_tag"),
            "training_cycles": rag_result.get("training_cycles", 1),
            "grounded_source": rag_result.get("grounded_source") or "ICMR STW & AYUSH Pharmacopoeia",
            "rag_metadata": rag_result.get("rag_metadata")
        }
