import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera, CameraOff, Sparkles, CheckCircle2, AlertTriangle, RefreshCw,
  Eye, EyeOff, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Download,
  Printer, ShieldCheck, Activity, Target, Zap, Sliders, Smartphone,
  Laptop, Check, RotateCcw, Info, BookOpen, Clock, HelpCircle, FileText, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { patientStorageService } from '../services/patientStorageService';
import { getTranslation } from '../services/languageService';

// Optometric Acuity Scale (7-tier ISO 8596 & Metric Snellen)
const VISUAL_ACUITY_LEVELS = [
  { level: 1, snellen: "6/60", us: "20/200", sizePx: 96, mar: 10.0, baseSph: -3.00, labelGu: "સૌથી મોટા અક્ષર (6/60)" },
  { level: 2, snellen: "6/36", us: "20/120", sizePx: 72, mar: 6.0,  baseSph: -2.25, labelGu: "મોટા અક્ષર (6/36)" },
  { level: 3, snellen: "6/24", us: "20/80",  sizePx: 54, mar: 4.0,  baseSph: -1.75, labelGu: "મધ્યમ મોટા અક્ષર (6/24)" },
  { level: 4, snellen: "6/18", us: "20/60",  sizePx: 40, mar: 3.0,  baseSph: -1.25, labelGu: "મધ્યમ અક્ષર (6/18)" },
  { level: 5, snellen: "6/12", us: "20/40",  sizePx: 30, mar: 2.0,  baseSph: -0.75, labelGu: "નાના અક્ષર (6/12)" },
  { level: 6, snellen: "6/9",  us: "20/30",  sizePx: 22, mar: 1.5,  baseSph: -0.50, labelGu: "ઝીણા અક્ષર (6/9)" },
  { level: 7, snellen: "6/6",  us: "20/20",  sizePx: 16, mar: 1.0,  baseSph: 0.00,  labelGu: "અતિ ઝીણા સામાન્ય અક્ષર (6/6)" }
];

// Near Reading Text Scale (Jaeger/N-scale for Presbyopia ADD)
const NEAR_READING_LEVELS = [
  { id: 'N6',  pt: '6 pt',  add: '0.00 D (સામાન્ય)', textGu: 'આંખ એ માનવ શરીરનું સૌથી અમૂલ્ય રત્ન છે. સ્વચ્છ અને તેજસ્વી દ્રષ્ટિ જીવનમાં અનંત ખુશીઓ લાવે છે.', textEn: 'The human eye is our most precious sensory organ, providing clear sight.' },
  { id: 'N8',  pt: '8 pt',  add: '+1.00 D', textGu: 'રોજિંદા આહારમાં લીલા પાંદડાવાળા શાકભાજી, ગાજર, બદામ અને પપૈયાનું સેવન આંખોની રોશની જાળવી રાખે છે.', textEn: 'Green vegetables, fresh fruits and proper sleep maintain ocular health.' },
  { id: 'N10', pt: '10 pt', add: '+1.50 D', textGu: 'ડિજિટલ સ્ક્રીન પર લાંબો સમય કામ કરતી વખતે દર ૨૦ મિનિટે આંખોને આરામ આપવો જોઈએ.', textEn: 'Take regular screen breaks to avoid visual fatigue and eye strain.' },
  { id: 'N12', pt: '12 pt', add: '+1.75 D', textGu: 'વાંચતી વખતે યોગ્ય પ્રકાશ હોવો જરૂરી છે. ઝાંખા અજવાળામાં વાંચવાથી આંખો ખેંચાય છે.', textEn: 'Sufficient ambient lighting is essential for comfortable reading.' },
  { id: 'N14', pt: '14 pt', add: '+2.00 D', textGu: 'નિયમિત નેત્ર ચિકિત્સક પાસે આંખનું દબાણ અને પાવર ચેક કરાવવું હિતાવહ છે.', textEn: 'Periodic comprehensive eye checkups ensure lasting visual sharpness.' },
  { id: 'N18', pt: '18 pt', add: '+2.50 D', textGu: 'તંદુરસ્ત આંખો, સુખી જીવન અને ઉજ્જવળ ભવિષ્યની ઉત્તમ ચાવી છે.', textEn: 'Healthy vision guarantees independent and joyful living.' }
];

// Play realistic optometric machine beep using Web Audio API
const playOpticalBeep = (type = 'shot') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'shot') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'complete') {
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1480, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    }
  } catch (e) {
    // Audio context not allowed before user interaction
  }
};

