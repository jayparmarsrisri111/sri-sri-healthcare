import React, { useState } from 'react';
import { Landmark, DollarSign, CheckCircle2, Shield, Search, ExternalLink, HelpCircle, Award, Phone } from 'lucide-react';

const MEDICINES_DATA = [
  { generic: "Paracetamol 650 mg", disease: { en: "Fever & Body Pain", gu: "તાવ અને દુખાવો", hi: "बुखार और दर्द" }, branded: "Dolo 650", brandedPrice: 32.0, genericPrice: 6.5, savings: "80%" },
  { generic: "Amoxicillin + Clav 625 mg", disease: { en: "Chest / Pneumonia", gu: "ફેફસાં/ન્યુમોનિયા", hi: "फेफड़े/न्यूमोनिया" }, branded: "Augmentin 625", brandedPrice: 210.0, genericPrice: 55.0, savings: "74%" },
  { generic: "Metformin 500 mg (10 Tabs)", disease: { en: "Diabetes Control", gu: "ડાયાબિટીસ (Diabetes)", hi: "डायबिटीज नियंत्रण" }, branded: "Glycomet 500", brandedPrice: 45.0, genericPrice: 8.0, savings: "82%" },
  { generic: "Telmisartan 40 mg", disease: { en: "High BP (Hypertension)", gu: "હાઈ BP (Hypertension)", hi: "हाई ब्लड प्रेशर" }, branded: "Telma 40", brandedPrice: 95.0, genericPrice: 14.0, savings: "85%" },
  { generic: "Iron + Folic Acid (100 Tabs)", disease: { en: "Anemia (Iron Deficiency)", gu: "એનિમિયા (Anemia)", hi: "एनीमिया (खून की कमी)" }, branded: "Autrin", brandedPrice: 180.0, genericPrice: 25.0, savings: "86%" },
  { generic: "Pantoprazole 40 mg (10 Tabs)", disease: { en: "Acidity & Heartburn", gu: "એસિડિટી & બળતરા", hi: "एसिडिटी एवं सीने में जलन" }, branded: "Pan 40", brandedPrice: 155.0, genericPrice: 24.0, savings: "85%" },
  { generic: "Azithromycin 500 mg (3 Tabs)", disease: { en: "Throat & Chest Infection", gu: "ગળાનો ચેપ & કફ", hi: "गले का संक्रमण" }, branded: "Azee 500", brandedPrice: 120.0, genericPrice: 28.0, savings: "77%" },
  { generic: "Atorvastatin 10 mg (10 Tabs)", disease: { en: "High Cholesterol & Heart", gu: "હાઈ કોલેસ્ટ્રોલ & હૃદય", hi: "हाई कोलेस्ट्रॉल" }, branded: "Atorva 10", brandedPrice: 110.0, genericPrice: 15.0, savings: "86%" }
];

