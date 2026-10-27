import React, { useState } from 'react';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import { AIChatbotTab } from './AIChatbotTab';
import { getTranslation } from '../services/languageService';

export const FloatingChatWidget = ({ currentLang, activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const t = getTranslation(currentLang);

  // If already on the dedicated Chatbot tab, hide the floating trigger button
  if (activeTab === 'chatbot') return null;

  // Clean the title text so there are no duplicate emojis or oversized text
  const rawTitle = t.tabChatbot || '24/7 AI Doctor Chatbot';
  // Strip any leading emojis and excess spaces
  const cleanTitle = rawTitle.replace(/^[\p{Emoji}\s]+/u, '').trim() || 'AI Doctor';

  return (
    <>
      {/* Compact Initial Circle FAB, Expands smoothly on Hover/Click */}
      <button
        className={`floating-chat-bubble-btn ${isOpen ? 'active-open' : ''} ${isHovered ? 'hover-expanded' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={cleanTitle}
        aria-label={cleanTitle}
      >
        <div className="chat-btn-avatar-wrap">
          <img
            src="/logo.png"
            alt="SRI SRI"
            className="chat-btn-logo"
          />
          <span className="chat-online-pulse" title="Online 24/7" />
        </div>

        <div className="chat-btn-content">
          <span className="chat-btn-title">{cleanTitle}</span>
        </div>

        <span className="chat-btn-badge">
          {isOpen ? <X size={13} strokeWidth={2.5} /> : <Sparkles size={12} />}
        </span>
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