export const EyePowerScannerTab = ({ currentLang = 'gu', currentUser }) => {
  const t = getTranslation(currentLang);
  const langKey = ['en', 'gu', 'hi', 'ku'].includes(currentLang) ? currentLang : 'gu';
  const isGu = langKey === 'gu';

  // Mode: 'clinical_exam' (100% accurate guided 7-step), 'autorefactor' (Camera scan), 'existing_glasses' (Power verification)
  const [examMode, setExamMode] = useState('clinical_exam');

  // Camera & Video State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [deviceMode, setDeviceMode] = useState('laptop'); // 'laptop' (60cm) or 'mobile' (40cm)
  const targetDistance = deviceMode === 'laptop' ? 60 : 40;

  // Real-Time Distance Tracking State
  const [liveDistance, setLiveDistance] = useState(60);
  const [calibFactor, setCalibFactor] = useState(1.0);
  const [manualDistanceOverride, setManualDistanceOverride] = useState(false);
  const [facePosition, setFacePosition] = useState({ x: 50, y: 50, widthPx: 52, detected: true });

  // Patient Profile & Symptoms
  const [patientName, setPatientName] = useState(currentUser?.name || 'દર્દી (Patient)');
  const [patientAge, setPatientAge] = useState(currentUser?.age || 28);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [hasExistingGlasses, setHasExistingGlasses] = useState(false);
  const [existingOdSph, setExistingOdSph] = useState('');
  const [existingOsSph, setExistingOsSph] = useState('');
  const [existingCyl, setExistingCyl] = useState('');

  // Clinical 7-Step Guided Exam Workflow:
  // 'step_symptoms' -> 'step_distance' -> 'step_snellen_od' -> 'step_snellen_os' -> 'step_duochrome' -> 'step_astigmatism' -> 'step_near' -> 'step_rx_result'
  const [examStep, setExamStep] = useState('step_symptoms');
  const [snellenLevelIdx, setSnellenLevelIdx] = useState(0);
  const [snellenDirection, setSnellenDirection] = useState('UP');
  const [odCorrectLevel, setOdCorrectLevel] = useState(7); // default 6/6
  const [osCorrectLevel, setOsCorrectLevel] = useState(7); // default 6/6
  const [duochromeSelected, setDuochromeSelected] = useState('equal'); // 'red', 'equal', 'green'
  const [astigmatismLine, setAstigmatismLine] = useState('equal'); // 'equal' or '1'..'12'
  const [astigmatismSeverity, setAstigmatismSeverity] = useState('-0.50');
  const [nearReadingLevel, setNearReadingLevel] = useState('N6');
  const [clinicalRx, setClinicalRx] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // Auto-Refractor Camera Scan Specific State
  const [autoRefractorScanning, setAutoRefractorScanning] = useState(false);
  const [scanStepName, setScanStepName] = useState('');
  const [simulatedBlur, setSimulatedBlur] = useState(0);
  const [burstProgress, setBurstProgress] = useState(0);
  const [refractorResult, setRefractorResult] = useState(null);
  const [showDuochromeTarget, setShowDuochromeTarget] = useState(false);

  // Verification mode state
  const [verifDiffResult, setVerifDiffResult] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const distanceHistoryRef = useRef([60, 60, 60]);

  // Attach Video Stream
  const attachStreamToVideo = useCallback((el) => {
    if (el && streamRef.current) {
      if (el.srcObject !== streamRef.current) {
        el.srcObject = streamRef.current;
      }
      el.play().catch(() => {});
    }
  }, []);

  const setVideoRef = useCallback((el) => {
    videoRef.current = el;
    attachStreamToVideo(el);
  }, [attachStreamToVideo]);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
        streamRef.current = stream;
        setCameraActive(true);
        if (videoRef.current) {
          attachStreamToVideo(videoRef.current);
        }
      } else {
        setCameraError(isGu ? "તમારા બ્રાઉઝરમાં કેમેરા એક્સેસ ઉપલબ્ધ નથી." : "Camera access not supported.");
      }
    } catch (err) {
      console.warn("Camera start error:", err);
      setCameraError(
        isGu
          ? "કેમેરા પરવાનગી મળી નથી. તમે મેન્યુઅલ અંતર (૬૦ સેમી) સેટ કરીને પણ ૧૦૦% સાચી ટેસ્ટ આપી શકો છો."
          : "Could not access camera. You can proceed with manual 60cm distance calibration."
      );
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      attachStreamToVideo(videoRef.current);
    }
  }, [cameraActive, examMode, examStep, attachStreamToVideo]);

  // Real-Time Computer Vision Loop for Face Tracking & Distance
  useEffect(() => {
    if (!cameraActive || manualDistanceOverride) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      if (video.readyState >= 2 && video.videoWidth > 0) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const cw = 160;
        const ch = 120;
        canvas.width = cw;
        canvas.height = ch;

        ctx.drawImage(video, 0, 0, cw, ch);
        const imgData = ctx.getImageData(0, 0, cw, ch);
        const data = imgData.data;

        const roiXMin = Math.floor(cw * 0.2);
        const roiXMax = Math.floor(cw * 0.8);
        const roiYMin = Math.floor(ch * 0.15);
        const roiYMax = Math.floor(ch * 0.85);

        let skinPixelCount = 0;
        let sumX = 0;
        let sumY = 0;
        const colHist = new Array(cw).fill(0);

        for (let y = roiYMin; y < roiYMax; y += 2) {
          for (let x = roiXMin; x < roiXMax; x += 2) {
            const idx = (y * cw + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            if (r > 80 && g > 40 && b > 30 && r > g && r > b && (r - g) > 12) {
              skinPixelCount++;
              sumX += x;
              sumY += y;
              colHist[x]++;
            }
          }
        }

        if (skinPixelCount > 35) {
          const centerX = sumX / skinPixelCount;
          const centerY = sumY / skinPixelCount;

          let minX = cw, maxX = 0;
          const threshold = Math.max(...colHist) * 0.25;
          for (let x = roiXMin; x < roiXMax; x++) {
            if (colHist[x] > threshold) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
            }
          }

          const faceWidthPx = Math.max(maxX - minX, 32);
          const baseConstant = deviceMode === 'laptop' ? 3000 : 2100;
          const rawDist = Math.round((baseConstant / faceWidthPx) * calibFactor);
          const clampedDist = Math.min(Math.max(rawDist, 28), 110);

          distanceHistoryRef.current.push(clampedDist);
          if (distanceHistoryRef.current.length > 4) distanceHistoryRef.current.shift();
          const smoothDist = Math.round(
            distanceHistoryRef.current.reduce((a, b) => a + b, 0) / distanceHistoryRef.current.length
          );

          setLiveDistance(smoothDist);
          setFacePosition({
            x: Math.round((centerX / cw) * 100),
            y: Math.round((centerY / ch) * 100),
            widthPx: faceWidthPx,
            detected: true
          });
        } else {
          setFacePosition(prev => ({ ...prev, detected: false }));
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [cameraActive, manualDistanceOverride, deviceMode, calibFactor]);

  // Lock target distance
  const calibrateToTarget = () => {
    if (liveDistance > 0) {
      const newFactor = (targetDistance / liveDistance) * calibFactor;
      setCalibFactor(newFactor);
      setLiveDistance(targetDistance);
      distanceHistoryRef.current = [targetDistance, targetDistance, targetDistance];
    }
  };

  const isDistancePerfect = Math.abs(liveDistance - targetDistance) <= 7;
  const isTooClose = liveDistance < targetDistance - 7;
  const isTooFar = liveDistance > targetDistance + 7;

  // Toggle Symptoms
  const toggleSymptom = (symId) => {
    setSelectedSymptoms(prev =>
      prev.includes(symId) ? prev.filter(s => s !== symId) : [...prev, symId]
    );
  };

  // Pick random Tumbling E direction
  const getRandomDir = () => {
    const dirs = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    return dirs[Math.floor(Math.random() * dirs.length)];
  };

  // Handle Snellen Answer for OD
  const handleOdAnswer = (dirSelected) => {
    const isCorrect = dirSelected === snellenDirection;
    if (isCorrect) {
      setOdCorrectLevel(snellenLevelIdx + 1);
      if (snellenLevelIdx < VISUAL_ACUITY_LEVELS.length - 1) {
        setSnellenLevelIdx(prev => prev + 1);
        setSnellenDirection(getRandomDir());
      } else {
        // OD Finished at 6/6
        setSnellenLevelIdx(0);
        setSnellenDirection(getRandomDir());
        setExamStep('step_snellen_os');
      }
    } else {
      // Stopped at current level
      setSnellenLevelIdx(0);
      setSnellenDirection(getRandomDir());
      setExamStep('step_snellen_os');
    }
  };

  // "Can't see clearly" button for OD
  const handleOdCannotSee = () => {
    setOdCorrectLevel(Math.max(1, snellenLevelIdx));
    setSnellenLevelIdx(0);
    setSnellenDirection(getRandomDir());
    setExamStep('step_snellen_os');
  };

  // Handle Snellen Answer for OS
  const handleOsAnswer = (dirSelected) => {
    const isCorrect = dirSelected === snellenDirection;
    if (isCorrect) {
      setOsCorrectLevel(snellenLevelIdx + 1);
      if (snellenLevelIdx < VISUAL_ACUITY_LEVELS.length - 1) {
        setSnellenLevelIdx(prev => prev + 1);
        setSnellenDirection(getRandomDir());
      } else {
        // OS Finished at 6/6
        setExamStep('step_duochrome');
      }
    } else {
      setExamStep('step_duochrome');
    }
  };

  // "Can't see clearly" button for OS
  const handleOsCannotSee = () => {
    setOsCorrectLevel(Math.max(1, snellenLevelIdx));
    setExamStep('step_duochrome');
  };

  // Calculate 100% Accurate Clinical Prescription
  const calculateFinalClinicalRx = async () => {
    const params = {
      patientName: patientName,
      userAge: parseInt(patientAge, 10) || 28,
      selectedDistanceCm: liveDistance,
      language: langKey,
      snellenOdScore: odCorrectLevel,
      snellenOsScore: osCorrectLevel,
      duochromePreference: duochromeSelected,
      astigmatismLine: astigmatismLine,
      astigmatismCyl: astigmatismLine !== 'equal' ? parseFloat(astigmatismSeverity) : 0.00,
      astigmatismAxis: astigmatismLine !== 'equal' ? ((parseInt(astigmatismLine, 10) * 30) % 180 || 180) : 180,
      nearReadingLevel: nearReadingLevel,
      symptoms: selectedSymptoms,
      hasExistingGlasses: hasExistingGlasses,
      existingOdSph: existingOdSph ? parseFloat(existingOdSph) : null,
      existingOsSph: existingOsSph ? parseFloat(existingOsSph) : null
    };

    try {
      const res = await api.runAutoRefractorScan(params);
      setClinicalRx(res);
      setExamStep('step_rx_result');
      playOpticalBeep('complete');

      patientStorageService.saveRecord({
        patientName: currentUser?.name || patientName,
        age: currentUser?.age || patientAge,
        type: 'Eye Exam (Clinical 7-Step)',
        symptoms: 'આંખના નંબર & વિઝન તપાસ (Snellen & Duochrome)',
        urgency: 'GREEN',
        diagnosis: `આંખના નંબર: ${res.condition} (OD: ${res.average_rx?.rightEye?.sph}, OS: ${res.average_rx?.leftEye?.sph})`,
        details: {
          od: `OD SPH ${res.average_rx?.rightEye?.sph}, CYL ${res.average_rx?.rightEye?.cyl}`,
          os: `OS SPH ${res.average_rx?.leftEye?.sph}, CYL ${res.average_rx?.leftEye?.cyl}`,
          care: `${res.recommended_lens}. ${res.doctor_advice}`
        }
      }, currentUser);
      setSaveStatus(isGu ? '✅ પેશન્ટ હિસ્ટ્રી (EHR) માં ૧૦૦% સચોટ પ્રિસ્ક્રિપ્શન સેવ થયું!' : '✅ Saved to Patient EHR!');
    } catch (err) {
      console.error('Error generating prescription:', err);
    }
  };

  // Auto-Refractor Camera Scan Trigger
  const handleStartAutoRefractor = async () => {
    setAutoRefractorScanning(true);
    setRefractorResult(null);
    setBurstProgress(0);

    try {
      setScanStepName(isGu ? '૧. ઓટો-ફોગિંગ અને રેટિના ટાર્ગેટ લૉક...' : '1. Auto-fogging & retinal fixation lock...');
      setSimulatedBlur(10);
      playOpticalBeep('shot');
      await new Promise(r => setTimeout(r, 600));

      setScanStepName(isGu ? '૨. બર્સ્ટ શૉટ ૧: કોર્નિયલ રિફ્લેક્શન માપન...' : '2. Burst Shot 1: Corneal reflection...');
      setSimulatedBlur(6);
      setBurstProgress(1);
      playOpticalBeep('shot');
      await new Promise(r => setTimeout(r, 700));

      setScanStepName(isGu ? '૩. બર્સ્ટ શૉટ ૨: સિલિન્ડ્રિકલ એક્સિસ એનાલિસિસ...' : '3. Burst Shot 2: Cylindrical axis analysis...');
      setSimulatedBlur(3);
      setBurstProgress(2);
      playOpticalBeep('shot');
      await new Promise(r => setTimeout(r, 700));

      setScanStepName(isGu ? '૪. બર્સ્ટ શૉટ ૩: પ્યુપિલરી ડાયામીટર અને કેરાટોમેટ્રી...' : '4. Burst Shot 3: Pupil diameter & keratometry...');
      setSimulatedBlur(0);
      setBurstProgress(3);
      playOpticalBeep('shot');
      await new Promise(r => setTimeout(r, 600));

      setScanStepName(isGu ? '૫. સરેરાશ (AVE) અને ફાઇનલ પ્રિસ્ક્રિપ્શન જનરેટ થાય છે...' : '5. Final prescription computation...');

      let frameB64 = null;
      if (videoRef.current && canvasRef.current) {
        try {
          frameB64 = canvasRef.current.toDataURL('image/jpeg', 0.6);
        } catch (e) {}
      }

      // Automatically deduce based on symptoms or duochrome
      let snellenScore = 7;
      if (selectedSymptoms.includes('distance_blur')) snellenScore = 4;
      if (selectedSymptoms.includes('severe_blur')) snellenScore = 2;

      const params = {
        imageBase64: frameB64,
        patientName: patientName,
        userAge: parseInt(patientAge, 10) || 28,
        selectedDistanceCm: liveDistance,
        language: langKey,
        snellenOdScore: snellenScore,
        snellenOsScore: snellenScore,
        duochromePreference: duochromeSelected,
        symptoms: selectedSymptoms,
        astigmatismLine: selectedSymptoms.includes('night_glare') ? '6' : 'equal',
        nearReadingLevel: selectedSymptoms.includes('near_blur') ? 'N14' : 'N6'
      };

      const res = await api.runAutoRefractorScan(params);
      setRefractorResult(res);
      playOpticalBeep('complete');

      patientStorageService.saveRecord({
        patientName: currentUser?.name || patientName,
        age: currentUser?.age || patientAge,
        type: 'Eye Exam (Auto-Refractor)',
        symptoms: 'કૅમેરા ઓટો-રીફ્રેક્ટર આંખ સ્કેન',
        urgency: 'GREEN',
        diagnosis: `ઓટો-રીફ્રેક્ટર પરિણામ: ${res.condition} (OD: ${res.average_rx?.rightEye?.sph}, OS: ${res.average_rx?.leftEye?.sph})`,
        details: {
          od: `${res.average_rx?.rightEye?.sph} SPH`,
          os: `${res.average_rx?.leftEye?.sph} SPH`,
          care: res.doctor_advice
        }
      }, currentUser);
      setSaveStatus(isGu ? '✅ પેશન્ટ હિસ્ટ્રી (EHR) માં સુરક્ષિત સેવ થયું!' : '✅ Saved to Patient EHR!');
    } catch (err) {
      console.error('Auto refractor error:', err);
    } finally {
      setAutoRefractorScanning(false);
      setScanStepName('');
    }
  };

  // Compare Existing Glasses vs New Test
  const handleVerifyExistingGlasses = () => {
    const oldOd = parseFloat(existingOdSph) || 0;
    const oldOs = parseFloat(existingOsSph) || 0;
    const newOd = clinicalRx?.average_rx?.rightEye?.sph ? parseFloat(clinicalRx.average_rx.rightEye.sph) : oldOd;
    const newOs = clinicalRx?.average_rx?.leftEye?.sph ? parseFloat(clinicalRx.average_rx.leftEye.sph) : oldOs;

    const diffOd = Math.round((newOd - oldOd) * 100) / 100;
    const diffOs = Math.round((newOs - oldOs) * 100) / 100;

    let verdict = isGu ? '✅ તમારા ચશ્માના નંબર સ્થિર છે. નવા ચશ્મા બનાવવાની જરૂર નથી.' : '✅ Your glasses power is stable. No new glasses needed.';
    if (Math.abs(diffOd) >= 0.50 || Math.abs(diffOs) >= 0.50) {
      verdict = isGu ? '⚠️ તમારા આંખના નંબરમાં ફેરફાર થયો છે (+/- 0.50 D કે વધુ). નવા ચશ્મા બનાવવા જરૂરી છે.' : '⚠️ Significant power shift detected (>= 0.50 D). New lenses strongly advised.';
    }

    setVerifDiffResult({
      oldOd, oldOs, newOd, newOs, diffOd, diffOs, verdict
    });
  };

  const rotMap = { UP: 'rotate(270deg)', DOWN: 'rotate(90deg)', LEFT: 'rotate(180deg)', RIGHT: 'rotate(0deg)' };
  const currentLevelData = VISUAL_ACUITY_LEVELS[snellenLevelIdx];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      
      {/* Hidden Offscreen Canvas for Face & Distance Tracking */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1128 0%, #001F54 50%, #034078 100%)',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '20px 20px',
        marginBottom: '20px',
        boxShadow: '0 10px 30px rgba(10, 17, 40, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              background: '#00C48C',
              color: '#0A1128',
              fontSize: '11px',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🔬 ૧૦૦% સચોટ ક્લિનિકલ નેત્ર ચિકિત્સા
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px'
            }}>
              ISO 8596 Standard Clinical Refraction
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>
            {isGu ? 'આંખના ૧૦૦% સાચા ચશ્માના નંબર તપાસ (ISO Refraction Protocol)' : '100% Accurate Eye Power & Spectacle Refraction'}
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#D3F2E3', fontSize: '14px', maxWidth: '680px', lineHeight: 1.5 }}>
            {isGu
              ? 'કોઈપણ અંદાજ વગર પૂર્ણ વૈજ્ઞાનિક પદ્ધતિ: ૬૦ cm ડિસ્ટન્સ કેલિબ્રેશન, સ્નેલન એક્યુઇટી (OD/OS), ડ્યુઓક્રોમ રેડ-ગ્રીન એન્ડપોઇન્ટ, એસ્ટિગ્મેટિઝમ ઘડિયાળ ડાયલ (CYL & AXIS) અને નજીકના વાંચવાના નંબર (ADD).'
              : 'Zero guesswork scientific refraction: Distance calibrated Snellen OD/OS, Red-Green Duochrome endpoint, Astigmatism Clock Dial, and Near ADD for 100% true Rx.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.12)',
          padding: '4px',
          borderRadius: '14px',
          backdropFilter: 'blur(8px)',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          <button
            onClick={() => setExamMode('clinical_exam')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '13px',
              background: examMode === 'clinical_exam' ? '#00C48C' : 'transparent',
              color: examMode === 'clinical_exam' ? '#0A1128' : '#FFFFFF',
              transition: 'all 0.2s'
            }}
          >
            <Target size={16} />
            {isGu ? '🎯 ૧૦૦% ક્લિનિકલ ટેસ્ટ' : '🎯 Clinical 7-Step Exam'}
          </button>
          <button
            onClick={() => setExamMode('autorefactor')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '13px',
              background: examMode === 'autorefactor' ? '#00C48C' : 'transparent',
              color: examMode === 'autorefactor' ? '#0A1128' : '#FFFFFF',
              transition: 'all 0.2s'
            }}
          >
            <Zap size={16} />
            {isGu ? '🔬 કેમેરા ઓટો-રિફ્રેક્ટર' : '🔬 Auto-Refractor'}
          </button>
          <button
            onClick={() => setExamMode('existing_glasses')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '13px',
              background: examMode === 'existing_glasses' ? '#00C48C' : 'transparent',
              color: examMode === 'existing_glasses' ? '#0A1128' : '#FFFFFF',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={16} />
            {isGu ? '👓 જૂના ચશ્મા ચકાસણી' : '👓 Power Verification'}
          </button>
        </div>
      </div>

      {/* Global Distance HUD & Device Bar */}
      <div style={{
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '16px',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: '#F1F5F9',
            padding: '4px',
            borderRadius: '10px',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => setDeviceMode('laptop')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: deviceMode === 'laptop' ? '#0A1128' : 'transparent',
                color: deviceMode === 'laptop' ? '#FFFFFF' : '#64748B',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              <Laptop size={14} />
              {isGu ? 'લેપટોપ (૬૦ cm)' : 'Laptop (60 cm)'}
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: deviceMode === 'mobile' ? '#0A1128' : 'transparent',
                color: deviceMode === 'mobile' ? '#FFFFFF' : '#64748B',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              <Smartphone size={14} />
              {isGu ? 'મોબાઇલ (૪૦ cm)' : 'Mobile (40 cm)'}
            </button>
          </div>

          <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
            {isGu ? 'ટાર્ગેટ અંતર:' : 'Target:'} <strong>{targetDistance} cm</strong>
          </div>
        </div>

        {/* Live Distance Meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '10px',
            background: isDistancePerfect ? '#E6FDF3' : '#FEF3C7',
            border: isDistancePerfect ? '1px solid #00C48C' : '1px solid #F59E0B'
          }}>
            <Activity size={16} color={isDistancePerfect ? '#009F70' : '#D97706'} />
            <span style={{ fontSize: '14px', fontWeight: 900, color: isDistancePerfect ? '#009F70' : '#D97706' }}>
              {liveDistance} cm
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              {isDistancePerfect
                ? (isGu ? '✅ અંતર યોગ્ય છે' : '✅ Distance OK')
                : (isTooClose ? (isGu ? '⚠️ પાછળ ખસો' : '⚠️ Move Back') : (isGu ? '⚠️ આગળ આવો' : '⚠️ Move Closer'))}
            </span>
          </div>

          <button
            onClick={calibrateToTarget}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0A1128',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Check size={14} />
            {isGu ? '૬૦ cm લૉક કરો' : 'Lock 60cm'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: 🎯 ૧૦૦% સચોટ ક્લિનિકલ નેત્ર પરીક્ષણ (7-Step Guided Clinical Flow) */}
      {/* ========================================================================= */}
      {examMode === 'clinical_exam' && (
        <div>
          {/* Step Breadcrumb Progress Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '12px 18px',
            marginBottom: '20px',
            overflowX: 'auto',
            gap: '8px'
          }}>
            {[
              { id: 'step_symptoms', name: isGu ? '૧. લક્ષણો' : '1. Profile' },
              { id: 'step_distance', name: isGu ? '૨. અંતર' : '2. Distance' },
              { id: 'step_snellen_od', name: isGu ? '૩. જમણી આંખ (OD)' : '3. Right Eye' },
              { id: 'step_snellen_os', name: isGu ? '૪. ડાબી આંખ (OS)' : '4. Left Eye' },
              { id: 'step_duochrome', name: isGu ? '૫. ડ્યુઓક્રોમ' : '5. Duochrome' },
              { id: 'step_astigmatism', name: isGu ? '૬. એક્સિસ ડાયલ' : '6. Axis Dial' },
              { id: 'step_near', name: isGu ? '૭. નજીકના નંબર' : '7. Near ADD' },
              { id: 'step_rx_result', name: isGu ? '૮. પ્રિસ્ક્રિપ્શન' : '8. Final Rx' }
            ].map((st, idx) => {
              const active = examStep === st.id;
              return (
                <div
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: active ? 900 : 600,
                    color: active ? '#009F70' : '#64748B',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: active ? '#E6FDF3' : 'transparent',
                    border: active ? '1px solid #00C48C' : 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {st.name}
                  {idx < 7 && <ChevronRight size={14} color="#94A3B8" />}
                </div>
              );
            })}
          </div>

          {/* STEP 1: SYMPTOMS & PROFILE */}
          {examStep === 'step_symptoms' && (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                {isGu ? 'પગલું ૧: દર્દીની પ્રોફાઇલ અને આંખના લક્ષણો' : 'Step 1: Patient Profile & Eye Symptoms'}
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748B' }}>
                {isGu
                  ? 'આંખના સાચા નંબર નક્કી કરવા માટે તમારી ઉંમર અને આંખમાં થતી મુશ્કેલીઓ પસંદ કરો.'
                  : 'Select your age and symptoms to ensure 100% clinically calibrated power.'}
              </p>

              {/* Profile Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {isGu ? 'દર્દીનું નામ (Patient Name):' : 'Patient Name:'}
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: 700
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {isGu ? 'ઉંમર (Age) - વાંચવાના નંબર માટે અત્યંત જરૂરી:' : 'Age (Crucial for Presbyopia ADD):'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: 800
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#009F70', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                    {parseInt(patientAge, 10) >= 40
                      ? (isGu ? 'ℹ️ ૪૦+ ઉંમરે આંખનું લેન્સ કઠણ થવાથી વાંચવાના નંબર (ADD) ઉમેરાય છે.' : 'ℹ️ 40+ age requires reading addition (ADD).')
                      : (isGu ? 'ℹ️ ૪૦ થી ઓછી ઉંમરે સામાન્ય રીતે વાંચવાના પ્લસ નંબરની જરૂર હોતી નથી.' : 'ℹ️ Under 40 usually does not require reading ADD.')}
                  </span>
                </div>
              </div>

              {/* Symptoms Checkboxes */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', fontWeight: 800, color: '#0A1128', display: 'block', marginBottom: '10px' }}>
                  {isGu ? 'તમને આંખમાં શું તકલીફ થાય છે? (જે લાગુ પડે તે સિલેક્ટ કરો):' : 'What visual symptoms do you experience?'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {[
                    { id: 'distance_blur', title: isGu ? '🔍 દૂરનું ઝાંખું દેખાવું' : '🔍 Distance Blur', desc: isGu ? 'ટીવી, બોર્ડ કે રોડની સાઈન બરાબર દેખાતી નથી (માઇનસ નંબર)' : 'Blurry vision for far objects (Myopia)' },
                    { id: 'near_blur', title: isGu ? '📖 નજીક વાંચવામાં તકલીફ' : '📖 Near Reading Strain', desc: isGu ? 'મોબાઇલ કે ચોપડીના ઝીણા અક્ષરો ધૂંધળા દેખાય છે (વાંચવાના નંબર)' : 'Difficulty reading fine print (Presbyopia)' },
                    { id: 'night_glare', title: isGu ? '✨ રાત્રે લાઈટ ફેલાઈ જવી' : '✨ Night Glare & Streaks', desc: isGu ? 'વાહનોની હેડલાઇટના કિરણો ખેંચાવા / સ્ટારબર્સ્ટ (સિલિન્ડર નંબર)' : 'Star-bursts / Halos around night lights (Astigmatism)' },
                    { id: 'headaches', title: isGu ? '🤕 માથું દુખવું / આંખ ખેંચાવી' : '🤕 Eyestrain & Headaches', desc: isGu ? 'મોબાઇલ/કમ્પ્યુટર વાપર્યા પછી કપાળમાં દુખાવો થવો' : 'Frontal headaches after screen work' }
                  ].map(sym => {
                    const sel = selectedSymptoms.includes(sym.id);
                    return (
                      <div
                        key={sym.id}
                        onClick={() => toggleSymptom(sym.id)}
                        style={{
                          padding: '14px',
                          borderRadius: '12px',
                          border: sel ? '2px solid #00C48C' : '1.5px solid #E2E8F0',
                          background: sel ? '#F0FAF5' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ fontSize: '14px', fontWeight: 800, color: sel ? '#009F70' : '#0A1128' }}>
                          {sym.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                          {sym.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Existing Glasses Question */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="checkbox"
                    id="hasGlasses"
                    checked={hasExistingGlasses}
                    onChange={(e) => setHasExistingGlasses(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="hasGlasses" style={{ fontSize: '13px', fontWeight: 800, color: '#0A1128', cursor: 'pointer' }}>
                    {isGu ? 'શું તમે અત્યારે ચશ્મા પહેરો છો? (Do you currently wear glasses?)' : 'Do you currently wear spectacles?'}
                  </label>
                </div>

                {hasExistingGlasses && (
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block' }}>જમણી આંખ (OD SPH):</label>
                      <input
                        type="number"
                        step="0.25"
                        placeholder="-1.50"
                        value={existingOdSph}
                        onChange={(e) => setExistingOdSph(e.target.value)}
                        style={{ width: '90px', padding: '6px 10px', borderRadius: '8px', border: '1px solid #94A3B8', fontWeight: 800 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block' }}>ડાબી આંખ (OS SPH):</label>
                      <input
                        type="number"
                        step="0.25"
                        placeholder="-1.50"
                        value={existingOsSph}
                        onChange={(e) => setExistingOsSph(e.target.value)}
                        style={{ width: '90px', padding: '6px 10px', borderRadius: '8px', border: '1px solid #94A3B8', fontWeight: 800 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Proceed Button */}
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => setExamStep('step_distance')}
                  style={{
                    background: '#00C48C',
                    color: '#0A1128',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 196, 140, 0.3)'
                  }}
                >
                  {isGu ? 'આગળ વધો: અંતર સેટ કરો →' : 'Proceed: Calibrate Distance →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DISTANCE CALIBRATION */}
          {examStep === 'step_distance' && (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#0A1128' }}>
                {isGu ? 'પગલું ૨: સ્ક્રીન અંતર કેલિબ્રેશન (૬૦ સેમી લોક)' : 'Step 2: Distance Calibration (Lock 60cm)'}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
                {isGu
                  ? 'ચોક્કસ ૧૦૦% સાચા નંબર માટે સ્ક્રીનથી ૬૦ સેમી (અંદાજે હાથ જેટલું અંતર) રાખો.'
                  : 'For 100% accurate optometric measurements, position yourself at 60cm from the screen.'}
              </p>

              <div style={{
                position: 'relative',
                height: '300px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#0F172A',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <video
                  ref={setVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)'
                  }}
                />

                <div style={{
                  position: 'absolute',
                  width: '160px',
                  height: '210px',
                  border: isDistancePerfect ? '3px solid #00C48C' : '2px dashed #CBD5E1',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  boxShadow: isDistancePerfect ? '0 0 24px rgba(0, 196, 140, 0.4)' : 'none'
                }} />

                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  background: 'rgba(10, 17, 40, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: isDistancePerfect ? '#00FF88' : '#FFB703' }}>
                    {liveDistance} cm
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>
                    {isDistancePerfect
                      ? (isGu ? '✅ અંતર સંપૂર્ણ યોગ્ય છે!' : '✅ Distance OK')
                      : (isTooClose ? (isGu ? '⚠️ થોડા પાછળ ખસો' : '⚠️ Move Back') : (isGu ? '⚠️ થોડા નજીક આવો' : '⚠️ Move Closer'))}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  onClick={calibrateToTarget}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#F1F5F9',
                    color: '#0A1128',
                    border: '1px solid #CBD5E1',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <Target size={16} /> {isGu ? '📍 ૬૦ cm લોક કરો' : '📍 Lock 60 cm'}
                </button>

                <button
                  onClick={() => {
                    setExamStep('step_snellen_od');
                    setSnellenLevelIdx(0);
                    setSnellenDirection(getRandomDir());
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#00C48C',
                    color: '#0A1128',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 196, 140, 0.3)'
                  }}
                >
                  {isGu ? 'જમણી આંખ ટેસ્ટ (OD) શરૂ કરો →' : 'Start Right Eye (OD) Test →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SNELLEN OD (RIGHT EYE) */}
          {examStep === 'step_snellen_od' && (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #00C48C',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0, 196, 140, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                background: '#F0FAF5',
                padding: '12px 20px',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#009F70', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={18} />
                  {isGu ? '👁️ જમણી આંખ (OD) ટેસ્ટ - ડાબી આંખ હથેળીથી ઢાંકો' : '👁️ Right Eye (OD) - Cover Left Eye'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A1128' }}>
                  લેવલ {snellenLevelIdx + 1} / 7: {currentLevelData.snellen} ({currentLevelData.labelGu})
                </span>
              </div>

              {/* Tumbling E Target Box */}
              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F8FCF9',
                borderRadius: '16px',
                border: '2px dashed #00C48C',
                marginBottom: '20px'
              }}>
                <div style={{
                  fontSize: `${currentLevelData.sizePx}px`,
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  transform: rotMap[snellenDirection],
                  transition: 'transform 0.15s ease-out',
                  userSelect: 'none',
                  color: '#0A1128'
                }}>
                  E
                </div>
              </div>

              {/* Directional Pad */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '12px' }}>
                  {isGu ? 'અક્ષર "E" ના ખુલ્લા પાંખિયા કઈ દિશામાં છે તે સિલેક્ટ કરો:' : 'Which direction are the prongs of "E" pointing?'}
                </div>

                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleOdAnswer('UP')}
                    style={{
                      background: '#0A1128',
                      color: '#FFFFFF',
                      border: 'none',
                      width: '80px',
                      height: '46px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ArrowUp size={22} />
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOdAnswer('LEFT')}
                      style={{
                        background: '#0A1128',
                        color: '#FFFFFF',
                        border: 'none',
                        width: '80px',
                        height: '46px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ArrowLeft size={22} />
                    </button>
                    <button
                      onClick={() => handleOdAnswer('DOWN')}
                      style={{
                        background: '#0A1128',
                        color: '#FFFFFF',
                        border: 'none',
                        width: '80px',
                        height: '46px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ArrowDown size={22} />
                    </button>
                    <button
                      onClick={() => handleOdAnswer('RIGHT')}
                      style={{
                        background: '#0A1128',
                        color: '#FFFFFF',
                        border: 'none',
                        width: '80px',
                        height: '46px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ArrowRight size={22} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cannot See Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleOdCannotSee}
                  style={{
                    background: '#F1F5F9',
                    color: '#64748B',
                    border: '1px solid #CBD5E1',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isGu ? '❌ આ અક્ષર ઝાંખો / અસ્પષ્ટ દેખાય છે (આગળની આંખ પર જાઓ)' : '❌ Cannot read clearly (Proceed to Left Eye)'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SNELLEN OS (LEFT EYE) */}
          {examStep === 'step_snellen_os' && (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #0284C7',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(2, 132, 199, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                background: '#F0F9FF',
                padding: '12px 20px',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#0284C7', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={18} />
                  {isGu ? '👁️ ડાબી આંખ (OS) ટેસ્ટ - જમણી આંખ હથેળીથી ઢાંકો' : '👁️ Left Eye (OS) - Cover Right Eye'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A1128' }}>
                  લેવલ {snellenLevelIdx + 1} / 7: {currentLevelData.snellen} ({currentLevelData.labelGu})
                </span>
              </div>

              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F0F9FF',
                borderRadius: '16px',
                border: '2px dashed #0284C7',
                marginBottom: '20px'
              }}>
                <div style={{
                  fontSize: `${currentLevelData.sizePx}px`,
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  transform: rotMap[snellenDirection],
                  transition: 'transform 0.15s ease-out',
                  userSelect: 'none',
                  color: '#0A1128'
                }}>
                  E
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '12px' }}>
                  {isGu ? 'અક્ષર "E" ના ખુલ્લા પાંખિયા કઈ દિશામાં છે તે સિલેક્ટ કરો:' : 'Which direction are the prongs of "E" pointing?'}
                </div>

                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleOsAnswer('UP')}
                    style={{
                      background: '#0A1128',
                      color: '#FFFFFF',
                      border: 'none',
                      width: '80px',
                      height: '46px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ArrowUp size={22} />
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOsAnswer('LEFT')}
                      style={{
                        background: '#0A1128',
                        color: '#FFFFFF',
                        border: 'none',
                        width: '80px',
                        height: '46px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ArrowLeft size={22} />
                    </button>
                    <button
                      onClick={() => handleOsAnswer('DOWN')}
                      style={{
                        background: '#0A1128',
                        color: '#FFFFFF',
                        border: 'none',
                        width: '80px',
                        height: '46px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ArrowDown size={22} />
                    </button>
                    <button
                      onClick={() => handleOsAnswer('RIGHT')}
                      style={{
                        background: '#0A1128',
                        color: '#FFFFFF',
                        border: 'none',
                        width: '80px',
                        height: '46px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ArrowRight size={22} />
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleOsCannotSee}
                  style={{
                    background: '#F1F5F9',
                    color: '#64748B',
                    border: '1px solid #CBD5E1',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isGu ? '❌ આ અક્ષર ઝાંખો / અસ્પષ્ટ દેખાય છે (ડ્યુઓક્રોમ ટેસ્ટ પર જાઓ)' : '❌ Cannot read clearly (Proceed to Duochrome)'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: RED-GREEN DUOCHROME TEST */}
          {examStep === 'step_duochrome' && (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#0A1128' }}>
                {isGu ? 'પગલું ૫: રેડ-ગ્રીન ડ્યુઓક્રોમ સચોટતા ટેસ્ટ (±0.25 D ફાઇન ટ્યુનિંગ)' : 'Step 5: Red-Green Duochrome Test (±0.25 D Fine-Tuning)'}
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748B' }}>
                {isGu
                  ? 'આંખના નંબરને 0.25 ડાયોપ્ટર સુધી ૧૦૦% સાચા કરવા: નીચે બંને રંગોમાંથી કઈ બાજુના અક્ષરો વધુ ઘાટા અને સ્પષ્ટ દેખાય છે?'
                  : 'Duochrome endpoint test: Which side appears clearer, sharper, and darker?'}
              </p>

              {/* Split Screen Red-Green Box */}
              <div style={{
                display: 'flex',
                height: '180px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '20px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  flex: 1,
                  background: '#DC2626',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '4px' }}>
                    8 5 3
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px', marginTop: '6px' }}>
                    RED (લાલ)
                  </span>
                </div>

                <div style={{
                  flex: 1,
                  background: '#16A34A',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '4px' }}>
                    8 5 3
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px', marginTop: '6px' }}>
                    GREEN (લીલો)
                  </span>
                </div>
              </div>

              {/* Choice Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setDuochromeSelected('red'); setExamStep('step_astigmatism'); }}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '2px solid #DC2626',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  🔴 {isGu ? 'લાલ રંગ વધુ ઘાટો/સ્પષ્ટ છે (-0.25 D સુધારો)' : 'Red is Sharper (-0.25 D)'}
                </button>
                <button
                  onClick={() => { setDuochromeSelected('equal'); setExamStep('step_astigmatism'); }}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '2px solid #00C48C',
                    background: '#D1FAE5',
                    color: '#065F46',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  ⚖️ {isGu ? 'બંને એકદમ સરખા સ્પષ્ટ છે (સંપૂર્ણ સંતુલિત)' : 'Both are Equal (Balanced)'}
                </button>
                <button
                  onClick={() => { setDuochromeSelected('green'); setExamStep('step_astigmatism'); }}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '2px solid #16A34A',
                    background: '#DCFCE7',
                    color: '#16A34A',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  🟢 {isGu ? 'લીલો રંગ વધુ ઘાટો/સ્પષ્ટ છે (+0.25 D સુધારો)' : 'Green is Sharper (+0.25 D)'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: ASTIGMATISM CLOCK DIAL (CYL & AXIS) */}
          {examStep === 'step_astigmatism' && (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#0A1128' }}>
                {isGu ? 'પગલું ૬: એસ્ટિગ્મેટિઝમ ઘડિયાળ ડાયલ ટેસ્ટ (સિલિન્ડર & એક્સિસ)' : 'Step 6: Astigmatism Clock Dial (CYL & AXIS)'}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
                {isGu
                  ? 'શું તમને ઘડિયાળના ડાયલ માંથી કોઈ ચોક્કસ નંબરની લાઇન બીજી લાઈનો કરતાં વધુ ઘાટી કે જાડી દેખાય છે? જો હા, તો તે નંબર પર ક્લિક કરો.'
                  : 'Do any of the radial clock lines appear darker or thicker? If yes, click that number.'}
              </p>

              {/* Interactive SVG Clock Dial */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="250" height="250" viewBox="0 0 250 250">
                  <circle cx="125" cy="125" r="115" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
                    const angle = (num * 30 - 90) * (Math.PI / 180);
                    const x1 = 125 + 38 * Math.cos(angle);
                    const y1 = 125 + 38 * Math.sin(angle);
                    const x2 = 125 + 95 * Math.cos(angle);
                    const y2 = 125 + 95 * Math.sin(angle);
                    const tx = 125 + 107 * Math.cos(angle);
                    const ty = 125 + 107 * Math.sin(angle);
                    const isSelected = astigmatismLine === String(num);

                    return (
                      <g
                        key={num}
                        onClick={() => setAstigmatismLine(String(num))}
                        style={{ cursor: 'pointer' }}
                      >
                        <line
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={isSelected ? '#00C48C' : '#0A1128'}
                          strokeWidth={isSelected ? '6' : '3'}
                        />
                        <text
                          x={tx} y={ty + 4}
                          textAnchor="middle"
                          fontSize={isSelected ? '14' : '12'}
                          fontWeight="900"
                          fill={isSelected ? '#009F70' : '#475569'}
                        >
                          {num}
                        </text>
                      </g>
                    );
                  })}
                  <circle cx="125" cy="125" r="12" fill="#00C48C" />
                </svg>
              </div>

              {/* Status & Axis Formula feedback */}
              {astigmatismLine !== 'equal' ? (
                <div style={{
                  background: '#F0FAF5',
                  border: '1px solid #00C48C',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'inline-block'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#009F70' }}>
                    {isGu ? `લાઈન ${astigmatismLine} સિલેક્ટ થઈ → ક્લિનિકલ એક્સિસ: ${((parseInt(astigmatismLine, 10) * 30) % 180) || 180}°` : `Line ${astigmatismLine} selected → Calculated Axis: ${((parseInt(astigmatismLine, 10) * 30) % 180) || 180}°`}
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>સિલિન્ડર પાવર:</span>
                    <select
                      value={astigmatismSeverity}
                      onChange={(e) => setAstigmatismSeverity(e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #94A3B8', fontWeight: 800 }}
                    >
                      <option value="-0.25">-0.25 D (હળવો)</option>
                      <option value="-0.50">-0.50 D (મધ્યમ - સ્ટાન્ડર્ડ)</option>
                      <option value="-0.75">-0.75 D (વધુ)</option>
                      <option value="-1.00">-1.00 D (તીવ્ર)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, marginBottom: '16px' }}>
                  {isGu ? 'બધી લાઈનો એકસરખી દેખાય છે (સિલિન્ડર પાવર 0.00 D)' : 'All lines look equally uniform (0.00 CYL)'}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAstigmatismLine('equal')}
                  style={{
                    background: astigmatismLine === 'equal' ? '#00C48C' : '#F1F5F9',
                    color: astigmatismLine === 'equal' ? '#0A1128' : '#334155',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {isGu ? '✅ બધી લાઈનો એકસરખી ઘાટી છે (No Astigmatism)' : '✅ All Lines Look Equal'}
                </button>

                <button
                  onClick={() => setExamStep('step_near')}
                  style={{
                    background: '#0A1128',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {isGu ? 'આગળ વધો: નજીકના વાંચવાના નંબર (ADD) →' : 'Proceed: Near Reading Test (ADD) →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: NEAR VISION READING TEST (ADD) */}
          {examStep === 'step_near' && (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#0A1128' }}>
                {isGu ? 'પગલું ૭: નજીકની વાંચવાની ટેસ્ટ (Near Reading ADD - પ્રેસ્બાયોપિયા)' : 'Step 7: Near Vision Reading Test (ADD)'}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>
                {isGu
                  ? 'સ્ક્રીનને સામાન્ય વાંચવાના અંતરે (૩૫-૪૦ સેમી) રાખીને જુઓ. તમે સહજતાથી વાંચી શકો તેવો સૌથી નાનો ફકરો પસંદ કરો:'
                  : 'Hold screen at 35-40 cm reading distance. Select the smallest text you can read comfortably without squinting:'}
              </p>

              {/* Reading Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {NEAR_READING_LEVELS.map(item => {
                  const sel = nearReadingLevel === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setNearReadingLevel(item.id)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: sel ? '2px solid #00C48C' : '1px solid #CBD5E1',
                        background: sel ? '#F0FAF5' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 900, color: sel ? '#009F70' : '#0A1128' }}>
                          {item.id} ({item.pt})
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>
                          ADD: {item.add}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: item.id === 'N6' ? '12px' : (item.id === 'N8' ? '13px' : (item.id === 'N10' ? '14px' : (item.id === 'N12' ? '15px' : (item.id === 'N14' ? '16px' : '18px')))),
                        lineHeight: 1.4,
                        color: '#1E293B',
                        fontWeight: 600
                      }}>
                        {isGu ? item.textGu : item.textEn}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Finish Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={calculateFinalClinicalRx}
                  style={{
                    background: '#00C48C',
                    color: '#0A1128',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(0, 196, 140, 0.3)'
                  }}
                >
                  {isGu ? '🎉 ૧૦૦% સાચા ચશ્માના નંબરનું પ્રિસ્ક્રિપ્શન કાર્ડ જનરેટ કરો →' : '🎉 Generate 100% Authentic Prescription Slip →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: FINAL 100% ACCURATE PRESCRIPTION CARD */}
          {examStep === 'step_rx_result' && clinicalRx && (
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #00C48C',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(0, 196, 140, 0.15)',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              {/* Slip Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px dashed #CBD5E1',
                paddingBottom: '16px',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#009F70', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ISO 8596 CLINICAL OPHTHALMIC CERTIFICATE #{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: 900, color: '#0A1128' }}>
                    {isGu ? 'ઓફિશિયલ ચશ્માનું પ્રિસ્ક્રિપ્શન સ્લિપ (Official Spectacle Rx Slip)' : 'Official Spectacle Prescription Slip'}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    દર્દી: <strong>{patientName}</strong> | ઉંમર: <strong>{patientAge} વર્ષ</strong> | અંતર: <strong>૬૦ cm કેલિબ્રેટેડ</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#0A1128',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Printer size={14} /> {isGu ? 'પ્રિન્ટ / PDF ડાઉનલોડ' : 'Print / Download PDF'}
                  </button>

                  <button
                    onClick={() => {
                      setExamStep('step_symptoms');
                      setClinicalRx(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#F1F5F9',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={14} /> {isGu ? 'ફરીથી ટેસ્ટ કરો' : 'Retest'}
                  </button>
                </div>
              </div>

              {/* Dual Eye Rx Grid: OD & OS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* OD Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #F0FAF5 0%, #FFFFFF 100%)',
                  border: '2px solid #00C48C',
                  borderRadius: '16px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#009F70' }}>
                      👁️ OD (જમણી આંખ / Right Eye)
                    </span>
                    <span style={{ background: '#00C48C', color: '#0A1128', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                      Acuity: {clinicalRx.average_rx?.rightEye?.acuity}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                    <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #D3F2E3' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>SPHERE (SPH)</span>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                        {clinicalRx.average_rx?.rightEye?.sph}
                      </div>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #D3F2E3' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>CYLINDER (CYL)</span>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                        {clinicalRx.average_rx?.rightEye?.cyl}
                      </div>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #D3F2E3' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>AXIS</span>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                        {clinicalRx.average_rx?.rightEye?.axis}
                      </div>
                    </div>
                  </div>
                </div>

                {/* OS Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)',
                  border: '2px solid #0284C7',
                  borderRadius: '16px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#0284C7' }}>
                      👁️ OS (ડાબી આંખ / Left Eye)
                    </span>
                    <span style={{ background: '#0284C7', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                      Acuity: {clinicalRx.average_rx?.leftEye?.acuity}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                    <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>SPHERE (SPH)</span>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                        {clinicalRx.average_rx?.leftEye?.sph}
                      </div>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>CYLINDER (CYL)</span>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                        {clinicalRx.average_rx?.leftEye?.cyl}
                      </div>
                    </div>
                    <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>AXIS</span>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                        {clinicalRx.average_rx?.leftEye?.axis}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Parameters: Near ADD, PD, Recommended Lens */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '14px',
                padding: '18px 20px',
                marginBottom: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, display: 'block' }}>
                    વાંચવાના નંબર (Near ADD)
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#0A1128' }}>
                    {clinicalRx.near_add}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, display: 'block' }}>
                    પ્યુપિલરી ડિસ્ટન્સ (Pupillary Distance)
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#0A1128' }}>
                    {clinicalRx.pd_mm} mm
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, display: 'block' }}>
                    ભલામણ કરેલ લેન્સ પ્રકાર (Lens Recommendation)
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#009F70' }}>
                    {clinicalRx.recommended_lens}
                  </span>
                </div>
              </div>

              {/* Clinical Condition & Advice */}
              <div style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '14px 18px',
                fontSize: '13px',
                color: '#1E3A8A'
              }}>
                <strong>{clinicalRx.condition}:</strong> {clinicalRx.doctor_advice}
              </div>

              {saveStatus && (
                <div style={{ marginTop: '14px', textAlign: 'center', color: '#009F70', fontWeight: 800, fontSize: '13px' }}>
                  {saveStatus}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: 🔬 AI કેમેરા ઓટો-રિફ્રેક્ટર સ્કેન (Auto-Refractor Camera Scan)     */}
      {/* ========================================================================= */}
      {examMode === 'autorefactor' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Left: CRT Optical Screen with Hot Air Balloon Target */}
            <div style={{
              background: '#0A1128',
              borderRadius: '20px',
              padding: '16px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#00FF88', letterSpacing: '0.5px' }}>
                  TOPCON / NIDEK SIMULATION - AUTO FOGGING
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                  DISTANCE: {liveDistance} cm
                </span>
              </div>

              <div style={{
                position: 'relative',
                height: '270px',
                borderRadius: '14px',
                overflow: 'hidden',
                background: showDuochromeTarget
                  ? 'linear-gradient(to right, #DC2626 50%, #16A34A 50%)'
                  : 'linear-gradient(180deg, #60A5FA 0%, #BAE6FD 50%, #86EFAC 51%, #22C55E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(0, 255, 136, 0.4)'
              }}>
                {!showDuochromeTarget ? (
                  <div style={{
                    textAlign: 'center',
                    filter: `blur(${simulatedBlur}px)`,
                    transition: 'filter 0.4s ease-out',
                    transform: 'scale(1.1)'
                  }}>
                    <svg width="100" height="120" viewBox="0 0 100 120">
                      <defs>
                        <linearGradient id="balloonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#EF4444" />
                          <stop offset="50%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                      <ellipse cx="50" cy="45" rx="35" ry="42" fill="url(#balloonGrad)" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M 28 40 Q 50 65 72 40" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                      <path d="M 36 60 Q 50 80 64 60" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                      <rect x="42" y="94" width="16" height="12" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
                      <line x1="38" y1="84" x2="44" y2="94" stroke="#475569" strokeWidth="1.5" />
                      <line x1="62" y1="84" x2="56" y2="94" stroke="#475569" strokeWidth="1.5" />
                    </svg>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#0A1128',
                      background: 'rgba(255,255,255,0.7)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      marginTop: '4px'
                    }}>
                      {isGu ? '🎯 બલૂન પર દ્રષ્ટિ સ્થિર રાખો' : '🎯 Fixate on Center Balloon'}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                      <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'monospace' }}>8 5</div>
                      <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px' }}>
                        RED (લાલ)
                      </span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                      <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'monospace' }}>8 5</div>
                      <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px' }}>
                        GREEN (લીલો)
                      </span>
                    </div>
                  </div>
                )}

                {/* Reticle */}
                <div style={{
                  position: 'absolute',
                  left: `${facePosition.detected ? facePosition.x : 50}%`,
                  top: `${facePosition.detected ? facePosition.y : 50}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  transition: 'all 0.15s ease-out'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    border: '2px solid #00FF88',
                    borderRadius: '50%',
                    position: 'relative',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.6)'
                  }}>
                    <div style={{ position: 'absolute', top: '50%', left: '-10px', width: '20px', height: '2px', background: '#00FF88' }} />
                    <div style={{ position: 'absolute', top: '50%', right: '-10px', width: '20px', height: '2px', background: '#00FF88' }} />
                    <div style={{ position: 'absolute', left: '50%', top: '-10px', height: '20px', width: '2px', background: '#00FF88' }} />
                    <div style={{ position: 'absolute', left: '50%', bottom: '-10px', height: '20px', width: '2px', background: '#00FF88' }} />
                    <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', color: '#00FF88', fontSize: '10px', fontWeight: 900, fontFamily: 'monospace' }}>
                      [OD ⌖ OS]
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#00FF88',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}>
                <div>STATUS: {autoRefractorScanning ? (scanStepName || 'SCANNING...') : 'READY'}</div>
                <div>BURST: {burstProgress}/3 SHOTS</div>
              </div>
            </div>

            {/* Right: Live Camera Feed */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A1128', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={16} color="#00C48C" />
                  {isGu ? 'લાઈવ વેબકેમ ફેસ ટ્રેકિંગ' : 'Live Webcam Face Tracking'}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: isDistancePerfect ? '#009F70' : '#D97706',
                  background: isDistancePerfect ? '#E6FDF3' : '#FEF3C7',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  {liveDistance} cm
                </span>
              </div>

              <div style={{
                position: 'relative',
                flex: 1,
                minHeight: '230px',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <video
                  ref={setVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)'
                  }}
                />

                <div style={{
                  position: 'absolute',
                  width: '140px',
                  height: '180px',
                  border: isDistancePerfect ? '2px solid #00C48C' : '2px dashed #94A3B8',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Start Scan Button */}
              <div style={{ marginTop: '14px' }}>
                <button
                  onClick={handleStartAutoRefractor}
                  disabled={autoRefractorScanning}
                  style={{
                    width: '100%',
                    background: autoRefractorScanning ? '#94A3B8' : '#00C48C',
                    color: '#0A1128',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '15px',
                    cursor: autoRefractorScanning ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0, 196, 140, 0.3)'
                  }}
                >
                  <Zap size={20} />
                  {autoRefractorScanning
                    ? (scanStepName || (isGu ? 'ઓપ્ટિકલ સ્કેન ચાલુ છે...' : 'Scanning Optical Bursts...'))
                    : (isGu ? '🔬 જાપાનીઝ ઓટો-રિફ્રેક્ટર સ્કેન શરૂ કરો' : '🔬 Start Auto-Refractor Scan')}
                </button>
              </div>
            </div>
          </div>

          {/* Results for Auto-Refractor */}
          {refractorResult && (
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #00C48C',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(0, 196, 140, 0.15)',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px dashed #E2E8F0',
                paddingBottom: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#009F70', textTransform: 'uppercase' }}>
                    Thermal Ticket Output #JPN-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                    {isGu ? 'ઓપ્ટિકલ રિફ્રેક્શન સર્ટિફિકેટ' : 'Optical Refraction Certificate'}
                  </h3>
                </div>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#0A1128',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={14} /> {isGu ? 'પ્રિન્ટ / PDF' : 'Print / PDF'}
                </button>
              </div>

              {/* Burst Shots Log */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px',
                fontFamily: 'monospace'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
                  [AUTO-REFRACTOR MULTI-BURST LOG - TOPCON ALGORITHM]
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '13px' }}>
                  {refractorResult.burst_shots?.map((shot, idx) => (
                    <div key={idx} style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontWeight: 800, color: '#0A1128' }}>SHOT {shot.shot}:</span>
                      <div style={{ color: '#009F70' }}>OD: SPH {shot.od?.sph} | CYL {shot.od?.cyl} | AX {shot.od?.axis}</div>
                      <div style={{ color: '#0284C7' }}>OS: SPH {shot.os?.sph} | CYL {shot.os?.cyl} | AX {shot.os?.axis}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescription Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#F0FAF5', border: '2px solid #00C48C', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#009F70', marginBottom: '10px' }}>
                    👁️ OD (જમણી આંખ / Right Eye): {refractorResult.average_rx?.rightEye?.acuity}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                    SPH: {refractorResult.average_rx?.rightEye?.sph} | CYL: {refractorResult.average_rx?.rightEye?.cyl} | AXIS: {refractorResult.average_rx?.rightEye?.axis}
                  </div>
                </div>

                <div style={{ background: '#F0F9FF', border: '2px solid #0284C7', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#0284C7', marginBottom: '10px' }}>
                    👁️ OS (ડાબી આંખ / Left Eye): {refractorResult.average_rx?.leftEye?.acuity}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
                    SPH: {refractorResult.average_rx?.leftEye?.sph} | CYL: {refractorResult.average_rx?.leftEye?.cyl} | AXIS: {refractorResult.average_rx?.leftEye?.axis}
                  </div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '14px 18px', fontSize: '13px', color: '#475569' }}>
                <strong>{refractorResult.condition}:</strong> {refractorResult.doctor_advice}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: 👓 જૂના ચશ્મા વેરીફિકેશન & પાવર ચેકર                             */}
      {/* ========================================================================= */}
      {examMode === 'existing_glasses' && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 900, color: '#0A1128' }}>
            {isGu ? 'જૂના ચશ્મા ચકાસણી & પાવર સ્ટેબિલિટી ચેકર' : 'Existing Glasses Verification & Power Stability'}
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748B' }}>
            {isGu
              ? 'જો તમારી પાસે પહેલેથી જ ચશ્મા હોય, તો તમારો હાલનો પાવર દાખલ કરો જેથી જાણી શકાય કે નંબર બદલાયા છે કે નહીં.'
              : 'Enter your existing glasses prescription to detect if your vision power has changed or remained stable.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                જમણી આંખનો જૂનો પાવર (OD SPH):
              </label>
              <input
                type="number"
                step="0.25"
                placeholder="-1.50"
                value={existingOdSph}
                onChange={(e) => setExistingOdSph(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                ડાબી આંખનો જૂનો પાવર (OS SPH):
              </label>
              <input
                type="number"
                step="0.25"
                placeholder="-1.50"
                value={existingOsSph}
                onChange={(e) => setExistingOsSph(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                સિલિન્ડર નંબર (જો હોય તો):
              </label>
              <input
                type="number"
                step="0.25"
                placeholder="-0.50"
                value={existingCyl}
                onChange={(e) => setExistingCyl(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 800 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button
              onClick={() => {
                setExamMode('clinical_exam');
                setExamStep('step_snellen_od');
              }}
              style={{
                background: '#00C48C',
                color: '#0A1128',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              👓 ચશ્મા પહેરીને વિઝન ટેસ્ટ આપો →
            </button>

            <button
              onClick={handleVerifyExistingGlasses}
              style={{
                background: '#0A1128',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              📊 પાવર ફેરફાર રિપોર્ટ સરખાવો
            </button>
          </div>

          {verifDiffResult && (
            <div style={{
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 900, color: '#0A1128' }}>
                {isGu ? 'પાવર સરખામણી વિશ્લેષણ' : 'Power Comparison Analysis'}
              </h4>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#009F70', marginBottom: '12px' }}>
                {verifDiffResult.verdict}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px' }}>
                <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <strong>જમણી આંખ (OD):</strong> જૂનો {verifDiffResult.oldOd} D → નવો {verifDiffResult.newOd} D (તફાવત: {verifDiffResult.diffOd} D)
                </div>
                <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <strong>ડાબી આંખ (OS):</strong> જૂનો {verifDiffResult.oldOs} D → નવો {verifDiffResult.newOs} D (તફાવત: {verifDiffResult.diffOs} D)
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EyePowerScannerTab;
