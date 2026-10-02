import React from 'react';
import { Sparkles, Trophy, Globe, Cpu, ShieldCheck, Activity, Brain, CheckCircle2, X } from 'lucide-react';

export const AIModelEnsembleModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const models = [
    {
      name: "Google DeepMind Med-PaLM 2 / Gemini 1.5 Pro",
      role: "🩻 Multimodal Radiography & Vision Diagnostics",
      task: "Chest X-Ray Pneumonia/TB detection, Dermatology lesion segmentation & Lab OCR",
      accuracy: "98.4%",
      rank: "#1 Global Medical Vision",
      badgeColor: "#00C48C"
    },
    {
      name: "Perplexity AI Sonar Online",
      role: "🔍 Live Global Medical Research & Evidence Grounding",
      task: "Real-time search over 100,000+ PubMed clinical trials, WHO advisories & ICMR updates",
      accuracy: "99.1%",
      rank: "#1 Evidence Retrieval",
      badgeColor: "#2563EB"
    },
    {
      name: "Anthropic Claude 3.5 Sonnet",
      role: "🧠 Clinical Reasoning, Empathy & Dialect Understanding",
      task: "Deep Gujarati/Kutchi regional nuances, Dual Care synthesis (Allopathy + AYUSH) & Drug-Free Cures",
      accuracy: "97.9%",
      rank: "#1 Clinical Reasoning",
      badgeColor: "#8B5CF6"
    },
    {
      name: "OpenAI GPT-4o & Whisper Speech Engine",
      role: "🎙️ High-Speed Voice Triage & Multilingual Audio STT",
      task: "Real-time phoneme recognition for rural Gujarati, Kutchi, Hindi & English",
      accuracy: "96.5%",
      rank: "#1 Voice Recognition",
      badgeColor: "#10B981"
    },
    {
      name: "Eulerian Video Magnification (rPPG AI)",
      role: "💓 Contactless Micro-Vascular Blood Pulsatility",
      task: "Calculates Heart Rate (BPM), Respiration & Stress Index directly via web camera",
      accuracy: "95.2%",
      rank: "MIT/NASA Biometrics",
      badgeColor: "#EF4444"
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(10, 17, 40, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        border: '2px solid #00C48C'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1.5px solid #D3F2E3', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo.png"
              alt="SRI SRI Logo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1.5px solid #00C48C',
                boxShadow: '0 4px 12px rgba(0, 196, 140, 0.3)'
              }}
            />
            <div>
              <h2 style={{ color: '#0A1128', margin: 0, fontSize: '20px', fontWeight: 800 }}>
                🤖 SRI SRI ❤️ AI MODELS ENSEMBLE (MoE Matrix)
              </h2>
              <span style={{ color: '#009F70', fontSize: '12px', fontWeight: 700 }}>
                DeepMind Gemini + Perplexity Sonar + Anthropic Claude + GPT-4o
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#F0FAF5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} color="#0A1128" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {models.map((m, idx) => (
            <div key={idx} style={{
              background: '#F8FCF9',
              border: '1.5px solid #D3F2E3',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ color: '#0A1128', margin: 0, fontSize: '16px', fontWeight: 800 }}>{m.name}</h4>
                  <span style={{ background: '#FFFFFF', color: m.badgeColor, border: `1px solid ${m.badgeColor}`, fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '8px' }}>
                    {m.rank}
                  </span>
                </div>
                <div style={{ color: '#009F70', fontSize: '13px', fontWeight: 700, margin: '2px 0' }}>{m.role}</div>
                <div style={{ color: '#5A6A85', fontSize: '12px' }}>{m.task}</div>
              </div>

              <div style={{ textAlign: 'right', background: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', border: '1px solid #D3F2E3' }}>
                <div style={{ fontSize: '11px', color: '#5A6A85', fontWeight: 700 }}>AI સચોટતા બેન્ચમાર્ક:</div>
                <div style={{ fontSize: '18px', color: '#009F70', fontWeight: 800 }}>{m.accuracy}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button className="btn-primary" onClick={onClose} style={{ padding: '12px 32px' }}>
            સમજાઈ ગયું (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
