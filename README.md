# 🏥 Sri Sri ❤️ HealthCare
### *All-in-One Multi-Model AI Clinical Health, Vision Diagnostics & Rural Lifeline*
### **Production MERN Stack (MongoDB, Express.js, React, Node.js) + Python AI Microservice Engine**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/AI%20Engine-Python%203.11%2B-3776AB?logo=python&logoColor=white)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable%20Offline%20Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 🌟 Executive Overview

**Sri Sri ❤️ HealthCare** is a next-generation healthcare platform and Progressive Web App (PWA) engineered to bridge the critical gap between medical expertise and underserved rural populations. It combines state-of-the-art Generative AI orchestration, real-time computer vision, and offline-first edge architecture into an intuitive, high-contrast, multilingual healthcare hub.

Whether assisting accredited social health activists (ASHA workers) in remote villages or serving families in urban centers, Sri Sri HealthCare delivers rapid preliminary triage, medical imaging interpretation, generic medicine pricing transparency, and contactless vital sign monitoring directly through standard web browsers and smartphones.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React 18 PWA)                     │
│   • Vite Bundler • Tailwind CSS • Lucide Icons • Web Workers / Cache   │
│   • Multilingual UI: English, Gujarati, Hindi, Kutchi                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / WebSocket REST
┌───────────────────────────────────▼────────────────────────────────────┐
│                    API GATEWAY (Node.js & Express.js)                  │
│   • JWT Auth • Patient & Triage Records • Facilities Directory         │
│   • PM-JAY Schemes Optimizer • Jan Aushadhi Generic Medicine Registry  │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
┌──────────────────▼───────────────┐ ┌───────────────▼───────────────────┐
│         DATABASE LAYER           │ │        PYTHON AI MICROSERVICE     │
│       MongoDB & Mongoose         │ │  • Gemini 1.5 Flash/Pro Vision   │
│  • Patient Histories & Vitals    │ │  • Claude 3.5 Sonnet / GPT-4o    │
│  • Doctor & Pharmacy DB          │ │  • Perplexity Real-Time Research  │
│  • Offline Local Storage Cache   │ │  • Contactless rPPG Vitals & CV   │
└──────────────────────────────────┘ └───────────────────────────────────┘
```

---

## ✨ Core Features & Capabilities

### 1. 🤖 Multi-Model AI Clinical Triage
- **Orchestrated Intelligence:** Seamlessly routes inquiries across **Google Gemini 1.5 Pro/Flash**, **Anthropic Claude 3.5 Sonnet**, and **OpenAI GPT-4o** to balance diagnostic accuracy, reasoning depth, and latency.
- **Evidence-Grounded Insights:** Grounded with medical literature via **Perplexity Sonar** and ICMR/WHO clinical guidelines.
- **Voice-Enabled Triage:** Speech-to-Text and Text-to-Speech support for low-literacy communities.

### 2. 🩻 Vision Diagnostics & Medical Image Analysis
- Automated preliminary review of chest X-rays, skin lesions, ocular anomalies, and laboratory report scans.
- Visual heatmaps and contextual breakdowns explaining preliminary findings with immediate specialist referral suggestions.

### 3. 💓 Contactless rPPG Camera Vitals Scanner
- Utilizes camera-based remote photoplethysmography (rPPG) to measure micro-vascular blood volume changes on the face.
- Computes estimated **Heart Rate (BPM)**, **Respiration Rate**, and **Stress Index** in real-time without external medical hardware.

### 4. 👁️ AI Eye Power & Vision Testing
- Interactive acuity and visual clarity test simulating Snellen charts and astigmatism screenings directly on desktop and mobile screens.

### 5. 💊 Generic Medicine Encyclopedia & Jan Aushadhi Locator
- Search over thousands of branded medicines to instantly uncover **Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)** generic alternatives.
- Highlights up to **50% to 90% cost savings** with accurate composition breakdowns, dosage guides, and nearby Jan Aushadhi Kendra locations.

### 6. 🏛️ Government Health Schemes Optimizer
- Automatic eligibility checker for **Ayushman Bharat (PM-JAY)**, **MAA Card**, and state healthcare welfare programs.
- Empowers rural patients to navigate hospital admission procedures and cashless claim limits.

### 7. 🗺️ Emergency Rural Lifeline & Facility Navigator
- GPS-driven directory of Primary Health Centers (PHCs), Community Health Centers (CHCs), Sub-District Hospitals, and blood banks.
- Offline-accessible emergency contacts and route guidance.

### 8. 🌐 True 4-Language Multilingual Support
- Native, culturally tailored translations for:
  - **English**
  - **ગુજરાતી (Gujarati)**
  - **हिन्दी (Hindi)**
  - **કચ્છી (Kutchi)**
- Instant language switching without page reloads.

### 9. 📲 Installable Progressive Web App (PWA)
- Full PWA compliance with custom Service Worker caching.
- 1-Click home screen installation on Android, iOS, Windows, and macOS.
- Works reliably on slow 2G/3G rural networks with offline data caching.

---

## 📁 Repository Structure

```
SRI SRI ❤️ ALL AI PROJECT/
├── client/                     # Frontend Application
│   ├── public/                 # Static assets, PWA manifest, service worker
│   │   ├── manifest.json       # PWA manifest metadata
│   │   ├── sw.js               # Service worker for offline caching
│   │   ├── sitemap.xml         # SEO search index
│   │   └── robots.txt          # Crawler instructions
│   ├── src/
│   │   ├── components/         # 30+ modular UI and clinical modal components
│   │   │   ├── AIChatbotTab.jsx
│   │   │   ├── VisionDiagnosticsTab.jsx
│   │   │   ├── VitalsScannerTab.jsx
│   │   │   ├── EyePowerScannerTab.jsx
│   │   │   ├── MedicineEncyclopediaTab.jsx
│   │   │   ├── LiveMedicineLocatorTab.jsx
│   │   │   ├── SchemesOptimizerTab.jsx
│   │   │   ├── RuralCareLifelineTab.jsx
│   │   │   ├── GlobalDoctorDirectoryTab.jsx
│   │   │   └── LanguageSelectorModal.jsx
│   │   ├── data/               # Catalogs, pharmacies, and verified doctors
│   │   ├── services/           # API connectors, auth, and i18n services
│   │   ├── App.jsx             # Main routing and application layout
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind CSS directives & theme rules
│   └── package.json            # Client dependencies and Vite configuration
├── server/                     # Backend API Gateway
│   ├── routes/                 # Express API endpoints
│   │   ├── aiProxyRoutes.js    # AI model proxy and load balancing
│   │   ├── authRoutes.js       # User and practitioner authentication
│   │   ├── triageRoutes.js     # Consultation history and diagnostic logs
│   │   ├── pharmacyRoutes.js   # Jan Aushadhi directory and inventory
│   │   ├── facilityRoutes.js   # Hospitals and PHC locator
│   │   └── schemeRoutes.js     # Health schemes eligibility data
│   ├── server.js               # Express application entrypoint
│   └── package.json            # Server dependencies
├── ai_engine/                  # Python AI & Computer Vision Microservice
│   ├── modules/
│   │   ├── multi_model_router.py # Gemini, Claude, GPT-4o orchestrator
│   │   └── rag_engine.py       # Retrieval-Augmented Generation for ICMR guidelines
│   └── main.py                 # FastAPI / Flask inference server
├── scripts/                    # Maintenance, SEO, and localization scripts
├── start_mern_ai.bat           # 1-Click all-in-one local launcher
├── PUSH_TO_GITHUB.bat          # 1-Click Git push automation script
├── .gitignore                  # Git tracking exclusion list
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python:** v3.10 or higher ([Download Python](https://www.python.org/))
- **Git:** Installed and configured ([Download Git](https://git-scm.com/))
- **MongoDB:** Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

---

### Method 1: 1-Click Windows Launcher (Fastest)

Simply double-click the bundled launcher in the project root:
```cmd
start_mern_ai.bat
```
This automatically boots:
1. Python AI Engine on port `8000`
2. Express API Gateway on port `5000`
3. React Vite Development Server on port `5173`

Open your browser and navigate to: **`http://localhost:5173`**

---

### Method 2: Manual Step-by-Step Setup

#### 1. Clone or Open the Workspace
```bash
git clone https://github.com/jayparmarsrisri111/sri-sri-healthcare.git
cd sri-sri-healthcare
```

#### 2. Configure Environment Variables
Create a `.env` file inside `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sri_sri_healthcare
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

#### 3. Start the Backend API Gateway
```bash
cd server
npm install
npm start
```

#### 4. Start the Python AI Microservice
```bash
cd ../ai_engine
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python main.py
```

#### 5. Start the React Frontend PWA
```bash
cd ../client
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/auth/register` | Register new patient or medical volunteer |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT session token |
| `POST` | `/api/ai/triage` | Multi-model text triage query execution |
| `POST` | `/api/ai/vision-scan` | Multimodal medical image analysis |
| `GET`  | `/api/pharmacies/search` | Query Jan Aushadhi generic medicine equivalents |
| `GET`  | `/api/facilities/nearby` | Find nearest PHC, CHC, or government hospital |
| `POST` | `/api/schemes/evaluate` | Calculate Ayushman Bharat / PM-JAY eligibility |
| `GET`  | `/api/triage/history` | Retrieve authenticated patient consultation records |

---

## 🌐 Production Deployment

- **Frontend (Client PWA):** Pre-configured with single-command deployment scripts for [Vercel](https://vercel.com) (`DEPLOY_TO_VERCEL.bat`) and [Netlify](https://netlify.com) (`DEPLOY_TO_NETLIFY.bat`).
- **Backend (Express API):** Production-ready for [Render](https://render.com), AWS EC2, DigitalOcean, or Docker containers via `server/server.js`.
- **Public Tunnels:** Compatible with Cloudflare Tunnels (`cloudflared`) and ngrok for immediate field testing on remote mobile devices.

---

## 🤝 Contributing

Contributions, feedback, and localization improvements are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License & Attribution

Distributed under the **ISC License**. Developed with dedication by **Sri Sri HealthCare Team** for empowering rural communities and advancing accessible healthcare AI.

*Heartfelt gratitude to rural healthcare workers, ASHA volunteers, and medical professionals serving underserved populations.*
