import React from 'react';

export interface AdventureRoadSvgProps {
  themeColor: string;
  secondaryColor?: string;
  totalNodes?: number;
}

/**
 * AdventureRoadSvg - Renders a continuous, stylized 3D cobblestone winding road
 * that weaves organically through the 10 nodes, chests, and boss platform.
 */
export const AdventureRoadSvg: React.FC<AdventureRoadSvgProps> = ({
  themeColor,
  secondaryColor = '#059669',
}) => {
  return (
    <svg
      className="absolute top-10 inset-x-0 w-full h-[calc(100%-80px)] pointer-events-none z-0 overflow-visible"
      viewBox="0 0 520 1800"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft shadow filter for the road */}
        <filter id="road-shadow" x="-10%" y="-5%" width="120%" height="110%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.12)" />
        </filter>

        {/* Linear gradient for the road base */}
        <linearGradient id="road-stone-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="25%" stopColor="#F8FAFC" />
          <stop offset="75%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Road Border Accent Gradient */}
        <linearGradient id="road-border-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={themeColor} stopOpacity="0.4" />
          <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={themeColor} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* ── 1. Wide Dirt/Grass Path Bed (Outer Contour) ── */}
      <path
        d="M 260 40
           C 290 120, 315 180, 315 250
           C 315 320, 335 380, 335 440
           C 335 500, 310 560, 260 620
           C 210 680, 205 740, 205 810
           C 205 880, 190 940, 190 1010
           C 190 1080, 210 1140, 260 1200
           C 310 1260, 315 1320, 315 1390
           C 315 1460, 290 1520, 260 1600
           L 260 1720"
        stroke="#E2E8F0"
        strokeWidth="68"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#road-shadow)"
      />

      {/* ── 2. Decorative Outer Cobblestone Edges ── */}
      <path
        d="M 260 40
           C 290 120, 315 180, 315 250
           C 315 320, 335 380, 335 440
           C 335 500, 310 560, 260 620
           C 210 680, 205 740, 205 810
           C 205 880, 190 940, 190 1010
           C 190 1080, 210 1140, 260 1200
           C 310 1260, 315 1320, 315 1390
           C 315 1460, 290 1520, 260 1600
           L 260 1720"
        stroke="url(#road-border-gradient)"
        strokeWidth="56"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── 3. Main Paved Road Surface ── */}
      <path
        d="M 260 40
           C 290 120, 315 180, 315 250
           C 315 320, 335 380, 335 440
           C 335 500, 310 560, 260 620
           C 210 680, 205 740, 205 810
           C 205 880, 190 940, 190 1010
           C 190 1080, 210 1140, 260 1200
           C 310 1260, 315 1320, 315 1390
           C 315 1460, 290 1520, 260 1600
           L 260 1720"
        stroke="url(#road-stone-gradient)"
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── 4. Golden Waypoint Center Dash Line ── */}
      <path
        d="M 260 40
           C 290 120, 315 180, 315 250
           C 315 320, 335 380, 335 440
           C 335 500, 310 560, 260 620
           C 210 680, 205 740, 205 810
           C 205 880, 190 940, 190 1010
           C 190 1080, 210 1140, 260 1200
           C 310 1260, 315 1320, 315 1390
           C 315 1460, 290 1520, 260 1600
           L 260 1720"
        stroke="#F59E0B"
        strokeWidth="4"
        strokeDasharray="10 14"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
};
