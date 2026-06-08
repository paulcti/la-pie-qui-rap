/**
 * ArtistIntro — Parametrized composition for the roster intros
 *
 * 1080×1920 vertical · 30fps · 8 seconds (240 frames)
 * Designed for Instagram Reels / TikTok / Stories
 *
 * Each artist gets:
 *   - Big italic name reveal (the star)
 *   - Number, city, style tag
 *   - One-line punchline
 *   - Accent color per artist (within the brand palette)
 *
 * Timeline:
 *    0– 0.6s   Number "N°XX" cuts in big
 *   0.6– 2.0s  Eyebrow + roster context settle
 *   2.0– 6.0s  Artist name reveal (spring) + locked
 *   3.5– 5.5s  Style + city slide in
 *   5.5– 7.0s  Punchline appears
 *   7.0– 8.0s  La Pie Records stamp
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
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
const OR = '#e7c862';
const ROUGE = '#c93838';
const INK = '#16140f';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export type ArtistAccent = 'neon' | 'glace' | 'or' | 'rouge' | 'paper';

const accentColor = (a: ArtistAccent): string => {
  switch (a) {
    case 'neon': return NEON;
    case 'glace': return GLACE;
    case 'or': return OR;
    case 'rouge': return ROUGE;
    case 'paper': return PAPER;
  }
};

export type ArtistIntroProps = {
  num: string;            // "01" through "06"
  firstName: string;      // "Fraîche"
  lastName: string;       // "la Peufra"
  style: string;          // "Rap mélodique"
  city: string;           // "Marseille → Paris"
  punchline: string;      // short one-liner
  accent: ArtistAccent;
};

/* Grain overlay matching the brand identity */
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

