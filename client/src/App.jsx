import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { VitalsHUD } from './components/VitalsHUD';
import { VoiceTriageTab } from './components/VoiceTriageTab';
import { AIChatbotTab } from './components/AIChatbotTab';
import { MedicineEncyclopediaTab } from './components/MedicineEncyclopediaTab';
import { LiveMedicineLocatorTab } from './components/LiveMedicineLocatorTab';
import { EyePowerScannerTab } from './components/EyePowerScannerTab';
import { MindEmotionDecoderTab } from './components/MindEmotionDecoderTab';
import { VisionDiagnosticsTab } from './components/VisionDiagnosticsTab';
import { VitalsScannerTab } from './components/VitalsScannerTab';
import { FacilityNavigatorTab } from './components/FacilityNavigatorTab';
import { SchemesOptimizerTab } from './components/SchemesOptimizerTab';
import { PatientHistoryTab } from './components/PatientHistoryTab';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { RuralCareLifelineTab } from './components/RuralCareLifelineTab';
import { AuthModal } from './components/AuthModal';
import { RealWorldCasesModal } from './components/RealWorldCasesModal';
import { AIModelEnsembleModal } from './components/AIModelEnsembleModal';
import { InternationalPitchModal } from './components/InternationalPitchModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { ContinuousLearningHubModal } from './components/ContinuousLearningHubModal';
import { HowToUseGuideModal } from './components/HowToUseGuideModal';
import { DisadvantagesToAdvantagesHubModal } from './components/DisadvantagesToAdvantagesHubModal';
import { HomeLabCollectionTab } from './components/HomeLabCollectionTab';
import { GlobalDoctorDirectoryTab } from './components/GlobalDoctorDirectoryTab';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { PWAInstallModal } from './components/PWAInstallModal';

