/**
 * POST /api/upload-url
 *
 * OIDC-friendly upload negotiation using @vercel/blob 2.4+ presigned URLs.
 * Works with Vercel Marketplace Blob stores (which use OIDC + BLOB_STORE_ID
 * instead of a static BLOB_READ_WRITE_TOKEN).
 *
 * Flow:
 *   1. Client calls uploadPresigned() in the browser → POSTs here for a
 *      short-lived signed URL
 *   2. issueSignedToken() (auth: VERCEL_OIDC_TOKEN + BLOB_STORE_ID) returns
 *      a put-scoped token bound to allowed content types + max size
 *   3. handleUploadPresigned() wraps that token into a presigned URL the
 *      client streams the file to (no server proxy → bypasses 4.5 MB body
 *      limit)
 *   4. After upload completes, Vercel calls back here → onUploadCompleted
 *      writes the submission record into KV with status: 'pending'
 *      (moderator must approve before it appears in Le Nid)
 */
import { issueSignedToken } from '@vercel/blob';
import { handleUploadPresigned } from '@vercel/blob/client';
import { Redis } from '@upstash/redis';

const redis = process.env.KV_REST_API_URL ? Redis.fromEnv() : null;

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
];

const MAX_SIZE_BYTES = 25 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jsonResponse = await handleUploadPresigned({
      body: req.body,
      request: req,
      getSignedToken: async (pathname /*, clientPayload, multipart */) => {
        /* Token derived from OIDC + BLOB_STORE_ID via issueSignedToken.
           Scoped tight: only PUT, only audio MIME types, 25 MB cap. */
        const token = await issueSignedToken({
          pathname,
          operations: ['put'],
          allowedContentTypes: ALLOWED_AUDIO_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          validUntil: Date.now() + 60 * 60 * 1000, // delegation valid 1h
        });

        return {
          token,
          urlOptions: {
            allowedContentTypes: ALLOWED_AUDIO_TYPES,
            maximumSizeInBytes: MAX_SIZE_BYTES,
            validUntil: Date.now() + 10 * 60 * 1000, // URL valid 10 min
            addRandomSuffix: true,
            allowOverwrite: false,
            cacheControlMaxAge: 30 * 24 * 60 * 60,
          },
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!redis) {
          console.warn('[upload-url] KV not configured, skipping persistence');
          return;
        }
        let meta = {};
        try { meta = JSON.parse(tokenPayload || '{}'); } catch {}

        const id = `sub_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        const submission = {
          id,
          source: meta.source === 'concours' ? 'concours' : 'boite',
          artist: String(meta.artist || 'anonyme').slice(0, 60),
          track:  String(meta.title  || 'sans titre').slice(0, 80),
          city:   String(meta.city   || '').slice(0, 40),
          email:  String(meta.email  || '').slice(0, 100), // private — never returned to clients
          audioUrl: blob.url,
          date: new Date().toISOString(),
          status: 'pending',
        };

        await redis.set(`submission:${id}`, submission);
        await redis.sadd('submissions:pending', id);
        await redis.hset(`votes:${id}`, { michoko: 0, carambar: 0, menthe: 0, fraise: 0 });
        console.info('[upload-url] submission saved:', id, blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (err) {
    console.error('[upload-url] failed:', err && err.message, err && err.stack);
    return res.status(400).json({ error: (err && err.message) || 'Upload failed' });
  }
}