export const ArtistIntro: React.FC<ArtistIntroProps> = ({
  num,
  firstName,
  lastName,
  style,
  city,
  punchline,
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ACCENT = accentColor(accent);

  /* 0–18 frames (0–0.6s): Number cuts in from below, big */
  const numberSpring = spring({
    fps,
    frame: frame - 2,
    config: { damping: 12, mass: 0.5 },
  });
  const numberY = interpolate(numberSpring, [0, 1], [60, 0]);
  const numberOpacity = interpolate(numberSpring, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  /* 12–48 frames (0.4–1.6s): Eyebrow fades in */
  const eyebrowOpacity = interpolate(frame, [12, 36], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  /* 60–150 frames (2–5s): Artist name big reveal — first/last lines staggered */
  const firstSpring = spring({
    fps,
    frame: frame - 60,
    config: { damping: 14, mass: 0.7 },
  });
  const firstY = interpolate(firstSpring, [0, 1], [80, 0]);
  const firstOpacity = interpolate(firstSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const lastSpring = spring({
    fps,
    frame: frame - 78,
    config: { damping: 14, mass: 0.7 },
  });
  const lastY = interpolate(lastSpring, [0, 1], [100, 0]);
  const lastOpacity = interpolate(lastSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  /* Underline draw under the last name */
  const underlineProgress = interpolate(frame, [110, 145], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  /* 110–160 frames (3.6–5.3s): Style + city slide in from left */
  const tagX = interpolate(frame, [110, 140], [-40, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE_OUT,
  });
  const tagOpacity = interpolate(frame, [110, 140], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE_OUT,
  });

  /* 150–195 frames (5–6.5s): Punchline fades in */
  const punchOpacity = interpolate(frame, [150, 180], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE_OUT,
  });
  const punchY = interpolate(frame, [150, 180], [20, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: EASE_OUT,
  });

  /* 195–235 frames (6.5–7.8s): Bottom stamp scales in */
  const stampSpring = spring({
    fps,
    frame: frame - 195,
    config: { damping: 11, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 70% 20%, #1a2f5e 0%, ${BLEU_NUIT} 55%, #0a173a 100%)`,
        padding: '120px 80px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* TOP — eyebrow + number */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 40,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: '0.24em',
            color: ACCENT,
            opacity: eyebrowOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: ACCENT,
            }}
          />
          LA PIE RECORDS
        </div>
      </div>

      <div
        style={{
          fontFamily: FRAUNCES,
          fontVariationSettings: '"opsz" 144',
          fontSize: 360,
          fontWeight: 300,
          color: ACCENT,
          opacity: numberOpacity,
          transform: `translateY(${numberY}px)`,
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          marginTop: 20,
          marginBottom: -40,
        }}
      >
        <span style={{ fontSize: 0.45 + 'em', verticalAlign: 'top', opacity: 0.7, marginRight: 12 }}>N°</span>
        <span style={{ fontStyle: 'italic' }}>{num}</span>
      </div>

      <div
        style={{
          fontFamily: MONO,
          fontSize: 22,
          letterSpacing: '0.22em',
          color: PAPER,
          opacity: eyebrowOpacity * 0.6,
          marginBottom: 80,
        }}
      >
        / ROSTER · ÉD. PRINTEMPS 2026
      </div>

      {/* MIDDLE — artist name (the star) */}
      <div
        style={{
          fontFamily: FRAUNCES,
          fontVariationSettings: '"opsz" 144',
          fontSize: 130,
          fontWeight: 300,
          color: PAPER,
          opacity: firstOpacity,
          transform: `translateY(${firstY}px)`,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginBottom: 10,
        }}
      >
        {firstName}
      </div>

      <div
        style={{
          position: 'relative',
          fontFamily: FRAUNCES,
          fontVariationSettings: '"opsz" 144',
          fontSize: 150,
          fontStyle: 'italic',
          fontWeight: 400,
          color: ACCENT,
          opacity: lastOpacity,
          transform: `translateY(${lastY}px)`,
          lineHeight: 1,
          letterSpacing: '-0.025em',
          marginBottom: 50,
          display: 'inline-block',
        }}
      >
        {lastName}
        <div
          style={{
            position: 'absolute',
            bottom: -6,
            left: 0,
            height: 6,
            width: `${underlineProgress * 100}%`,
            background: ACCENT,
            transformOrigin: 'left',
          }}
        />
      </div>

      {/* TAGS — style + city */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          marginBottom: 50,
          flexWrap: 'wrap',
          opacity: tagOpacity,
          transform: `translateX(${tagX}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: '0.18em',
            color: INK,
            background: ACCENT,
            padding: '8px 18px',
            fontWeight: 500,
            textTransform: 'uppercase',
          }}
        >
          {style}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: '0.18em',
            color: PAPER,
            border: `1.5px solid rgba(244,239,228,.3)`,
            padding: '7px 18px',
            textTransform: 'uppercase',
          }}
        >
          {city}
        </div>
      </div>

      {/* PUNCHLINE */}
      <div
        style={{
          fontFamily: FRAUNCES,
          fontVariationSettings: '"opsz" 144',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 56,
          color: PAPER,
          opacity: punchOpacity * 0.92,
          transform: `translateY(${punchY}px)`,
          lineHeight: 1.2,
          maxWidth: '90%',
        }}
      >
        « {punchline} »
      </div>

      {/* BOTTOM stamp */}
      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            transform: `scale(${stampSpring})`,
            transformOrigin: 'left center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: ACCENT,
              display: 'grid',
              placeItems: 'center',
              fontFamily: FRAUNCES,
              fontStyle: 'italic',
              fontVariationSettings: '"opsz" 144',
              fontSize: 36,
              fontWeight: 500,
              color: INK,
            }}
          >
            ★
          </div>
          <div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 18,
                letterSpacing: '0.2em',
                color: PAPER,
                opacity: 0.55,
              }}
            >
              SIGNÉ
            </div>
            <div
              style={{
                fontFamily: FRAUNCES,
                fontStyle: 'italic',
                fontVariationSettings: '"opsz" 144',
                fontSize: 32,
                fontWeight: 400,
                color: ACCENT,
                lineHeight: 1.1,
              }}
            >
              La Pie Records · 2026
            </div>
          </div>
        </div>
      </div>

      <Grain />
    </AbsoluteFill>
  );
};
