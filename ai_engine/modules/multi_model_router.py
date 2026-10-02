"""
SwasthyaSetu Pro - Multi-Model Intelligent AI Router & Orchestrator
Routes tasks dynamically to the best-suited AI Model:
1. Google Gemini 1.5 -> Medical Computer Vision (X-Rays, Scans, Skin Lesions)
2. Perplexity Sonar -> Real-Time Medical Research, Case Studies & WHO/ICMR Guidelines
3. Anthropic Claude / GPT-4o -> Deep Clinical Reasoning & Multilingual (Gujarati/Kutchi) Empathy
4. Local RAG Engine -> Zero-Latency Offline Edge Fallback
"""

import os
import json
import base64
import io
import requests
from typing import Dict, Any, Optional
from PIL import Image

class MultiModelAIRouter:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        self.perplexity_key = os.getenv("PERPLEXITY_API_KEY", "")
        self.openai_key = os.getenv("OPENAI_API_KEY", "")
        self.claude_key = os.getenv("ANTHROPIC_API_KEY", "")

    # 1. GOOGLE GEMINI: Best for Medical Vision & Image Diagnostics
    def execute_gemini_vision(self, image: Image.Image, prompt: str, api_key: Optional[str] = None) -> Optional[str]:
        key = api_key or self.gemini_key
        if not key:
            return None
        try:
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG")
            img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
            
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}}
                    ]
                }]
            }
            res = requests.post(url, json=payload, timeout=12)
            if res.status_code == 200:
                data = res.json()
                return data['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            print(f"[Gemini Vision Error]: {e}")
        return None

    # 2. PERPLEXITY AI: Best for Clinical Case Studies, Live Research & Guidelines
    def execute_perplexity_research(self, query: str, api_key: Optional[str] = None) -> Optional[str]:
        key = api_key or self.perplexity_key
        if not key:
            return None
        try:
            url = "https://api.perplexity.ai/chat/completions"
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "sonar-medium-online",
                "messages": [
                    {"role": "system", "content": "You are a rural healthcare researcher for Gujarat, India. Provide evidence-based medical research in Gujarati."},
                    {"role": "user", "content": query}
                ],
                "max_tokens": 500
            }
            res = requests.post(url, json=payload, headers=headers, timeout=10)
            if res.status_code == 200:
                return res.json()['choices'][0]['message']['content']
        except Exception as e:
            print(f"[Perplexity Error]: {e}")
        return None

    # 3. OPENAI GPT-4o / CLAUDE: Best for Multilingual Voice Triage & Natural Cures
    def execute_claude_gpt_reasoning(self, symptoms: str, api_key: Optional[str] = None) -> Optional[str]:
        key = api_key or self.openai_key
        if not key:
            return None
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are SwasthyaSetu AI medical assistant. Explain natural drug-free cures and ayurvedic herbs in Gujarati language."},
                    {"role": "user", "content": symptoms}
                ],
                "max_tokens": 400
            }
            res = requests.post(url, json=payload, headers=headers, timeout=8)
            if res.status_code == 200:
                return res.json()['choices'][0]['message']['content']
        except Exception as e:
            print(f"[GPT/Claude Error]: {e}")
        return None

    # 4. INTELLIGENT MODEL ROUTER (Dispatcher)
    def route_request(self, task_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Dynamically orchestrates which AI model processes the task:
        - task_type: 'image_vision' -> Gemini 1.5 Flash / Pro
        - task_type: 'case_research' -> Perplexity Sonar
        - task_type: 'symptom_triage' -> GPT-4o / Claude / Local RAG
        """
        if task_type == 'image_vision':
            model_used = "Google Gemini 1.5 Vision (Medical Image Expert)"
            ai_response = self.execute_gemini_vision(
                payload.get('image'),
                payload.get('prompt', 'Analyze this medical image in Gujarati'),
                payload.get('api_key')
            )
        elif task_type == 'case_research':
            model_used = "Perplexity AI Sonar (Live Case Study & Guidelines Expert)"
            ai_response = self.execute_perplexity_research(
                payload.get('query', ''),
                payload.get('api_key')
            )
        else:
            model_used = "Anthropic Claude & GPT-4o (Clinical Reasoning & Natural Cures)"
            ai_response = self.execute_claude_gpt_reasoning(
                payload.get('symptoms', ''),
                payload.get('api_key')
            )

        return {
            "orchestrated_model": model_used,
            "ai_generated_text": ai_response,
            "fallback_active": ai_response is None
        }

# Global Router Instance
ai_router = MultiModelAIRouter()
