import './index.css';
import { Composition } from 'remotion';
import { IlsMentheVisualizer } from './IlsMenthe';

/**
 * 77 seconds × 30 fps = 2310 frames
 * Vertical 1080×1920 — Reels / TikTok / Shorts
 */
const FPS = 30;
const DURATION_SECONDS = 77;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="IlsMenthe"
      component={IlsMentheVisualizer}
      durationInFrames={DURATION_SECONDS * FPS}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
