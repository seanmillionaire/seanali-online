const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5';

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
    const { text, voice_id, model_id } = req.body || {};
    const cleanText = String(text || '').trim().slice(0, 280);

    if (!cleanText) {
      return res.status(400).json({ error: 'Missing text' });
    }

    const voiceId = String(voice_id || ELEVENLABS_VOICE_ID).trim();
    const modelId = String(model_id || ELEVENLABS_MODEL_ID).trim();

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
      const errorText = await elevenRes.text();
      return res.status(elevenRes.status).json({
        error: 'ElevenLabs request failed',
        details: errorText.slice(0, 500)
      });
    }

    const audioBuffer = Buffer.from(await elevenRes.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(audioBuffer);
  } catch (error) {
    return res.status(500).json({
      error: 'TTS server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
