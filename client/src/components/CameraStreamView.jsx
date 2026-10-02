import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, CheckCircle2, Video, VideoOff, Eye, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';
import { validateMedicalImage, EXPECTED_DOC_TYPES } from '../services/imageValidatorService';

export const CameraStreamView = ({ 
  onFrameCaptured, 
  isScanning, 
  scanProgress, 
  defaultImage, 
  title = "લાઈવ કેમેરા / વિઝન સ્કેનર",
  showReticle = true,
  expectedDocType = null,
  onResetToSample
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start real browser webcam stream
  const startCamera = async () => {
    setErrorMessage(null);
    setValidationError(null);
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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
        setCapturedImage(null);
      } else {
        setErrorMessage("તમારા બ્રાઉઝરમાં કેમેરા એક્સેસ સપોર્ટ ઉપલબ્ધ નથી.");
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setErrorMessage("કેમેરા એક્સેસ મંજૂરી નકારાઈ છે અથવા કેમેરા અન્ય એપ્લિકેશનમાં ચાલુ છે. સેમ્પલ મોડ ઉપલબ્ધ છે.");
      setCameraActive(false);
    }
  };

  // Stop camera stream
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
    return () => {
      stopCamera();
    };
  }, []);

  // Capture frame from active video stream with validation
  const captureSnapshot = async () => {
    if (videoRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

      // Validate capture against expected document type
      if (expectedDocType) {
        const check = await validateMedicalImage(dataUrl, expectedDocType);
        if (!check.isValid) {
          setValidationError(check);
          return;
        }
      }

      setValidationError(null);
      setCapturedImage(dataUrl);
      if (onFrameCaptured) {
        onFrameCaptured(dataUrl);
      }
    }
  };

  // Upload custom file/image with validation
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      // Check validation
      if (expectedDocType) {
        const check = await validateMedicalImage(file, expectedDocType);
        if (!check.isValid) {
          setValidationError(check);
          return;
        }
      }

      setValidationError(null);
      setCapturedImage(url);
      stopCamera();
      if (onFrameCaptured) {
        onFrameCaptured(url);
      }
    }
  };

  return (
    <div style={{
      background: '#0F172A',
      borderRadius: '22px',
      padding: '20px',
      textAlign: 'center',
      color: '#FFFFFF',
      position: 'relative',
      border: validationError ? '2px solid #EF4444' : '2px solid #00C48C',
      boxShadow: validationError ? '0 12px 40px rgba(239, 68, 68, 0.25)' : '0 12px 40px rgba(0, 196, 140, 0.2)',
      overflow: 'hidden'
    }}>
      {/* 6D Laser Scanline Animation Overlay */}
      {isScanning && <div className="holographic-laser-scan" />}

      {/* Camera / Image Viewport Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '260px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#050B14',
        border: '1.5px solid #1E293B',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Real Live Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: cameraActive && !capturedImage ? 'block' : 'none'
          }}
        />

        {/* Captured Snapshot or Preset Sample Image */}
        {(!cameraActive || capturedImage) && (
          <img
            src={capturedImage || defaultImage}
            alt="Scan Viewport"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isScanning ? 0.75 : 1,
              transition: 'all 0.3s ease'
            }}
          />
        )}

        {/* Viewfinder Target Reticle */}
        {showReticle && !isScanning && !validationError && (
          <div style={{
            position: 'absolute',
            width: '160px',
            height: '160px',
            border: '2px dashed rgba(0, 196, 140, 0.7)',
            borderRadius: '50%',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 196, 140, 0.15)'
          }}>
            <div style={{ width: '8px', height: '8px', background: '#00C48C', borderRadius: '50%' }} />
          </div>
        )}

        {/* Live Active Badge */}
        {cameraActive && !capturedImage && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(239, 68, 68, 0.85)',
            color: '#FFFFFF',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', background: '#FFFFFF', borderRadius: '50%' }} className="animated-pulse" />
            LIVE WEBCAM
          </div>
        )}

        {/* Scanning Badge */}
        {isScanning && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 196, 140, 0.95)',
            color: '#FFFFFF',
            padding: '10px 22px',
            borderRadius: '24px',
            fontWeight: 800,
            fontSize: '14px',
            zIndex: 30,
            boxShadow: '0 0 30px rgba(0, 196, 140, 0.9)'
          }}>
            ⚡ AI વિશ્લેષણ... {scanProgress}%
          </div>
        )}
      </div>

      {/* INVALID DOCUMENT / WRONG IMAGE GUARDRAIL ALERT */}
      {validationError && (
        <div style={{
          background: '#FEF2F2',
          border: '2px solid #EF4444',
          borderRadius: '14px',
          padding: '14px',
          color: '#991B1B',
          textAlign: 'left',
          marginBottom: '14px',
          boxShadow: '0 4px 16px rgba(239, 68, 68, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '14px', color: '#DC2626', marginBottom: '4px' }}>
            <AlertOctagon size={18} />
            {validationError.errorMessage}
          </div>
          <p style={{ margin: '4px 0 8px 0', fontSize: '12.5px', color: '#7F1D1D' }}>
            <b>ઓળખાયેલ ફાઈલ:</b> {validationError.detectedType}
          </p>
          <div style={{ background: '#FFF5F5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #FEB2B2', fontSize: '12px', color: '#991B1B', marginBottom: '10px' }}>
            👉 <b>સાચો ઉપાય:</b> {validationError.expectedGuide}
          </div>
          {onResetToSample && (
            <button
              onClick={() => { setValidationError(null); onResetToSample(); }}
              style={{
                background: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔄 સાચી સેમ્પલ ઈમેજ લો <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {errorMessage && (
        <div style={{ fontSize: '11.5px', color: '#F87171', marginBottom: '10px', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 10px', borderRadius: '8px' }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Interactive Controls Bar */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Toggle Live Camera */}
        {!cameraActive ? (
          <button
            className="btn-primary"
            onClick={startCamera}
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >
            <Video size={16} />
            📹 લાઈવ કેમેરો ચાલુ કરો
          </button>
        ) : (
          <>
            <button
              className="btn-primary"
              onClick={captureSnapshot}
              style={{ padding: '10px 18px', fontSize: '13px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
            >
              <Camera size={16} />
              📸 લાઈવ ફોટો પાડો & સ્કેન કરો
            </button>

            <button
              className="btn-secondary"
              onClick={stopCamera}
              style={{ fontSize: '13px', padding: '10px 14px', background: '#FEF2F2', borderColor: '#EF4444', color: '#EF4444' }}
            >
              <VideoOff size={16} />
              કેમેરા બંધ
            </button>
          </>
        )}

        {/* Upload Button */}
        <label style={{
          background: '#FFFFFF',
          color: '#0A1128',
          border: '1.5px solid #D3F2E3',
          borderRadius: '12px',
          padding: '10px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 700
        }}>
          <Upload size={16} color="#00C48C" />
          <span>ફાઈલ/PDF અપલોડ</span>
          <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>

        {(capturedImage || validationError) && (
          <button
            className="btn-secondary"
            onClick={() => { setCapturedImage(null); setValidationError(null); }}
            style={{ fontSize: '12px', padding: '10px 12px' }}
          >
            <RefreshCw size={14} /> રીસેટ
          </button>
        )}
      </div>
    </div>
  );
};
