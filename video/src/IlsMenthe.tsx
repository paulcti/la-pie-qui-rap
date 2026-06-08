/**
 * Ils Menthe — Visualizer
 * Fraîche la Peufra · La Pie Records · 2026
 *
 * Format: vertical 1080×1920, 30fps, 77 seconds (2310 frames)
 * Audience: Instagram Reels / TikTok / YouTube Shorts
 *
 * Scene timing (in seconds):
 *   0 -  4   Cold open    — La Pie Records intro
 *   4 - 12   Title card   — artist + track typography
 *  12 - 60   Main visual  — sachet + audio-reactive spectrum + bass-pulsing title
 *  60 - 72   Outro        — credits-style copyright stamp
 *  72 - 77   Final stamp  — "bonbon glaçon → bonbon du son" callback
 */
import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Img,
  spring,
} from 'remotion';
import { Audio } from '@remotion/media';
import {
  useWindowedAudioData,
  visualizeAudio,
} from '@remotion/media-utils';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: FRAUNCES } = loadFraunces();
const { fontFamily: MONO } = loadJetBrains();

/* ───────── Brand tokens (mirror the website CSS variables) ───────── */
const BLEU_NUIT = '#11244d';
const PAPER = '#f4efe4';
const NEON = '#f3e000';
const GLACE = '#c4def0';
const INK = '#16140f';

/* Strong ease-out (matches Emil's curve on the website) */
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

/* ═══════════════════════════════════════════════════════════════════
   GRAIN — paper noise overlay (matches the website's body::after)
═══════════════════════════════════════════════════════════════════ */
const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
      opacity: 0.12,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '240px',
    }}
  />
);

