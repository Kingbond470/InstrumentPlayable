/**
 * Multi-provider AI router.
 * Tries each configured provider in priority order; falls through on any error
 * (rate limit, auth failure, network error).
 *
 * Text order:   Anthropic → OpenAI → Gemini → DeepSeek → xAI
 * Vision order: Anthropic → OpenAI → Gemini → xAI
 *
 * Add a key to .env.local to activate that provider.
 * No new npm packages — raw fetch for all non-Anthropic providers.
 */

import Anthropic from '@anthropic-ai/sdk';

type Provider = 'anthropic' | 'openai' | 'gemini' | 'deepseek' | 'xai';

const DEFS: Record<Provider, { envKey: string; label: string; vision: boolean }> = {
  anthropic: { envKey: 'ANTHROPIC_API_KEY', label: 'Claude',   vision: true  },
  openai:    { envKey: 'OPENAI_API_KEY',    label: 'GPT-4o',   vision: true  },
  gemini:    { envKey: 'GEMINI_API_KEY',    label: 'Gemini',   vision: true  },
  deepseek:  { envKey: 'DEEPSEEK_API_KEY',  label: 'DeepSeek', vision: false },
  xai:       { envKey: 'XAI_API_KEY',       label: 'Grok',     vision: true  },
};

const TEXT_ORDER:   Provider[] = ['anthropic', 'openai', 'gemini', 'deepseek', 'xai'];
const VISION_ORDER: Provider[] = ['anthropic', 'openai', 'gemini', 'xai'];

const key = (p: Provider) => process.env[DEFS[p].envKey] ?? '';
const has = (p: Provider) => key(p).length > 0;

// Strip markdown code fences some models add even when asked not to.
function cleanJson(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim();
}

// ── Per-provider text calls ───────────────────────────────────────────────────

async function anthropicText(system: string, user: string): Promise<string> {
  const client = new Anthropic({ apiKey: key('anthropic') });
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    system,
    messages: [{ role: 'user', content: user }],
    max_tokens: 512,
  });
  return msg.content[0].type === 'text' ? msg.content[0].text : '{}';
}

async function openaiText(system: string, user: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key('openai')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      max_tokens: 512,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const d = await res.json() as { choices: { message: { content: string } }[] };
  return d.choices[0].message.content;
}

async function geminiText(system: string, user: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key('gemini')}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ parts: [{ text: user }] }],
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 512 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const d = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] };
  return d.candidates[0].content.parts[0].text;
}

async function openaiCompatText(provider: 'deepseek' | 'xai', system: string, user: string): Promise<string> {
  const BASE = provider === 'deepseek' ? 'https://api.deepseek.com/v1' : 'https://api.x.ai/v1';
  const MODEL = provider === 'deepseek' ? 'deepseek-chat' : 'grok-2-1212';
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key(provider)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      max_tokens: 512,
    }),
  });
  if (!res.ok) throw new Error(`${DEFS[provider].label} ${res.status}`);
  const d = await res.json() as { choices: { message: { content: string } }[] };
  return d.choices[0].message.content;
}

// ── Per-provider vision calls ─────────────────────────────────────────────────

async function anthropicVision(system: string, b64: string, mime: string): Promise<string> {
  const client = new Anthropic({ apiKey: key('anthropic') });
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    system,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mime as 'image/jpeg', data: b64 } },
        { type: 'text',  text: 'Identify the instrument in this image.' },
      ],
    }],
    max_tokens: 256,
  });
  return msg.content[0].type === 'text' ? msg.content[0].text : '{}';
}

async function openaiVision(system: string, b64: string, mime: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key('openai')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } },
          { type: 'text',  text: `${system}\n\nIdentify the instrument in this image.` },
        ],
      }],
      max_tokens: 256,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const d = await res.json() as { choices: { message: { content: string } }[] };
  return d.choices[0].message.content;
}

async function geminiVision(system: string, b64: string, mime: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key('gemini')}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mime, data: b64 } },
        { text: 'Identify the instrument in this image.' },
      ]}],
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 256 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const d = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] };
  return d.candidates[0].content.parts[0].text;
}

async function xaiVision(system: string, b64: string, mime: string): Promise<string> {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key('xai')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'grok-2-vision-1212',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } },
          { type: 'text', text: `${system}\n\nIdentify the instrument in this image.` },
        ],
      }],
      max_tokens: 256,
    }),
  });
  if (!res.ok) throw new Error(`xAI ${res.status}`);
  const d = await res.json() as { choices: { message: { content: string } }[] };
  return d.choices[0].message.content;
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface RouterResult {
  text: string;
  provider: string;
}

/** Try each text provider in order; return first success. */
export async function routeText(system: string, user: string): Promise<RouterResult> {
  for (const p of TEXT_ORDER) {
    if (!has(p)) continue;
    try {
      let raw: string;
      switch (p) {
        case 'anthropic': raw = await anthropicText(system, user); break;
        case 'openai':    raw = await openaiText(system, user);    break;
        case 'gemini':    raw = await geminiText(system, user);    break;
        case 'deepseek':  raw = await openaiCompatText('deepseek', system, user); break;
        case 'xai':       raw = await openaiCompatText('xai', system, user);      break;
      }
      return { text: cleanJson(raw), provider: DEFS[p].label };
    } catch (err) {
      console.warn(`[aiRouter] ${DEFS[p].label} text failed:`, (err as Error).message);
    }
  }
  throw new Error('no_providers');
}

/** Try each vision provider in order; return first success. */
export async function routeVision(system: string, b64: string, mime: string): Promise<RouterResult> {
  for (const p of VISION_ORDER) {
    if (!has(p)) continue;
    try {
      let raw: string;
      switch (p) {
        case 'anthropic': raw = await anthropicVision(system, b64, mime); break;
        case 'openai':    raw = await openaiVision(system, b64, mime);    break;
        case 'gemini':    raw = await geminiVision(system, b64, mime);    break;
        case 'xai':       raw = await xaiVision(system, b64, mime);       break;
        default:          throw new Error('no vision');
      }
      return { text: cleanJson(raw), provider: DEFS[p].label };
    } catch (err) {
      console.warn(`[aiRouter] ${DEFS[p].label} vision failed:`, (err as Error).message);
    }
  }
  throw new Error('no_providers');
}

/** Returns list of which providers are currently configured. */
export function activeProviders() {
  return Object.entries(DEFS)
    .filter(([p]) => has(p as Provider))
    .map(([, d]) => d.label);
}