import { getTranslation, applyGlobalLanguage } from './services/languageService';
import { authService } from './services/authService';
import { updateSEOMeta } from './services/seoService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) return tabParam;
    }
    const user = authService.getCurrentUser();
    if (user?.role === 'doctor') return 'doctorPortal';
    if (user?.role === 'admin') return 'adminHub';
    return 'triage';
  });

  const [currentLang, setLangState] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang');
      if (langParam) return langParam;
    }
    return localStorage.getItem('preferred_language') || 'gu';
  });

  const setLang = (lang) => {
    setLangState(lang);
    applyGlobalLanguage(lang);
  };

  useEffect(() => {
    updateSEOMeta(activeTab, currentLang);
  }, [activeTab, currentLang]);

  const [selectedModel, setSelectedModel] = useState('auto');
  const [liveBpm, setLiveBpm] = useState(74);
  const [modalMessage, setModalMessage] = useState(null);
  const [showCasesModal, setShowCasesModal] = useState(false);
  const [showEnsembleModal, setShowEnsembleModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showContinuousLearnModal, setShowContinuousLearnModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showAdvantagesModal, setShowAdvantagesModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }
    return false;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedCasePrompt, setSelectedCasePrompt] = useState(null);
  const [selectedMedForLocator, setSelectedMedForLocator] = useState('Dolo 650');

  const t = getTranslation(currentLang);

  useEffect(() => {
    const handleAuthChange = (e) => {
      const user = e.detail || authService.getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener('auth_user_changed', handleAuthChange);
    return () => window.removeEventListener('auth_user_changed', handleAuthChange);
  }, []);

  // Native PWA Install Lifecycle Listener for Android, Windows, Mac, Chrome & Edge
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('💡 PWA native install prompt captured and ready');
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      setShowInstallModal(false);
      console.log('✅ Sri Sri HealthCare App Installed Successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'doctor') {
      setActiveTab('doctorPortal');
    } else if (user.role === 'admin') {
      setActiveTab('adminHub');
    } else {
      setActiveTab('triage');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setShowAuthModal(true);
  };

  const handleEmergency = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:108';
    }
  };

  const handleSOS = () => {
    setModalMessage({
      title: t.sosAlertTitle,
      body: t.sosAlertBody
    });
  };

  const handleInstallClick = () => {
    setShowInstallModal(true);
  };

  const handleNativeInstall = async () => {
    if (!deferredPrompt) {
      setShowInstallModal(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      setShowInstallModal(false);
    }
  };

  const handleSelectCase = (prompt) => {
    setSelectedCasePrompt(prompt);
    setActiveTab('triage');
  };

  return (
    <div className="dashboard-layout">
      {/* Native Cross-Platform PWA Installation Modal (Mobile, Tablet, Desktop) */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredPrompt}
        isInstalled={isAppInstalled}
        onNativeInstall={handleNativeInstall}
        currentLang={currentLang}
      />

      {/* Login & Sign Up Modal with Patient, Doctor, Admin Personas */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        currentLang={currentLang}
      />

      {/* Global World Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
        currentLang={currentLang}
        setLang={setLang}
      />

      {/* Real-World Case Simulator Modal */}
      <RealWorldCasesModal
        isOpen={showCasesModal}
        onClose={() => setShowCasesModal(false)}
        onSelectCase={handleSelectCase}
      />

      {/* AI Models Ensemble Modal */}
      <AIModelEnsembleModal
        isOpen={showEnsembleModal}
        onClose={() => setShowEnsembleModal(false)}
      />

      {/* International Pitch Deck Modal */}
      <InternationalPitchModal
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
      />

      {/* Continuous Active Self-Training Hub Modal (100% Accuracy Engine) */}
      <ContinuousLearningHubModal
        isOpen={showContinuousLearnModal}
        onClose={() => setShowContinuousLearnModal(false)}
      />

      {/* Step-by-Step Visual & Voice Guide Modal for Everyone */}
      <HowToUseGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        currentLang={currentLang}
      />

      {/* Disadvantages to 5 Super Advantages Master Modal */}
      <DisadvantagesToAdvantagesHubModal
        isOpen={showAdvantagesModal}
        onClose={() => setShowAdvantagesModal(false)}
        onOpenLabTab={() => setActiveTab('homeLab')}
        onOpenTriage={() => setActiveTab('triage')}
        onOpenRuralCare={() => setActiveTab('ruralCare')}
      />

      {/* Modern Left Sidebar Navigation (Fully Multilingual & Role-Aware) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenCasesModal={() => setShowCasesModal(true)}
        onOpenEnsembleModal={() => setShowEnsembleModal(true)}
        onOpenPitchModal={() => setShowPitchModal(true)}
        onOpenContinuousLearnModal={() => setShowContinuousLearnModal(true)}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onOpenGuideModal={() => setShowGuideModal(true)}
        onOpenAdvantagesModal={() => setShowAdvantagesModal(true)}
        onInstallClick={handleInstallClick}
      />

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Glassmorphic Top Navbar with User Role Badge */}
        <TopHeader
          currentLang={currentLang}
          setLang={setLang}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onEmergencyClick={handleEmergency}
          onSOSClick={handleSOS}
          onInstallClick={handleInstallClick}
          onOpenLangModal={() => setShowLangModal(true)}
          currentUser={currentUser}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dynamic Content Container */}
        <main className="content-body">
          {/* Real-Time Live Vitals & Stats HUD Bar */}
          <VitalsHUD
            currentLang={currentLang}
            currentBpm={liveBpm}
            totalSavings="85%"
            activePhcs={5}
            triageCount={142}
          />

          {/* Quick Universal Category Ribbon (Multilingual Category Buttons) */}
          <div className="quick-category-ribbon">
            <button
              onClick={() => setActiveTab('triage')}
              className={`quick-ribbon-btn ${activeTab === 'triage' ? 'active' : ''}`}
            >
              <span className="ribbon-icon">🎙️</span>
              <div className="ribbon-text">
                <strong>{t.ribbonTriageTitle || '1. Speak Symptoms'}</strong>
                <span>{t.ribbonTriageSub || 'Speak into mic'}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('ruralCare')}
              className={`quick-ribbon-btn ${activeTab === 'ruralCare' ? 'active' : ''}`}
            >
              <span className="ribbon-icon">🌾</span>
              <div className="ribbon-text">
                <strong>{t.ribbonRuralTitle || '2. Village Lifeline'}</strong>
                <span>{t.ribbonRuralSub || 'Snakebite & ASV'}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('medLocator')}
              className={`quick-ribbon-btn ${activeTab === 'medLocator' ? 'active' : ''}`}
            >
              <span className="ribbon-icon">💊</span>
              <div className="ribbon-text">
                <strong>{t.ribbonMedTitle || '3. Cheap Medicine (85% Off)'}</strong>
                <span>{t.ribbonMedSub || 'Jan Aushadhi'}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('eye')}
              className={`quick-ribbon-btn ${activeTab === 'eye' ? 'active' : ''}`}
            >
              <span className="ribbon-icon">👁️</span>
              <div className="ribbon-text">
                <strong>{t.ribbonEyeTitle || '4. Eye Power'}</strong>
                <span>{t.ribbonEyeSub || 'Vision AI'}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('homeLab')}
              className={`quick-ribbon-btn ${activeTab === 'homeLab' ? 'active' : ''}`}
            >
              <span className="ribbon-icon">🧪</span>
              <div className="ribbon-text">
                <strong>{t.ribbonLabTitle || '5. Home Blood Test'}</strong>
                <span>{t.ribbonLabSub || '80% Subsidy'}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('doctorDirectory')}
              className={`quick-ribbon-btn ${activeTab === 'doctorDirectory' ? 'active' : ''}`}
            >
              <span className="ribbon-icon">🌍</span>
              <div className="ribbon-text">
                <strong>{t.ribbonDoctorTitle || '6. Doctor Directory'}</strong>
                <span>{t.ribbonDoctorSub || 'Gujarat • India • Global'}</span>
              </div>
            </button>

            <button
              onClick={() => setShowGuideModal(true)}
              className="quick-ribbon-btn guide-btn"
            >
              <span className="ribbon-icon">📖</span>
              <div className="ribbon-text">
                <strong>{t.ribbonGuideTitle || '7. Easy App Guide'}</strong>
                <span>{t.ribbonGuideSub || '🔊 Listen in Voice'}</span>
              </div>
            </button>
          </div>

          {/* Emergency / SOS Modal Alert */}
          {modalMessage && (
            <div style={{
              background: '#FEF2F2',
              border: '2px solid #EF4444',
              padding: '16px 20px',
              borderRadius: '16px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.15)'
            }}>
              <div>
                <h4 style={{ color: '#EF4444', margin: 0, fontWeight: 800 }}>{modalMessage.title}</h4>
                <p style={{ color: '#991B1B', margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600 }}>{modalMessage.body}</p>
              </div>
              <button
                onClick={() => setModalMessage(null)}
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 800
                }}
              >
                {t.okBtn}
              </button>
            </div>
          )}

          {/* Dynamic Active Module Render */}
          {activeTab === 'doctorPortal' && (
            <DoctorDashboard
              currentUser={currentUser}
              currentLang={currentLang}
              onSelectPatient={() => setActiveTab('history')}
            />
          )}

          {activeTab === 'adminHub' && (
            <AdminDashboard
              currentUser={currentUser}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'ruralCare' && (
            <RuralCareLifelineTab
              currentLang={currentLang}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'homeLab' && (
            <HomeLabCollectionTab
              currentLang={currentLang}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'triage' && (
            <VoiceTriageTab
              currentLang={currentLang}
              initialPrompt={selectedCasePrompt}
              selectedModel={selectedModel}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'chatbot' && (
            <AIChatbotTab currentLang={currentLang} currentUser={currentUser} />
          )}

          {activeTab === 'encyclopedia' && (
            <MedicineEncyclopediaTab
              currentLang={currentLang}
              currentUser={currentUser}
              onLocateMedicine={(med) => {
                setSelectedMedForLocator(med);
                setActiveTab('medLocator');
              }}
            />
          )}

          {activeTab === 'doctorDirectory' && (
            <GlobalDoctorDirectoryTab
              currentLang={currentLang}
              currentUser={currentUser}
              onOpenAuthModal={(role) => setShowAuthModal(true)}
            />
          )}

          {activeTab === 'medLocator' && (
            <LiveMedicineLocatorTab
              currentLang={currentLang}
              initialMedicine={selectedMedForLocator}
            />
          )}

          {activeTab === 'eye' && (
            <EyePowerScannerTab currentLang={currentLang} currentUser={currentUser} />
          )}

          {activeTab === 'emotion' && (
            <MindEmotionDecoderTab currentLang={currentLang} currentUser={currentUser} />
          )}

          {activeTab === 'vision' && (
            <VisionDiagnosticsTab selectedModel={selectedModel} currentLang={currentLang} currentUser={currentUser} />
          )}

          {activeTab === 'vitals' && (
            <VitalsScannerTab
              currentLang={currentLang}
              currentUser={currentUser}
              onVitalsUpdate={(bpm) => setLiveBpm(bpm)}
            />
          )}

          {activeTab === 'phc' && (
            <FacilityNavigatorTab currentLang={currentLang} />
          )}

          {activeTab === 'schemes' && (
            <SchemesOptimizerTab currentLang={currentLang} />
          )}

          {activeTab === 'history' && (
            <PatientHistoryTab currentLang={currentLang} currentUser={currentUser} />
          )}
        </main>
      </div>

      {/* Native App-like Mobile Bottom Navigation Bar (Phones & Small Tablets) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        currentUser={currentUser}
      />

      {/* Floating 24/7 AI Doctor Chat Widget (Fixed Bottom Right) */}
      <FloatingChatWidget currentLang={currentLang} activeTab={activeTab} />
    </div>
  );
}
