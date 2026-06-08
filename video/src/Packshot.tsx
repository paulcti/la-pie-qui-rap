/**
 * Packshot — Looping product ad
 *
 * 1080×1080 square · 30fps · 6 seconds (180 frames)
 * Format polyvalent : Instagram feed, TikTok square, IG Stories (crop center),
 * banners, pre-roll.
 *
 * Seamless loop: every cyclical element completes a full period in 180 frames
 * so frame 0 visually matches frame 180.
 *
 * Layout:
 *   - Top 14%   : eyebrow tag + corner sticker
 *   - Center    : floating sachet with subtle 3D tilt + light sweep
 *   - Bottom 22%: title + CTA strip
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

/* Grain overlay — same recipe as other compositions */
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

/* Subtle drifting particles to give the bg life (deterministic seeded positions) */
const Particles: React.FC<{ frame: number; durationInFrames: number }> = ({
  frame,
  durationInFrames,
}) => {
  const dots = Array.from({ length: 18 }, (_, i) => {
    const seed = (i * 137.5) % 360;
    const baseX = ((Math.sin(seed) * 0.5 + 0.5) * 100) % 100;
    const baseY = ((Math.cos(seed * 1.3) * 0.5 + 0.5) * 100) % 100;
    /* Each particle drifts in a perfect cycle so it loops seamlessly */
    const t = (frame / durationInFrames) * Math.PI * 2;
    const dx = Math.sin(t + i) * 1.5;
    const dy = Math.cos(t * 0.7 + i * 0.4) * 2;
    const size = 2 + (i % 4);
    const opacity = 0.12 + ((i % 3) * 0.08);
    return { x: baseX + dx, y: baseY + dy, size, opacity, i };
  });
  return (
    <AbsoluteFill>
      {dots.map((d) => (
        <div
          key={d.i}
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: d.i % 5 === 0 ? NEON : PAPER,
            opacity: d.opacity,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const Packshot: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  /* Loop progress 0 → 1 — used to drive everything cyclical */
  const t = frame / durationInFrames;

  /* Sachet motion — all sine/cosine to guarantee seamless loop */
  const tiltY = Math.sin(t * Math.PI * 2) * 10; // ±10deg rotateY
  const tiltZ = Math.cos(t * Math.PI * 2) * 3;  // ±3deg rotateZ
  const floatY = Math.sin(t * Math.PI * 2) * 18; // ±18px
  const scaleSwell = 1 + Math.sin(t * Math.PI * 4) * 0.012; // tiny pulse

  /* Light sweep travels left → right once per loop, then resets via gradient */
  const sweepX = (t * 200 - 50); // -50% to 150%

  /* CTA pulse */
  const ctaPulse = 0.85 + Math.sin(t * Math.PI * 4) * 0.15;

  /* Title scale subtle on bass-like timing */
  const titleScale = 1 + Math.abs(Math.sin(t * Math.PI * 6)) * 0.015;

  /* Corner sticker rotation — 1 full turn per loop */
  const stampRotation = t * 360;

  /* Eyebrow opacity blink subtle */
  const eyebrowOpacity = 0.85 + Math.sin(t * Math.PI * 8) * 0.15;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, #1a2f5e 0%, ${BLEU_NUIT} 50%, #07112e 100%)`,
      }}
    >
      <Particles frame={frame} durationInFrames={durationInFrames} />

      {/* TOP eyebrow */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: '0.32em',
            color: NEON,
            opacity: eyebrowOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontWeight: 500,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: NEON, display: 'inline-block' }} />
          ÉDITION LIMITÉE · PRINTEMPS 2026
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: NEON, display: 'inline-block' }} />
        </div>
      </div>

      {/* CENTER — sachet with 3D tilt + light sweep */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1800,
          padding: '160px 0 240px',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 560,
            height: 720,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) translateY(${floatY}px) scale(${scaleSwell})`,
            filter: `drop-shadow(0 ${30 + Math.abs(floatY)}px ${50 + Math.abs(floatY) * 2}px rgba(0,0,0,.55)) drop-shadow(0 10px 20px rgba(0,0,0,.3))`,
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
          {/* Light sweep — diagonal white gradient travelling across */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(115deg, transparent 35%, rgba(255,255,255,.18) 50%, transparent 65%)`,
              transform: `translateX(${sweepX}%)`,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        </div>
      </AbsoluteFill>

      {/* CORNER STICKER — rotating circular stamp top-right */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          right: 60,
          width: 140,
          height: 140,
          transform: `rotate(${stampRotation}deg)`,
        }}
      >
        <svg viewBox="0 0 140 140" width="140" height="140">
          <defs>
            <path
              id="ringPath"
              d="M 70,70 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0"
            />
          </defs>
          <circle cx="70" cy="70" r="62" fill={NEON} />
          <text
            fontFamily={MONO}
            fontSize="11"
            letterSpacing="2.2"
            fill={INK}
            fontWeight="600"
          >
            <textPath href="#ringPath">
              ★ NOUVEAU · ★ LA PIE QUI RAP · ★ NOUVEAU ·
            </textPath>
          </text>
          <text
            x="70"
            y="78"
            textAnchor="middle"
            fontFamily={FRAUNCES}
            fontSize="42"
            fontStyle="italic"
            fontWeight="500"
            fill={INK}
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            2026
          </text>
        </svg>
      </div>

      {/* BOTTOM — title + CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 60px 56px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FRAUNCES,
            fontVariationSettings: '"opsz" 144',
            fontWeight: 300,
            fontSize: 96,
            color: PAPER,
            lineHeight: 0.95,
            letterSpacing: '-0.025em',
            transform: `scale(${titleScale})`,
            marginBottom: 8,
          }}
        >
          Menthe Claire <em style={{ color: NEON }}>×</em> rap.
        </div>
        <div
          style={{
            fontFamily: FRAUNCES,
            fontVariationSettings: '"opsz" 144',
            fontStyle: 'italic',
            fontSize: 44,
            color: GLACE,
            opacity: 0.85,
            marginBottom: 32,
          }}
        >
          « Le bonbon du son. »
        </div>

        {/* CTA strip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 32px',
            background: NEON,
            color: INK,
            borderRadius: 999,
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: '0.16em',
            fontWeight: 600,
            opacity: ctaPulse,
            boxShadow: '0 12px 30px rgba(243,224,0,.25)',
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
              fontSize: 16,
            }}
          >
            →
          </span>
        </div>
      </div>

      <Grain />
    </AbsoluteFill>
  );
};
