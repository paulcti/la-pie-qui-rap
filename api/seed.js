/**
 * POST /api/seed
 *
 * One-time seed of the 6 mock submissions + base vote counts into KV.
 * Protected by SEED_TOKEN env var to prevent random users from resetting state.
 *
 * Usage:
 *   curl -X POST https://la-pie-qui-rap.vercel.app/api/seed \
 *     -H "Authorization: Bearer YOUR_SEED_TOKEN"
 *
 * Idempotent: calling twice overwrites with the same data.
 */
import { Redis } from '@upstash/redis';

const redis = process.env.KV_REST_API_URL ? Redis.fromEnv() : null;

const SEED_DATA = [
  { id: 'k2', source: 'concours', artist: 'Kayïs',      track: 'Bonbon Marseille',  city: 'Marseille',     date: 'il y a 4j', votes: { michoko: 89, carambar: 14, menthe: 41, fraise: 22 } },
  { id: 'lb', source: 'boite',    artist: 'Lyc Boréal',  track: 'Le drop du frigo',  city: 'Saint-Étienne', date: 'il y a 2j', votes: { michoko: 47, carambar: 32, menthe: 28, fraise: 12 } },
  { id: 'lr', source: 'boite',    artist: 'Lulu RDS',    track: 'Recette 1921',      city: 'Lille',         date: 'il y a 3j', votes: { michoko: 64, carambar: 22, menthe: 14, fraise:  8 } },
  { id: 'sn', source: 'concours', artist: 'Snèze',       track: 'Tour du papier',    city: 'Lyon',          date: 'il y a 6j', votes: { michoko: 31, carambar: 18, menthe: 19, fraise: 27 } },
  { id: 'pb', source: 'boite',    artist: 'Plata Beats', track: 'Glaçon flip',       city: 'Paris 18e',     date: 'il y a 1j', votes: { michoko: 23, carambar:  8, menthe: 51, fraise:  5 } },
  { id: 'm7', source: 'concours', artist: 'Mémoire 7',   track: 'Croqué',            city: 'Bordeaux',      date: 'il y a 5j', votes: { michoko: 18, carambar: 41, menthe:  9, fraise: 11 } },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!redis) {
    return res.status(503).json({ error: 'KV not configured' });
  }

  // Auth check
  const expected = process.env.SEED_TOKEN;
  const provided = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!expected || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized — set SEED_TOKEN env var and pass it as Bearer' });
  }

  let count = 0;
  for (const s of SEED_DATA) {
    const { votes, ...rest } = s;
    await redis.set(`submission:${s.id}`, { ...rest, status: 'approved' });
    await redis.sadd('submissions:approved', s.id);
    await redis.del(`votes:${s.id}`);
    await redis.hset(`votes:${s.id}`, votes);
    count++;
  }

  return res.status(200).json({ ok: true, seeded: count });
}
