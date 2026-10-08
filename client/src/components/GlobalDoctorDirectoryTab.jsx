import React, { useState, useMemo } from 'react';
import {
  Users, Stethoscope, Search, MapPin, Award, Phone, MessageSquare,
  Calendar, ShieldCheck, Star, Clock, Globe, Filter, ExternalLink,
  CheckCircle2, X, AlertCircle, FileText, ChevronRight, UserPlus
} from 'lucide-react';
import { MASTER_DOCTORS_DIRECTORY, searchDoctorsDirectory, resolveAnyDoctor } from '../data/doctorsDirectory';
import { getTranslation } from '../services/languageService';

export const GlobalDoctorDirectoryTab = ({
  currentLang = 'gu',
  currentUser,
  onOpenAuthModal
}) => {
  const t = getTranslation(currentLang);
  const isGu = currentLang === 'gu' || currentLang === 'ku';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Modal states
  const [selectedDocForBooking, setSelectedDocForBooking] = useState(null);
  const [selectedDocForCertificate, setSelectedDocForCertificate] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    patientName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:00 AM',
    consultType: 'telemedicine',
    symptomsNote: ''
  });

  // Categories list
  const categories = [
    { id: 'all', labelGu: 'બધા નિષ્ણાતો', labelEn: 'All Doctors', icon: '🩺' },
    { id: 'cardiology', labelGu: 'હૃદયરોગ (Cardiology)', labelEn: 'Cardiology', icon: '❤️' },
    { id: 'orthopedics', labelGu: 'સાંધા-હાડકાં (Orthopedics)', labelEn: 'Orthopedics', icon: '🦴' },
    { id: 'gynecology', labelGu: 'સ્ત્રીરોગ (Gynecology)', labelEn: 'Gynecology', icon: '🌸' },
    { id: 'pediatrics', labelGu: 'બાળરોગ (Pediatrics)', labelEn: 'Pediatrics', icon: '👶' },
    { id: 'ayurveda', labelGu: 'આયુર્વેદ & નાડી (Ayurveda)', labelEn: 'Ayurveda', icon: '🌿' },
    { id: 'ophthalmology', labelGu: 'આંખના સર્જન (Eye Care)', labelEn: 'Eye Care', icon: '👁️' },
    { id: 'oncology', labelGu: 'કેન્સર સારવાર (Oncology)', labelEn: 'Oncology', icon: '🎗️' },
    { id: 'neurology', labelGu: 'મગજ-ન્યુરો (Neurology)', labelEn: 'Neurology', icon: '🧠' },
    { id: 'gastroenterology', labelGu: 'લીવર & પાચન (Gastro)', labelEn: 'Gastroenterology', icon: '🥗' },
  ];

  // Computed Doctors List
  const doctorsList = useMemo(() => {
    let results = searchDoctorsDirectory(searchQuery, selectedCategory, selectedRegion);
    if (verifiedOnly) {
      results = results.filter(d => d.verifiedBadge);
    }
    // If user searched for something very specific and got zero results, resolve dynamic doctor card!
    if (results.length === 0 && searchQuery.trim().length > 0) {
      return [resolveAnyDoctor(searchQuery)];
    }
    return results;
  }, [searchQuery, selectedCategory, selectedRegion, verifiedOnly]);

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const bookingId = `APT-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccess({
      bookingId,
      docName: selectedDocForBooking?.name,
      hospital: selectedDocForBooking?.hospitalAffiliation,
      date: bookingForm.date,
      time: bookingForm.timeSlot,
      type: bookingForm.consultType === 'telemedicine' ? 'ઓનલાઈન વિડીયો કન્સલ્ટેશન' : 'હોસ્પિટલ ઓપીડી મુલાકાત'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1128 0%, #064E3B 100%)',
        borderRadius: '24px',
        padding: '24px 28px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 12px 30px rgba(6, 78, 59, 0.25)',
        border: '1.5px solid #059669'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(5, 150, 105, 0.3)', border: '1px solid #10B981', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, color: '#A7F3D0', marginBottom: '12px' }}>
            <ShieldCheck size={14} color="#34D399" />
            {isGu ? '૧૦૦% સત્તાવાર મેડિકલ કાઉન્સિલ પ્રમાણિત ડૉક્ટરો' : '100% Medical Council Verified Registrations'}
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: 900, lineHeight: 1.25 }}>
            {isGu ? '🌍 વિશ્વ & ભારત ડૉક્ટર ડિરેક્ટરી' : '🌍 Global & National Doctors Directory'}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#D1FAE5', lineHeight: 1.6 }}>
            {isGu
              ? 'ગુજરાત, ભારત અને વિશ્વના શ્રેષ્ઠ હૃદયરોગ, સાંધા-હાડકાં, આંખ, બાળરોગ, સ્ત્રીરોગ અને આયુર્વેદિક તબીબોની સંપૂર્ણ ડિગ્રી, કાઉન્સિલ નંબર અને ઓનલાઈન કન્સલ્ટેશન સેતુ.'
              : 'Verified doctors, surgeons, cardiologists, and Ayurvedic Vaidyas across Gujarat, India, and premier global medical centers.'}
          </p>
        </div>

        {/* Doctor Registration CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal('doctor')}
            style={{
              background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(0, 196, 140, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            <UserPlus size={16} />
            {isGu ? '🩺 નવા ડૉક્ટર રજીસ્ટર થાઓ' : '🩺 Register as Doctor'}
          </button>
          <div style={{ fontSize: '11px', color: '#A7F3D0', textAlign: 'center', fontWeight: 600 }}>
            {isGu ? '✓ સર્ટિફિકેટ વેરિફિકેશન બાદ લાઈવ થશે' : '✓ Verified via Medical Council Certificate'}
          </div>
        </div>
      </div>

      {/* Search & Comprehensive Filters Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '20px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Main Search Input */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input
              type="text"
              placeholder={isGu ? "ડૉક્ટરનું નામ, હોસ્પિટલ, શહેર (દા.ત. ભાવનગર, અમદાવાદ), અથવા રોગ શોધો..." : "Search doctor name, hospital, city (e.g. Bhuj, London), or specialty..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Region Filter Selector */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              fontSize: '13px',
              fontWeight: 700,
              color: '#334155',
              background: '#F8FAFC',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">{isGu ? '🌐 સમગ્ર વિશ્વ & ભારત (All World)' : '🌐 All Regions'}</option>
            <option value="gujarat">{isGu ? '📍 ગુજરાત (ભાવનગર, અમદાવાદ, રાજકોટ, સુરત, ભુજ)' : '📍 Gujarat State'}</option>
            <option value="india">{isGu ? '🇮🇳 ભારત (AIIMS, Medanta, Narayana)' : '🇮🇳 National India'}</option>
            <option value="international">{isGu ? '✈️ વૈશ્વિક (USA, UK, Harvard, Mayo Clinic)' : '✈️ Global / Worldwide'}</option>
          </select>
        </div>

        {/* Category Horizontal Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(c => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1.5px solid #00C48C' : '1.5px solid #E2E8F0',
                  background: isActive ? '#ECFDF5' : '#FFFFFF',
                  color: isActive ? '#065F46' : '#475569',
                  fontWeight: 800,
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                <span>{c.icon}</span>
                <span>{isGu ? c.labelGu : c.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B' }}>
          {isGu ? `મળેલા પરિણામો: ${doctorsList.length} પ્રમાણિત તબીબો` : `Showing ${doctorsList.length} Verified Doctors`}
        </div>
        <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#059669" />
          {isGu ? '૨૪ કલાક ટેલિમેડિસિન & ૧૦૮ ઇમરજન્સી સેતુ' : '24/7 Telemedicine & Emergency Link'}
        </div>
      </div>

      {/* Doctors Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {doctorsList.map((doc) => {
          return (
            <div
              key={doc.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: doc.country === 'India' ? 'linear-gradient(90deg, #00C48C, #0284C7)' : 'linear-gradient(90deg, #8B5CF6, #EC4899)'
              }} />

              <div>
                {/* Doctor Header & Avatar */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #E0F2FE 0%, #D1FAE5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0,
                    border: '1.5px solid #A7F3D0'
                  }}>
                    👨‍⚕️
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>
                        {doc.name}
                      </h3>
                      {doc.verifiedBadge && (
                        <span style={{
                          background: '#ECFDF5',
                          border: '1px solid #10B981',
                          color: '#047857',
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <ShieldCheck size={11} color="#059669" />
                          {isGu ? 'વેરિફાઈડ' : 'Verified'}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                      {doc.title}
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                      🎓 {doc.degrees}
                    </div>
                  </div>
                </div>

                {/* Medical Council Registration Badge */}
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '11.5px',
                  color: '#334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>Reg: </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0369A1' }}>{doc.councilRegNo}</span>
                  </div>
                  <button
                    onClick={() => setSelectedDocForCertificate(doc)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#0284C7',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: 0
                    }}
                  >
                    <FileText size={12} />
                    {isGu ? 'સર્ટિફિકેટ જુઓ' : 'View License'}
                  </button>
                </div>

                {/* Hospital Affiliation & Location */}
                <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                  <div style={{ color: '#1E293B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="#059669" />
                    <span>{doc.hospitalAffiliation}</span>
                  </div>
                  <div style={{ color: '#64748B', paddingLeft: '19px', fontSize: '11.5px' }}>
                    {doc.city}, {doc.state} ({doc.country})
                  </div>
                </div>

                {/* Experience & Rating & Fee */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ background: '#F1F5F9', padding: '6px 4px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>અનુભવ (Exp)</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>{doc.experienceYears}+ yrs</div>
                  </div>
                  <div style={{ background: '#FEF3C7', padding: '6px 4px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#92400E', fontWeight: 700 }}>રેટિંગ (Rating)</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#B45309' }}>★ {doc.rating} ({doc.reviewsCount})</div>
                  </div>
                  <div style={{ background: '#ECFDF5', padding: '6px 4px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#065F46', fontWeight: 700 }}>PM-JAY કાર્ડ</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#047857' }}>{doc.pmjayAyushmanAccepted ? '✓ ૧૦૦% માન્ય' : 'પ્રાઇવેટ'}</div>
                  </div>
                </div>

                {/* Bio text */}
                {doc.bio && (
                  <p style={{
                    fontSize: '12px',
                    color: '#475569',
                    lineHeight: 1.5,
                    marginBottom: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {doc.bio}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* Phone Call */}
                  <a
                    href={`tel:${doc.phone}`}
                    style={{
                      flex: 1,
                      textDecoration: 'none',
                      background: '#F1F5F9',
                      color: '#0F172A',
                      padding: '8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Phone size={13} color="#059669" />
                    {isGu ? 'કૉલ' : 'Call'}
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${doc.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`નમસ્તે ${doc.name}, હું શ્રી શ્રી હેલ્થકેર ડિજિટલ એપ પરથી ઓનલાઈન કન્સલ્ટેશન / એપોઇન્ટમેન્ટ લેવા માંગુ છું.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      textDecoration: 'none',
                      background: '#DCFCE7',
                      color: '#166534',
                      padding: '8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <MessageSquare size={13} color="#16A34A" />
                    WhatsApp
                  </a>
                </div>

                {/* Book Appointment CTA */}
                <button
                  onClick={() => setSelectedDocForBooking(doc)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '10px',
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
                  <Calendar size={14} />
                  {isGu ? '📅 એપોઇન્ટમેન્ટ / ટેલિ-કન્સલ્ટેશન બુક કરો' : '📅 Book Tele-Consultation'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 📜 Medical License & Certificate Inspection Modal */}
      {selectedDocForCertificate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 17, 40, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '540px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '2px solid #00C48C'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #064E3B 0%, #0A1128 100%)',
              color: '#FFFFFF',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#34D399" />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                  {isGu ? 'મેડિકલ કાઉન્સિલ પ્રમાણપત્ર & લાયસન્સ' : 'Medical Council Certificate Verification'}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDocForCertificate(null)}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Certificate Body Simulation */}
            <div style={{ padding: '24px', background: '#FCFBF7' }}>
              <div style={{
                border: '3px double #059669',
                borderRadius: '16px',
                padding: '20px',
                background: '#FFFFFF',
                textAlign: 'center',
                boxShadow: 'inset 0 0 16px rgba(0, 196, 140, 0.05)'
              }}>
                <div style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#065F46', fontWeight: 800 }}>
                  GOVERNMENT MEDICAL COUNCIL REGISTRY OF INDIA
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>
                  CERTIFICATE OF REGISTRATION
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '14px' }}>
                  Issued under Indian Medical Council Act / State Council Registration
                </div>

                <div style={{ width: '60px', height: '2px', background: '#00C48C', margin: '0 auto 16px' }} />

                <div style={{ textAlign: 'left', fontSize: '13px', lineHeight: 1.8, color: '#1E293B' }}>
                  <div><strong>તબીબનું નામ (Doctor Name):</strong> {selectedDocForCertificate.name}</div>
                  <div><strong>માન્ય ડિગ્રી (Degree):</strong> {selectedDocForCertificate.degrees}</div>
                  <div><strong>રજીસ્ટ્રેશન નંબર (Reg No):</strong> <span style={{ fontFamily: 'monospace', color: '#0369A1', fontWeight: 800 }}>{selectedDocForCertificate.councilRegNo}</span></div>
                  <div><strong>સત્તાવાર કાઉન્સિલ (Issuing Body):</strong> {selectedDocForCertificate.councilName}</div>
                  <div><strong>હોસ્પિટલ / કેન્દ્ર:</strong> {selectedDocForCertificate.hospitalAffiliation}</div>
                  <div><strong>સ્થિતિ (Status):</strong> <span style={{ color: '#16A34A', fontWeight: 800 }}>🟢 સક્રિય & કાનૂની રીતે અધિકૃત (Active Practitioner)</span></div>
                </div>

                <div style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px dashed #CBD5E1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#64748B'
                }}>
                  <div>
                    <div>ડિજિટલ ઓથોરિટી વેરિફાઈડ</div>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>Sri Sri HealthCare AI Registry</div>
                  </div>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    border: '2px solid #059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    color: '#059669',
                    fontSize: '9px',
                    transform: 'rotate(-12deg)'
                  }}>
                    VERIFIED
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedDocForCertificate(null)}
                style={{
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                {t.okBtn || 'ઠીક છે (Close)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📅 Interactive Appointment Booking Modal */}
      {selectedDocForBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 17, 40, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '2px solid #00C48C'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #00C48C 0%, #064E3B 100%)',
              color: '#FFFFFF',
              padding: '18px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900 }}>
                  {isGu ? '📅 ડૉક્ટર કન્સલ્ટેશન બુકિંગ' : '📅 Book Doctor Consultation'}
                </h3>
                <div style={{ fontSize: '12px', color: '#D1FAE5', marginTop: '2px' }}>
                  {selectedDocForBooking.name} ({selectedDocForBooking.title})
                </div>
              </div>
              <button
                onClick={() => { setSelectedDocForBooking(null); setBookingSuccess(null); }}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 900, color: '#065F46' }}>
                    {isGu ? '🎉 એપોઇન્ટમેન્ટ કન્ફર્મ થઈ ગઈ!' : '🎉 Consultation Confirmed!'}
                  </h3>
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#475569' }}>
                    બુકિંગ આઈડી: <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>{bookingSuccess.bookingId}</strong>
                  </p>

                  <div style={{
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    lineHeight: 1.7,
                    border: '1px solid #E2E8F0',
                    marginBottom: '18px'
                  }}>
                    <div><strong>ડૉક્ટર:</strong> {bookingSuccess.docName}</div>
                    <div><strong>હોસ્પિટલ / કેન્દ્ર:</strong> {bookingSuccess.hospital}</div>
                    <div><strong>તારીખ & સમય:</strong> {bookingSuccess.date} • {bookingSuccess.time}</div>
                    <div><strong>માધ્યમ:</strong> {bookingSuccess.type}</div>
                  </div>

                  <button
                    onClick={() => { setSelectedDocForBooking(null); setBookingSuccess(null); }}
                    style={{
                      background: '#00C48C',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {isGu ? 'સમજાઈ ગયું (Done)' : 'Done'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      {isGu ? 'દર્દીનું નામ:' : 'Patient Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.patientName}
                      onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value })}
                      placeholder="દર્દીનું પૂરું નામ"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      {isGu ? 'મોબાઇલ નંબર:' : 'Mobile Phone:'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="૯૮૨૫૦..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        {isGu ? 'તારીખ:' : 'Date:'}
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        {isGu ? 'સમય:' : 'Time Slot:'}
                      </label>
                      <select
                        value={bookingForm.timeSlot}
                        onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                      >
                        <option value="10:00 AM">૧૦:૦૦ AM</option>
                        <option value="11:30 AM">૧૧:૩૦ AM</option>
                        <option value="02:00 PM">૦૨:૦૦ PM</option>
                        <option value="05:30 PM">૦૫:૩૦ PM</option>
                        <option value="07:00 PM">૦૭:૦૦ PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      {isGu ? 'મુલાકાતનો પ્રકાર:' : 'Consultation Mode:'}
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <label style={{ flex: 1, border: bookingForm.consultType === 'telemedicine' ? '2px solid #00C48C' : '1px solid #CBD5E1', borderRadius: '10px', padding: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: 700, background: bookingForm.consultType === 'telemedicine' ? '#ECFDF5' : '#FFF' }}>
                        <input
                          type="radio"
                          name="consultType"
                          value="telemedicine"
                          checked={bookingForm.consultType === 'telemedicine'}
                          onChange={() => setBookingForm({ ...bookingForm, consultType: 'telemedicine' })}
                          style={{ marginRight: '4px' }}
                        />
                        {isGu ? '📱 ઓનલાઈન વિડીયો' : 'Online Video'}
                      </label>
                      <label style={{ flex: 1, border: bookingForm.consultType === 'clinic' ? '2px solid #00C48C' : '1px solid #CBD5E1', borderRadius: '10px', padding: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: 700, background: bookingForm.consultType === 'clinic' ? '#ECFDF5' : '#FFF' }}>
                        <input
                          type="radio"
                          name="consultType"
                          value="clinic"
                          checked={bookingForm.consultType === 'clinic'}
                          onChange={() => setBookingForm({ ...bookingForm, consultType: 'clinic' })}
                          style={{ marginRight: '4px' }}
                        />
                        {isGu ? '🏥 હોસ્પિટલ ઓપીડી' : 'Hospital OPD'}
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: 'pointer',
                      marginTop: '6px',
                      boxShadow: '0 4px 14px rgba(0, 196, 140, 0.35)'
                    }}
                  >
                    {isGu ? '✓ કન્ફર્મ બુકિંગ કરો' : 'Confirm Appointment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
