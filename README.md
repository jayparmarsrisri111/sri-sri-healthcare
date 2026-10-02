# 🏥 Sri Sri ❤️ HealthCare (શ્રી શ્રી ❤️ હેલ્થકેર)
### *All-in-One Multi-Model AI Rural Healthcare Progressive Web App (PWA)*
### **Built with MERN Stack (MongoDB, Express, React, Node.js) + Python AI Microservice**

---

## 🌟 Overview
**Sri Sri ❤️ HealthCare** is an installable AI Progressive Web App (PWA) specifically engineered for rural and underserved communities in Gujarat and India. It bridges the gap between rural patients, ASHA workers, and the healthcare ecosystem through a production-grade **MERN Stack + Multi-Model AI Orchestrator (Gemini + Perplexity + Claude + GPT-4o)**:

1. **⚛️ Installable React PWA Web App (`client/` - Port 5173 / 3000):**
   - High-contrast **Light Mint Green & Pure White** healthcare design (`#00C48C`, `#EBFBF3`, `#FFFFFF`).
   - 1-Click **"📲 Install Web App"** capability onto Mobile and Desktop home screens with offline service worker.
   - Multilingual toggle: **ગુજરાતી (Gujarati)**, **हिन्दी (Hindi)**, **કચ્છી (Kutchi)**, and **English**.
   - 5 interactive clinical tabs.
2. **🟢 Express.js & Node.js API Gateway (`server/` - Port 5000):**
   - REST API endpoints for patient records, triage logs, and hospital directories.
   - Robust offline in-memory cache and MongoDB Mongoose integration.
3. **🍃 MongoDB Database:**
   - Stores patient profiles, triage consultation history, PHC inventories, and Jan Aushadhi generic medicine lists.
4. **🐍 Python FastAPI Multi-Model AI Engine (`ai_engine/` - Port 8000):**
   - **Google Gemini 1.5 Vision:** Medical Image diagnostics (Chest X-Rays, Skin Lesions, Lab Reports).
   - **Perplexity AI Sonar:** Real-time clinical research & ICMR/WHO guideline grounding.
   - **Anthropic Claude 3.5 & GPT-4o:** Multilingual triage reasoning & 100% Drug-Free Natural Cures.
   - **Contactless rPPG Vitals:** Camera-based Heart Rate (BPM), Respiration, and Stress Index calculation.

---

## 🚀 How to Run the Web App

### ⚡ Option 1: One-Click Windows Launcher
Simply double-click:
```
start_mern_ai.bat
```

### 🛠️ Option 2: Step-by-Step Manual Launch
1. **Start Python AI Engine (Port 8000):** `python ai_engine/main.py`
2. **Start Express Gateway (Port 5000):** `cd server && npm start`
3. **Start React PWA Web App (Port 5173):** `cd client && npm run dev`

*Open in Browser:* **`http://localhost:5173`**
*Click **"📲 Install Web App"** to install it directly to your laptop or smartphone!*
