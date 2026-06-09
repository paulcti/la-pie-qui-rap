/**
 * POST /api/admin/moderate
 *
 * Body: { id: string, action: 'approve' | 'reject' }
 * Headers: Authorization: Bearer ADMIN_TOKEN (falls back to SEED_TOKEN)
 *
 * - approve: move from submissions:pending → submissions:approved
 * - reject:  delete the KV record + remove from pending set (the
 *   Blob file remains; cleanup can be a future cron — minimal cost)
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!authorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!redis) {
    return res.status(503).json({ error: 'KV not configured' });
  }

  const { id, action } = req.body || {};
  if (!id || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Missing id or invalid action' });
  }

  const submission = await redis.get(`submission:${id}`);
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  if (action === 'approve') {
    /* Promote: mark approved + move to approved set */
    submission.status = 'approved';
    await redis.set(`submission:${id}`, submission);
    await redis.srem('submissions:pending', id);
    await redis.sadd('submissions:approved', id);
    console.info('[moderate] approved:', id);
    return res.status(200).json({ ok: true, action, id });
  }

  /* reject: drop the KV record + pending entry. Blob file left
     orphan — acceptable for demo, future: schedule a cleanup job. */
  await redis.del(`submission:${id}`);
  await redis.del(`votes:${id}`);
  await redis.srem('submissions:pending', id);
  console.info('[moderate] rejected:', id);
  return res.status(200).json({ ok: true, action, id });
}
