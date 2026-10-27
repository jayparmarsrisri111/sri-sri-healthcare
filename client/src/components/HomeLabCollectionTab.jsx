import React, { useState } from 'react';
import {
  Activity, TestTube, CheckCircle2, Clock, MapPin,
  PhoneCall, ShieldCheck, DollarSign, Calendar, User,
  FileText, Sparkles, AlertCircle, Share2, Printer,
  QrCode, X, Building
} from 'lucide-react';
import { getTranslation } from '../services/languageService';
import { patientStorageService } from '../services/patientStorageService';
import { OfficialMedicalStamp } from './OfficialMedicalStamp';

export const HomeLabCollectionTab = ({ currentLang = 'gu', currentUser }) => {
  const t = getTranslation(currentLang);
  const isGu = currentLang === 'gu' || currentLang === 'ku';
  const isEn = !isGu;
  const [selectedTests, setSelectedTests] = useState(['cbc']);
  const [patientName, setPatientName] = useState(currentUser?.name || 'રામજીભાઈ પટેલ');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '9876543210');
  const [patientAddress, setPatientAddress] = useState(currentUser?.village ? `${currentUser.village}, ${currentUser.district || 'કચ્છ'}` : 'મુ. પો. માધાપર, ભુજ ગ્રામીણ');
  const [preferredSlot, setPreferredSlot] = useState('morning'); // morning, afternoon, urgent
  const [isAyushmanHolder, setIsAyushmanHolder] = useState(true);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);

  const availableLabTests = [
    {
      id: 'cbc',
      nameGu: '🩸 CBC + પ્લેટલેટ્સ કાઉન્ટ (Dengue/Malaria)',
      nameEn: 'Complete Blood Count (CBC) & Platelets',
      desc: 'ડેન્ગ્યુ, મેલેરિયા, એનિમિયા અને શરીરમાં ચેપ (WBC) ની સચોટ તપાસ.',
      brandedPrice: 350,
      janAushadhiPrice: 60,
      turnaround: '૨ થી ૩ કલાક (Express)'
    },
    {
      id: 'sugar',
      nameGu: '🩺 બ્લડ સુગર ફાસ્ટિંગ & HbA1c (Diabetes Tracker)',
      nameEn: 'Fasting Blood Glucose + HbA1c 3-Month Average',
      desc: 'ડાયાબિટીસનું ૩ મહિનાનું ચોક્કસ સરેરાશ નિયંત્રણ અને ગ્લુકોઝ માપન.',
      brandedPrice: 600,
      janAushadhiPrice: 90,
      turnaround: '૪ કલાક'
    },
    {
      id: 'sickle',
      nameGu: '🧬 સીકલ સેલ & થેલેસેમિયા ટેસ્ટ (ગ્રામીણ & આદિવાસી)',
      nameEn: 'Sickle Cell Anemia & Thalassemia Electrophoresis',
      desc: 'વારસાગત રક્તકણ ખામીનું સરકારી વિનામૂલ્યે લેબોરેટરી સ્ક્રીનિંગ.',
      brandedPrice: 850,
      janAushadhiPrice: 0, // Free under Govt tribal mission
      turnaround: '૧૨ કલાક',
      freeBadge: 'PM-JAY ૧૦૦% મફત'
    },
    {
      id: 'lipid',
      nameGu: '🫀 લિપિડ પ્રોફાઇલ & કોલેસ્ટ્રોલ (Heart Risk Screen)',
      nameEn: 'Lipid Profile (HDL, LDL, Triglycerides)',
      desc: 'હૃદયરોગ અને ધમનીઓમાં બ્લોકેજ અટકાવવા માટે ચરબીનું માપન.',
      brandedPrice: 750,
      janAushadhiPrice: 110,
      turnaround: '૬ કલાક'
    },
    {
      id: 'kft_lft',
      nameGu: '🧪 કિડની & લીવર ફંક્શન ટેસ્ટ (KFT / LFT)',
      nameEn: 'Kidney & Liver Function Test (Creatinine, Urea, Bilirubin)',
      desc: 'કમળો, સોજા, પથરી કે યુરિક એસિડ માટે કિડની-લીવર તપાસ.',
      brandedPrice: 1100,
      janAushadhiPrice: 150,
      turnaround: '૬ કલાક'
    },
    {
      id: 'dengue_ns1',
      nameGu: '🦟 ડેન્ગ્યુ NS1 & ચિકનગુનિયા એન્ટિજેન (Rapid)',
      nameEn: 'Dengue NS1 Antigen & Chikungunya IgM Rapid Card',
      desc: 'તીવ્ર તાવ અને સાંધાના દુખાવામાં તાત્કાલિક ડેન્ગ્યુ વિષાણુ પરીક્ષણ.',
      brandedPrice: 900,
      janAushadhiPrice: 120,
      turnaround: '૧ કલાક (Emergency Express)'
    }
  ];

  const toggleTest = (id) => {
    if (selectedTests.includes(id)) {
      if (selectedTests.length === 1) return; // Keep at least one
      setSelectedTests(selectedTests.filter(t => t !== id));
    } else {
      setSelectedTests([...selectedTests, id]);
    }
  };

  const selectedTestObjects = availableLabTests.filter(t => selectedTests.includes(t.id));
  const totalBranded = selectedTestObjects.reduce((acc, t) => acc + t.brandedPrice, 0);
  const totalSubsidized = isAyushmanHolder
    ? 0
    : selectedTestObjects.reduce((acc, t) => acc + t.janAushadhiPrice, 0);

  const totalSavings = totalBranded - totalSubsidized;

  const handleBookTest = (e) => {
    e.preventDefault();
    const bookingId = `LAB-COL-${Date.now().toString(36).toUpperCase()}`;

    const newBooking = {
      bookingId,
      patientName,
      patientPhone,
      patientAddress,
      tests: selectedTestObjects.map(t => t.nameGu),
      slot: preferredSlot === 'morning' ? 'સવારે ૭:૩૦ થી ૯:૩૦ (નરણા કોઠે Fasting)' : (preferredSlot === 'afternoon' ? 'બપોરે ૧૨:૦૦ થી ૨:૦૦' : '🚨 ૧ કલાકમાં ઈમરજન્સી વિઝિટ'),
      totalAmount: totalSubsidized,
      savings: totalSavings,
      status: 'CONFIRMED',
      phlebotomist: 'રાજેશભાઈ પરમાર (DMLT Govt Certified Tech)',
      phlebotomistPhone: '9428011223',
      estimatedArrival: preferredSlot === 'urgent' ? '૨૫ થી ૩૫ મિનિટ' : 'આવતીકાલે સવારે ૮:૦૦ વાગ્યે',
      bookedAt: new Date().toISOString()
    };

    setConfirmedBooking(newBooking);

    // Save to Patient EHR
    patientStorageService.saveRecord({
      patientName,
      age: currentUser?.age || 45,
      type: 'Home Lab Test Sample Collection',
      symptoms: `લેબ ટેસ્ટ બુકિંગ: ${selectedTestObjects.map(t => t.nameEn).join(', ')}`,
      urgency: preferredSlot === 'urgent' ? 'YELLOW' : 'GREEN',
      diagnosis: `ઘરે બેઠા રક્ત નમૂનો (Phygital Lab Collection - ID: ${bookingId})`,
      details: {
        tests: selectedTestObjects.map(t => t.nameGu).join(' | '),
        amount: isAyushmanHolder ? 'PM-JAY ૧૦૦% વિનામૂલ્યે (Free)' : `₹${totalSubsidized}`,
        savings: `₹${totalSavings} ની સરકારી બચત`
      }
    });

    setToastMessage(`🎉 અભિનંદન! બ્લડ ટેસ્ટ કલેક્શન બુક થયું (ID: ${bookingId}). ટેકનિશિયન તમને થોડીવારમાં સંપર્ક કરશે.`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  // Clean lab title to prevent duplicate emojis beside the dedicated icon container
  const rawLabTitle = t.homeLabTitle || 'ઘરે બેઠા લેબ બ્લડ સેમ્પલ કલેક્શન (Phygital Lab Diagnostics)';
  const cleanLabTitle = rawLabTitle.replace(/^[\p{Emoji}\s]+/u, '').trim() || 'ઘરે બેઠા લેબ બ્લડ સેમ્પલ કલેક્શન (Phygital Lab Diagnostics)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner - Fully Responsive with Single Icon */}
      <div className="home-lab-hero-card" style={{
        background: 'linear-gradient(135deg, #0A1128 0%, #0369A1 100%)',
        borderRadius: '22px',
        padding: '20px 24px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 10px 30px rgba(3, 105, 161, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 320px', minWidth: 0 }}>
          <div style={{
            width: '52px',
            height: '52px',
            minWidth: '52px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            flexShrink: 0
          }}>
            🧪
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(17px, 3.5vw, 22px)', fontWeight: 800, wordBreak: 'break-word' }}>
                {cleanLabTitle}
              </h2>
              <span style={{
                background: '#00C48C',
                color: '#0A1128',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: '8px',
                whiteSpace: 'nowrap'
              }}>
                {isEn ? 'Advantage #1' : 'એડવાન્ટેજ #1'}
              </span>
            </div>
            <p style={{ margin: '6px 0 0 0', color: '#BAE6FD', fontSize: '13.5px', lineHeight: 1.4 }}>
              {t.homeLabSub || 'ગામડે બેઠા લેબોરેટરી ટેસ્ટ: સરકારી ટેકનિશિયન ઘરે આવીને લોહીના નમૂના લેશે અને ૨ કલાકમાં ડિજિટલ રિપોર્ટ મળશે.'}
            </p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          padding: '10px 18px',
          borderRadius: '14px',
          textAlign: 'right',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '11px', color: '#E0F2FE', display: 'block' }}>જન ઔષધિ સબસિડી</span>
          <strong style={{ fontSize: '18px', color: '#38BDF8' }}>૮૫% સુધી બચત</strong>
        </div>
      </div>

      {toastMessage && (
        <div style={{
          background: '#ECFDF5',
          border: '1.5px solid #10B981',
          color: '#065F46',
          padding: '12px 18px',
          borderRadius: '14px',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
        }}>
          <CheckCircle2 size={20} color="#059669" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Test Selection | Right Booking Form */}
      <div className="lab-main-grid">
        {/* Left Column: Select Lab Tests */}
        <div className="medical-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0A1128', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TestTube size={20} color="#0284C7" />
              <span>જરૂરી લેબોરેટરી ટેસ્ટ પસંદ કરો ({selectedTests.length} પસંદ કરેલ):</span>
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>NABL પ્રમાણિત લેબ</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {availableLabTests.map(test => {
              const isSelected = selectedTests.includes(test.id);
              return (
                <div
                  key={test.id}
                  onClick={() => toggleTest(test.id)}
                  style={{
                    background: isSelected ? '#F0F9FF' : '#FFFFFF',
                    border: `1.5px solid ${isSelected ? '#0284C7' : '#E2E8F0'}`,
                    borderRadius: '14px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#0284C7' }}
                      />
                      <div>
                        <strong style={{ fontSize: '14.5px', color: '#0F172A', display: 'block' }}>
                          {isEn ? test.nameEn : test.nameGu}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>{isEn ? test.nameGu : test.nameEn}</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#475569' }}>
                          {test.desc}
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '12px' }}>
                          ₹{test.brandedPrice}
                        </span>
                        <strong style={{ fontSize: '15px', color: test.janAushadhiPrice === 0 ? '#10B981' : '#0284C7' }}>
                          {test.janAushadhiPrice === 0 ? '૧૦૦% મફત' : `₹${test.janAushadhiPrice}`}
                        </strong>
                      </div>
                      <span style={{ fontSize: '10.5px', color: '#10B981', fontWeight: 700, display: 'block' }}>
                        ⏱️ રિપોર્ટ: {test.turnaround}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Home Pickup Booking Form */}
        <div className="medical-card">
          <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 800, color: '#0A1128', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#00C48C" />
            <span>ઘરેથી સેમ્પલ કલેક્શન બુકિંગ ફોર્મ</span>
          </h3>

          <form onSubmit={handleBookTest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                દર્દીનું નામ (Patient Name)
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                મોબાઈલ નંબર (WhatsApp Report)
              </label>
              <input
                type="text"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                required
                style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                ઘરનું સરનામું / ગામ (Village & Address)
              </label>
              <input
                type="text"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                required
                style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                સમય પસંદગી (Time Slot)
              </label>
              <select
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
              >
                <option value="morning">🌅 સવારે ૭:૩૦ થી ૯:૩૦ (નરણા કોઠે - Fasting Blood)</option>
                <option value="afternoon">☀️ બપોરે ૧૨:૦૦ થી ૨:૦૦</option>
                <option value="urgent">🚨 તાત્કાલિક ૩૦ મિનિટમાં (Emergency Fevers)</option>
              </select>
            </div>

            {/* PM-JAY Ayushman Card Scheme Toggle */}
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#16A34A" />
                <div>
                  <strong style={{ fontSize: '12.5px', color: '#166534', display: 'block' }}>
                    {t.ayushmanFreeToggle || 'આયુષ્માન ભારત (PM-JAY) કાર્ડ છે?'}
                  </strong>
                  <span style={{ fontSize: '10.5px', color: '#15803D' }}>{isEn ? '100% Free with Govt card' : 'સરકારી કાર્ડ હોય તો ૧૦૦% મફત'}</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAyushmanHolder}
                onChange={(e) => setIsAyushmanHolder(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#16A34A' }}
              />
            </div>

            {/* Price Breakdown Card */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '12.5px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>{isEn ? 'Private Lab Market Price:' : 'સામાન્ય પ્રાઇવેટ લેબ ફી:'}</span>
                <span style={{ textDecoration: 'line-through' }}>₹{totalBranded}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 800 }}>
                <span>{isEn ? 'Jan Aushadhi Subsidy Savings:' : 'જન ઔષધિ સબસિડી બચત:'}</span>
                <span>- ₹{totalSavings}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px solid #E2E8F0',
                fontSize: '14px',
                fontWeight: 800,
                color: '#0F172A'
              }}>
                <span>{t.totalCostLabel || 'કુલ ચૂકવવાપાત્ર રકમ:'}</span>
                <span style={{ color: totalSubsidized === 0 ? '#10B981' : '#0284C7' }}>
                  {totalSubsidized === 0 ? (isEn ? '₹0 (100% Free)' : '₹૦ (PM-JAY ૧૦૦% મફત)') : `₹${totalSubsidized}`}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 800 }}
            >
              🚀 {t.bookNowBtn || 'સેમ્પલ કલેક્શન કન્ફર્મ કરો'}
            </button>
          </form>

          {/* Confirmed Booking Voucher Card */}
          {confirmedBooking && (
            <div style={{
              marginTop: '16px',
              background: '#F0FDF4',
              border: '1.5px solid #22C55E',
              borderRadius: '14px',
              padding: '14px',
              animation: 'slideUpFade 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D', fontWeight: 800, marginBottom: '8px' }}>
                <CheckCircle2 size={18} />
                <span>બુકિંગ માન્ય થયું (ID: {confirmedBooking.bookingId})</span>
              </div>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#166534' }}>
                <b>લેબ ટેકનિશિયન:</b> {confirmedBooking.phlebotomist} ({confirmedBooking.phlebotomistPhone})
              </p>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#166534' }}>
                <b>અંદાજિત આગમન:</b> {confirmedBooking.estimatedArrival}
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowBillModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#0A1128',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(10, 17, 40, 0.25)'
                  }}
                >
                  <Printer size={15} />
                  <span>🖨️ સત્તાવાર લેબ બિલ & રસીદ પ્રિન્ટ કરો</span>
                </button>

                <a
                  href={`https://wa.me/91${confirmedBooking.phlebotomistPhone}?text=${encodeURIComponent(`હેલો, લેબ બુકિંગ ID ${confirmedBooking.bookingId} માટે દર્દી ${confirmedBooking.patientName}, સ્થળ: ${confirmedBooking.patientAddress}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#22C55E',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 800
                  }}
                >
                  <span>💬 WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Diagnostic Lab Bill & Receipt Modal */}
      {showBillModal && confirmedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(10, 17, 40, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
            border: '2px solid #00C48C',
            position: 'relative'
          }}>
            {/* Modal Actions Bar (hidden when printing) */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              background: '#0A1128',
              color: '#FFFFFF',
              borderTopLeftRadius: '18px',
              borderTopRightRadius: '18px'
            }} className="no-print">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800 }}>
                <Printer size={16} color="#00C48C" />
                <span>સત્તાવાર પેથોલોજી લેબ બિલ & રસીદ વાઉચર (Official Lab Invoice)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: '#00C48C',
                    color: '#0A1128',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Printer size={14} /> પ્રિન્ટ / PDF
                </button>
                <button
                  onClick={() => setShowBillModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Bill Paper Content */}
            <div id="lab-bill-paper" className="printable-certificate" style={{ padding: '24px 28px' }}>
              {/* Lab Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '2.5px solid #0A1128',
                paddingBottom: '16px',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF'
                    }}>
                      <TestTube size={22} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0A1128' }}>
                        SRI SRI HEALTHCARE CENTRAL PATHOLOGY LAB
                      </h3>
                      <div style={{ fontSize: '11px', color: '#009F70', fontWeight: 800 }}>
                        NABL & ICMR RECOGNIZED CLINICAL DIAGNOSTIC CENTER • ISO 15189:2022
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', lineHeight: 1.4 }}>
                    સરકારી સિવિલ હોસ્પિટલ રોડ, મુખ્ય ડાયગ્નોસ્ટિક ભવન, ગુજરાત • હેલ્પલાઇન: 02832-250108 / 108
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '170px' }}>
                  <div style={{
                    background: '#F1F5F9',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    textAlign: 'right'
                  }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>INVOICE / BILL NO:</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#0A1128' }}>
                      INV-LAB-{confirmedBooking.bookingId}
                    </div>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '4px' }}>
                    તારીખ: {new Date().toLocaleDateString('gu-IN')} | સમય: {new Date().toLocaleTimeString('gu-IN')}
                  </div>
                </div>
              </div>

              {/* Patient & Booking Details Box */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px',
                fontSize: '12px'
              }}>
                <div>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>દર્દીનું નામ:</span>{' '}
                  <strong style={{ color: '#0F172A', fontSize: '13px' }}>{confirmedBooking.patientName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>સંપર્ક નંબર:</span>{' '}
                  <strong style={{ color: '#0F172A' }}>+91 {confirmedBooking.patientPhone}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>સેમ્પલ કલેક્શન સ્લોટ:</span>{' '}
                  <strong style={{ color: '#009F70' }}>{confirmedBooking.slot}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>નમૂનો લેનાર ટેકનિશિયન:</span>{' '}
                  <strong style={{ color: '#0F172A' }}>{confirmedBooking.phlebotomist}</strong>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>સેમ્પલ કલેક્શન સરનામું:</span>{' '}
                  <strong style={{ color: '#0F172A' }}>{confirmedBooking.patientAddress}</strong>
                </div>
              </div>

              {/* Itemized Tests Billing Table */}
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '16px',
                fontSize: '12.5px'
              }}>
                <thead>
                  <tr style={{ background: '#0A1128', color: '#FFFFFF' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', borderRadius: '6px 0 0 6px', width: '40px' }}>ક્રમ</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>પેથોલોજી ટેસ્ટનું નામ (Investigation)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>પ્રાઇવેટ લેબ દર</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>ચૂકવવાપાત્ર સરકારી દર</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTestObjects.map((test, idx) => (
                    <tr key={test.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '10px 10px', color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 10px' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>{test.nameGu}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{test.nameEn}</div>
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{test.brandedPrice}
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>
                        {isAyushmanHolder ? '₹૦ (PM-JAY Free)' : `₹${test.janAushadhiPrice}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Billing Summary Box */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderTop: '2px solid #0A1128',
                paddingTop: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ maxWidth: '340px' }}>
                  <div style={{
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '11.5px',
                    color: '#065F46',
                    fontWeight: 700
                  }}>
                    🎉 સરકારી સબસિડી / PM-JAY બચત: <strong>₹{confirmedBooking.savings} ની સીધી બચત</strong>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '6px' }}>
                    * આ રસીદ અધિકૃત ડાયગ્નોસ્ટિક બિલ તરીકે માન્ય છે અને મેડિકલેમ / સરકારી રી-ઇમ્બર્સમેન્ટ માટે ઉપયોગ કરી શકાય છે.
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '200px' }}>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    કુલ માર્કેટ કિંમત: <span style={{ textDecoration: 'line-through' }}>₹{totalBranded}</span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#059669', margin: '4px 0' }}>
                    ચૂકવેલ રકમ: {confirmedBooking.totalAmount === 0 ? '₹૦ (PM-JAY ૧૦૦% મફત)' : `₹${confirmedBooking.totalAmount}`}
                  </div>
                  <span style={{
                    background: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                    ✅ પેમેન્ટ માન્ય / રસીદ જનરેટ
                  </span>
                </div>
              </div>

              {/* Official Seal, QR Verification & Pathologist Signature */}
              <div style={{
                borderTop: '1.5px dashed #CBD5E1',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                {/* QR Code */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#0A1128',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <QrCode size={44} color="#00C48C" />
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', maxWidth: '170px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>NABL લેબ વેરિફિકેશન QR</div>
                    <div>આ બિલ NABL સેન્ટ્રલ સર્વર પર ડિજિટલી નોંધાયેલું અને અધિકૃત છે.</div>
                  </div>
                </div>

                {/* Real Circular Medical Council Stamp (સત્તાવાર સરકારી સિક્કો) */}
                <OfficialMedicalStamp
                  size={105}
                  regNumber="GMC-GUJ-2016-48291"
                  doctorName="Dr. Jay Parmar"
                  council="GUJARAT MEDICAL COUNCIL"
                  color="#1D4ED8"
                  rotation={-8}
                />

                {/* Pathologist Signature of Dr. Jay Parmar */}
                <div style={{ textAlign: 'right', minWidth: '200px' }}>
                  <div style={{
                    fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
                    fontSize: '30px',
                    color: '#0284C7',
                    fontWeight: 700,
                    transform: 'rotate(-3deg)',
                    lineHeight: 1,
                    marginBottom: '4px',
                    textDecoration: 'underline'
                  }}>
                    Dr. Jay Parmar
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A' }}>
                    Dr. Jay Parmar, M.D. (Pathology)
                  </div>
                  <div style={{ fontSize: '11px', color: '#009F70', fontWeight: 800 }}>
                    GMC Reg: GMC-GUJ-2016-48291
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    મુખ્ય લેબોરેટરી કન્સલ્ટન્ટ & પેથોલોજિસ્ટ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
