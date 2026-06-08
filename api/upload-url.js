/**
 * POST /api/upload-url
 *
 * Used by @vercel/blob/client `upload()` to negotiate a signed upload URL.
 * Validates content type and max size BEFORE issuing the token, so the
 * browser can stream directly to Blob storage without going through us.
 *
 * Once the upload completes, `onUploadCompleted` runs server-side and
 * persists the submission to KV with status "pending" (awaiting
 * moderation — production would expose an admin endpoint to approve).
 */
import { handleUpload } from '@vercel/blob/client';
import { Redis } from '@upstash/redis';

const redis = process.env.KV_REST_API_URL ? Redis.fromEnv() : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // clientPayload is a stringified JSON sent by the client carrying
        // artist/title/city/email/source so we can persist it after upload.
        return {
          allowedContentTypes: [
            'audio/mpeg',
            'audio/mp3',
            'audio/wav',
            'audio/x-wav',
            'audio/wave',
          ],
          maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB
          addRandomSuffix: true,
          tokenPayload: clientPayload, // forwarded to onUploadCompleted
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!redis) return;
        let meta = {};
        try { meta = JSON.parse(tokenPayload || '{}'); } catch {}

        const id = `sub_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        const submission = {
          id,
          source: meta.source === 'concours' ? 'concours' : 'boite',
          artist: String(meta.artist || 'anonyme').slice(0, 60),
          track:  String(meta.title  || 'sans titre').slice(0, 80),
          city:   String(meta.city   || '').slice(0, 40),
          email:  String(meta.email  || '').slice(0, 100), // private, never returned
          audioUrl: blob.url,
          date: new Date().toISOString(),
          status: 'pending', // moderator must approve before it appears in Le Nid
        };

        // Store the submission record
        await redis.set(`submission:${id}`, submission);
        await redis.sadd('submissions:pending', id);
        // Initialize empty vote hash so it's discoverable
        await redis.hset(`votes:${id}`, { michoko: 0, carambar: 0, menthe: 0, fraise: 0 });
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Upload failed' });
  }
}