/* ═══════════════════════════════════════════════════════════════════
   SCENE 1 — Cold open · La Pie Records intro (0-4s)
═══════════════════════════════════════════════════════════════════ */
const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* Eyebrow draws in like a typewriter, then fades */
  const eyebrowProgress = interpolate(frame, [0, fps * 1.5], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const eyebrowOut = interpolate(frame, [fps * 3, fps * 4], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const text = 'LA PIE RECORDS — 2026';
  const chars = Math.floor(text.length * eyebrowProgress);

  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: eyebrowOut,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 42,
            letterSpacing: '0.28em',
            color: NEON,
            fontWeight: 500,
          }}
        >
          {text.slice(0, chars)}
          <span
            style={{
              opacity: frame % 30 < 15 ? 1 : 0,
              marginLeft: 4,
            }}
          >
            |
          </span>
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 2 — Title card · artist + track (4-12s)
═══════════════════════════════════════════════════════════════════ */
const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* Eyebrow */
  const eyebrowOpacity = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  /* Artist line slides in from below */
  const artistSpring = spring({
    fps,
    frame: frame - fps * 0.4,
    config: { damping: 14, mass: 0.7 },
  });
  const artistY = interpolate(artistSpring, [0, 1], [80, 0]);
  const artistOpacity = interpolate(artistSpring, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  /* Track title is the showstopper — drops in big with a bounce */
  const trackSpring = spring({
    fps,
    frame: frame - fps * 1.4,
    config: { damping: 12, mass: 0.8 },
  });
  const trackY = interpolate(trackSpring, [0, 1], [120, 0]);
  const trackOpacity = interpolate(trackSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  /* Yellow underline draws */
  const underlineWidth = interpolate(frame, [fps * 2.2, fps * 3.4], [0, 100], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 70% 30%, #1a2f5e 0%, ${BLEU_NUIT} 50%, #0a173a 100%)`,
        padding: '0 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 28,
          letterSpacing: '0.24em',
          color: NEON,
          opacity: eyebrowOpacity,
          marginBottom: 60,
        }}
      >
        ↳ LE BONBON DU SON · ÉD. 2026
      </div>

      <div
        style={{
          fontFamily: FRAUNCES,
          fontVariationSettings: '"opsz" 144',
          fontSize: 90,
          fontWeight: 300,
          color: PAPER,
          opacity: artistOpacity,
          transform: `translateY(${artistY}px)`,
          marginBottom: 16,
          lineHeight: 1,
        }}
      >
        Fraîche
      </div>

      <div
        style={{
          fontFamily: FRAUNCES,
          fontVariationSettings: '"opsz" 144',
          fontSize: 110,
          fontStyle: 'italic',
          fontWeight: 400,
          color: GLACE,
          opacity: artistOpacity,
          transform: `translateY(${artistY}px)`,
          marginBottom: 90,
          lineHeight: 1,
        }}
      >
        la Peufra
      </div>

      <div
        style={{
          position: 'relative',
          fontFamily: FRAUNCES,
          fontVariationSettings: '"opsz" 144',
          fontSize: 200,
          fontStyle: 'italic',
          fontWeight: 400,
          color: NEON,
          opacity: trackOpacity,
          transform: `translateY(${trackY}px)`,
          lineHeight: 0.92,
          letterSpacing: '-0.03em',
          display: 'inline-block',
        }}
      >
        Ils menthe.
        <div
          style={{
            position: 'absolute',
            bottom: -16,
            left: 0,
            width: `${underlineWidth}%`,
            height: 10,
            background: NEON,
          }}
        />
      </div>

      <Grain />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 3 — Main visual · sachet + spectrum + bass-pulse title (12-60s)
═══════════════════════════════════════════════════════════════════ */
type MainVisualProps = {
  frame: number;
  audioBars: number[];
  bassIntensity: number;
};

const MainVisual: React.FC<MainVisualProps> = ({ frame, audioBars, bassIntensity }) => {
  const { fps } = useVideoConfig();

  /* Sachet floats gently and reacts to bass */
  const floatY = Math.sin((frame / fps) * 1.2) * 14;
  const bassScale = 1 + bassIntensity * 0.06;
  const sachetRotate = Math.sin((frame / fps) * 0.6) * 1.2;

  /* Title scale pulses with the bass */
  const titleScale = 1 + bassIntensity * 0.04;

  /* Fade in from black */
  const sceneOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <AbsoluteFill
      style={{
        background: BLEU_NUIT,
        opacity: sceneOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px 60px',
      }}
    >
      {/* Top eyebrow */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 22,
          letterSpacing: '0.26em',
          color: NEON,
          opacity: 0.85,
          marginBottom: 30,
          display: 'flex',
          gap: 16,
        }}
      >
        <span>●</span>
        <span>NOW PLAYING · LA PIE RECORDS</span>
      </div>

      {/* Sachet — drop-shadow + float + bass-react */}
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${floatY}px) rotate(${sachetRotate}deg) scale(${bassScale})`,
          filter: `drop-shadow(0 30px 60px rgba(0,0,0,.6)) drop-shadow(0 10px 20px rgba(0,0,0,.4))`,
        }}
      >
        <Img
          src={staticFile('sachet.webp')}
          style={{ height: '100%', width: 'auto', maxWidth: '90%' }}
        />
      </div>

      {/* Bass-pulsing track title */}
      <div
        style={{
          fontFamily: FRAUNCES,
          fontVariationSettings: '"opsz" 144',
          fontSize: 160,
          fontStyle: 'italic',
          fontWeight: 400,
          color: NEON,
          letterSpacing: '-0.025em',
          lineHeight: 1,
          marginTop: 20,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
        }}
      >
        Ils menthe.
      </div>

      {/* Artist tag */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 22,
          letterSpacing: '0.22em',
          color: GLACE,
          opacity: 0.7,
          marginTop: 24,
        }}
      >
        FRAÎCHE LA PEUFRA · 2026
      </div>

      {/* Spectrum bars at bottom */}
      <div
        style={{
          width: '100%',
          height: 100,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 6,
          marginTop: 36,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        {audioBars.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${Math.max(4, v * 100)}%`,
              background: i < audioBars.length / 3 ? NEON : i < (audioBars.length * 2) / 3 ? GLACE : PAPER,
              opacity: 0.85,
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      <Grain />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 4 — Outro · credits (60-72s)
═══════════════════════════════════════════════════════════════════ */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  /* Lines fade in staggered */
  const line = (i: number) =>
    interpolate(frame - fps * (0.6 + i * 0.35), [0, fps * 0.5], [0, 1], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
      easing: EASE_OUT,
    });

  const credits: [string, string][] = [
    ['Écrit & interprété par', 'Fraîche la Peufra'],
    ['Production', 'DJ Vanille Ice'],
    ['Label', 'La Pie Records'],
    ['Édition limitée', 'La Pie Qui Chante · Printemps 2026'],
    ['Référence', '« Le bonbon glaçon » devenu « le bonbon du son »'],
  ];

  return (
    <AbsoluteFill
      style={{
        background: INK,
        padding: '160px 80px',
        display: 'flex',
        flexDirection: 'column',
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 22,
          letterSpacing: '0.26em',
          color: NEON,
          marginBottom: 80,
        }}
      >
        ↳ CRÉDITS
      </div>

      {credits.map(([label, value], i) => (
        <div
          key={i}
          style={{
            marginBottom: 36,
            opacity: line(i),
            transform: `translateY(${(1 - line(i)) * 30}px)`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 20,
              letterSpacing: '0.18em',
              color: PAPER,
              opacity: 0.55,
              marginBottom: 8,
            }}
          >
            {label.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: FRAUNCES,
              fontVariationSettings: '"opsz" 144',
              fontSize: 48,
              fontStyle: 'italic',
              fontWeight: 400,
              color: PAPER,
              lineHeight: 1.15,
            }}
          >
            {value}
          </div>
        </div>
      ))}

      <Grain />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SCENE 5 — Final stamp (72-77s)
