/**
 * GET /api/submissions
 *
 * Returns: { submissions: [{ id, source, artist, track, city, date, audioUrl?, votes }] }
 *
 * Reads from KV. If KV not configured or empty, returns empty list —
 * the frontend will fall back to its seeded mock data.
 */
import { Redis } from '@upstash/redis';

const ALLOWED_EMOJIS = ['michoko', 'carambar', 'menthe', 'fraise'];

const redis = process.env.KV_REST_API_URL
  ? Redis.fromEnv()
  : null;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!redis) {
    return res.status(200).json({ submissions: [], source: 'fallback' });
  }

  const ids = (await redis.smembers('submissions:approved')) || [];
  if (ids.length === 0) {
    return res.status(200).json({ submissions: [], source: 'empty' });
  }

  // Parallel fetch each submission + its vote hash
  const submissions = await Promise.all(
    ids.map(async (id) => {
      const [data, votes] = await Promise.all([
        redis.get(`submission:${id}`),
        redis.hgetall(`votes:${id}`),
      ]);
      if (!data) return null;
      const votesNum = {};
      for (const k of ALLOWED_EMOJIS) votesNum[k] = Number((votes || {})[k] || 0);
      return { ...data, votes: votesNum };
    })
  );

  const valid = submissions.filter(Boolean);

  // Compute rank by total votes
  const ranked = valid
    .map((s) => ({ ...s, _total: Object.values(s.votes).reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b._total - a._total)
    .map((s, i) => ({ ...s, rank: i + 1 }));

  return res.status(200).json({
    submissions: ranked.map(({ _total, ...rest }) => rest),
    source: 'kv',
    count: ranked.length,
  });
}
