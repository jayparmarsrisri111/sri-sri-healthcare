import React, { useState } from 'react';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import { AIChatbotTab } from './AIChatbotTab';
import { getTranslation } from '../services/languageService';

export const FloatingChatWidget = ({ currentLang, activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = getTranslation(currentLang);

  // If already on the dedicated Chatbot tab, hide the floating trigger button
  if (activeTab === 'chatbot') return null;

  return (
    <>
      {/* Floating Chat Button with Official SRI SRI Logo */}
      <button
        className="floating-chat-bubble-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="24/7 AI Doctor Chat"
      >
        <img
          src="/logo.png"
          alt="SRI SRI"
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            objectFit: 'cover',
            background: '#FFFFFF'
          }}
        />
        <span>💬 {t.tabChatbot}</span>
      </button>

      {/* Floating Chat Window with Slide-Up Animation */}
      {isOpen && (
        <div className="floating-chatbot-window">
          <AIChatbotTab
            currentLang={currentLang}
            isFloating={true}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
};
