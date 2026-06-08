# Visualizers — La Pie Qui Rap

Vidéos générées avec [Remotion](https://www.remotion.dev) — framework React pour créer des vidéos par le code.

## Compositions

| ID | Format | Durée | Usage |
| --- | --- | --- | --- |
| `IlsMenthe` | 1080×1920 (vertical) | 77 s | Reels / TikTok / Shorts — single Fraîche la Peufra |

## Commandes

```bash
# Studio interactif (preview live)
npm run dev

# Rendu d'une frame de vérification rapide
npx remotion still IlsMenthe out/check.png --frame=900 --scale=0.5

# Rendu MP4 complet
npx remotion render IlsMenthe out/ils-menthe.mp4 --concurrency=4
```

## Scènes (Ils menthe)

| Temps | Scène | Description |
| --- | --- | --- |
| 0–4 s | Cold open | Typewriter "LA PIE RECORDS — 2026" sur fond ink |
| 4–12 s | Title card | "Fraîche / la Peufra / Ils menthe." italique + underline néon |
| 12–60 s | Main visual | Sachet Menthe Claire + spectre audio-réactif + bass-pulse |
| 60–72 s | Outro | Crédits staggerés (artiste, prod, label, édition) |
| 72–77 s | Final stamp | "la pie qui rap." + sceau rotatif "FAIT MAIN · 0% IA" |

## Stack

- `remotion` 4.0.474
- `@remotion/media` — composants Audio / Video
- `@remotion/media-utils` — `useWindowedAudioData` + `visualizeAudio`
- `@remotion/google-fonts` — Fraunces (italique), JetBrains Mono

## Prochains visualizers

- **Intros artistes** — 6 clips de 8 s, un par membre du roster
- **Packshot animé** — 6 s en boucle, sachet 360° pour les pubs réseaux