═══════════════════════════════════════════════════════════════════ */
const FinalStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = spring({
    fps,
    frame,
    config: { damping: 10, mass: 0.6 },
  });

  /* Circular spinning tagline using SVG textPath */
  const sealRotation = interpolate(frame, [0, fps * 5], [0, 180], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: NEON,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${scaleIn})`,
          textAlign: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontFamily: FRAUNCES,
            fontVariationSettings: '"opsz" 144',
            fontSize: 200,
            fontStyle: 'italic',
            fontWeight: 400,
            color: INK,
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            marginBottom: 80,
          }}
        >
          la pie<br />
          qui rap.
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: '0.28em',
            color: INK,
            opacity: 0.75,
            fontWeight: 500,
          }}
        >
          ÉDITION LIMITÉE · 2026
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: '0.2em',
            color: INK,
            opacity: 0.55,
            marginTop: 12,
          }}
        >
          lapiequirap.vercel.app
        </div>

        {/* Rotating circular stamp — bottom right */}
        <svg
          width={220}
          height={220}
          viewBox="0 0 220 220"
          style={{
            position: 'absolute',
            bottom: -40,
            right: -40,
            transform: `rotate(${sealRotation}deg)`,
          }}
        >
          <defs>
            <path
              id="sealPath"
              d="M 110,110 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
            />
          </defs>
          <text
            fontFamily={MONO}
            fontSize="13"
            letterSpacing="3"
            fill={INK}
            fontWeight="600"
          >
            <textPath href="#sealPath">
              FAIT MAIN · 100% FRAIS · 0% IA · FAIT MAIN · 100% FRAIS ·
            </textPath>
          </text>
          <text
            x="110"
            y="118"
            textAnchor="middle"
            fontFamily={FRAUNCES}
            fontSize="36"
            fontStyle="italic"
            fontWeight="500"
            fill={INK}
          >
            2026
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ROOT COMPOSITION — orchestrate the scenes + audio analysis
═══════════════════════════════════════════════════════════════════ */
export const IlsMentheVisualizer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* Pull audio data + compute spectrum bars and bass intensity */
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile('ils-menthe.mp3'),
    frame,
    fps,
    windowInSeconds: 8,
  });

  let audioBars: number[] = new Array(48).fill(0);
  let bassIntensity = 0;

  if (audioData) {
    const freqs = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 128,
      optimizeFor: 'speed',
      dataOffsetInSeconds,
    });

    /* Log scaling for nicer visual balance */
    const scaled = freqs.map((v) => {
      if (v === 0) return 0;
      const db = 20 * Math.log10(v);
      return Math.max(0, Math.min(1, (db - -90) / 60));
    });

    /* Down-sample to 48 bars across the spectrum */
    audioBars = Array.from({ length: 48 }, (_, i) => {
      const start = Math.floor((i / 48) * scaled.length);
      const end = Math.floor(((i + 1) / 48) * scaled.length);
      const slice = scaled.slice(start, end);
      return slice.reduce((a, b) => a + b, 0) / slice.length;
    });

    /* Bass = first 25% of frequencies */
    const bass = scaled.slice(0, Math.floor(scaled.length * 0.25));
    bassIntensity = bass.reduce((a, b) => a + b, 0) / bass.length;
  }

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* Audio track plays throughout */}
      <Audio src={staticFile('ils-menthe.mp3')} />

      <Sequence durationInFrames={fps * 4}>
        <ColdOpen />
      </Sequence>

      <Sequence from={fps * 4} durationInFrames={fps * 8}>
        <TitleCard />
      </Sequence>

      <Sequence from={fps * 12} durationInFrames={fps * 48}>
        <MainVisual frame={frame - fps * 12} audioBars={audioBars} bassIntensity={bassIntensity} />
      </Sequence>

      <Sequence from={fps * 60} durationInFrames={fps * 12}>
        <Outro />
      </Sequence>

      <Sequence from={fps * 72} durationInFrames={fps * 5}>
        <FinalStamp />
      </Sequence>
    </AbsoluteFill>
  );
};
