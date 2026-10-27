import React from 'react';

/**
 * Official Medical Stamp (સત્તાવાર સરકારી સિક્કો / Seal)
 * Generates an authentic, high-resolution circular medical seal with double rings,
 * curved official text, central caduceus/cross emblem, and realistic ink stamp tilt.
 */
export const OfficialMedicalStamp = ({
  size = 120,
  regNumber = 'GMC-GUJ-2016-48291',
  doctorName = 'Dr. Jay Parmar',
  council = 'GUJARAT MEDICAL COUNCIL',
  department = 'GOVT. REGD. HEALTHCARE NETWORK',
  color = '#1D4ED8', // Official ink stamp royal blue
  rotation = -8,
  showDate = true
}) => {
  const dateStr = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY

  return (
    <div
      className="official-medical-stamp"
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${rotation}deg)`,
        userSelect: 'none',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 2px 4px rgba(29, 78, 216, 0.15))'
      }}
      title="Official Medical Council Verified Stamp"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Top curve for council header text */}
          <path
            id="stampTopCurve"
            d="M 24,100 A 76,76 0 0,1 176,100"
            fill="none"
          />
          {/* Bottom curve for verification text */}
          <path
            id="stampBottomCurve"
            d="M 176,100 A 76,76 0 0,1 24,100"
            fill="none"
          />
        </defs>

        {/* Outer Ring */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray="none"
          opacity="0.95"
        />

        {/* Beaded / Dotted Accent Ring */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          strokeDasharray="2.5,2.5"
          opacity="0.75"
        />

        {/* Inner Border Ring */}
        <circle
          cx="100"
          cy="100"
          r="66"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          opacity="0.9"
        />

        {/* Innermost Ring */}
        <circle
          cx="100"
          cy="100"
          r="61"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Top Curved Text */}
        <text
          fill={color}
          fontSize="11.5"
          fontWeight="900"
          letterSpacing="2.2px"
          style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
        >
          <textPath href="#stampTopCurve" startOffset="50%" textAnchor="middle">
            ★ {council} ★
          </textPath>
        </text>

        {/* Bottom Curved Text */}
        <text
          fill={color}
          fontSize="10"
          fontWeight="900"
          letterSpacing="1.8px"
          style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
        >
          <textPath href="#stampBottomCurve" startOffset="50%" textAnchor="middle">
            ★ VERIFIED & REGISTERED ★
          </textPath>
        </text>

        {/* Center Content: Medical Cross / Caduceus & Details */}
        {/* Medical Cross Symbol */}
        <g transform="translate(100, 78)">
          <rect x="-3" y="-14" width="6" height="28" fill={color} rx="1.5" />
          <rect x="-14" y="-3" width="28" height="6" fill={color} rx="1.5" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        </g>

        {/* Center Labels */}
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fill={color}
          fontSize="9"
          fontWeight="900"
          letterSpacing="0.8px"
          style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
        >
          SRI SRI HEALTHCARE
        </text>

        <text
          x="100"
          y="120"
          textAnchor="middle"
          fill={color}
          fontSize="8"
          fontWeight="800"
          letterSpacing="0.4px"
          style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
        >
          REG: {regNumber.split('-').slice(-2).join('-') || regNumber}
        </text>

        {showDate && (
          <text
            x="100"
            y="131"
            textAnchor="middle"
            fill={color}
            fontSize="7"
            fontWeight="700"
            letterSpacing="0.5px"
            opacity="0.85"
            style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
          >
            DATE: {dateStr}
          </text>
        )}

        <text
          x="100"
          y="141"
          textAnchor="middle"
          fill={color}
          fontSize="7"
          fontWeight="800"
          letterSpacing="0.5px"
          style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
        >
          OFFICIAL CLINICAL SEAL
        </text>
      </svg>
    </div>
  );
};

/**
 * Helper to generate raw SVG string for native window.print() HTML documents
 */
export const generateOfficialStampSvgString = ({
  size = 110,
  regNumber = 'G-48291',
  council = 'GUJARAT MEDICAL COUNCIL',
  color = '#1D4ED8',
  rotation = -8
} = {}) => {
  const dateStr = new Date().toLocaleDateString('en-GB');
  return `
    <div style="display:inline-block;transform:rotate(${rotation}deg);margin:0 12px;vertical-align:middle;">
      <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="prTop" d="M 24,100 A 76,76 0 0,1 176,100" fill="none" />
          <path id="prBottom" d="M 176,100 A 76,76 0 0,1 24,100" fill="none" />
        </defs>
        <circle cx="100" cy="100" r="95" fill="none" stroke="${color}" stroke-width="3.5" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="${color}" stroke-width="1.2" stroke-dasharray="2.5,2.5" />
        <circle cx="100" cy="100" r="66" fill="none" stroke="${color}" stroke-width="2.5" />
        <circle cx="100" cy="100" r="61" fill="none" stroke="${color}" stroke-width="1" opacity="0.6" />
        <text fill="${color}" font-size="11.5" font-weight="900" letter-spacing="2.2px" font-family="'Plus Jakarta Sans', sans-serif">
          <textPath href="#prTop" startOffset="50%" text-anchor="middle">★ ${council} ★</textPath>
        </text>
        <text fill="${color}" font-size="10" font-weight="900" letter-spacing="1.8px" font-family="'Plus Jakarta Sans', sans-serif">
          <textPath href="#prBottom" startOffset="50%" text-anchor="middle">★ VERIFIED & REGISTERED ★</textPath>
        </text>
        <g transform="translate(100, 78)">
          <rect x="-3" y="-14" width="6" height="28" fill="${color}" rx="1.5" />
          <rect x="-14" y="-3" width="28" height="6" fill="${color}" rx="1.5" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        </g>
        <text x="100" y="108" text-anchor="middle" fill="${color}" font-size="9" font-weight="900" font-family="'Plus Jakarta Sans', sans-serif">SRI SRI HEALTHCARE</text>
        <text x="100" y="120" text-anchor="middle" fill="${color}" font-size="8" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">REG: ${regNumber}</text>
        <text x="100" y="131" text-anchor="middle" fill="${color}" font-size="7" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif">DATE: ${dateStr}</text>
        <text x="100" y="141" text-anchor="middle" fill="${color}" font-size="7" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif">OFFICIAL CLINICAL SEAL</text>
      </svg>
    </div>
  `;
};
