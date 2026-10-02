import React, { useState } from 'react';
import {
  X, User, Lock, Mail, Shield, Stethoscope, Heart,
  CheckCircle2, AlertCircle, ArrowRight, UserPlus, LogIn,
  Building, Phone, MapPin, Award, KeyRound, Sparkles
} from 'lucide-react';
import { authService, DEMO_ACCOUNTS } from '../services/authService';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess, currentLang = 'gu' }) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState('login'); // 'login' or 'signup'
  const [selectedRole, setSelectedRole] = useState('patient'); // 'patient', 'doctor', 'admin'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState('Male');
  const [village, setVillage] = useState('ભુજ ગ્રામીણ');
  const [specialization, setSpecialization] = useState('જનરલ મેડિસિન (General Medicine)');
  const [regNumber, setRegNumber] = useState('');
  const [adminPin, setAdminPin] = useState('');

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

    if (selectedRole === 'admin' && adminPin !== 'ADMIN2026' && adminPin !== '1234') {
      setErrorMessage('અમાન્ય એડમિન સિક્યુરિટી પિન. (Default Demo PIN: ADMIN2026)');
      setLoading(false);
      return;
    }

    const payload = {
      name,
      email,
      password,
      role: selectedRole,
      phone,
      age: Number(age),
      gender,
      village,
      specialization,
      regNumber: regNumber || `GMC-${Math.floor(1000 + Math.random() * 9000)}`,
      adminBadge: `DISTRICT-CHIEF-${Date.now().toString().slice(-4)}`
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
              background: '#00C48C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              {activeMode === 'login' ? <LogIn size={22} /> : <UserPlus size={22} />}
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#0A1128', fontSize: '18px', fontWeight: 800 }}>
                {activeMode === 'login' ? '🔐 સ્વાસ્થ્યસેતુ લૉગિન (User Login)' : '📝 નવું એકાઉન્ટ બનાવો (Sign Up)'}
              </h3>
              <p style={{ margin: '2px 0 0 0', color: '#64748B', fontSize: '12px', fontWeight: 600 }}>
                પેશન્ટ, ડૉક્ટર અને એડમિન માટે સુરક્ષિત સ્વાસ્થ્ય પોર્ટલ
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
          {/* Quick Demo 1-Click Launchers */}
          <div style={{
            background: '#F8FAFC',
            border: '1.5px dashed #00C48C',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Sparkles size={16} color="#00C48C" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                ⚡ ૧-ક્લિક ડેમો લૉગિન (Instant Test Logins)
              </span>
            </div>
            <div className="auth-demo-grid">
              <button
                type="button"
                onClick={() => handleQuickDemo('patient')}
                disabled={loading}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '12px',
                  padding: '8px 6px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ fontSize: '20px' }}>👨‍🦰</div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#065F46' }}>દર્દી (Patient)</div>
                <div style={{ fontSize: '9px', color: '#64748B' }}>રામજીભાઈ</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('doctor')}
                disabled={loading}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #BAE6FD',
                  borderRadius: '12px',
                  padding: '8px 6px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ fontSize: '20px' }}>👨‍⚕️</div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0369A1' }}>ડોક્ટર (Doctor)</div>
                <div style={{ fontSize: '9px', color: '#64748B' }}>Dr. રાજેશ મહેતા</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                disabled={loading}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #DDD6FE',
                  borderRadius: '12px',
                  padding: '8px 6px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ fontSize: '20px' }}>🛡️</div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#6D28D9' }}>એડમિન (Admin)</div>
                <div style={{ fontSize: '9px', color: '#64748B' }}>Chief Officer</div>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs (Login vs SignUp) */}
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => { setActiveMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '10px',
                background: activeMode === 'login' ? '#FFFFFF' : 'transparent',
                color: activeMode === 'login' ? '#00C48C' : '#64748B',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeMode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              🔑 લૉગિન (Login)
            </button>
            <button
              type="button"
              onClick={() => { setActiveMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '10px',
                background: activeMode === 'signup' ? '#FFFFFF' : 'transparent',
                color: activeMode === 'signup' ? '#00C48C' : '#64748B',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeMode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              📝 નવું રજીસ્ટ્રેશન (Sign Up)
            </button>
          </div>

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
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  સ્પેશ્યલાઇઝેશન (Medical Speciality)
                </label>
                <input
                  type="text"
                  placeholder="જનરલ મેડિસિન / કાર્ડિયોલોજી / આયુર્વેદ"
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
            )}

            {activeMode === 'signup' && selectedRole === 'admin' && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#7C3AED', marginBottom: '4px' }}>
                  એડમિન ઓથોરાઇઝેશન પિન (Admin PIN) * (Default: ADMIN2026)
                </label>
                <input
                  type="password"
                  placeholder="ADMIN2026"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #C4B5FD',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                />
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
                  <span>{selectedRole.toUpperCase()} તરીકે લૉગિન કરો</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>ખાતું બનાવો & શરુ કરો</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
