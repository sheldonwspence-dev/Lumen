// The only place the Anthropic API is called. The key comes from the Vercel
// environment variable ANTHROPIC_API_KEY and is never returned or logged.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const MODEL = 'claude-sonnet-5-5';
const MAX_TOKENS = 1024;
const MAX_INPUT_CHARS = 4000;
const MAX_BODY_CHARS = 16000;

const ALLOWED_ORIGINS = [
  'https://lumen-theta-ten.vercel.app',
];

// In-memory per-IP limit. Each serverless instance has its own copy, so the
// limit leaks across instances; the monthly spend cap on the Anthropic account
// is the real backstop.
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

function originAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return /^http:\/\/localhost(:\d+)?$/.test(origin);
}

function rateLimited(ip) {
  const now = Date.now();
  for (const [key, times] of hits) {
    if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
  }
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// Only the Instructions section of optimizer.md is sent. The task examples
// further down that file are for the page's example button, never the model.
function buildPrompt(input) {
  const file = readFileSync(join(process.cwd(), 'prompts', 'optimizer.md'), 'utf8');
  const start = file.indexOf('\n## Instructions\n');
  const end = file.indexOf('\n## Task presets');
  if (start === -1 || end === -1 || end < start) throw new Error('optimizer.md sections not found');
  const instructions = file.slice(start + '\n## Instructions\n'.length, end).trim();
  if (!instructions.includes('${input}')) throw new Error('optimizer.md has no ${input} slot');
  // split/join so "$" characters in the user's text are never treated as patterns
  return instructions.split('${input}').join(input);
}

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    improved: { type: 'string' },
    highlights: { type: 'array', items: { type: 'string' } },
    changes: { type: 'array', items: { type: 'string' } },
  },
  required: ['improved', 'highlights', 'changes'],
  additionalProperties: false,
};

const isText = (s) => typeof s === 'string' && s.trim() !== '';

// The schema can't express array lengths, so the counts are checked here.
function validate(result) {
  if (!result || !isText(result.improved)) return null;
  const { highlights, changes } = result;
  if (!Array.isArray(highlights) || highlights.length < 3 || highlights.length > 4) return null;
  if (!Array.isArray(changes) || changes.length !== 3) return null;
  if (!highlights.every(isText) || !changes.every(isText)) return null;
  return { improved: result.improved, highlights, changes };
}

function fail(code, status, detail) {
  if (detail) console.error(`optimize ${code}: ${detail}`);
  return Response.json({ ok: false, error: code }, { status });
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') return fail('method_not_allowed', 405);
    if (!originAllowed(request.headers.get('origin'))) return fail('bad_origin', 403);

    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    if (rateLimited(ip)) return fail('rate_limited', 429);

    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) return fail('too_long', 413);
    let input;
    try {
      input = JSON.parse(raw).input;
    } catch {
      return fail('bad_request', 400);
    }
    if (typeof input !== 'string') return fail('bad_request', 400);
    if (input.trim() === '') return fail('empty_input', 400);
    if (input.length > MAX_INPUT_CHARS) return fail('too_long', 413);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return fail('server_error', 500, 'ANTHROPIC_API_KEY is not set');

    let prompt;
    try {
      prompt = buildPrompt(input);
    } catch (err) {
      return fail('server_error', 500, err.message);
    }

    let upstream;
    try {
      upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          // Sonnet 5.5 thinks by default and rejects "disabled"; this is its lowest setting.
          thinking: { type: 'between_tools' },
          messages: [{ role: 'user', content: prompt }],
          output_config: { format: { type: 'json_schema', schema: OUTPUT_SCHEMA } },
        }),
        signal: AbortSignal.timeout(30000),
      });
    } catch (err) {
      return fail('upstream_error', 502, `request failed: ${err.name}`);
    }

    let data;
    try {
      data = await upstream.json();
    } catch {
      return fail('upstream_error', 502, `status ${upstream.status}, unreadable body`);
    }
    if (!upstream.ok) {
      return fail('upstream_error', 502, `status ${upstream.status}, ${data?.error?.type}: ${data?.error?.message}`);
    }

    const text = (data.content || []).find((block) => block.type === 'text')?.text;
    let result = null;
    try {
      result = validate(JSON.parse(text));
    } catch {
      // falls through to bad_output
    }
    if (!result) return fail('bad_output', 502, `stop_reason ${data.stop_reason}`);

    return Response.json({ ok: true, ...result });
  },
};
