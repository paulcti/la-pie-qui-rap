import './index.css';
import { Composition } from 'remotion';
import { IlsMentheVisualizer } from './IlsMenthe';
import { ArtistIntro, ArtistIntroProps } from './ArtistIntro';

/* ──────────────────────────────────────────────────────────────────
   Roster — 6 artistes signés sur La Pie Records
────────────────────────────────────────────────────────────────── */
const ROSTER: (ArtistIntroProps & { id: string })[] = [
  {
    id: 'fraiche',
    num: '01',
    firstName: 'Fraîche',
    lastName: 'la Peufra',
    style: 'Rap mélodique',
    city: 'Marseille → Paris',
    punchline: "La plume qui glace l'été.",
    accent: 'neon',
  },
  {
    id: 'koba',
    num: '02',
    firstName: 'Koba',
    lastName: 'la Fraîche',
    style: 'Drill · Trap',
    city: 'Évry',
    punchline: 'Drill froide. Flow chaud.',
    accent: 'glace',
  },
  {
    id: 'frinho',
    num: '03',
    firstName: 'Frinho',
    lastName: '.',
    style: 'Mélodique · Cloud',
    city: 'Boulogne',
    punchline: "Mélodies pour l'été qui dure.",
    accent: 'paper',
  },
  {
    id: 'bouba',
    num: '04',
    firstName: 'Bouba',
    lastName: 'Vanille',
    style: 'Rap classique',
    city: 'Boulogne-Bnt',
    punchline: 'Vétéran. Flow constant, goûts changeants.',
    accent: 'or',
  },
  {
    id: 'glaco',
    num: '05',
    firstName: 'Glaço',
    lastName: '.',
    style: 'Egotrip · Punchline',
    city: 'Lyon',
    punchline: 'Punchlines qui mordent.',
    accent: 'rouge',
  },
  {
    id: 'dj-vanille',
    num: '06',
    firstName: 'DJ Vanille',
    lastName: 'Ice',
    style: 'DJ · Producteur',
    city: 'Paris',
    punchline: 'La signature sonore du label.',
    accent: 'neon',
  },
];

const VISUALIZER_FPS = 30;
const VISUALIZER_DURATION_S = 77;
const INTRO_FPS = 30;
const INTRO_DURATION_S = 8;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Single visualizer pour "Ils menthe" */}
      <Composition
        id="IlsMenthe"
        component={IlsMentheVisualizer}
        durationInFrames={VISUALIZER_DURATION_S * VISUALIZER_FPS}
        fps={VISUALIZER_FPS}
        width={1080}
        height={1920}
      />

      {/* 6 intros artistes — une composition par membre du roster */}
      {ROSTER.map(({ id, ...props }) => (
        <Composition
          key={id}
          id={`Intro-${id}`}
          component={ArtistIntro}
          durationInFrames={INTRO_DURATION_S * INTRO_FPS}
          fps={INTRO_FPS}
          width={1080}
          height={1920}
          defaultProps={props}
        />
      ))}
    </>
  );
};
