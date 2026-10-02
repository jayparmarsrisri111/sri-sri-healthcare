import React from 'react';
import {
  Mic, ShieldAlert, MessageSquare, Eye, Menu,
  Activity, Pill, Stethoscope, ShieldCheck, User
} from 'lucide-react';
import { getTranslation } from '../services/languageService';

export const MobileBottomNav = ({
  activeTab,
  setActiveTab,
  currentLang = 'gu',
  onToggleSidebar,
  currentUser
}) => {
  const t = getTranslation(currentLang);

  const navItems = [
    {
      id: 'triage',
      label: t.navTriage || 'Triage',
      sub: 'Voice',
      icon: Mic,
      color: '#00C48C'
    },
    {
      id: 'ruralCare',
      label: t.navSnakebite || 'Snakebite',
      sub: 'Lifeline',
      icon: ShieldAlert,
      color: '#EF4444',
      badge: 'SOS'
    },
    {
      id: 'chatbot',
      label: t.navDoctor || 'AI Doctor',
      sub: 'Chat',
      icon: MessageSquare,
      color: '#0284C7'
    },
    {
      id: 'eye',
      label: t.navEyeHeart || 'Eye/Heart',
      sub: 'Scan',
      icon: Eye,
      color: '#8B5CF6'
    },
    {
      id: 'menu',
      label: t.navMenu || 'Menu',
      sub: 'All Tools',
      icon: Menu,
      color: '#0A1128',
      isMenuAction: true
    }
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const handleClick = () => {
            if (item.isMenuAction) {
              onToggleSidebar();
            } else {
              setActiveTab(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              style={{
                color: isActive ? item.color : '#64748B'
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  color={isActive ? item.color : '#64748B'}
                />
                {item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '8px',
                    fontWeight: 800,
                    padding: '1px 4px',
                    borderRadius: '6px',
                    animation: 'pulseGlow6D 2s infinite'
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mobile-nav-label">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
