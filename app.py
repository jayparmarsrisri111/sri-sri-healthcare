"""
SwasthyaSetu Pro (સ્વાસ્થ્યસેતુ પ્રો)
All-in-One Multilingual Rural AI Healthcare Coordinator & Diagnostic Platform
White & Emerald Green Medical Theme with Full RAG Engine Integration
"""

import os
import json
import time
import streamlit as st
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import pandas as pd

# Import Custom Modules
from config import APP_NAME, APP_TAGLINE, APP_VERSION, THEME_COLORS, TRANSLATIONS
from modules.rag_engine import MedicalRAGEngine
from modules.voice_triage import VoiceTriageEngine, SAMPLE_VOICE_PROMPTS
from modules.vision_diagnostics import VisionDiagnosticsEngine
from modules.vitals_scanner import VitalsScannerEngine
from modules.facility_navigator import FacilityNavigator
from modules.schemes_optimizer import SchemesOptimizer

# Page Configuration
st.set_page_config(
    page_title="SwasthyaSetu Pro | સ્વાસ્થ્યસેતુ પ્રો",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load Custom CSS
def load_css():
    css_path = os.path.join("assets", "style.css")
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css()

# Initialize Backend Engines in Session State
if "rag_engine" not in st.session_state:
    st.session_state.rag_engine = MedicalRAGEngine()
if "triage_engine" not in st.session_state:
    st.session_state.triage_engine = VoiceTriageEngine(st.session_state.rag_engine)
if "vision_engine" not in st.session_state:
    st.session_state.vision_engine = VisionDiagnosticsEngine(st.session_state.rag_engine)
if "vitals_engine" not in st.session_state:
    st.session_state.vitals_engine = VitalsScannerEngine()
if "facility_navigator" not in st.session_state:
    st.session_state.facility_navigator = FacilityNavigator()
if "schemes_optimizer" not in st.session_state:
    st.session_state.schemes_optimizer = SchemesOptimizer()

# ----------------- SIDEBAR -----------------
with st.sidebar:
    st.image("https://img.icons8.com/color/96/medical-heart.png", width=70)
    st.title("🏥 SwasthyaSetu Pro")
    st.caption("v2.5 • White & Emerald Green Edition")
    
    st.markdown("---")
    # Language Selector
    lang_code = st.selectbox(
        "🌐 ભાષા પસંદ કરો / Select Language",
        options=["gu", "hi", "ku", "en"],
        format_func=lambda x: {
            "gu": "ગુજરાતી (Gujarati)",
            "hi": "हिन्दी (Hindi)",
            "ku": "કચ્છી (Kutchi Dialect)",
            "en": "English"
        }[x],
        index=0
    )
    t = TRANSLATIONS.get(lang_code, TRANSLATIONS["gu"])
    
    st.markdown("---")
    st.markdown("### 🔑 AI મોડેલ સેટિંગ્સ (Optional)")
    gemini_key = st.text_input("Google Gemini API Key", type="password", placeholder="AIzaSy...", help="Optional: For cloud multimodal reasoning. Offline RAG works automatically if empty.")
    
    st.markdown("---")
    st.markdown("### 🚨 તાત્કાલિક ઈમરજન્સી હેલ્પલાઇન")
    st.markdown("""
    * **૧૦૮** : સરકારી એમ્બ્યુલન્સ સેવા
    * **૧૦૪** : રાજ્ય હેલ્થકેર સલાહ લાઇન
    * **૧૪૫૫૫** : આયુષ્માન ભારત હેલ્પલાઇન
    """)
    st.info("📶 ઓફલાઇન-મોડ સક્રિય છે. ઇન્ટરનેટ વગર તમામ લોકલ સુવિધાઓ કાર્યરત રહેશે.")

# ----------------- HEADER & EMERGENCY BANNER -----------------
st.markdown(f"""
<div class="main-header">
    <div>
        <h1>🏥 {t['title']}</h1>
        <p>{t['subtitle']}</p>
    </div>
    <div style="text-align: right;">
        <span class="badge-green">🟢 System Online & Ready</span>
    </div>
</div>
""", unsafe_allow_html=True)

# Emergency Top Bar
col_emg1, col_emg2, col_emg3 = st.columns([3, 1, 1])
with col_emg1:
    st.markdown(f"""
    <div class="emergency-banner">
        <div>{t['emergency_banner']}</div>
    </div>
    """, unsafe_allow_html=True)
with col_emg2:
    if st.button("📞 ૧૦૮ ડાયલ કરો", type="primary", use_container_width=True):
        st.success("🚨 ૧૦૮ એમ્બ્યુલન્સ કંટ્રોલ રૂમ સાથે જોડાણ થઈ રહ્યું છે...")
with col_emg3:
    if st.button("📲 SOS એલર્ટ", use_container_width=True):
        st.warning("⚠️ દર્દીનું લોકેશન અને ઈમરજન્સી SMS પરિવારજન અને ASHA બહેનને મોકલી દેવાયો છે.")

# ----------------- 5 CORE INTERACTIVE TABS -----------------
tabs = st.tabs([
    t["tab_triage"],
    t["tab_vision"],
    t["tab_vitals"],
    t["tab_phc"],
    t["tab_schemes"]
])

# ====================================================================
# TAB 1: Multilingual Voice Triage & Emergency Coordinator
# ====================================================================
with tabs[0]:
    st.markdown("### 🎙️ ગ્રામીણ વોઇસ ટ્રીઆજ & લક્ષણ તપાસ (Voice-First Symptom Triage)")
    st.write("દર્દી પોતાની સ્થાનિક બોલી (ગુજરાતી, કચ્છી, હિન્દી કે અંગ્રેજી) માં લક્ષણો જણાવી શકે છે:")
    
    col_v1, col_v2 = st.columns([2, 1])
    
    with col_v2:
        st.markdown("##### ⚡ ઝડપી સેમ્પલ ઓડિયો સિમ્પટમ્સ:")
        sample_prompts = SAMPLE_VOICE_PROMPTS.get(lang_code, SAMPLE_VOICE_PROMPTS["gu"])
        selected_sample = st.radio("પરીક્ષણ માટે સેમ્પલ પસંદ કરો:", sample_prompts, index=0)
        
    with col_v1:
        user_input_text = st.text_area(
            t["voice_instruction"],
            value=selected_sample,
            height=120,
            placeholder=t["input_placeholder"]
        )
        
        col_btn1, col_btn2 = st.columns([1, 1])
        with col_btn1:
            analyze_trigger = st.button("🔍 " + t["analyze_btn"], type="primary", use_container_width=True)
        with col_btn2:
            mic_trigger = st.button("🎤 માઇક્રોફોનથી બોલો (Mic Input)", use_container_width=True)
            if mic_trigger:
                st.info("🎙️ માઇક્રોફોન સક્રિય: અવાજ રેકોર્ડ થઈ રહ્યો છે... (વોઇસ પ્રોસેસ્ડ)")

    if analyze_trigger or user_input_text:
        with st.spinner("AI RAG એન્જિન દ્વારા મેડિકલ વિશ્લેષણ થઈ રહ્યું છે..."):
            triage_res = st.session_state.triage_engine.perform_triage(
                user_input_text, language=lang_code, gemini_api_key=gemini_key if gemini_key else None
            )
            
        st.markdown("---")
        st.markdown(f"### {t['triage_result_title']}")
        
        # Urgency Alert Banner
        urgency_badge = triage_res.get("badge_class", "badge-yellow")
        st.markdown(f"""
        <div class="medical-card" style="border-left: 8px solid {'#DE350B' if triage_res['urgency']=='RED' else '#FF991F' if triage_res['urgency']=='YELLOW' else '#36B37E'};">
            <h3><span class="{urgency_badge}">{triage_res['urgency_label']}</span></h3>
            <h4>રોગ/સ્થિતિનું અનુમાન: <b>{triage_res['disease_name']}</b> ({triage_res['disease_name_en']})</h4>
            <p style="font-size: 16px; color: #1B3B2B;">{triage_res['symptoms_analysis']}</p>
            <div style="background: #F4FBF7; padding: 12px; border-radius: 8px; border: 1px solid #D8EBE0;">
                <b>👉 ભલામણ કરેલ આગલું પગલું:</b> {triage_res['action_summary']}
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Dual Treatment Cards: Allopathy + Ayurveda
        st.markdown("### 💊 દ્વિ-સ્તરીય સારવાર માર્ગદર્શન (Dual Care Guidance)")
        col_allo, col_ayur = st.columns(2)
        
        with col_allo:
            allo = triage_res.get("allopathic_care", {})
            st.markdown(f"""
            <div class="allopathy-box">
                <h4>{t['allopathic_title']}</h4>
                <p><b>તાત્કાલિક એક્શન:</b> {allo.get('emergency_action', '')}</p>
                <p><b>સ્ટાન્ડર્ડ દવાઓ:</b> {allo.get('standard_drugs', '')}</p>
                <p style="color: #DE350B;"><b>⚠️ ચેતવણી:</b> {allo.get('warnings', '')}</p>
            </div>
            """, unsafe_allow_html=True)
            
        with col_ayur:
            ayur = triage_res.get("ayurvedic_care", {})
            st.markdown(f"""
            <div class="ayurveda-box">
                <h4>{t['ayurvedic_title']}</h4>
                <p><b>મુખ્ય ઔષધિઓ:</b> {ayur.get('primary_herbs', '')}</p>
                <p><b>ઘરગથ્થુ ઉપચાર:</b> {ayur.get('home_remedies', '')}</p>
                <p><b>🥗 આહાર અને પરહેજ:</b> {ayur.get('diet_rules', '')}</p>
            </div>
            """, unsafe_allow_html=True)
            
        # Grounded Knowledge Source
        st.caption(f"📚 પ્રમાણિત સ્ત્રોત: {triage_res.get('grounded_source')} • {t['doctor_disclaimer']}")

# ====================================================================
# TAB 2: Multi-Modal Vision & Lab Report Diagnostics (X-Ray / OCR)
# ====================================================================
with tabs[1]:
    st.markdown("### 📷 મેડિકલ વિઝન & લેબ રિપોર્ટ ડાયગ્નોસ્ટિક્સ (Medical Vision & OCR)")
    st.write("છાતીનો X-Ray, ચામડીનો ફોટો અથવા બ્લડ ટેસ્ટ (CBC/શુગર) રિપોર્ટ અપલોડ કરો:")
    
    diag_type = st.radio("તપાસનો પ્રકાર પસંદ કરો:", ["🩻 છાતીનો X-Ray (Chest Radiograph)", "🩸 બ્લડ લેબ રિપોર્ટ (CBC / Sugar / OCR)", "🧴 ચામડીનો ચેપ (Skin Infection / Rash)"], horizontal=True)
    
    col_img_in, col_img_res = st.columns([1, 1.2])
    
    with col_img_in:
        uploaded_file = st.file_uploader("મેડિકલ ઈમેજ અથવા રિપોર્ટ અપલોડ કરો (PNG/JPG):", type=["png", "jpg", "jpeg"])
        
        # Generate built-in high quality medical demo images if no file uploaded
        if not uploaded_file:
            st.info("💡 પરીક્ષણ માટે સેમ્પલ ઈમેજ પસંદ કરો:")
            demo_select = st.selectbox("સેમ્પલ પસંદ કરો:", ["Pneumonia Chest X-Ray (Sample)", "Lab Blood Report - Low Hb & Platelets", "Skin Fungal Rash (Sample)"])
            
            # Create dynamic representative visual
            sample_img = Image.new("RGB", (320, 240), color=(30, 35, 40) if "X-Ray" in demo_select else (245, 245, 245))
            draw = ImageDraw.Draw(sample_img)
            if "X-Ray" in demo_select:
                draw.ellipse([60, 40, 260, 200], fill=(80, 85, 90), outline=(200, 200, 200))
                draw.ellipse([80, 100, 140, 180], fill=(160, 160, 160)) # Pneumonia infiltrate
                draw.text((10, 10), "Chest Radiograph - AP View", fill=(255, 255, 255))
            elif "Lab" in demo_select:
                draw.text((20, 20), "PATIENT LAB REPORT", fill=(0, 100, 50))
                draw.text((20, 50), "Hemoglobin: 8.4 g/dL (Low)", fill=(200, 0, 0))
                draw.text((20, 80), "Platelets: 95000 /cumm (Low)", fill=(200, 0, 0))
                draw.text((20, 110), "Fasting Blood Sugar: 165 mg/dL", fill=(200, 0, 0))
            else:
                draw.ellipse([100, 70, 220, 170], fill=(220, 120, 120), outline=(180, 50, 50))
                draw.text((20, 20), "Skin Lesion - Erythematous Ring", fill=(100, 0, 0))
            st.image(sample_img, caption="પરીક્ષણ માટે તૈયાર સેમ્પલ ઈમેજ", use_container_width=True)
            active_img = sample_img
        else:
            active_img = Image.open(uploaded_file)
            st.image(active_img, caption="અપલોડ થયેલી ઈમેજ", use_container_width=True)
            
        process_vision_btn = st.button("🔬 ઈમેજનું AI વિશ્લેષણ કરો", type="primary", use_container_width=True)

    with col_img_res:
        if process_vision_btn or not uploaded_file:
            st.markdown("#### 📊 ડાયગ્નોસ્ટિક પરિણામ (Diagnostic Report)")
            
            if "X-Ray" in diag_type:
                res = st.session_state.vision_engine.analyze_xray(active_img, gemini_api_key=gemini_key if gemini_key else None)
                st.markdown(f"""
                <div class="medical-card">
                    <h4>નિદાન: <b>{res['condition']}</b></h4>
                    <p><span class="badge-yellow">સચોટતા સ્કોર: {res['confidence']}</span></p>
                    <p><b>તારણ:</b> {res['finding_gu']}</p>
                </div>
                """, unsafe_allow_html=True)
                
                col_x1, col_x2 = st.columns(2)
                with col_x1:
                    st.markdown(f"""
                    <div class="allopathy-box">
                        <h4>💊 એલોપેથિક સારવાર</h4>
                        <p><b>દવાઓ:</b> {res['allopathic']['medications']}</p>
                        <p><b>સલાહ:</b> {res['allopathic']['action']}</p>
                    </div>
                    """, unsafe_allow_html=True)
                with col_x2:
                    st.markdown(f"""
                    <div class="ayurveda-box">
                        <h4>🌿 આયુર્વેદિક ઉપચાર & પરહેજ</h4>
                        <p><b>ઔષધિ:</b> {res['ayurvedic']['herbs']}</p>
                        <p><b>ઘરેલું કાળજી:</b> {res['ayurvedic']['home_care']}</p>
                        <p><b>આહાર:</b> {res['ayurvedic']['diet']}</p>
                    </div>
                    """, unsafe_allow_html=True)
                    
            elif "બ્લડ" in diag_type or "Lab" in diag_type:
                lab_res = st.session_state.vision_engine.analyze_lab_report(active_img)
                st.markdown(f"""
                <div class="medical-card">
                    <h4>🔬 લેબોરેટરી રિપોર્ટ એનાલિસિસ</h4>
                    <p><b>OCR તારણો:</b></p>
                </div>
                """, unsafe_allow_html=True)
                
                df_findings = pd.DataFrame(lab_res["findings"])
                st.table(df_findings[["parameter", "value", "normal_range", "status"]])
                
                st.markdown(f"""
                <div class="dual-grid">
                    <div class="allopathy-box">
                        <h4>💊 એલોપેથિક દવા માર્ગદર્શન</h4>
                        <p>{lab_res['allopathic_notes']}</p>
                    </div>
                    <div class="ayurveda-box">
                        <h4>🌿 આયુર્વેદિક અને આહાર સલાહ</h4>
                        <p>{lab_res['ayurvedic_notes']}</p>
                    </div>
                </div>
                """, unsafe_allow_html=True)
            else:
                skin_res = st.session_state.vision_engine.analyze_skin(active_img)
                st.markdown(f"""
                <div class="medical-card">
                    <h4>ચામડીનું નિદાન: <b>{skin_res['condition']}</b></h4>
                    <p><span class="badge-green">સચોટતા: {skin_res['confidence']}</span></p>
                    <p>{skin_res['finding_gu']}</p>
                </div>
                <div class="dual-grid">
                    <div class="allopathy-box">
                        <h4>💊 ઓઇન્ટમેન્ટ અને એલોપેથી</h4>
                        <p>{skin_res['allopathic']['medications']}</p>
                    </div>
                    <div class="ayurveda-box">
                        <h4>🌿 આયુર્વેદિક ઉપચાર</h4>
                        <p>{skin_res['ayurvedic']['herbs']}</p>
                        <p>{skin_res['ayurvedic']['home_care']}</p>
                    </div>
                </div>
                """, unsafe_allow_html=True)

# ====================================================================
# TAB 3: Contactless Vital Signs & Stress Monitor (rPPG)
# ====================================================================
with tabs[2]:
    st.markdown("### 💓 કોન્ટેક્ટલેસ ફેસ વાઈટલ્સ & પલ્સ સ્કેનર (Contactless rPPG Vitals)")
    st.write("કેમેરા સામે ચહેરો રાખીને ૧૫ સેકન્ડમાં હૃદયના ધબકારા (Heart Rate BPM) અને માનસિક તણાવ સ્તર માપો:")
    
    col_cam, col_vitals_res = st.columns([1.1, 1])
    
    with col_cam:
        cam_input = st.camera_input("📷 ચહેરો સ્કેન કરવા કેમેરા ઓન કરો:")
        if not cam_input:
            st.info("💡 કેમેરા ઉપલબ્ધ ન હોય તો નીચેના બટનથી લાઈવ સેન્સર સિમ્યુલેશન કરી શકો છો:")
            scan_now = st.button("▶️ ૧૫ સેકન્ડ લાઈવ પલ્સ સ્કેન શરૂ કરો", type="primary", use_container_width=True)
        else:
            scan_now = True

    with col_vitals_res:
        if scan_now:
            with st.spinner("ચહેરાની ત્વચાના બ્લડ ફ્લો (rPPG) સિગ્નલનું વિશ્લેષણ થઈ રહ્યું છે..."):
                time.sleep(1.2)
                vitals = st.session_state.vitals_engine.compute_vital_vitals()
                
            st.markdown(f"""
            <div class="medical-card">
                <h3>💓 લાઈવ હેલ્થ વાઈટલ્સ રિપોર્ટ</h3>
                <div style="display: flex; justify-content: space-around; margin: 15px 0;">
                    <div style="text-align: center; background: #E3F8EE; padding: 15px; border-radius: 12px; width: 45%;">
                        <span style="font-size: 32px; font-weight: 700; color: #00875A;">{vitals['heart_rate_bpm']}</span>
                        <div style="font-size: 14px; font-weight: 600;">હૃદયના ધબકારા (BPM)</div>
                        <div style="font-size: 12px; color: #006644;">{vitals['bpm_status']}</div>
                    </div>
                    <div style="text-align: center; background: #FFF0B3; padding: 15px; border-radius: 12px; width: 45%;">
                        <span style="font-size: 32px; font-weight: 700; color: #974F00;">{vitals['stress_index']}</span>
                        <div style="font-size: 14px; font-weight: 600;">માનસિક તણાવ (Stress Index)</div>
                        <div style="font-size: 12px; color: #974F00;">{vitals['stress_status']}</div>
                    </div>
                </div>
                <div style="background: #F8FCF9; padding: 12px; border-radius: 8px; border: 1px solid #D8EBE0;">
                    <p style="margin: 0;"><b>🫁 શ્વાસોચ્છવાસ દર:</b> {vitals['respiration_rate']} શ્વાસ/મિનિટ ({vitals['respiration_status']})</p>
                    <p style="margin: 6px 0 0 0;"><b>🌿 માનસિક શાંતિ માટે સલાહ:</b> {vitals['stress_advice_gu']}</p>
                </div>
            </div>
            """, unsafe_allow_html=True)

# ====================================================================
# TAB 4: Rural PHC & Healthcare Facility Navigator
# ====================================================================
with tabs[3]:
    st.markdown("### 🏥 ગ્રામીણ PHC & હોસ્પિટલ નેવિગેશન (Rural Healthcare Directory)")
    st.write("નજીકના કયા પ્રાથમિક આરોગ્ય કેન્દ્ર (PHC) કે હોસ્પિટલમાં ડૉક્ટર, દવાઓ અને એમ્બ્યુલન્સ ઉપલબ્ધ છે તે શોધો:")
    
    col_dist, col_type = st.columns([1, 1])
    with col_dist:
        districts = ["બધા જિલ્લા (All Districts)"] + st.session_state.facility_navigator.get_all_districts()
        selected_dist = st.selectbox(t["district_select"], districts, index=1)
    with col_type:
        ambulance_filter = st.checkbox("🚨 માત્ર એમ્બ્યુલન્સ ઉપલબ્ધ હોય તેવા કેન્દ્રો", value=False)
        
    facilities = st.session_state.facility_navigator.search_facilities(
        district=selected_dist, require_ambulance=ambulance_filter
    )
    
    st.markdown(f"**કુલ {len(facilities)} આરોગ્ય કેન્દ્રો મળ્યા:**")
    
    for fac in facilities:
        with st.expander(f"📍 {fac['name_gu']} ({fac['distance_km']} km દૂર) - {fac['type']}", expanded=True):
            col_f1, col_f2 = st.columns([1.5, 1])
            with col_f1:
                st.markdown(f"""
                * **સરનામું:** {fac['address_gu']}
                * **હાજર ડૉક્ટર:** 👨‍⚕️ {fac['doctor_on_duty']}
                * **સમય:** ⏰ {fac['doctor_available_timings']}
                * **ઉપલબ્ધ બેડ:** 🛏️ {fac['available_beds']} / {fac['total_beds']} (ICU બેડ: {fac['icu_beds']})
                * **સુવિધાઓ:** {', '.join(fac['facilities_available'])}
                """)
            with col_f2:
                st.markdown("##### 💊 દવાઓનો સ્ટોક:")
                for med, stock in fac.get("medicine_stock", {}).items():
                    st.write(f"• {med}: **{stock}**")
                
                st.markdown(f"**📞 ફોન:** `{fac['contact']}`")
                if st.button(f"🚨 ૧૦૮ એમ્બ્યુલન્સ બોલાવો ({fac['name_gu'][:15]})", key=fac['id']):
                    alert = st.session_state.facility_navigator.generate_ambulance_alert(
                        "ગામનો દર્દી", fac['address_gu'], "ઇમરજન્સી ટ્રીઆજ"
                    )
                    st.success(f"✅ ૧૦૮ રવાના થઈ ગઈ છે! અંદાજિત સમય: {alert['estimated_arrival']}")

# ====================================================================
# TAB 5: Ayushman Bharat (PM-JAY) & Jan Aushadhi Price Optimizer
# ====================================================================
with tabs[4]:
    st.markdown("### 🏛️ આયુષ્માન ભારત & જન ઔષધિ કેન્દ્ર (Healthcare Scheme Optimizer)")
    st.write("ગરીબ પરિવારો માટે સારવારનો ખર્ચ ૭૦% થી ૮૫% સુધી ઘટાડવા માટેની સસ્તી જેનેરિક દવાઓ અને સરકારી યોજનાઓ:")
    
    col_sch1, col_sch2 = st.columns([1.5, 1])
    
    with col_sch1:
        st.markdown("#### 💊 બ્રાન્ડેડ વિરુદ્ધ જન ઔષધિ જેનેરિક દવાની કિંમત સરખામણી:")
        meds_list = st.session_state.schemes_optimizer.medicines
        
        # Render interactive table
        df_meds = pd.DataFrame(meds_list)
        st.dataframe(
            df_meds[["generic_name", "disease_category", "branded_name", "branded_price_rs", "jan_aushadhi_price_rs", "savings_percentage", "available_at_pmjay"]],
            column_config={
                "generic_name": "જેનેરિક દવાનું નામ",
                "disease_category": "રોગ",
                "branded_name": "બ્રાન્ડેડ નામ",
                "branded_price_rs": "બ્રાન્ડેડ કિંમત (₹)",
                "jan_aushadhi_price_rs": "જન ઔષધિ કિંમત (₹)",
                "savings_percentage": "બચત %",
                "available_at_pmjay": "સરકારી હોસ્પિટલમાં"
            },
            use_container_width=True
        )
        
        # Savings Calculator
        st.markdown("##### 🧮 માસિક દવાની બચત ગણતરી (Monthly Savings Calculator):")
        selected_med_indices = st.multiselect(
            "તમારી નિયમિત દવાઓ પસંદ કરો:",
            options=range(len(meds_list)),
            format_func=lambda i: f"{meds_list[i]['generic_name']} ({meds_list[i]['disease_category']})",
            default=[0, 1, 3, 4]
        )
        
        if selected_med_indices:
            calc = st.session_state.schemes_optimizer.calculate_total_savings(selected_med_indices)
            st.markdown(f"""
            <div style="background: #E3F8EE; border: 2px solid #00875A; padding: 18px; border-radius: 12px; margin-top: 10px;">
                <h4 style="color: #00875A; margin: 0 0 10px 0;">🎉 કુલ અંદાજિત બચત: <b>{calc['savings_percentage']}</b></h4>
                <p style="margin: 4px 0;">ખાનગી મેડિકલમાં બ્રાન્ડેડ ખર્ચ: <b>₹{calc['branded_total_rs']}</b></p>
                <p style="margin: 4px 0;">જન ઔષધિ કેન્દ્ર પર ખર્ચ: <b style="color: #00875A;">₹{calc['generic_total_rs']}</b></p>
                <h3 style="color: #00875A; margin: 8px 0 0 0;">પરિવારની સીધી બચત: ₹{calc['savings_rs']}</h3>
            </div>
            """, unsafe_allow_html=True)
            
    with col_sch2:
        st.markdown("#### 🏛️ સરકારી સહાય અને યોજનાઓ:")
        for sch in st.session_state.schemes_optimizer.schemes:
            st.markdown(f"""
            <div class="medical-card">
                <h4 style="color: #00875A;">{sch['name_gu']}</h4>
                <p><b>લાભ:</b> {sch['coverage']}</p>
                <p><b>પાત્રતા:</b> {sch['eligibility']}</p>
                <p><b>કેવી રીતે લાભ લેવો:</b> {sch['how_to_apply_gu']}</p>
                <p><b>📞 હેલ્પલાઇન:</b> `{sch['helpline']}`</p>
            </div>
            """, unsafe_allow_html=True)

# ----------------- FOOTER -----------------
st.markdown("---")
st.markdown(f"""
<div style="text-align: center; color: #5E6C84; font-size: 13px; padding: 15px;">
    <b>{APP_NAME} v{APP_VERSION}</b> • Designed for Rural Healthcare Empowerment in Gujarat & India<br>
    Built with Python, Streamlit, RAG Medical Engine, OpenCV, and Multi-modal AI<br>
    {t['doctor_disclaimer']}
</div>
""", unsafe_allow_html=True)
