/**
 * Packshot v3 — Editorial × Rap
 *
 * 1080×1080 square · 30fps · 6 seconds · seamless loop
 *
 * Design DNA: Aimé Leon Dore editorial confidence × Off-White streetwear
 * codes × Travis Scott chaos restraint × Damso album-cover minimalism.
 *
 * Brand-rap codes used:
 *   - Off-White «×» quotation marks on the "rap." accent
 *   - "FEAT. FRAÎCHE LA PEUFRA" track-card tag
 *   - Track number "01/06" like a playlist position
 *   - Spinning vinyl ring behind the sachet (anchor: musique)
 *   - Marker pen scribble underline (handwritten over polish)
 *   - Diagonal caution-tape strip "ÉDITION LIMITÉE" Off-White style
 */
import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';

const { fontFamily: FRAUNCES } = loadFraunces();
const { fontFamily: MONO } = loadJetBrains();
const { fontFamily: ANTON } = loadAnton();

/* Brand tokens */
const BLEU_NUIT = '#11244d';
const PAPER = '#f4efe4';
const NEON = '#f3e000';
const GLACE = '#c4def0';
const INK = '#16140f';

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
      opacity: 0.1,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '240px',
    }}
  />
);

/* Spinning vinyl ring — anchor that signals "music" */
const VinylRing: React.FC<{ rotation: number }> = ({ rotation }) => (
  <div
    style={{
      position: 'absolute',
      width: 880,
      height: 880,
      right: -180,
      top: '50%',
      transform: `translateY(-50%) rotate(${rotation}deg)`,
      borderRadius: '50%',
      background:
        // outer ring
        `radial-gradient(circle at 50% 50%, transparent 0 38%, rgba(244,239,228,.06) 38.5% 39.5%, transparent 40% 100%),
         radial-gradient(circle at 50% 50%, transparent 0 41%, rgba(244,239,228,.04) 41.5% 42.5%, transparent 43% 100%),
         radial-gradient(circle at 50% 50%, transparent 0 44%, rgba(244,239,228,.06) 44.5% 45.5%, transparent 46% 100%),
         radial-gradient(circle at 50% 50%, transparent 0 47%, rgba(244,239,228,.03) 47.5% 48% , transparent 48.5% 100%),
         radial-gradient(circle at 50% 50%, rgba(243,224,0,.12) 0 6%, transparent 6.5% 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/* Marker pen scribble underline (hand-drawn SVG) */
const MarkerScribble: React.FC<{ progress: number }> = ({ progress }) => {
  /* Path drawn with slight imperfection — three short overlapping strokes */
  const totalLength = 760;
  const drawn = totalLength * progress;
  return (
    <svg
      width={580}
      height={26}
      viewBox="0 0 580 26"
      style={{ overflow: 'visible' }}
    >
      <path
        d="M 4 14 Q 80 6, 160 16 Q 250 22, 330 12 Q 410 4, 490 18 Q 540 22, 568 14"
        stroke={NEON}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
        opacity={0.92}
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: totalLength - drawn,
        }}
      />
      <path
        d="M 18 11 Q 60 9, 140 18 Q 220 22, 280 14"
        stroke={NEON}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
        style={{
          strokeDasharray: 280,
          strokeDashoffset: 280 - drawn * 0.4,
        }}
      />
    </svg>
  );
};

/* Diagonal caution tape — repeats infinitely via animated background */
const CautionTape: React.FC<{ shift: number }> = ({ shift }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 152,
      left: 0,
      right: 0,
      height: 38,
      overflow: 'hidden',
      transform: 'rotate(-1.5deg)',
      transformOrigin: 'center',
      backgroundColor: NEON,
      borderTop: `1.5px solid ${INK}`,
      borderBottom: `1.5px solid ${INK}`,
    }}
  >
    <div
      style={{
        whiteSpace: 'nowrap',
        fontFamily: ANTON,
        fontSize: 22,
        letterSpacing: '0.18em',
        color: INK,
        fontWeight: 700,
        lineHeight: '38px',
        transform: `translateX(${shift}px)`,
        textTransform: 'uppercase',
      }}
    >
      {'★ LA PIE QUI RAP × LA PIE QUI CHANTE ★ ÉDITION LIMITÉE 2026 ★ LE BONBON DU SON ★ '.repeat(4)}
    </div>
  </div>
);

export const Packshot: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const t = frame / durationInFrames;
  const tau = t * Math.PI * 2;

  /* Sachet motion */
  const tiltY = Math.sin(tau) * 6;
  const tiltZ = Math.cos(tau) * 2;
  const floatY = Math.sin(tau) * 10;
  const sachetScale = 1 + Math.sin(tau * 2) * 0.008;

  /* Light sweep */
  const sweepX = t * 220 - 60;

  /* Vinyl ring rotation — one full turn per loop */
  const vinylRotation = t * 360;

  /* Marker scribble draws on twice per loop (cycle) */
  const scribbleProgress = Math.min(1, ((t * 2) % 1) * 1.6);

  /* Caution tape scroll — left to right, repeats seamlessly */
  const tapeShift = -((t * 600) % 600);

  /* Emphasis pulse on "Menthe" */
  const emphasis = 1 + Math.sin(tau * 3) * 0.012;

  /* CTA scale pulse */
  const ctaScale = 1 + Math.sin(tau * 4) * 0.015;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 80% at 75% 45%, #1d3470 0%, ${BLEU_NUIT} 55%, #0a173a 100%)`,
      }}
    >
      {/* Vinyl ring (behind everything, anchored to right) */}
      <VinylRing rotation={vinylRotation} />

      {/* TOP-LEFT — track number */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 56,
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: ANTON,
            fontSize: 56,
            color: NEON,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
          }}
        >
          01
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 18,
            color: PAPER,
            opacity: 0.55,
            letterSpacing: '0.18em',
          }}
        >
          / 06 — TRACK CARD
        </div>
      </div>

      {/* TOP-RIGHT — brand mark */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: MONO,
          fontSize: 17,
          letterSpacing: '0.26em',
          color: PAPER,
          opacity: 0.65,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: NEON,
          }}
        />
        LA PIE RECORDS
      </div>

      {/* HERO — sachet on the right, bleeds off the frame */}
      <div
        style={{
          position: 'absolute',
          right: -90,
          top: '50%',
          width: 620,
          height: 800,
          transform: 'translateY(-50%)',
          perspective: 1800,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${tiltY - 6}deg) rotateZ(${tiltZ}deg) translateY(${floatY}px) scale(${sachetScale})`,
            filter: `drop-shadow(0 ${30 + Math.abs(floatY)}px ${60 + Math.abs(floatY) * 2}px rgba(0,0,0,.55)) drop-shadow(0 8px 14px rgba(0,0,0,.3))`,
          }}
        >
          <Img
            src={staticFile('sachet.webp')}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(110deg, transparent 38%, rgba(255,255,255,.22) 50%, transparent 62%)`,
              transform: `translateX(${sweepX}%)`,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* TYPOGRAPHY block — left, with rap codes */}
      <div
        style={{
          position: 'absolute',
          top: 188,
          left: 56,
          width: 660,
        }}
      >
        {/* LA PIE */}
        <div
          style={{
            fontFamily: FRAUNCES,
            fontVariationSettings: '"opsz" 144',
            fontWeight: 400,
            fontSize: 142,
            color: PAPER,
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            transform: `scale(${emphasis})`,
            transformOrigin: 'left center',
          }}
        >
          La Pie
        </div>

        {/* qui rap. + scribble underline */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 6 }}>
          <div
            style={{
              fontFamily: FRAUNCES,
              fontVariationSettings: '"opsz" 144',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 142,
              color: PAPER,
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
            }}
          >
            qui rap.
          </div>
          <div style={{ position: 'absolute', left: -6, bottom: -8 }}>
            <MarkerScribble progress={scribbleProgress} />
          </div>
        </div>

        {/* Off-White-style « × MENTHE. » — the flavor accent */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginTop: 36,
            marginBottom: 26,
          }}
        >
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 86,
              color: NEON,
              lineHeight: 0.9,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            « × MENTHE. »
          </div>
        </div>

        {/* FEAT. line — the heritage brand featured */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            padding: '8px 16px',
            border: `1.5px solid ${PAPER}`,
            opacity: 0.9,
            fontFamily: MONO,
            fontSize: 18,
            letterSpacing: '0.24em',
            color: PAPER,
            fontWeight: 500,
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: NEON }}>★</span>
          Feat. La Pie Qui Chante
        </div>

        {/* Subtitle quote */}
        <div
          style={{
            marginTop: 28,
            fontFamily: FRAUNCES,
            fontVariationSettings: '"opsz" 144',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 30,
            color: GLACE,
            opacity: 0.78,
            lineHeight: 1.3,
            maxWidth: 520,
          }}
        >
          « Le bonbon glaçon devient<br />le bonbon du son. »
        </div>
      </div>

      {/* Caution tape — diagonal scrolling band above CTA */}
      <CautionTape shift={tapeShift} />

      {/* BOTTOM — CTA + production line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 130,
          paddingLeft: 56,
          paddingRight: 56,
          paddingBottom: 44,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            padding: '18px 32px',
            background: NEON,
            color: INK,
            borderRadius: 999,
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: '0.16em',
            fontWeight: 600,
            transform: `scale(${ctaScale})`,
            transformOrigin: 'left center',
            boxShadow: '0 14px 30px rgba(243,224,0,.3)',
          }}
        >
          LAPIEQUIRAP.VERCEL.APP
          <span
            style={{
              display: 'inline-grid',
              placeItems: 'center',
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: INK,
              color: NEON,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            →
          </span>
        </div>

        <div
          style={{
            textAlign: 'right',
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: '0.24em',
            color: PAPER,
            opacity: 0.4,
            lineHeight: 1.5,
            textTransform: 'uppercase',
          }}
        >
          Side A · 77 SEC<br />
          La Pie Qui Chante · Depuis 1921
        </div>
      </div>

      <Grain />
    </AbsoluteFill>
  );
};
