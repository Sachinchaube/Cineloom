import React from 'react';

export function BrandLogo({ size = 'default', showSubtitle = false, onClick = null }) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const iconDim = isSmall ? 30 : isLarge ? 48 : 38;
  const fontSize = isSmall ? '17px' : isLarge ? '28px' : '22px';

  return (
    <div
      className="brand-logo-container"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '8px' : '12px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* Creative Dynamic SVG Cinema Emblem */}
      <div
        className="brand-icon-wrapper"
        style={{
          width: `${iconDim}px`,
          height: `${iconDim}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #1c1f2e 0%, #0d0e15 100%)',
          border: '1px solid rgba(229, 9, 20, 0.4)',
          boxShadow: '0 4px 16px rgba(229, 9, 20, 0.35)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <svg
          viewBox="0 0 44 44"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ padding: '4px' }}
        >
          <defs>
            <linearGradient id="cineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d58" />
              <stop offset="50%" stopColor="#e50914" />
              <stop offset="100%" stopColor="#990000" />
            </linearGradient>
            <linearGradient id="lensGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd269" />
              <stop offset="100%" stopColor="#e5a93c" />
            </linearGradient>
            <radialGradient id="apertureGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4d58" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e50914" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Aperture Core Background Glow */}
          <circle cx="22" cy="22" r="16" fill="url(#apertureGlow)" />

          {/* Outer Lens Ring with Film Perforations */}
          <circle
            cx="22"
            cy="22"
            r="16.5"
            stroke="url(#cineGlow)"
            strokeWidth="2"
            strokeDasharray="4 2.5"
          />

          {/* Inner Optical Lens Core */}
          <circle
            cx="22"
            cy="22"
            r="10.5"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1.2"
          />

          {/* Stylized Interlocking Cinematic "C" and "L" Projector Shutter */}
          <path
            d="M26 13C20.5 13 16 17 16 22C16 27 20.5 31 26 31"
            stroke="url(#cineGlow)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M22 17L22 27L28 27"
            stroke="url(#lensGold)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Projector Center Beam Dot */}
          <circle cx="22" cy="22" r="2.2" fill="#ffffff" />
        </svg>

        {/* Anamorphic Flare Shimmer Overlay */}
        <div
          className="brand-shimmer-beam"
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-25deg)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Brand Typography */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span>CINE</span>
          <span
            style={{
              background: 'linear-gradient(135deg, #ff4d58 0%, #e50914 50%, #e5a93c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800
            }}
          >
            LOOM
          </span>
          <span
            style={{
              display: 'inline-block',
              width: isSmall ? '4px' : '6px',
              height: isSmall ? '4px' : '6px',
              borderRadius: '50%',
              background: '#e50914',
              marginLeft: '3px',
              boxShadow: '0 0 8px rgba(229, 9, 20, 0.8)'
            }}
          />
        </div>

        {showSubtitle && (
          <div
            style={{
              fontSize: isSmall ? '9px' : '10.5px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginTop: '3px'
            }}
          >
            Cinema Networks
          </div>
        )}
      </div>
    </div>
  );
}
