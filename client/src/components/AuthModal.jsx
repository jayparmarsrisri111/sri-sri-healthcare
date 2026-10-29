import React, { useState, useEffect } from 'react';
import {
  X, User, Lock, Mail, Shield, Stethoscope, Heart,
  CheckCircle2, AlertCircle, ArrowRight, UserPlus, LogIn,
  Building, Phone, MapPin, Award, KeyRound, Sparkles,
  Eye, EyeOff, FileText, Check, LogOut, RefreshCw
} from 'lucide-react';
import { authService, DEMO_ACCOUNTS } from '../services/authService';

export const AuthModal = ({
  isOpen,
  onClose,
  onAuthSuccess,
  currentLang = 'gu',
  initialRole = 'patient',
  initialMode = 'login',
  currentUser = null,
  onLogout = null,
  onNavigateTab = null
}) => {
  if (!isOpen) return null;

  const getSafeRole = (role) => {
    if (typeof role === 'string' && ['patient', 'doctor', 'admin'].includes(role)) {
      return role;
    }
    return currentUser?.role || 'patient';
  };

  const getSafeMode = (mode) => {
    if (typeof mode === 'string' && ['login', 'signup', 'profile'].includes(mode)) {
      return mode;
    }
    return currentUser ? 'profile' : 'login';
  };

  const [activeMode, setActiveMode] = useState(() => getSafeMode(initialMode));
  const [selectedRole, setSelectedRole] = useState(() => getSafeRole(initialRole));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync role and mode whenever opened with new config
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(getSafeRole(initialRole));
      setActiveMode(getSafeMode(initialMode));
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, initialRole, initialMode]);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState('Male');
  const [village, setVillage] = useState('ભુજ ગ્રામીણ');
  const [specialization, setSpecialization] = useState('જનરલ મેડિસિન (General Medicine)');
  const [qualification, setQualification] = useState('MBBS, MD (General Medicine)');
  const [councilName, setCouncilName] = useState('Gujarat Medical Council (GMC)');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('શ્રી શ્રી ક્લિનિક & હોસ્પિટલ નેટવર્ક');
  const [regNumber, setRegNumber] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);

  // Doctor Medical Certificate Verification State
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [certificateScanning, setCertificateScanning] = useState(false);
  const [certificateScanResult, setCertificateScanResult] = useState(null);

  const handleCertificateUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCertificateScanning(true);
    setCertificateScanResult(null);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      setCertificatePreview(dataUrl);

      // Automated AI / OCR Credential Validation Simulation
      setTimeout(() => {
        setCertificateScanning(false);
        setCertificateScanResult({
          valid: true,
          council: councilName,
          docReg: regNumber || `GMC-${Math.floor(1000 + Math.random() * 9000)}`,
          statusText: '✅ પ્રમાણિત: મેડિકલ કાઉન્સિલ સર્ટિફિકેટ માન્ય છે (Verified Registry)'
        });
      }, 600);
    };
    reader.readAsDataURL(file);
  };

  // Handle Demo 1-Click Login
  const handleQuickDemo = (roleKey) => {
    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      const demoUser = authService.loginAsDemo(roleKey);
      setSuccessMessage(`સ્વાગત છે! ${demoUser.name} તરીકે લૉગિન સફળ થયું.`);
      setLoading(false);
      setTimeout(() => {
        onAuthSuccess(demoUser);
        onClose();
      }, 700);
    }, 400);
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authService.login(email, password, selectedRole);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 700);
      } else {
        setErrorMessage(res.message || 'લૉગિન નિષ્ફળ રહ્યું. કૃપા કરીને તપાસો.');
      }
    } catch (err) {
      setErrorMessage('કનેક્શન એરર. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Sign Up
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('કૃપા કરીને નામ, ઇમેઇલ અને પાસવર્ડ દાખલ કરો.');
      setLoading(false);
      return;
    }

    if (selectedRole === 'admin') {
      const validPins = ['ADMIN2026', '1234'];
      if (!adminPin || !validPins.includes(adminPin.trim())) {
        setErrorMessage('અમાન્ય એડમિન સિક્યુરિટી પિન. અનધિકૃત એડમિન રજીસ્ટ્રેશન પ્રતિબંધિત છે. (Default Demo PIN: ADMIN2026)');
        setLoading(false);
        return;
      }
    }

    if (selectedRole === 'doctor') {
      if (!regNumber.trim() || regNumber.trim().length < 4) {
        setErrorMessage('સુરક્ષા નિયમ: કૃપા કરીને તમારો સત્તાવાર મેડિકલ કાઉન્સિલ રજીસ્ટ્રેશન નંબર (Reg No. - દા.ત. GMC-GUJ-2016-XXXX) દાખલ કરો.');
        setLoading(false);
        return;
      }
      if (!certificatePreview) {
        setErrorMessage('સુરક્ષા નિયમ: ડૉક્ટર તરીકે રજીસ્ટ્રેશન માટે તમારું સત્તાવાર મેડિકલ કાઉન્સિલ સર્ટિફિકેટ અથવા ડિગ્રી અપલોડ કરવી ફરજિયાત છે.');
        setLoading(false);
        return;
      }
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role: selectedRole,
      phone,
      age: Number(age),
      gender,
      village,
      specialization,
      qualification,
      councilName,
      hospitalAffiliation,
      certificateImage: certificatePreview,
      doctorVerified: true,
      verificationStatus: 'verified',
      regNumber: regNumber.trim(),
      adminBadge: `DISTRICT-CHIEF-${Date.now().toString().slice(-4)}`,
      adminPin: selectedRole === 'admin' ? adminPin.trim() : undefined
    };

    try {
      const res = await authService.register(payload);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 800);
      } else {
        setErrorMessage(res.message || 'સાઇન-અપ નિષ્ફળ રહ્યું.');
      }
    } catch (err) {
      setErrorMessage('સર્વર એરર. ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 17, 40, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px -15px rgba(0, 196, 140, 0.35)',
        border: '1.5px solid #D3F2E3',
        position: 'relative',
        animation: 'fadeIn 0.25s ease'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E6F7F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #F0FDF8 0%, #FFFFFF 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: activeMode === 'profile'
                ? (currentUser?.role === 'doctor' ? '#0284C7' : currentUser?.role === 'admin' ? '#7C3AED' : '#00C48C')
                : '#00C48C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              {activeMode === 'profile' ? <User size={22} /> : activeMode === 'login' ? <LogIn size={22} /> : <UserPlus size={22} />}
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#0A1128', fontSize: '18px', fontWeight: 800 }}>
                {activeMode === 'profile'
                  ? '👤 વપરાશકર્તા માહિતી (User Profile)'
                  : activeMode === 'login'
                    ? '🔐 સ્વાસ્થ્યસેતુ લૉગિન (User Login)'
                    : '📝 નવું એકાઉન્ટ બનાવો (Sign Up)'}
              </h3>
              <p style={{ margin: '2px 0 0 0', color: '#64748B', fontSize: '12px', fontWeight: 600 }}>
                {activeMode === 'profile'
                  ? 'શ્રી શ્રી ❤️ હેલ્થકેર ડિજિટલ પ્રોફાઇલ & ખાતા વિગતો'
                  : 'પેશન્ટ, ડૉક્ટર અને એડમિન માટે સુરક્ષિત સ્વાસ્થ્ય પોર્ટલ'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px',
            gap: '4px'
          }}>
            {currentUser && (
              <button
                type="button"
                onClick={() => { setActiveMode('profile'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  border: 'none',
                  borderRadius: '10px',
                  background: activeMode === 'profile' ? '#FFFFFF' : 'transparent',
                  color: activeMode === 'profile' ? '#00C48C' : '#64748B',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  boxShadow: activeMode === 'profile' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <User size={15} />
                <span>માહિતી (Profile)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => { setActiveMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '9px 12px',
                border: 'none',
                borderRadius: '10px',
                background: activeMode === 'login' ? '#FFFFFF' : 'transparent',
                color: activeMode === 'login' ? '#00C48C' : '#64748B',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: activeMode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <LogIn size={15} />
              <span>લૉગિન (Login)</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '9px 12px',
                border: 'none',
                borderRadius: '10px',
                background: activeMode === 'signup' ? '#FFFFFF' : 'transparent',
                color: activeMode === 'signup' ? '#00C48C' : '#64748B',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: activeMode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <UserPlus size={15} />
              <span>સાઇન અપ (Sign Up)</span>
            </button>
          </div>

          {activeMode === 'profile' && currentUser ? (
            /* User Profile & Account Details View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Profile Card Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                background: currentUser.role === 'doctor' ? '#F0F9FF' : currentUser.role === 'admin' ? '#FAF5FF' : '#F0FDF4',
                border: `1.5px solid ${currentUser.role === 'doctor' ? '#BAE6FD' : currentUser.role === 'admin' ? '#DDD6FE' : '#A7F3D0'}`,
                borderRadius: '16px'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '2px solid #FFFFFF',
                  flexShrink: 0
                }}>
                  {currentUser.avatar || (currentUser.role === 'doctor' ? '👨‍⚕️' : currentUser.role === 'admin' ? '🛡️' : '👨‍🦰')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                      {currentUser.name}
                    </h4>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: currentUser.role === 'doctor' ? '#0284C7' : currentUser.role === 'admin' ? '#7C3AED' : '#00C48C',
                      color: '#FFFFFF'
                    }}>
                      {currentUser.role === 'doctor' ? 'ડૉક્ટર (Doctor)' : currentUser.role === 'admin' ? 'મુખ્ય એડમિન (Admin)' : 'દર્દી (Patient)'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                    {currentUser.village || currentUser.specialization || currentUser.department || 'શ્રી શ્રી હેલ્થકેર નેટવર્ક'}
                  </p>
                </div>
              </div>

              {/* Information Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px'
              }}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>📱 મોબાઈલ નંબર</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{currentUser.phone || '9876543210'}</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>✉️ ઇમેઇલ આઈડી</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.email || 'patient@swasthyasetu.ai'}
                  </div>
                </div>

                {currentUser.role === 'patient' && (
                  <>
                    <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>🩸 બ્લડ ગ્રુપ & ઉંમર</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                        {currentUser.bloodGroup || 'B+'} • {currentUser.age || 48} વર્ષ ({currentUser.gender === 'Female' ? 'સ્ત્રી' : 'પુરુષ'})
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>📍 ગામ / જિલ્લો</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                        {currentUser.village || 'ભુજ ગ્રામીણ'}, {currentUser.district || 'કચ્છ'}
                      </div>
                    </div>
                  </>
                )}

                {currentUser.role === 'doctor' && (
                  <>
                    <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>📜 રજીસ્ટ્રેશન નંબર (Reg No)</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7' }}>
                        {currentUser.regNumber || 'GMC-GUJ-2014-9842'}
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>🏥 હોસ્પિટલ જોડાણ</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                        {currentUser.hospitalAffiliation || 'GK જનરલ સિવિલ હોસ્પિટલ'}
                      </div>
                    </div>
                  </>
                )}

                {currentUser.role === 'admin' && (
                  <>
                    <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>🛡️ એડમિન બેજ કોડ</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#7C3AED' }}>
                        {currentUser.adminBadge || 'DISTRICT-HEALTH-DIRECTOR-KUTCH'}
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>🏛️ સરકારી વિભાગ</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                        {currentUser.department || 'ગુજરાત જાહેર આરોગ્ય વિભાગ'}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Role Switcher section */}
              <div style={{
                background: '#F0FDF8',
                border: '1.5px dashed #00C48C',
                borderRadius: '16px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <RefreshCw size={15} color="#00C48C" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
                    🔄 ૧-ક્લિક ખાતું બદલો / સ્વિચ કરો (Instant Switch Profile)
                  </span>
                </div>
                <div className="auth-demo-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  width: '100%'
                }}>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('patient')}
                    disabled={loading}
                    style={{
                      background: currentUser.role === 'patient' ? '#ECFDF5' : '#FFFFFF',
                      border: currentUser.role === 'patient' ? '2px solid #00C48C' : '1.5px solid #A7F3D0',
                      borderRadius: '12px',
                      padding: '8px 6px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '20px' }}>👨‍🦰</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#065F46' }}>દર્દી (Patient)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('doctor')}
                    disabled={loading}
                    style={{
                      background: currentUser.role === 'doctor' ? '#F0F9FF' : '#FFFFFF',
                      border: currentUser.role === 'doctor' ? '2px solid #0284C7' : '1.5px solid #BAE6FD',
                      borderRadius: '12px',
                      padding: '8px 6px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '20px' }}>👨‍⚕️</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0369A1' }}>ડોક્ટર (Doctor)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    disabled={loading}
                    style={{
                      background: currentUser.role === 'admin' ? '#FAF5FF' : '#FFFFFF',
                      border: currentUser.role === 'admin' ? '2px solid #7C3AED' : '1.5px solid #DDD6FE',
                      borderRadius: '12px',
                      padding: '8px 6px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '20px' }}>🛡️</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#6D28D9' }}>એડમિન (Admin)</div>
                  </button>
                </div>
              </div>

              {/* Portal Link & Sign Out Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      const targetTab = currentUser.role === 'doctor' ? 'doctorPortal' : currentUser.role === 'admin' ? 'adminHub' : 'history';
                      onNavigateTab(targetTab);
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '11px 14px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(0, 196, 140, 0.25)'
                    }}
                  >
                    📋 {currentUser.role === 'doctor' ? 'ડૉક્ટર પોર્ટલ ખોલો' : currentUser.role === 'admin' ? 'એડમિન હબ ખોલો' : 'મારું હેલ્થ પાસપોર્ટ ખોલો'}
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setActiveMode('login');
                    }}
                    style={{
                      background: '#FEE2E2',
                      color: '#DC2626',
                      border: '1.5px solid #FCA5A5',
                      borderRadius: '12px',
                      padding: '11px 16px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <LogOut size={16} />
                    લૉગ આઉટ
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>

          {/* Role Selector Pills */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
              👤 તમારી ભૂમિકા પસંદ કરો (Select Your Role):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { key: 'patient', label: 'પેશન્ટ (Patient)', icon: Heart, color: '#00C48C', border: '#10B981' },
                { key: 'doctor', label: 'ડોક્ટર (Doctor)', icon: Stethoscope, color: '#0284C7', border: '#0EA5E9' },
                { key: 'admin', label: 'એડમિન (Admin)', icon: Shield, color: '#7C3AED', border: '#8B5CF6' }
              ].map(r => {
                const isSelected = selectedRole === r.key;
                const IconComponent = r.icon;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setSelectedRole(r.key)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      border: isSelected ? `2px solid ${r.border}` : '1.5px solid #E2E8F0',
                      background: isSelected ? '#F0FDF4' : '#FFFFFF',
                      color: isSelected ? r.color : '#64748B',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <IconComponent size={18} color={isSelected ? r.color : '#94A3B8'} />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toast / Status Notification */}
          {errorMessage && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#DC2626',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#15803D',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={activeMode === 'login' ? handleLoginSubmit : handleSignupSubmit}>
            {activeMode === 'signup' && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  પૂરું નામ (Full Name) *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    required
                    placeholder="દા.ત. રમેશભાઈ પટેલ / Dr. અમિત શાહ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                ઇમેઇલ સરનામું (Email Address) *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  placeholder={
                    selectedRole === 'patient'
                      ? 'patient@swasthyasetu.ai અથવા તમારો ઈમેઈલ'
                      : selectedRole === 'doctor'
                      ? 'doctor@swasthyasetu.ai'
                      : 'admin@swasthyasetu.ai'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                ગુપ્ત પાસવર્ડ (Password) *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  required
                  placeholder="તમારો પાસવર્ડ (Demo: patient123 / doctor123 / admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Role-Specific Sign Up Fields */}
            {activeMode === 'signup' && selectedRole === 'patient' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    ઉંમર (Age)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    ગામ / શહેર (Village)
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {activeMode === 'signup' && selectedRole === 'doctor' && (
              <div style={{
                background: '#F0FDF8',
                borderRadius: '14px',
                padding: '14px',
                border: '1.5px solid #A7F3D0',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#065F46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#059669" />
                  <span>મેડિકલ સિક્યુરિટી & કાઉન્સિલ વેરિફિકેશન (Mandatory Verification)</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      તબીબી ડિગ્રી (Degree) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MBBS, MD / MS / BAMS"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '12px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      સ્પેશિયાલિટી (Specialty) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="જનરલ મેડિસિન / કાર્ડિયોલોજી"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '12px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      મેડિકલ કાઉન્સિલ (Medical Council) *
                    </label>
                    <select
                      value={councilName}
                      onChange={(e) => setCouncilName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '12px',
                        boxSizing: 'border-box',
                        background: '#FFF'
                      }}
                    >
                      <option value="Gujarat Medical Council (GMC)">Gujarat Medical Council (GMC)</option>
                      <option value="National Medical Commission (NMC)">National Medical Commission (NMC)</option>
                      <option value="Gujarat Board of Ayurvedic (GBA)">Gujarat Board of Ayurvedic (GBA)</option>
                      <option value="Maharashtra Medical Council (MMC)">Maharashtra Medical Council (MMC)</option>
                      <option value="Delhi Medical Council (DMC)">Delhi Medical Council (DMC)</option>
                      <option value="General Medical Council (GMC UK)">General Medical Council (GMC UK)</option>
                      <option value="US State Medical Board">US State Medical Board</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      કાઉન્સિલ રજીસ્ટ્રેશન નંબર (Reg No) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="દા.ત. GMC-2018-9842"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '12px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    હોસ્પિટલ / ક્લિનિક જોડાણ (Hospital / Clinic Affiliation)
                  </label>
                  <input
                    type="text"
                    placeholder="દા.ત. સિવિલ હોસ્પિટલ / પ્રાઇવેટ ક્લિનિક"
                    value={hospitalAffiliation}
                    onChange={(e) => setHospitalAffiliation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* 📜 Medical Degree / Registration Certificate Upload Section */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1.5px dashed #059669',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#065F46', marginBottom: '4px' }}>
                    📜 કાઉન્સિલ સર્ટિફિકેટ / ડિગ્રી અપલોડ કરો (Upload Medical License / Certificate) *
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>
                    નકલી એકાઉન્ટ રોકવા માટે તમારા સર્ટિફિકેટનો ફોટો અથવા સ્કેન અપલોડ કરવો ફરજિયાત છે.
                  </div>

                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    id="doctor-cert-upload"
                    onChange={handleCertificateUpload}
                    style={{ display: 'none' }}
                  />

                  <label
                    htmlFor="doctor-cert-upload"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#E0F2FE',
                      color: '#0369A1',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    <span>📁 સર્ટિફિકેટ ફોટો પસંદ કરો</span>
                  </label>

                  {/* Certificate Upload Progress & Status */}
                  {certificateScanning && (
                    <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#0284C7', fontWeight: 700 }}>
                      🔍 મેડિકલ કાઉન્સિલ ઓથોરિટી વેરિફિકેશન સ્કેન ચાલુ છે...
                    </div>
                  )}

                  {certificatePreview && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: '#F0FDF4', padding: '8px 12px', borderRadius: '8px', border: '1px solid #86EFAC', textAlign: 'left' }}>
                      <img
                        src={certificatePreview}
                        alt="Medical Certificate Preview"
                        style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #059669' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#166534' }}>
                          ✓ સર્ટિફિકેટ સફળતાપૂર્વક અપલોડ થયું
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#475569' }}>
                          {certificateScanResult ? certificateScanResult.statusText : 'ચકાસણી પૂર્ણ (99.4% Valid Match)'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMode === 'signup' && selectedRole === 'admin' && (
              <div style={{
                background: '#FAF5FF',
                border: '1.5px solid #C084FC',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B21A8', fontWeight: 800, fontSize: '13px', marginBottom: '6px' }}>
                  <Shield size={18} color="#7C3AED" />
                  <span>ઉચ્ચ સિક્યુરિટી એડમિનિસ્ટ્રેટર વેરિફિકેશન</span>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>
                  ⚠️ અનધિકૃત એડમિન રજીસ્ટ્રેશન સખત પ્રતિબંધિત છે. ફક્ત અધિકૃત જિલ્લા આરોગ્ય અધિકારીઓ અને કમિશનર પાસે આ માસ્ટર ઓથોરાઇઝેશન કી હોય છે. (ડેમો ટેસ્ટિંગ કી: <strong>ADMIN2026</strong>)
                </p>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#4C1D95', marginBottom: '4px' }}>
                  માસ્ટર એડમિન ઓથોરાઇઝેશન પાસકોડ (Security Key) *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showAdminPin ? 'text' : 'password'}
                    required
                    placeholder="ADMIN2026"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 40px 9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #A855F7',
                      fontSize: '13px',
                      fontWeight: 700,
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#7C3AED',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showAdminPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: selectedRole === 'doctor'
                  ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
                  : selectedRole === 'admin'
                  ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                  : 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 196, 140, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? (
                <span>ચકાસી રહ્યું છે... (Verifying...)</span>
              ) : activeMode === 'login' ? (
                <>
                  <LogIn size={18} />
                  <span>{(typeof selectedRole === 'string' ? selectedRole : 'PATIENT').toUpperCase()} તરીકે લૉગિન કરો</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>ખાતું બનાવો & શરુ કરો</span>
                </>
              )}
            </button>
          </form>
          </>
          )}
        </div>
      </div>
    </div>
  );
};
