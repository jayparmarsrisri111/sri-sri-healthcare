import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Navigation, Phone, DollarSign, ShieldCheck, CheckCircle2,
  Clock, AlertTriangle, Sparkles, Mic, Camera, Upload, X, RefreshCw, Compass,
  TrendingDown, ArrowRight, Share2, Award, ExternalLink, MessageCircle, HeartHandshake,
  Check, Store, Building2, Layers, Zap, Info, ShoppingCart, Truck, CreditCard,
  QrCode, FileText, ChevronRight, Eye, AlertCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import Tesseract from 'tesseract.js';

export const LiveMedicineLocatorTab = ({ currentLang = 'gu', initialMedicine = '' }) => {
  const [medicineQuery, setMedicineQuery] = useState(initialMedicine || 'Dolo 650');
  const [locationCity, setLocationCity] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [detectedLocationName, setDetectedLocationName] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Results State
  const [matchedMedicine, setMatchedMedicine] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [competitorComparison, setCompetitorComparison] = useState(null);
  const [activeSort, setActiveSort] = useState('best_value'); // 'best_value' | 'cheapest' | 'nearest' | 'rating'
  const [activeFilter, setActiveFilter] = useState('all');   // 'all' | 'jan_aushadhi' | '24x7' | 'in_stock'
  const [showAdvantageModal, setShowAdvantageModal] = useState(false);
  const [selectedPharmacyDetails, setSelectedPharmacyDetails] = useState(null);

  // Online Buy / Order Modal State
  const [orderModalPharmacy, setOrderModalPharmacy] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderDeliveryType, setOrderDeliveryType] = useState('express_delivery'); // 'express_delivery' | 'self_pickup'
  const [orderPaymentMethod, setOrderPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'ayushman_free'
  const [orderPatientName, setOrderPatientName] = useState('');
  const [orderPatientPhone, setOrderPatientPhone] = useState('');
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState('');
  const [orderHasPrescription, setOrderHasPrescription] = useState(true);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Live GPS Route Tracker Simulation Modal
  const [liveRoutePharmacy, setLiveRoutePharmacy] = useState(null);
  const [routeProgressKm, setRouteProgressKm] = useState(0);

  // Voice & OCR state
  const [isListening, setIsListening] = useState(false);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const fileInputRef = useRef(null);
  const prescriptionUploadRef = useRef(null);

  const langKey = ['en', 'gu', 'hi', 'ku'].includes(currentLang) ? currentLang : 'gu';
  const isGu = langKey === 'gu' || langKey === 'ku';

  // Quick Medicine Tags
  const POPULAR_MEDICINES = [
    { label: '💊 Dolo 650 (તાવ/દુખાવો)', query: 'Dolo 650' },
    { label: '🔥 Pan 40 (એસિડિટી)', query: 'Pan 40' },
    { label: '🦠 Augmentin 625 (એન્ટિબાયોટિક)', query: 'Augmentin 625' },
    { label: '🌬️ Montair-LC (શ્વાસ/દમ)', query: 'Montair-LC' },
    { label: '🩸 Telma 40 (હાઈ બીપી)', query: 'Telma 40' },
    { label: '🍬 Glycomet 500 (ડાયાબિટીસ)', query: 'Glycomet 500' },
    { label: '🦴 Shelcal 500 (કેલ્શિયમ)', query: 'Shelcal 500' },
    { label: '🌿 Liv 52 (લીવર/કમળો)', query: 'Liv 52' },
    { label: '💊 Combiflam (સાંધા/કમર)', query: 'Combiflam' },
    { label: '🦠 Azithromycin (ગળાનો ચેપ)', query: 'Azithromycin' },
    { label: '⚡ Zerodol-P (વા/સોજો)', query: 'Zerodol-P' },
    { label: '🩸 Drotaverine (પથરી)', query: 'Drotaverine' },
    { label: '🌸 Cetirizine (એલર્જી/છીંકો)', query: 'Cetirizine' },
    { label: '🦋 Thyronorm (થાઇરોઇડ)', query: 'Thyronorm' },
    { label: '🛡️ Becosules (વિટામિન/ચાંદા)', query: 'Becosules' },
    { label: '🧃 Electral ORS (અશક્તિ)', query: 'Electral' }
  ];

  // Quick City Suggestions
  const POPULAR_CITIES = [
    { label: isGu ? '📍 ભાવનગર' : '📍 Bhavnagar', query: 'Bhavnagar' },
    { label: isGu ? '📍 અમદાવાદ' : '📍 Ahmedabad', query: 'Ahmedabad' },
    { label: isGu ? '📍 રાજકોટ' : '📍 Rajkot', query: 'Rajkot' },
    { label: isGu ? '📍 સુરત' : '📍 Surat', query: 'Surat' },
    { label: isGu ? '📍 વડોદરા' : '📍 Vadodara', query: 'Vadodara' },
    { label: isGu ? '📍 ભુજ (કચ્છ)' : '📍 Bhuj (Kutch)', query: 'Bhuj' },
    { label: isGu ? '📍 અંજાર' : '📍 Anjar', query: 'Anjar' },
    { label: isGu ? '📍 ખેડોઈ ગામ' : '📍 Khedoi Village', query: 'Khedoi' },
    { label: isGu ? '📍 કોટા' : '📍 Kota', query: 'Kota' },
    { label: isGu ? '📍 જયપુર' : '📍 Jaipur', query: 'Jaipur' },
    { label: isGu ? '📍 મુંબઈ' : '📍 Mumbai', query: 'Mumbai' },
    { label: isGu ? '📍 દિલ્હી' : '📍 Delhi', query: 'Delhi' }
  ];

  // Fetch / Locate Medicines & Pharmacies
  const handleLocateMedicine = async ({
    med = medicineQuery,
    city = locationCity,
    coords = userCoords,
    sort = activeSort,
    filt = activeFilter
  } = {}) => {
    setLoading(true);
    try {
      const res = await apiService.locateMedicine({
        medicineName: med.trim() || 'Dolo 650',
        city: city.trim(),
        lat: coords?.lat || null,
        lng: coords?.lng || null,
        sortBy: sort,
        filter: filt
      });

      if (res && res.success) {
        setMatchedMedicine(res.searched_medicine);
        setPharmacies(res.data || []);
        if (res.detected_location) {
          setDetectedLocationName(res.detected_location);
        }
        if (res.competitor_comparison) {
          setCompetitorComparison(res.competitor_comparison);
        }
      }
    } catch (err) {
      console.error('Locate medicine error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleLocateMedicine({ med: initialMedicine || 'Dolo 650' });
  }, []);

  // Update on initialMedicine prop change
  useEffect(() => {
    if (initialMedicine && initialMedicine !== medicineQuery) {
      setMedicineQuery(initialMedicine);
      handleLocateMedicine({ med: initialMedicine });
    }
  }, [initialMedicine]);

  // 1-Click Auto GPS Location Trigger
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert(isGu ? "તમારા બ્રાઉઝરમાં GPS લોકેશન સપોર્ટ નથી." : "Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setIsLocating(false);
        handleLocateMedicine({ coords, city: '' });
      },
      (err) => {
        console.warn('GPS error:', err);
        setIsLocating(false);
        alert(isGu ? "GPS લોકેશન મેળવી શકાયું નથી. કૃપા કરીને શહેરનું નામ લખો." : "Unable to retrieve GPS. Please type your city.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Voice Mic Search (Speech Recognition)
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isGu ? "તમારા બ્રાઉઝરમાં સ્પીચ રેકગ્નિશન સપોર્ટ નથી." : "Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = isGu ? 'gu-IN' : (langKey === 'hi' ? 'hi-IN' : 'en-IN');
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setMedicineQuery(transcript);
        handleLocateMedicine({ med: transcript });
      }
    };

    recognition.start();
  };

  // Prescription Photo OCR Scan
  const handleOcrFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrScanning(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      let detectedName = 'Paracetamol';

      for (const line of lines) {
        const lLow = line.toLowerCase();
        if (lLow.includes('dolo') || lLow.includes('paracetamol') || lLow.includes('calpol')) { detectedName = 'Dolo 650'; break; }
        if (lLow.includes('pan') || lLow.includes('pantoprazole') || lLow.includes('omez')) { detectedName = 'Pan 40'; break; }
        if (lLow.includes('augmentin') || lLow.includes('amoxicillin')) { detectedName = 'Augmentin 625'; break; }
        if (lLow.includes('azee') || lLow.includes('azithromycin')) { detectedName = 'Azithromycin 500'; break; }
        if (lLow.includes('combiflam') || lLow.includes('ibuprofen')) { detectedName = 'Combiflam'; break; }
        if (lLow.includes('telma') || lLow.includes('telmisartan')) { detectedName = 'Telma 40'; break; }
        if (lLow.includes('glycomet') || lLow.includes('metformin')) { detectedName = 'Glycomet 500'; break; }
        if (lLow.includes('shelcal') || lLow.includes('calcium')) { detectedName = 'Shelcal 500'; break; }
      }

      if (lines.length > 0 && detectedName === 'Paracetamol') {
        detectedName = lines[0].replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Dolo 650';
      }

      setMedicineQuery(detectedName);
      handleLocateMedicine({ med: detectedName });
    } catch (err) {
      console.warn('OCR error:', err);
      alert(isGu ? "ફોટો સ્કેન કરવામાં ક્ષતિ આવી. કૃપા કરીને નામ ટાઈપ કરો." : "OCR scan error. Please type medicine name.");
    } finally {
      setIsOcrScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Open Online Buy / Express Order Modal
  const handleOpenBuyModal = (ph) => {
    setOrderModalPharmacy(ph);
    setOrderQuantity(1);
    setOrderDeliveryType('express_delivery');
    setOrderPaymentMethod('cod');
    setCompletedOrder(null);
  };

  // Submit Online Order
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!orderPatientName.trim() || !orderPatientPhone.trim()) {
      alert(isGu ? "કૃપા કરીને તમારું નામ અને મોબાઈલ નંબર દાખલ કરો." : "Please enter your name and phone number.");
      return;
    }
    if (orderDeliveryType === 'express_delivery' && !orderDeliveryAddress.trim()) {
      alert(isGu ? "કૃપા કરીને હોમ ડિલિવરી માટે તમારું સરનામું લખો." : "Please enter delivery address.");
      return;
    }

    setOrderSubmitting(true);
    try {
      const payload = {
        medicine_name: matchedMedicine?.brandName || medicineQuery,
        generic_salt: matchedMedicine?.genericSalt || '',
        pharmacy_id: orderModalPharmacy?.id,
        pharmacy_name: isGu ? orderModalPharmacy?.name_gu : orderModalPharmacy?.name_en,
        quantity: orderQuantity,
        unit_price: orderModalPharmacy?.pharmacy_price || 6.5,
        delivery_type: orderDeliveryType,
        delivery_address: orderDeliveryAddress,
        patient_name: orderPatientName,
        patient_phone: orderPatientPhone,
        payment_method: orderPaymentMethod
      };

      const res = await apiService.orderMedicineOnline(payload);
      if (res && res.success) {
        setCompletedOrder(res.order);
      }
    } catch (err) {
      console.error('Order error:', err);
      alert(isGu ? "ઓર્ડર સબમિટ કરવામાં ભૂલ આવી." : "Error placing order.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  // WhatsApp Order Broadcast
  const handleSendWhatsAppOrder = (order) => {
    if (!order) return;
    const msg = encodeURIComponent(
      `*🚨 શ્રી શ્રી ❤️ હેલ્થકેર - દવા ઓનલાઈન ઓર્ડર*\n` +
      `*ઓર્ડર ID:* ${order.order_id}\n` +
      `*દર્દીનું નામ:* ${order.patient_name}\n` +
      `*મોબાઇલ:* ${order.patient_phone}\n` +
      `*દવા:* ${order.medicine_name} (${order.generic_salt})\n` +
      `*જથ્થો:* ${order.quantity} પેક\n` +
      `*કુલ રકમ:* ₹${order.total_amount} (${order.payment_method.toUpperCase()})\n` +
      `*મેડિકલ સ્ટોર:* ${order.pharmacy_name}\n` +
      `*ડિલિવરી:* ${order.delivery_type === 'express_delivery' ? '૧૫ મિનિટ એક્સપ્રેસ ડિલિવરી (' + order.delivery_address + ')' : 'રૂબરૂ પિકઅપ'}\n` +
      `*અંદાજિત સમય:* ${order.estimated_delivery}`
    );
    window.open(`https://wa.me/91${order.patient_phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  // Launch Live GPS Turn-by-Turn Route Simulation
  const handleStartLiveRouteSimulation = (ph) => {
    setLiveRoutePharmacy(ph);
    setRouteProgressKm(0);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Hidden File Input for OCR */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleOcrFileChange}
      />

      {/* TOP HERO BANNER: 100% Dynamic Medicine & Lowest Cost GPS Radar */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1128 0%, #005F43 55%, #00C48C 100%)',
        borderRadius: '20px',
        padding: '26px 28px',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(0, 196, 140, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={14} color="#FFE600" />
              {isGu ? '૧૦૦% લાઈવ દવા શોધક, સસ્તી મેડિકલ & ઓનલાઇન ઓર્ડર રડાર' : '100% Live Medicine Finder & Lowest Cost GPS Radar'}
            </span>

            {/* Competitor Advantages Button */}
            <button
              onClick={() => setShowAdvantageModal(!showAdvantageModal)}
              style={{
                background: '#FFE600',
                color: '#0A1128',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 3px 10px rgba(255, 230, 0, 0.4)'
              }}
            >
              <Award size={15} color="#0A1128" />
              {isGu ? '🏆 બજારના ગેરફાયદા vs આપણા ફાયદા' : '🏆 Market Flaws vs Sri Sri HealthCare'}
            </button>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '4px 0 8px 0', letterSpacing: '-0.3px' }}>
            {isGu
              ? 'કોઈપણ દવા લખો → સૌથી નજીક & ૮૦-૯૦% સસ્તી ક્યાં મળશે તે લાઈવ જુઓ & ઘરે બેઠા મંગાવો'
              : 'Enter Any Medicine → Nearest Lowest Cost Pharmacy GPS Radar & Express Delivery'}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.92, maxWidth: '850px', lineHeight: 1.5 }}>
            {isGu
              ? 'પ્રધાનમંત્રી જન ઔષધિ કેન્દ્રો અને ૨૪x૭ ઈમરજન્સી મેડિકલ સ્ટોર્સ સાથે જોડાયેલું લાઈવ નેટવર્ક. ઓછું અંતર + ઓછી કિંમત સરખામણી, લાઈવ GPS ટ્રેકિંગ, અને ૧૫ મિનિટમાં એક્સપ્રેસ હોમ ડિલિવરી!'
              : 'Direct connection to Jan Aushadhi Kendras and 24x7 verified emergency pharmacies. Shortest distance + lowest cost filter, live GPS tracking, and express home delivery.'}
          </p>
        </div>
      </div>

      {/* COMPETITOR ADVANTAGES DROPDOWN / ACCORDION */}
      {showAdvantageModal && (
        <div style={{
          background: '#F0FDF8',
          border: '2px solid #00C48C',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 6px 18px rgba(0, 196, 140, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ margin: 0, color: '#007A54', fontSize: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartHandshake size={20} color="#00C48C" />
              {isGu ? 'બજારની એપ્સના મુખ્ય ગેરફાયદા vs શ્રી શ્રી ❤️ હેલ્થકેરના ૧૦૦% ક્રાંતિકારી ફાયદા' : 'Market Apps Disadvantages vs Sri Sri HealthCare Real Advantages'}
            </h4>
            <button
              onClick={() => setShowAdvantageModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A6A85' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* Market Disadvantages */}
            <div style={{ background: '#FFF5F5', border: '1.5px solid #FEB2B2', borderRadius: '12px', padding: '16px' }}>
              <h5 style={{ color: '#C53030', margin: '0 0 10px 0', fontSize: '14px', fontWeight: 800 }}>
                {isGu ? '❌ અન્ય કોમર્શિયલ એપ્સના ગેરફાયદા (1mg / Pharmeasy / Apollo / Google Maps)' : '❌ Commercial Apps Disadvantages'}
              </h5>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#742A2A', fontSize: '13px', lineHeight: 1.7, fontWeight: 600 }}>
                <li><b>મોંઘી બ્રાન્ડેડ દવાઓનું માર્કેટિંગ:</b> કમિશન માટે ₹૧૫૦-૨૦૦ વસૂલે છે; સસ્તી સરકારી જનરિક છુપાવે છે.</li>
                <li><b>૨ થી ૩ દિવસની ડિલિવરી:</b> તાવ, દુખાવો કે ઈમરજન્સીમાં દર્દી ૨ દિવસ રાહ ન જોઈ શકે.</li>
                <li><b>ખોટી સ્ટોક માહિતી:</b> સ્ટોર પહોંચ્યા પછી દવા આઉટ-ઓફ-સ્ટોક નીકળે છે.</li>
                <li><b>રાત્રે મેડિકલ બંધ:</b> રાત્રે કઈ દુકાન ખુલ્લી છે તેનો કોઈ લાઈવ ફિલ્ટર નથી.</li>
                <li><b>છૂપા ચાર્જીસ & અંગ્રેજી:</b> ડિલિવરી ફી અને અંગ્રેજી ભાષાથી ગ્રામીણ લોકો અટવાઈ જાય છે.</li>
              </ul>
            </div>

            {/* Sri Sri HealthCare Advantages */}
            <div style={{ background: '#E6FFFA', border: '1.5px solid #81E6D9', borderRadius: '12px', padding: '16px' }}>
              <h5 style={{ color: '#234E52', margin: '0 0 10px 0', fontSize: '14px', fontWeight: 800 }}>
                {isGu ? '✅ શ્રી શ્રી ❤️ હેલ્થકેરના ૧૦૦% વિજેતા ફાયદા (આપણી એપ્લિકેશન)' : '✅ Sri Sri HealthCare Core Advantages'}
              </h5>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#234E52', fontSize: '13px', lineHeight: 1.7, fontWeight: 700 }}>
                <li><b>૮૦% થી ૯૦% સરકારી બચત:</b> સરકારી પ્રધાનમંત્રી જન ઔષધિ કેન્દ્રના લાઈવ ભાવથી ₹૩૨ ની દવા ₹૬.૫૦ માં!</li>
                <li><b>૧૫ મિનિટમાં એક્સપ્રેસ ડિલિવરી અથવા રૂબરૂ પિકઅપ:</b> લાઈવ GPS રડારથી ટૂંકો રસ્તો & ફાસ્ટ ડિલિવરી.</li>
                <li><b>૯૯% લાઈવ સ્ટોક & ઓનલાઇન ઓર્ડર:</b> ઘરે બેઠા ઓર્ડર કરો અથવા વોટ્સએપથી દવા તમારા નામે રિઝર્વ કરો.</li>
                <li><b>૨૪x૭ રાત્રિ ઈમરજન્સી મેડિકલ ફિલ્ટર:</b> રાત્રે પણ ખુલ્લા મેડિકલ સ્ટોર અને ૧૦૮ એમ્બ્યુલન્સ લિંક.</li>
                <li><b>ગુજરાતી/હિન્દી અવાજ (Mic) & ફોટો સ્કેન:</b> બોલીને કે પ્રિસ્ક્રિપ્શનનો ફોટો પાડીને ૧૦૦% મફત સેવા.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH & FILTER CONTROLS BAR */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        padding: '22px',
        border: '1.5px solid #D3F2E3',
        boxShadow: '0 4px 18px rgba(0, 196, 140, 0.08)'
      }}>
        {/* Search Input Row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {/* Medicine Input */}
          <div style={{ flex: 2, minWidth: '280px', position: 'relative' }}>
            <Search size={18} color="#00C48C" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={medicineQuery}
              onChange={(e) => setMedicineQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLocateMedicine(); }}
              placeholder={isGu
                ? "કોઈપણ દવાનું નામ લખો (દા.ત. Dolo 650, Pan 40, Augmentin, Telma 40)..."
                : "Enter any medicine name (e.g. Dolo 650, Pan 40, Augmentin, Telma 40)..."}
              style={{
                width: '100%',
                padding: '13px 44px 13px 44px',
                borderRadius: '12px',
                border: '1.5px solid #D3F2E3',
                fontSize: '14.5px',
                fontWeight: 700,
                outline: 'none',
                background: '#FFFFFF',
                color: '#0A1128'
              }}
            />
            {medicineQuery && (
              <button
                onClick={() => setMedicineQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8898AA' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* City / Area Input */}
          <div style={{ flex: 1.2, minWidth: '200px', position: 'relative' }}>
            <MapPin size={18} color="#00C48C" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLocateMedicine(); }}
              placeholder={isGu ? "શહેર / ગામનું નામ (દા.ત. ભાવનગર, અમદાવાદ)..." : "City / Village name (e.g. Bhavnagar)..."}
              style={{
                width: '100%',
                padding: '13px 14px 13px 42px',
                borderRadius: '12px',
                border: '1.5px solid #D3F2E3',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
                background: '#FFFFFF',
                color: '#0A1128'
              }}
            />
          </div>

          {/* Action Buttons: Voice Mic, Camera Scan, Auto GPS, Search */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Mic */}
            <button
              onClick={handleVoiceSearch}
              title={isGu ? "બોલીને દવા શોધો" : "Voice Search"}
              style={{
                background: isListening ? '#EF4444' : '#F0FBF7',
                border: '1.5px solid #00C48C',
                color: isListening ? '#FFFFFF' : '#007A54',
                padding: '12px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <Mic size={18} />
            </button>

            {/* Camera OCR */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title={isGu ? "પ્રિસ્ક્રિપ્શનનો ફોટો સ્કેન કરો" : "Scan Prescription Photo"}
              style={{
                background: isOcrScanning ? '#FDE68A' : '#F0FBF7',
                border: '1.5px solid #00C48C',
                color: '#007A54',
                padding: '12px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Camera size={18} />
            </button>

            {/* GPS Button */}
            <button
              onClick={handleDetectGPS}
              title={isGu ? "મારું લાઈવ GPS લોકેશન શોધો" : "Use Live GPS"}
              style={{
                background: userCoords ? '#E0F8EE' : '#F8FAFC',
                border: userCoords ? '1.5px solid #00C48C' : '1.5px solid #CBD5E1',
                color: userCoords ? '#007A54' : '#475569',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Compass size={17} color={userCoords ? '#00C48C' : '#64748B'} />
              {isLocating ? (isGu ? 'શોધી રહ્યું છે...' : 'Locating...') : (userCoords ? (isGu ? 'GPS ચાલુ' : 'GPS On') : (isGu ? 'લાઈવ GPS' : 'Live GPS'))}
            </button>

            {/* Search Submit Button */}
            <button
              onClick={() => handleLocateMedicine()}
              style={{
                background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '13px 22px',
                fontWeight: 900,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 196, 140, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Search size={16} />
              {isGu ? 'શોધો' : 'Search'}
            </button>
          </div>
        </div>

        {/* Quick Popular Medicines Shortcut Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', color: '#5A6A85', fontWeight: 800 }}>
            {isGu ? 'વારંવાર વપરાતી દવાઓ:' : 'Quick Medicines:'}
          </span>
          {POPULAR_MEDICINES.map((pm, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMedicineQuery(pm.query);
                handleLocateMedicine({ med: pm.query });
              }}
              style={{
                background: medicineQuery.toLowerCase().includes(pm.query.toLowerCase()) ? '#00C48C' : '#F0FBF7',
                color: medicineQuery.toLowerCase().includes(pm.query.toLowerCase()) ? '#FFFFFF' : '#007A54',
                border: '1px solid #B7E8D2',
                padding: '5px 12px',
                borderRadius: '18px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {pm.label}
            </button>
          ))}
        </div>

        {/* Quick Popular Cities Shortcut Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px dashed #E2E8F0' }}>
          <span style={{ fontSize: '12px', color: '#5A6A85', fontWeight: 800 }}>
            {isGu ? 'શહેર/ગામ શોર્ટકટ:' : 'Quick Towns:'}
          </span>
          {POPULAR_CITIES.map((pc, idx) => (
            <button
              key={idx}
              onClick={() => {
                setLocationCity(pc.query);
                handleLocateMedicine({ city: pc.query });
              }}
              style={{
                background: locationCity.toLowerCase().includes(pc.query.toLowerCase()) ? '#0A1128' : '#FFFFFF',
                color: locationCity.toLowerCase().includes(pc.query.toLowerCase()) ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {pc.label}
            </button>
          ))}
        </div>
      </div>

      {/* DETECTED LOCATION & STATUS BANNER */}
      {detectedLocationName && (
        <div style={{
          background: '#E8F8F1',
          border: '1.5px solid #00C48C',
          borderRadius: '14px',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#007A54', fontWeight: 700, fontSize: '13.5px' }}>
            <MapPin size={18} color="#00C48C" />
            <span>{isGu ? 'ચકાસાયેલ લોકેશન:' : 'Search Center:'} <b>{detectedLocationName}</b></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', background: '#FFFFFF', color: '#009F70', padding: '4px 12px', borderRadius: '10px', border: '1px solid #B7E8D2', fontWeight: 800 }}>
              {pharmacies.length} {isGu ? 'મેડિકલ સ્ટોર્સ ઉપલબ્ધ' : 'Pharmacies Found'}
            </span>
            {userCoords && (
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 700 }}>
                GPS: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* FULL MEDICINE DETAILS ANALYSIS CARD (Brand vs Generic Jan Aushadhi vs Natural) */}
      {matchedMedicine && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1.5px solid #00C48C',
          padding: '24px',
          boxShadow: '0 6px 20px rgba(0, 196, 140, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ background: '#E0F8EE', color: '#007A54', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                  {matchedMedicine.category}
                </span>
                <span style={{ background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingDown size={14} />
                  {matchedMedicine.savingsPct}% {isGu ? 'સરકારી જન ઔષધિ બચત' : 'Jan Aushadhi Savings'}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                {matchedMedicine.brandName}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#007A54', fontWeight: 700 }}>
                {isGu ? 'ચોક્કસ સરકારી સોલ્ટ ફોર્મ્યુલા:' : 'Exact Bioequivalent Salt:'} <u>{matchedMedicine.genericSalt}</u>
              </p>
            </div>

            {/* Price Comparison Snapshot */}
            <div style={{
              background: '#F8FCF9',
              border: '1.5px solid #D3F2E3',
              borderRadius: '14px',
              padding: '12px 18px',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '12px', color: '#8898AA', textDecoration: 'line-through', fontWeight: 700 }}>
                {isGu ? 'બજારમાં બ્રાન્ડેડ MRP:' : 'Commercial MRP:'} ₹{matchedMedicine.brandedMrp?.toFixed(2)}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#00C48C' }}>
                {isGu ? 'જન ઔષધિ સરકારી ભાવ:' : 'Jan Aushadhi:'} ₹{matchedMedicine.janAushadhiPrice?.toFixed(2)}
              </div>
              <div style={{ fontSize: '11.5px', color: '#007A54', fontWeight: 800 }}>
                {isGu ? 'તમારી સીધી બચત:' : 'Your Direct Saving:'} ₹{(matchedMedicine.brandedMrp - matchedMedicine.janAushadhiPrice).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Complete Medicine Details Grid: Uses, Dosage, Precautions, Ayurvedic */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', paddingTop: '12px', borderTop: '1px solid #EDF2F7' }}>
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
                {isGu ? 'આ રોગ/તકલીફમાં વપરાય છે' : 'Therapeutic Indication'}
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#1E293B', fontWeight: 700 }}>
                {matchedMedicine.indication}
              </p>
            </div>

            <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
              <span style={{ fontSize: '11px', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>
                {isGu ? '🌿 દેશી / આયુર્વેદિક નેચરલ વિકલ્પ' : '🌿 100% Herbal AYUSH Equivalent'}
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#14532D', fontWeight: 700 }}>
                {matchedMedicine.desiAyurvedic}
              </p>
            </div>

            <div style={{ background: '#FFFBEB', padding: '14px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
              <span style={{ fontSize: '11px', color: '#92400E', fontWeight: 800, textTransform: 'uppercase' }}>
                {isGu ? 'દવા લેવાની સાચી રીત (Dosage)' : 'Administration & Dosage'}
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#78350F', fontWeight: 700 }}>
                {isGu ? 'જમ્યા પછી ૧ ગોળી હૂંફાળા પાણી સાથે. ક્યારેય ખાલી પેટે ન લેવી.' : 'Take 1 tablet after food with warm water. Never take on empty stomach.'}
              </p>
            </div>

            <div style={{ background: '#FEF2F2', padding: '14px', borderRadius: '12px', border: '1px solid #FECACA' }}>
              <span style={{ fontSize: '11px', color: '#991B1B', fontWeight: 800, textTransform: 'uppercase' }}>
                {isGu ? 'મહત્વની તકેદારી & પરહેજ' : 'Clinical Precautions'}
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7F1D1D', fontWeight: 700 }}>
                {isGu ? 'લીવર કે કિડની તકલીફમાં ડૉક્ટર સલાહ જરૂરી. દવા પછી ડ્રાઇવિંગ ટાળો.' : 'Consult doctor if liver/kidney issues exist. Avoid driving after medication.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SORTING TABS & QUICK FILTER BAR */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '6px 0'
      }}>
        {/* Sorting Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'best_value', label: isGu ? '💎 સૌથી શ્રેષ્ઠ (ઓછું અંતર + ઓછી કિંમત)' : '💎 Best Value (Short Distance + Low Cost)' },
            { id: 'cheapest', label: isGu ? '💰 સૌથી ઓછી કિંમત' : '💰 Lowest Cost First' },
            { id: 'nearest', label: isGu ? '📍 સૌથી નજીકનું અંતર' : '📍 Closest Distance' },
            { id: 'rating', label: isGu ? '⭐ શ્રેષ્ઠ રેટિંગ' : '⭐ Top Rated' }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSort(s.id);
                handleLocateMedicine({ sort: s.id });
              }}
              style={{
                background: activeSort === s.id ? '#0A1128' : '#FFFFFF',
                color: activeSort === s.id ? '#FFFFFF' : '#475569',
                border: activeSort === s.id ? '1.5px solid #0A1128' : '1.5px solid #E2E8F0',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Filter Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: isGu ? 'બધા સ્ટોર્સ' : 'All Stores' },
            { id: 'jan_aushadhi', label: isGu ? '🏛️ ફક્ત જન ઔષધિ (૯૦% સસ્તી)' : 'Govt Jan Aushadhi Only' },
            { id: '24x7', label: isGu ? '🚨 ૨૪ કલાક ખુલ્લું' : '24x7 Open Only' },
            { id: 'in_stock', label: isGu ? '✅ હાજરમાં સ્ટોક' : 'In Stock Only' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setActiveFilter(f.id);
                handleLocateMedicine({ filt: f.id });
              }}
              style={{
                background: activeFilter === f.id ? '#00C48C' : '#F8FAFC',
                color: activeFilter === f.id ? '#FFFFFF' : '#334155',
                border: activeFilter === f.id ? '1px solid #00C48C' : '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: '#FFFFFF', borderRadius: '18px', border: '1.5px solid #D3F2E3' }}>
          <RefreshCw size={36} color="#00C48C" className="spin-icon" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ margin: '0 0 6px 0', color: '#0A1128', fontSize: '16px', fontWeight: 900 }}>
            {isGu ? 'મેડિકલ સ્ટોર્સ અને સૌથી સસ્તા ભાવ શોધી રહ્યા છીએ...' : 'Locating Nearest Pharmacies & Lowest Cost Stores...'}
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#5A6A85' }}>
            {isGu ? 'OpenStreetMap GPS અને પ્રધાનમંત્રી જન ઔષધિ કેન્દ્ર ડેટાબેઝ ચકાસી રહ્યા છીએ' : 'Querying verified Jan Aushadhi registries & OpenStreetMap live GPS'}
          </p>
        </div>
      )}

      {/* PHARMACIES RESULTS LIST */}
      {!loading && pharmacies.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {pharmacies.map((ph, idx) => {
            const isJanAushadhi = ph.type === 'jan_aushadhi';
            const isGovtFree = ph.type === 'govt_hospital_pharmacy';
            const is24x7 = ph.is_24x7;
            const nameDisplay = isGu ? ph.name_gu : (ph.name_en || ph.name_gu);
            const addressDisplay = isGu ? ph.address_gu : (ph.address_en || ph.address_gu);
            const typeLabel = isGu ? ph.type_label_gu : (ph.type_label_en || ph.type_label_gu);

            const isBestValue = idx === 0 && activeSort === 'best_value';

            return (
              <div
                key={ph.id || idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  border: isBestValue ? '2px solid #00C48C' : (isJanAushadhi ? '1.5px solid #00C48C' : '1.5px solid #E2E8F0'),
                  padding: '22px',
                  boxShadow: isBestValue
                    ? '0 6px 22px rgba(0, 196, 140, 0.18)'
                    : '0 3px 12px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  transition: 'transform 0.2s ease'
                }}
              >
                {/* Best Value Header Tag */}
                {isBestValue && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '24px',
                    background: 'linear-gradient(135deg, #00C48C 0%, #007A54 100%)',
                    color: '#FFFFFF',
                    padding: '3px 14px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 900,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 2px 8px rgba(0, 196, 140, 0.3)'
                  }}>
                    <Award size={13} color="#FFE600" />
                    {isGu ? '🌟 સૌથી શ્રેષ્ઠ પસંદગી (ઓછું અંતર + સૌથી ઓછી કિંમત)' : '🌟 BEST VALUE RECOMMENDED (Lowest Distance + Price)'}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginTop: isBestValue ? '4px' : '0' }}>
                  {/* Left Column: Details */}
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    {/* Badge Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {/* Type Badge */}
                      <span style={{
                        background: isJanAushadhi ? '#E0F8EE' : (is24x7 ? '#EFF6FF' : '#F1F5F9'),
                        color: isJanAushadhi ? '#007A54' : (is24x7 ? '#1D4ED8' : '#475569'),
                        border: isJanAushadhi ? '1.5px solid #00C48C' : (is24x7 ? '1px solid #93C5FD' : '1px solid #CBD5E1'),
                        padding: '3px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {isJanAushadhi ? <Building2 size={13} /> : <Store size={13} />}
                        {typeLabel}
                      </span>

                      {/* Distance Badge */}
                      {ph.distance_km !== undefined && (
                        <span style={{
                          background: '#FFFBEB',
                          color: '#B45309',
                          border: '1px solid #FCD34D',
                          padding: '3px 9px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Compass size={13} />
                          {ph.distance_km} km {isGu ? 'દૂર' : 'away'}
                        </span>
                      )}

                      {/* Travel ETA */}
                      {ph.eta_minutes && (
                        <span style={{
                          background: '#F8FAFC',
                          color: '#475569',
                          border: '1px solid #E2E8F0',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: 700
                        }}>
                          🛵 {ph.eta_minutes} min • 🚗 {ph.eta_car_minutes} min • 🚶 {ph.eta_walk_minutes} min
                        </span>
                      )}

                      {/* 24x7 Badge */}
                      {is24x7 && (
                        <span style={{
                          background: '#FEF2F2',
                          color: '#B91C1C',
                          border: '1px solid #FCA5A5',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: 800
                        }}>
                          🚨 ૨૪ કલાક ખુલ્લું
                        </span>
                      )}
                    </div>

                    {/* Store Title */}
                    <h4 style={{
                      margin: '2px 0 6px 0',
                      fontSize: '17.5px',
                      fontWeight: 900,
                      color: isJanAushadhi ? '#007A54' : '#0A1128',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px'
                    }}>
                      <Store size={18} color={isJanAushadhi ? '#00C48C' : '#0A1128'} />
                      {nameDisplay}
                    </h4>

                    {/* Address */}
                    <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#5A6A85', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="#00C48C" style={{ flexShrink: 0 }} />
                      {addressDisplay}
                      {ph.city_or_village ? ` • ${ph.city_or_village}` : ''}
                    </p>

                    {/* Live Stock & Timings Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '12px', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#047857', fontWeight: 800 }}>
                        <CheckCircle2 size={15} color="#10B981" />
                        <span>{ph.stock_quantity_label}</span>
                        <span style={{ fontSize: '11px', color: '#059669', opacity: 0.85 }}>({ph.stock_confidence})</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748B' }}>
                        <Clock size={14} />
                        <span>{ph.open_timings}</span>
                      </div>

                      {/* Store Details View Trigger */}
                      <button
                        onClick={() => setSelectedPharmacyDetails(ph)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#007A54',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: 0
                        }}
                      >
                        <Eye size={13} />
                        {isGu ? 'સ્ટોર વિગતો જુઓ' : 'Store Details'}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Price Box & Actions */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '10px',
                    minWidth: '240px'
                  }}>
                    {/* Price Card */}
                    <div style={{
                      background: isJanAushadhi ? '#F0FDF4' : '#F8FAFC',
                      border: isJanAushadhi ? '1.5px solid #86EFAC' : '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      textAlign: 'right',
                      width: '100%'
                    }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>
                        {matchedMedicine?.brandName} {isGu ? 'આ સ્ટોરનો ભાવ:' : 'Store Price:'}
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: isJanAushadhi ? '#00C48C' : '#0A1128' }}>
                        {isGovtFree ? (isGu ? '૧૦૦% મફત' : 'FREE') : `₹${ph.pharmacy_price?.toFixed(2)}`}
                      </div>
                      {ph.savings_amount > 0 && (
                        <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 800 }}>
                          ₹{ph.savings_amount} {isGu ? 'બચત' : 'Savings'} ({ph.savings_percentage}%)
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: BUY ONLINE (NEW!), Google Maps Navigation, Live GPS Route */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', width: '100%' }}>
                      {/* BUY ONLINE BUTTON (CORE NEW FEATURE) */}
                      <button
                        onClick={() => handleOpenBuyModal(ph)}
                        style={{
                          background: 'linear-gradient(135deg, #00C48C 0%, #00875A 100%)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '9px 14px',
                          fontSize: '12.5px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 3px 10px rgba(0, 196, 140, 0.35)'
                        }}
                      >
                        <ShoppingCart size={15} />
                        {isGu ? '🛒 ઓનલાઇન ખરીદો' : 'Buy Online'}
                      </button>

                      {/* Google Maps Turn-by-Turn Route */}
                      <a
                        href={ph.directions_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: '#F0FBF7',
                          border: '1.5px solid #00C48C',
                          color: '#007A54',
                          textDecoration: 'none',
                          borderRadius: '10px',
                          padding: '9px 12px',
                          fontSize: '12px',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Navigation size={14} />
                        {isGu ? 'GPS રસ્તો' : 'Navigate'}
                      </a>

                      {/* Live GPS Route Tracker Simulation Button */}
                      <button
                        onClick={() => handleStartLiveRouteSimulation(ph)}
                        style={{
                          background: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          color: '#334155',
                          borderRadius: '10px',
                          padding: '9px 10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Compass size={13} color="#00C48C" />
                        {isGu ? 'રૂટ ટ્રેક' : 'Track'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ONLINE BUY / ORDER MODAL (POPUP DIALOG) */}
      {orderModalPharmacy && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 17, 40, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '26px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0A1128', fontSize: '18px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={20} color="#00C48C" />
                  {isGu ? 'દવા ઓનલાઇન ખરીદો & એક્સપ્રેસ ડિલિવરી' : 'Order Medicine Online'}
                </h3>
                <span style={{ fontSize: '12px', color: '#5A6A85' }}>
                  {isGu ? orderModalPharmacy.name_gu : orderModalPharmacy.name_en}
                </span>
              </div>
              <button
                onClick={() => setOrderModalPharmacy(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* ORDER SUCCESS SCREEN */}
            {completedOrder ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#E0F8EE',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '2px solid #00C48C'
                }}>
                  <CheckCircle2 size={36} color="#00C48C" />
                </div>
                <h3 style={{ color: '#007A54', margin: '0 0 6px 0', fontSize: '20px', fontWeight: 900 }}>
                  {isGu ? '🎉 તમારો ઓર્ડર સફળતાપૂર્વક લેવાયો છે!' : 'Order Placed Successfully!'}
                </h3>
                <p style={{ color: '#5A6A85', fontSize: '13px', margin: '0 0 16px 0' }}>
                  {isGu ? 'ઓર્ડર નંબર:' : 'Order ID:'} <b>{completedOrder.order_id}</b>
                </p>

                {/* Tracking Step Visualizer */}
                <div style={{ background: '#F8FCF9', border: '1.5px solid #D3F2E3', borderRadius: '14px', padding: '16px', marginBottom: '18px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#007A54', fontWeight: 800, fontSize: '13.5px', marginBottom: '8px' }}>
                    <Truck size={18} color="#00C48C" />
                    <span>{completedOrder.estimated_delivery}</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.6 }}>
                    • <b>દવા:</b> {completedOrder.medicine_name} ({completedOrder.quantity} પેક)<br />
                    • <b>ચુકવણી:</b> {completedOrder.payment_status} (કુલ: ₹{completedOrder.total_amount})<br />
                    • <b>સરનામું:</b> {completedOrder.delivery_address || 'રૂબરૂ પિકઅપ'}<br />
                    • <b>સ્ટોર:</b> {completedOrder.pharmacy_name}
                  </div>
                </div>

                {/* WhatsApp Order Send Button */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => handleSendWhatsAppOrder(completedOrder)}
                    style={{
                      background: '#25D366',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 3px 12px rgba(37, 211, 102, 0.3)'
                    }}
                  >
                    <MessageCircle size={16} />
                    {isGu ? 'WhatsApp પર રસીદ મેળવો' : 'Get WhatsApp Receipt'}
                  </button>
                  <button
                    onClick={() => setOrderModalPharmacy(null)}
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      color: '#334155',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {isGu ? 'પૂર્ણ કરો' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              /* ORDER FORM */
              <form onSubmit={handleConfirmOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Product Summary Box */}
                <div style={{ background: '#F8FCF9', border: '1.5px solid #D3F2E3', borderRadius: '14px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ margin: 0, color: '#0A1128', fontSize: '15px', fontWeight: 800 }}>
                      {matchedMedicine?.brandName}
                    </h5>
                    <span style={{ fontSize: '12px', color: '#007A54', fontWeight: 700 }}>
                      {matchedMedicine?.genericSalt}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#00C48C' }}>
                      ₹{orderModalPharmacy.pharmacy_price}
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {isGu ? 'પ્રતિ પેક' : 'per pack'}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {isGu ? 'જથ્થો (Quantity):' : 'Quantity:'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', fontSize: '18px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#0A1128', minWidth: '30px', textAlign: 'center' }}>
                      {orderQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.min(10, orderQuantity + 1))}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', fontSize: '18px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      +
                    </button>
                    <span style={{ fontSize: '12.5px', color: '#64748B', marginLeft: '6px' }}>
                      {isGu ? `કુલ રકમ: ₹${(orderModalPharmacy.pharmacy_price * orderQuantity).toFixed(2)}` : `Total: ₹${(orderModalPharmacy.pharmacy_price * orderQuantity).toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Delivery Type Option */}
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {isGu ? 'ડિલિવરી પદ્ધતિ પસંદ કરો:' : 'Choose Delivery Mode:'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setOrderDeliveryType('express_delivery')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: orderDeliveryType === 'express_delivery' ? '2px solid #00C48C' : '1px solid #CBD5E1',
                        background: orderDeliveryType === 'express_delivery' ? '#E0F8EE' : '#FFFFFF',
                        color: orderDeliveryType === 'express_delivery' ? '#007A54' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <Truck size={16} color="#00C48C" />
                        <span>{isGu ? '૧૫ મિનિટ એક્સપ્રેસ' : 'Express 15-Min'}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        {isGu ? 'ઘરે બેઠા ડિલિવરી' : 'Doorstep Delivery'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderDeliveryType('self_pickup')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: orderDeliveryType === 'self_pickup' ? '2px solid #00C48C' : '1px solid #CBD5E1',
                        background: orderDeliveryType === 'self_pickup' ? '#E0F8EE' : '#FFFFFF',
                        color: orderDeliveryType === 'self_pickup' ? '#007A54' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <Store size={16} color="#00C48C" />
                        <span>{isGu ? 'રૂબરૂ પિકઅપ' : 'Self Pickup'}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        {isGu ? '૧૦ મિનિટમાં તૈયાર' : 'Ready at Store'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Patient Information Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      {isGu ? 'દર્દીનું પૂરું નામ *' : 'Patient Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={orderPatientName}
                      onChange={(e) => setOrderPatientName(e.target.value)}
                      placeholder={isGu ? "દા.ત. રમેશભાઈ પટેલ" : "e.g. Ramesh Patel"}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      {isGu ? 'મોબાઈલ નંબર *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderPatientPhone}
                      onChange={(e) => setOrderPatientPhone(e.target.value)}
                      placeholder={isGu ? "દા.ત. 98790 12345" : "e.g. 98790 12345"}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Address (If Express Delivery) */}
                {orderDeliveryType === 'express_delivery' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      {isGu ? 'ડિલિવરી સરનામું / લેન્ડમાર્ક *' : 'Delivery Address / Landmark *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={orderDeliveryAddress}
                      onChange={(e) => setOrderDeliveryAddress(e.target.value)}
                      placeholder={isGu ? "મકાન નં, શેરી, લેન્ડમાર્ક, ગામ/શહેર" : "House No, Street, Landmark, Town"}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                )}

                {/* Payment Method Selector */}
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {isGu ? 'ચુકવણી પદ્ધતિ (Payment):' : 'Payment Method:'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { id: 'cod', label: isGu ? '💵 કેશ ઓન ડિલિવરી' : 'Cash on Delivery' },
                      { id: 'upi', label: isGu ? '💳 UPI / QR કોડ' : 'Instant UPI / QR' },
                      { id: 'ayushman_free', label: isGu ? '🏛️ આયુષ્માન (મફત)' : 'PM-JAY (Free)' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setOrderPaymentMethod(p.id)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '10px',
                          border: orderPaymentMethod === p.id ? '2px solid #00C48C' : '1px solid #CBD5E1',
                          background: orderPaymentMethod === p.id ? '#E0F8EE' : '#FFFFFF',
                          color: orderPaymentMethod === p.id ? '#007A54' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={orderSubmitting}
                  style={{
                    background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontSize: '14.5px',
                    fontWeight: 900,
                    cursor: orderSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 196, 140, 0.3)',
                    marginTop: '4px'
                  }}
                >
                  {orderSubmitting ? (isGu ? 'ઓર્ડર નોંધાઈ રહ્યો છે...' : 'Placing Order...') : (isGu ? '✅ ઓર્ડર કન્ફર્મ કરો' : 'Confirm & Place Order')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MEDICAL STORE COMPLETE DETAILS MODAL */}
      {selectedPharmacyDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 17, 40, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ background: '#E0F8EE', color: '#007A54', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                  {isGu ? selectedPharmacyDetails.type_label_gu : selectedPharmacyDetails.type_label_en}
                </span>
                <h3 style={{ margin: '6px 0 2px 0', fontSize: '18px', fontWeight: 900, color: '#0A1128' }}>
                  {isGu ? selectedPharmacyDetails.name_gu : selectedPharmacyDetails.name_en}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPharmacyDetails(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#00C48C" />
                <span><b>સરનામું:</b> {isGu ? selectedPharmacyDetails.address_gu : selectedPharmacyDetails.address_en}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#00C48C" />
                <span><b>સમય:</b> {selectedPharmacyDetails.open_timings}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#00C48C" />
                <span><b>ફોન:</b> {selectedPharmacyDetails.contact_phone || '+91 108'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#00C48C" />
                <span><b>સ્ટોક:</b> {selectedPharmacyDetails.stock_quantity_label} ({selectedPharmacyDetails.stock_confidence})</span>
              </div>
              {selectedPharmacyDetails.jan_aushadhi_code && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#00C48C" />
                  <span><b>જન ઔષધિ લાયસન્સ કોડ:</b> {selectedPharmacyDetails.jan_aushadhi_code}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  const ph = selectedPharmacyDetails;
                  setSelectedPharmacyDetails(null);
                  handleOpenBuyModal(ph);
                }}
                style={{
                  flex: 1,
                  background: '#00C48C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '11px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {isGu ? 'ઓનલાઇન ખરીદો' : 'Buy Online'}
              </button>
              <a
                href={selectedPharmacyDetails.directions_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  background: '#F0FBF7',
                  border: '1.5px solid #00C48C',
                  color: '#007A54',
                  borderRadius: '10px',
                  padding: '11px',
                  fontSize: '13px',
                  fontWeight: 800,
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                {isGu ? 'GPS રસ્તો ખોલો' : 'Open GPS Route'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* LIVE GPS ROUTE TRACKER SIMULATION MODAL */}
      {liveRoutePharmacy && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 17, 40, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={22} color="#00C48C" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0A1128' }}>
                  {isGu ? 'લાઈવ GPS નેવિગેશન રડાર' : 'Live GPS Navigation Radar'}
                </h3>
              </div>
              <button
                onClick={() => setLiveRoutePharmacy(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Radar UI Visualization */}
            <div style={{
              background: 'radial-gradient(circle, #0F172A 0%, #020617 100%)',
              borderRadius: '16px',
              padding: '30px 20px',
              textAlign: 'center',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '2px solid rgba(0, 196, 140, 0.4)',
                margin: '0 auto 16px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '1.5px dashed rgba(0, 196, 140, 0.3)' }} />
                <Navigation size={28} color="#00C48C" style={{ position: 'absolute', transform: 'rotate(35deg)' }} />
              </div>

              <div style={{ fontSize: '26px', fontWeight: 900, color: '#00C48C' }}>
                {liveRoutePharmacy.distance_km} km
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.85 }}>
                {isGu
                  ? `તમે ${liveRoutePharmacy.name_gu} તરફ જઈ રહ્યા છો`
                  : `Navigating to ${liveRoutePharmacy.name_en}`}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={liveRoutePharmacy.directions_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #00C48C 0%, #009F70 100%)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 900,
                  fontSize: '13px'
                }}
              >
                {isGu ? 'Google Maps પર ખોલો' : 'Open Google Maps'}
              </a>
              <button
                onClick={() => setLiveRoutePharmacy(null)}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  fontWeight: 800,
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                {isGu ? 'બંધ કરો' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CLINICAL DISCLAIMER */}
      <div style={{
        background: '#F8FCF9',
        border: '1px solid #D3F2E3',
        borderRadius: '14px',
        padding: '14px 18px',
        fontSize: '12px',
        color: '#5A6A85',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Info size={18} color="#00C48C" style={{ flexShrink: 0 }} />
        <span>
          {isGu
            ? 'સરકારી માર્ગદર્શિકા: પ્રધાનમંત્રી ભારતીય જન ઔષધિ પરિયોજના (PMBJP) હેઠળ તમામ જનરિક દવાઓ WHO-GMP પ્રમાણિત હોય છે અને બ્રાન્ડેડ દવા જેટલી જ ૧૦૦% અસરકારકતા ધરાવે છે. કોઈપણ શેડ્યૂલ-H એન્ટિબાયોટિક્સ દવા ખરીદતી વખતે માન્ય ડૉક્ટરનું પ્રિસ્ક્રિપ્શન સાથે રાખવું.'
            : 'Clinical Notice: All generic drugs under PMBJP are WHO-GMP certified and therapeutically equivalent to branded medicines. Present a valid medical prescription for Schedule-H prescription drugs.'}
        </span>
      </div>
    </div>
  );
};

export default LiveMedicineLocatorTab;