export const SchemesOptimizerTab = ({ currentLang = 'en' }) => {
  const [selectedMeds, setSelectedMeds] = useState([0, 1, 2, 5]);
  const [searchQuery, setSearchQuery] = useState('');
  const langKey = ['en', 'gu', 'hi', 'ku'].includes(currentLang) ? currentLang : 'en';

  // PM-JAY Eligibility Checker State
  const [rationCard, setRationCard] = useState('BPL'); // 'AAY', 'BPL', 'PHH', 'APL'
  const [annualIncome, setAnnualIncome] = useState('<1.5'); // '<1.5', '1.5-3', '>3'
  const [isRuralSECC, setIsRuralSECC] = useState(true);
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const toggleSelect = (index) => {
    if (selectedMeds.includes(index)) {
      setSelectedMeds(selectedMeds.filter((i) => i !== index));
    } else {
      setSelectedMeds([...selectedMeds, index]);
    }
  };

  const filteredMeds = MEDICINES_DATA.filter(m => 
    m.generic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.branded.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const brandedTotal = selectedMeds.reduce((acc, idx) => acc + (MEDICINES_DATA[idx]?.brandedPrice || 0), 0);
  const genericTotal = selectedMeds.reduce((acc, idx) => acc + (MEDICINES_DATA[idx]?.genericPrice || 0), 0);
  const totalSaved = brandedTotal - genericTotal;
  const savingsPct = brandedTotal > 0 ? Math.round((totalSaved / brandedTotal) * 100) : 0;

  // Real PM-JAY & MAA Card Eligibility Calculation
  const checkEligibility = () => {
    let eligible = false;
    let schemeName = "આયુષ્માન ભારત (PM-JAY) & મા અમૃતમ (MAA Card)";
    let details = "";

    if (rationCard === 'AAY' || rationCard === 'BPL') {
      eligible = true;
      details = langKey === 'gu'
        ? "તમે ૧૦૦% પાત્ર છો! તમારું કુટુંબ અંત્યોદય (AAY) અથવા BPL કેટેગરીમાં હોવાથી વાર્ષિક ₹૧૦ લાખ સુધીની સંપૂર્ણ મફત કેશલેસ હોસ્પિટલ સારવાર માટે માન્ય છે."
        : "You are 100% ELIGIBLE! As an Antyodaya (AAY) or BPL ration card holder, your family qualifies for up to ₹10 Lakh free hospital treatment annually.";
    } else if (annualIncome === '<1.5' || isRuralSECC) {
      eligible = true;
      details = langKey === 'gu'
        ? "તમે પાત્ર છો! વાર્ષિક આવક ₹૪ લાખથી ઓછી હોવાથી અને ગ્રામીણ SECC હેઠળ આવતા હોવાથી ગુજરાત સરકારના PM-JAY / MAA કાર્ડ હેઠળ ₹૧૦ લાખ કવરેજ મળશે."
        : "You are ELIGIBLE! Families with annual income below threshold qualify under PM-JAY / State MAA Card scheme.";
    } else {
      eligible = false;
      details = langKey === 'gu'
        ? "તમારું રેશનકાર્ડ APL છે અને આવક મર્યાદા વધારે છે. તેમ છતાં સરકારી જન ઔષધિ કેન્દ્ર પર ૮૫% સસ્તી દવાઓ અને સરકારી સિવિલ હોસ્પિટલમાં મફત તપાસનો લાભ કોઈપણ આવક મર્યાદા વગર મળે છે."
        : "Standard PM-JAY cashless card may require income certification, but you are 100% eligible for Jan Aushadhi 85% generic discounts!";
    }

    setEligibilityResult({
      eligible,
      schemeName,
      details
    });
  };

  return (
    <div>
      <div className="medical-card">
        {/* Top Title */}
        <h3 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0A1128', fontSize: '18px', fontWeight: 800 }}>
          <Landmark color="#00C48C" size={24} />
          {langKey === 'gu' ? '🏛️ આયુષ્માન ભારત (PM-JAY) & જન ઔષધિ કેન્દ્ર પ્રાઇસ ઓપ્ટિમાઇઝર' :
           '🏛️ Ayushman Bharat (PM-JAY) & Jan Aushadhi Savings Calculator'}
        </h3>
        <p style={{ color: '#5A6A85', marginBottom: '18px', fontSize: '13.5px' }}>
          {langKey === 'gu' ? 'વાર્ષિક ₹૧૦ લાખની મફત સારવાર પાત્રતા ચકાસો અને દવાઓ પર ૮૫% સીધી બચત કરો:' :
           'Verify real PM-JAY ₹10 Lakh eligibility and calculate up to 85% generic medicine savings:'}
        </p>

        {/* SECTION 1: INTERACTIVE PM-JAY ELIGIBILITY CHECKER WIZARD */}
        <div style={{ background: '#F8FCF9', border: '1.5px solid #D3F2E3', borderRadius: '18px', padding: '20px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ margin: 0, color: '#009F70', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800 }}>
              <Shield size={20} />
              {langKey === 'gu' ? '🔍 PM-JAY ₹૧૦ લાખ આયુષ્માન કાર્ડ પાત્રતા કેલ્ક્યુલેટર' : 'PM-JAY ₹10 Lakh Cashless Eligibility Checker'}
            </h4>
            <span style={{ fontSize: '11.5px', color: '#5A6A85', fontWeight: 700 }}>
              National Health Authority (NHA) Guidelines
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#4A5568' }}>રેશનકાર્ડ પ્રકાર:</label>
              <select
                value={rationCard}
                onChange={(e) => setRationCard(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px' }}
              >
                <option value="AAY">અંત્યોદય અન્ન યોજના (AAY કાર્ડ)</option>
                <option value="BPL">ગરીબી રેખા નીચે (BPL રેશનકાર્ડ)</option>
                <option value="PHH">પ્રાથમિક કુટુંબ (NFSA / PHH)</option>
                <option value="APL">સામાન્ય (APL કાર્ડ)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#4A5568' }}>વાર્ષિક કુટુંબ આવક:</label>
              <select
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px' }}
              >
                <option value="<1.5">₹૧.૫ લાખથી ઓછી (Low Income)</option>
                <option value="1.5-3">₹૧.૫ થી ₹૩ લાખ વચ્ચે</option>
                <option value=">3">₹૩ લાખથી વધુ</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#4A5568' }}>SECC / ગ્રામીણ આવાસ:</label>
              <select
                value={isRuralSECC ? 'yes' : 'no'}
                onChange={(e) => setIsRuralSECC(e.target.value === 'yes')}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', marginTop: '4px' }}
              >
                <option value="yes">હા (કાચું મકાન / શ્રમજીવી / જમીનવિહોણા)</option>
                <option value="no">ના (સામાન્ય)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={checkEligibility}
                className="btn-primary"
                style={{ width: '100%', padding: '10px 16px', fontWeight: 800, fontSize: '13px', borderRadius: '10px' }}
              >
                ચકાસો (Verify)
              </button>
            </div>
          </div>

          {/* Eligibility Result Banner */}
          {eligibilityResult && (
            <div style={{
              background: eligibilityResult.eligible ? '#E0F8EE' : '#FFFBEB',
              border: `1.5px solid ${eligibilityResult.eligible ? '#00C48C' : '#F59E0B'}`,
              borderRadius: '14px',
              padding: '16px',
              animation: 'fadeIn 0.3s ease'
            }}>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800, color: eligibilityResult.eligible ? '#009F70' : '#D97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={18} />
                {eligibilityResult.eligible ? '🎉 ૧૦૦% આયુષ્માન કાર્ડ માટે પાત્ર (Eligible)!' : 'ℹ️ સામાન્ય પાત્રતા પરિણામ:'}
              </h5>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#0A1128', lineHeight: 1.5 }}>
                {eligibilityResult.details}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                <a
                  href="https://mera.pmjay.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '12.5px', color: '#00C48C', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  <ExternalLink size={14} /> અધિકૃત પોર્ટલ: mera.pmjay.gov.in
                </a>
                <a
                  href="tel:14555"
                  style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  <Phone size={14} /> હેલ્પલાઇન: 14555
                </a>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: GENERIC VS BRANDED MEDICINE COMPARISON */}
        <div className="grid-2">
          {/* Generic Meds Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ color: '#009F70', margin: 0, fontWeight: 800 }}>
                {langKey === 'gu' ? '💊 જેનેરિક વિરુદ્ધ બ્રાન્ડેડ દવાની સરખામણી:' : '💊 Generic vs Branded Price Comparison:'}
              </h4>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 દવા શોધો (Dolo, Augmentin, Pan 40, Metformin...)"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '13px', marginBottom: '10px' }}
            />

            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>{langKey === 'gu' ? 'પસંદ' : 'Select'}</th>
                    <th>{langKey === 'gu' ? 'જેનેરિક દવા' : 'Generic'}</th>
                    <th>{langKey === 'gu' ? 'બ્રાન્ડેડ' : 'Branded'}</th>
                    <th>{langKey === 'gu' ? 'જન ઔષધિ' : 'Generic'}</th>
                    <th>{langKey === 'gu' ? 'બચત %' : 'Save'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMeds.map((med, idx) => (
                    <tr key={idx} style={{ background: selectedMeds.includes(idx) ? '#F4FBF7' : 'transparent' }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedMeds.includes(idx)}
                          onChange={() => toggleSelect(idx)}
                          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                      </td>
                      <td>
                        <b>{med.generic}</b>
                        <div style={{ fontSize: '11px', color: '#5A6A85' }}>{med.disease[langKey] || med.disease['en']}</div>
                      </td>
                      <td style={{ color: '#EF4444' }}>₹{med.brandedPrice}</td>
                      <td style={{ color: '#009F70', fontWeight: 700 }}>₹{med.genericPrice}</td>
                      <td><span className="badge-pill badge-green">{med.savings}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Savings Summary Box */}
          <div>
            <div style={{ background: '#E0F8EE', border: '2px solid #00C48C', padding: '20px', borderRadius: '16px', marginBottom: '18px' }}>
              <h4 style={{ color: '#009F70', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: 800 }}>
                <DollarSign size={20} />
                {langKey === 'gu' ? `માસિક દવાની અંદાજિત બચત: ${savingsPct}%` : `Estimated Monthly Savings: ${savingsPct}%`}
              </h4>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                {langKey === 'gu' ? 'ખાનગી મેડિકલમાં બ્રાન્ડેડ ખર્ચ:' : 'Cost in Private Pharmacy (Branded):'} <b>₹{brandedTotal.toFixed(2)}</b>
              </p>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                {langKey === 'gu' ? 'જન ઔષધિ કેન્દ્ર પર ખર્ચ:' : 'Cost at Jan Aushadhi Kendra:'} <b style={{ color: '#009F70' }}>₹{genericTotal.toFixed(2)}</b>
              </p>
              <h3 style={{ color: '#009F70', marginTop: '10px', fontSize: '18px', fontWeight: 800 }}>
                {langKey === 'gu' ? `પરિવારની સીધી બચત: ₹${totalSaved.toFixed(2)}` : `Direct Family Savings: ₹${totalSaved.toFixed(2)}`}
              </h3>
            </div>

            {/* Scheme Cards */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #D3F2E3', borderRadius: '16px', padding: '18px' }}>
              <h4 style={{ color: '#009F70', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', fontWeight: 800 }}>
                <Shield size={20} />
                Ayushman Bharat (PM-JAY & MAA Card)
              </h4>
              <p style={{ fontSize: '13.5px', color: '#1B3B2B', margin: '6px 0', lineHeight: 1.5 }}>
                {langKey === 'gu' ? 'પરિવાર દીઠ વાર્ષિક ₹૧૦ લાખ સુધીની ૧૦૦% મફત કેશલેસ સરકારી અને ખાનગી હોસ્પિટલ સારવાર.' :
                 'Up to ₹10 Lakh per family per year in 100% cashless hospital treatment in empaneled hospitals.'}
              </p>
              <p style={{ fontSize: '13px', color: '#5A6A85', margin: '4px 0 0 0' }}>
                📞 Helpline: <b>14555 / 1800 233 1022</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
