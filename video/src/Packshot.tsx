/**
 * Packshot — Editorial product ad (looping)
 *
 * 1080×1080 square · 30fps · 6 seconds · seamless loop
 *
 * Design language: Aimé Leon Dore lookbook × Off-White typography ×
 * Aesop minimalism. The TYPOGRAPHY is the hero; the sachet is the
 * proof. Asymmetric 60/40 split — type on the left, product on the
 * right, cropped intentionally at the frame edge.
 *
 * Rules (high-end-visual-design):
 *   - No corner stickers crowding the frame
 *   - No top eyebrow fighting with bottom CTA
 *   - One light source, consistent shadow direction
 *   - Generous breathing room — let the design breathe
 *   - One accent color (neon), single decorative element (the rule line)
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

const { fontFamily: FRAUNCES } = loadFraunces();
const { fontFamily: MONO } = loadJetBrains();

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
      opacity: 0.09,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '240px',
    }}
  />
);

export const Packshot: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  /* Loop progress 0 → 1 */
  const t = frame / durationInFrames;
  const tau = t * Math.PI * 2;

  /* Sachet — subtle, cinematic float */
  const tiltY = Math.sin(tau) * 8;
  const tiltZ = Math.cos(tau) * 2;
  const floatY = Math.sin(tau) * 12;
  const sachetScale = 1 + Math.sin(tau * 2) * 0.008;

  /* Light sweep travels across the sachet once per loop */
  const sweepX = t * 220 - 60;

  /* Accent rule line sweeps across the bottom */
  const ruleProgress = (t * 1.2) % 1;

  /* "Menthe" emphasis pulse on bass-feeling beats */
  const emphasis = 1 + Math.abs(Math.sin(tau * 3)) * 0.015;

  /* CTA subtle attention pulse */
  const ctaScale = 1 + Math.sin(tau * 4) * 0.015;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 80% at 75% 45%, #1d3470 0%, ${BLEU_NUIT} 55%, #0a173a 100%)`,
      }}
    >
      {/* ════════════════════════════════════════════════
         Editorial grid — 60/40 split, asymmetric.
         Left: typography. Right: sachet (cropped at edge).
         ════════════════════════════════════════════════ */}

      {/* TOP — single discreet brand mark, top right */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          right: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontFamily: MONO,
          fontSize: 18,
          letterSpacing: '0.28em',
          color: PAPER,
          opacity: 0.6,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: NEON,
          }}
        />
        LA PIE RECORDS
      </div>

      {/* TOP-LEFT — edition tag */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 56,
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: '0.3em',
          color: NEON,
          opacity: 0.85,
        }}
      >
        N°01 · ÉDITION LIMITÉE 2026
      </div>

      {/* HERO — sachet on the right, cropping the frame */}
      <div
        style={{
          position: 'absolute',
          right: -100, // bleed off the right edge
          top: '50%',
          width: 640,
          height: 820,
          transform: `translateY(-50%)`,
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
          {/* Light sweep travelling across — anchored to the sachet */}
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

      {/* TYPOGRAPHY block — left, takes confident space */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 56,
          width: 620,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontFamily: FRAUNCES,
            fontVariationSettings: '"opsz" 144',
            fontWeight: 300,
            fontSize: 130,
            color: PAPER,
            lineHeight: 0.92,
            letterSpacing: '-0.035em',
            transform: `scale(${emphasis})`,
            transformOrigin: 'left center',
            marginBottom: 4,
          }}
        >
          Menthe
        </div>
        <div
          style={{
            fontFamily: FRAUNCES,
            fontVariationSettings: '"opsz" 144',
            fontWeight: 300,
            fontSize: 130,
            color: PAPER,
            lineHeight: 0.92,
            letterSpacing: '-0.035em',
            marginBottom: 24,
          }}
        >
          Claire
        </div>

        {/* Thin neon rule + "× rap." accent */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            marginBottom: 38,
          }}
        >
          <div
            style={{
              width: 80,
              height: 4,
              background: NEON,
            }}
          />
          <div
            style={{
              fontFamily: FRAUNCES,
              fontVariationSettings: '"opsz" 144',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 92,
              color: NEON,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            × rap.
          </div>
        </div>

        {/* Editorial subtitle in italic */}
        <div
          style={{
            fontFamily: FRAUNCES,
            fontVariationSettings: '"opsz" 144',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 36,
            color: GLACE,
            opacity: 0.85,
            lineHeight: 1.25,
            maxWidth: 520,
          }}
        >
          « Le bonbon glaçon devient<br />le bonbon du son. »
        </div>
      </div>

      {/* BOTTOM — CTA + footer line + sweeping accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 140,
          paddingLeft: 56,
          paddingRight: 56,
          paddingBottom: 48,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        {/* CTA — bottom-left, confident pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            padding: '18px 34px',
            background: NEON,
            color: INK,
            borderRadius: 999,
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: '0.16em',
            fontWeight: 600,
            transform: `scale(${ctaScale})`,
            transformOrigin: 'left center',
            boxShadow: '0 14px 30px rgba(243,224,0,.28)',
          }}
        >
          LAPIEQUIRAP.VERCEL.APP
          <span
            style={{
              display: 'inline-grid',
              placeItems: 'center',
              width: 32,
              height: 32,
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

        {/* Right side — production line */}
        <div
          style={{
            textAlign: 'right',
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: '0.22em',
            color: PAPER,
            opacity: 0.45,
            lineHeight: 1.5,
          }}
        >
          MADE IN FRANCE<br />
          LA PIE QUI CHANTE · DEPUIS 1921
        </div>
      </div>

      {/* Thin accent rule line — sweeps across just above CTA, repeats once per loop */}
      <div
        style={{
          position: 'absolute',
          bottom: 156,
          left: 0,
          right: 0,
          height: 1,
          background: 'rgba(244,239,228,.15)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 156,
          left: `${ruleProgress * 100}%`,
          width: 120,
          height: 1,
          background: NEON,
          opacity: 0.9,
          transform: 'translateX(-50%)',
        }}
      />

      <Grain />
    </AbsoluteFill>
  );
};
