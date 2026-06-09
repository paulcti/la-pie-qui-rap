# Assets vidéo — La Pie Qui Rap

Tous les MP4 sont accessibles via `/assets/video/<filename>` sur le site déployé.

| Fichier | Format | Durée | Taille | Usage |
| --- | --- | --- | --- | --- |
| `ils-menthe.mp4` | 1080×1920 | 77 s | 97 MB | Visualizer single « Ils menthe » par Fraîche la Peufra — audio-réactif, 5 scènes |
| `intro-fraiche.mp4` | 1080×1920 | 8 s | 744 KB | Carte intro Fraîche la Peufra (accent néon) |
| `intro-koba.mp4` | 1080×1920 | 8 s | 643 KB | Koba la Fraîche (accent glace) |
| `intro-frinho.mp4` | 1080×1920 | 8 s | 625 KB | Frinho (accent paper) |
| `intro-bouba.mp4` | 1080×1920 | 8 s | 756 KB | Bouba Vanille (accent or) |
| `intro-glaco.mp4` | 1080×1920 | 8 s | 634 KB | Glaço (accent rouge) |
| `intro-dj-vanille.mp4` | 1080×1920 | 8 s | 718 KB | DJ Vanille Ice (accent néon) |
| `packshot.mp4` | 1080×1080 | 6 s loop | 5.6 MB | Pub paid social — éditorial × rap, seamless loop |

## URLs publiques

Sur le site live :

```
https://la-pie-qui-rap.vercel.app/assets/video/ils-menthe.mp4
https://la-pie-qui-rap.vercel.app/assets/video/intro-fraiche.mp4
https://la-pie-qui-rap.vercel.app/assets/video/packshot.mp4
… etc
```

## Re-générer

Tous les MP4 sont générés par code depuis `video/src/` (Remotion).
Pour re-render : `cd video && npm install && npx remotion render <CompositionId> out/<name>.mp4`.

Les IDs de composition disponibles :
- `IlsMenthe`
- `Intro-fraiche`, `Intro-koba`, `Intro-frinho`, `Intro-bouba`, `Intro-glaco`, `Intro-dj-vanille`
- `Packshot`

## Recommandation production

Pour une charge réelle (plus de 1000 vues/mois du visualizer), bouger le
gros fichier `ils-menthe.mp4` (97 MB) sur Vercel Blob ou un CDN dédié
pour éviter de saturer le quota bandwidth Vercel Hobby (100 GB/mois).
