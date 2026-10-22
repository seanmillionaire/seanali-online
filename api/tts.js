import { createHash } from 'node:crypto';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5';

// SEC-TTS-001: Fail closed if durable server-side quotas are not configured.
// An in-memory Map is not a safe quota for distributed serverless functions.
async function reserveTtsQuota(req) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const salt = process.env.TTS_RATE_LIMIT_SALT;
  if (!redisUrl || !redisToken || !salt) {
    return { ok: false, status: 503, error: 'Voice temporarily unavailable' };
  }

  // On Vercel, only use the provider's forwarded IP field, not a caller's
  // arbitrary x-forwarded-for value. Global quota still caps distributed abuse.
  const forwarded = process.env.VERCEL
    ? req.headers['x-vercel-forwarded-for']
    : undefined;
  const rawIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded)
    || req.socket?.remoteAddress || 'unidentified';
  const ip = String(rawIp).split(',')[0].trim();
  const anonymousId = createHash('sha256')
    .update(salt + ':' + ip)
    .digest('hex')
    .slice(0, 24);
  const now = new Date();
  const minute = now.toISOString().slice(0, 16);
  const day = now.toISOString().slice(0, 10);
  const minuteKey = 'tts:minute:' + anonymousId + ':' + minute;
  const userDayKey = 'tts:day:' + anonymousId + ':' + day;
  const globalDayKey = 'tts:global:' + day;
  const commands = [
    ['INCR', minuteKey], ['EXPIRE', minuteKey, 180],
    ['INCR', userDayKey], ['EXPIRE', userDayKey, 172800],
    ['INCR', globalDayKey], ['EXPIRE', globalDayKey, 172800],
  ];

  try {
    const response = await fetch(redisUrl.replace(/\\/$/, '') + '/pipeline', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + redisToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) throw new Error('Quota store error');
    const output = await response.json();
    const counts = [output?.[0]?.result, output?.[2]?.result, output?.[4]?.result];
    if (counts.some(n => !Number.isInteger(n) || n < 1)) {
      throw new Error('Invalid quota response');
    }
    // 6 per minute and 60 per person/day; hard provider cost ceiling 500/day.
    if (counts[0] > 6 || counts[1] > 60 || counts[2] > 500) {
      return { ok: false, status: 429, error: 'Voice usage limit reached' };
    }
    return { ok: true };
  } catch (_) {
    return { ok: false, status: 503, error: 'Voice temporarily unavailable' };
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ELEVENLABS_API_KEY) {
    return res.status(500).json({
      error: 'Missing ELEVENLABS_API_KEY environment variable'
    });
  }

  try {
    if (Number(req.headers['content-length'] || 0) > 8192) {
      return res.status(413).json({ error: 'Request too large' });
    }
    const { text, voice_id, model_id } = req.body || {};
    const cleanText = String(text || '').trim().slice(0, 280);

    if (!cleanText) {
      return res.status(400).json({ error: 'Missing text' });
    }

    // Callers cannot choose other paid voices/models.
    if ((voice_id && voice_id !== ELEVENLABS_VOICE_ID)
        || (model_id && model_id !== ELEVENLABS_MODEL_ID)) {
      return res.status(400).json({ error: 'Unsupported voice or model' });
    }
    const voiceId = ELEVENLABS_VOICE_ID;
    const modelId = ELEVENLABS_MODEL_ID;

    const quota = await reserveTtsQuota(req);
    if (!quota.ok) return res.status(quota.status).json({ error: quota.error });

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_96`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0,
            use_speaker_boost: false
          }
        })
      }
    );

    if (!elevenRes.ok) {
      // Never expose provider error bodies or account details to the public.
      return res.status(502).json({ error: 'Voice generation failed' });
    }

    const audioBuffer = Buffer.from(await elevenRes.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).send(audioBuffer);
  } catch (error) {
    return res.status(500).json({
      error: 'Voice temporarily unavailable'
    });
  }
}
