/**
 * GET /api/admin/pending
 *
 * Returns submissions awaiting moderation. Gated by Bearer token
 * (ADMIN_TOKEN with SEED_TOKEN fallback for one-token-fits-all
 * during the demo phase).
 *
 * Response: { submissions: [{ id, source, artist, track, city, date, audioUrl }] }
 *   - `email` is intentionally stripped (private metadata)
 */
import { Redis } from '@upstash/redis';

const redis = process.env.KV_REST_API_URL ? Redis.fromEnv() : null;

function authorized(req) {
  const expected = process.env.ADMIN_TOKEN || process.env.SEED_TOKEN;
  if (!expected) return false;
  const provided = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return provided && provided === expected;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!authorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!redis) {
    return res.status(503).json({ error: 'KV not configured' });
  }

  const ids = (await redis.smembers('submissions:pending')) || [];
  if (ids.length === 0) {
    return res.status(200).json({ submissions: [], count: 0 });
  }

  const subs = await Promise.all(ids.map(async (id) => {
    const data = await redis.get(`submission:${id}`);
    if (!data) return null;
    const { email, ...publicFields } = data; // strip private email
    return publicFields;
  }));

  /* Sort newest first */
  const valid = subs
    .filter(Boolean)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return res.status(200).json({ submissions: valid, count: valid.length });
}
