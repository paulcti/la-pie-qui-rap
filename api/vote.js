/**
 * POST /api/vote
 *
 * Body: { submissionId: string, emoji: 'michoko'|'carambar'|'menthe'|'fraise', action: 'add'|'remove' }
 * Returns: { ok: true, votes: { michoko: number, ... } }
 *
 * Stores votes as a Redis hash per submission. The frontend tracks
 * which votes are "mine" via localStorage; this endpoint just bumps
 * the global counter. Idempotency is the frontend's job.
 */
import { Redis } from '@upstash/redis';

const ALLOWED_EMOJIS = new Set(['michoko', 'carambar', 'menthe', 'fraise']);
const ALLOWED_ACTIONS = new Set(['add', 'remove']);

const redis = process.env.KV_REST_API_URL
  ? Redis.fromEnv()
  : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!redis) {
    return res.status(503).json({ error: 'KV not configured — provision Upstash Redis on Vercel' });
  }

  const { submissionId, emoji, action } = req.body || {};
  if (!submissionId || !ALLOWED_EMOJIS.has(emoji) || !ALLOWED_ACTIONS.has(action)) {
    return res.status(400).json({ error: 'Invalid params' });
  }

  const delta = action === 'add' ? 1 : -1;
  const key = `votes:${submissionId}`;

  await redis.hincrby(key, emoji, delta);
  const allVotes = (await redis.hgetall(key)) || {};

  // Coerce to numbers (Upstash returns strings sometimes)
  const votes = {};
  for (const k of ALLOWED_EMOJIS) {
    votes[k] = Number(allVotes[k] || 0);
  }

  return res.status(200).json({ ok: true, submissionId, votes });
}
