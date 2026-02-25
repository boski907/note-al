const OpenAI = require('openai');
const fs = require('fs');

let _client = null;
function getClient() {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set in .env');
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

// ─── Chat ─────────────────────────────────────────────────────────────────

/**
 * Chat with sources using GPT-4o-mini.
 * @param {string} userMessage
 * @param {Array<{name,type,content}>} sources
 * @param {Array<{role,content}>} history  last N messages for context
 */
async function chatWithSources(userMessage, sources, history = []) {
  const client = getClient();

  // Build context block from sources
  let sourceContext = '';
  if (sources.length === 0) {
    sourceContext = '[No sources have been added to this notebook yet.]';
  } else {
    sourceContext = sources.map((s, i) =>
      `--- SOURCE ${i + 1}: ${s.name} (${s.type}) ---\n${s.content || s.summary || '[No content]'}`
    ).join('\n\n');
  }

  const systemPrompt = `You are Notematica AI, an intelligent research assistant.
You answer questions ONLY based on the sources provided below.
Always cite sources by name when referencing them (e.g. "According to [Source Name]...").
If the answer cannot be found in the sources, say so clearly rather than guessing.
Be concise, well-structured, and use markdown formatting where helpful.

SOURCES:
${sourceContext}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage }
  ];

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.3,
    max_tokens: 1500
  });

  return response.choices[0].message.content;
}

// ─── Transcription (Whisper) ───────────────────────────────────────────────

/**
 * Transcribe an audio or video file using OpenAI Whisper.
 * @param {string} filePath  path to the audio/video file
 * @param {string} fileName  original filename (for mime type detection)
 */
async function transcribeFile(filePath, fileName) {
  const client = getClient();
  const fileStream = fs.createReadStream(filePath);

  const transcription = await client.audio.transcriptions.create({
    file: fileStream,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['segment']
  });

  // Format with timestamps
  if (transcription.segments && transcription.segments.length > 0) {
    const formatted = transcription.segments.map(seg => {
      const t = formatTime(seg.start);
      return `[${t}] ${seg.text.trim()}`;
    }).join('\n');
    return formatted;
  }

  return transcription.text || '[No speech detected]';
}

/**
 * Transcribe a YouTube video by its transcript (captions).
 * Falls back to a placeholder if unavailable.
 */
async function transcribeYouTube(videoId) {
  try {
    const { YoutubeTranscript } = require('youtube-transcript');
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    return segments.map(s => `[${formatTime(s.offset / 1000)}] ${s.text}`).join('\n');
  } catch (err) {
    throw new Error(`Could not fetch YouTube transcript: ${err.message}. Make sure the video has captions enabled.`);
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

module.exports = { chatWithSources, transcribeFile, transcribeYouTube };
