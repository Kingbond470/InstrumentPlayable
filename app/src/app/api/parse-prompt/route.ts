import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import type { KitConfig } from '@/types/kit';

const client = new Anthropic();

const SYSTEM = `You are a music producer AI. Given a text description of a vibe or scene, return a JSON kit configuration. Output ONLY valid JSON — no markdown, no code fences, no explanation.

Schema:
{
  "name": "short creative kit name (3–5 words)",
  "bpm": number 60–180,
  "key": one of "Am"|"Dm"|"Em"|"Gm"|"Cm"|"C"|"G"|"F"|"D"|"A"|"E"|"Bb",
  "mood": "2–3 adjectives joined by ·",
  "character": "2–3 texture words joined by ·",
  "tags": ["3–7 uppercase single words from the description"],
  "padNotes": {
    "SUB": "bass note e.g. A1",
    "BUZ": "mid note e.g. E2",
    "VOX": "note e.g. C3",
    "FX1": "note e.g. G2",
    "ARP": "high note e.g. A3",
    "STB": ["stab note 1", "stab note 2"],
    "CHD": ["chord root", "chord third", "chord fifth"],
    "END": "ending note e.g. A2"
  },
  "effects": {
    "reverb": 0.0–1.0,
    "delay": 0.0–1.0,
    "distortion": 0.0–1.0
  }
}`;

function fallbackKit(prompt: string): KitConfig {
  const hash = [...prompt].reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0);
  const bpm = 80 + (Math.abs(hash) % 80);
  const keys = ['Am', 'Dm', 'Em', 'Gm', 'C', 'G'] as const;
  const key = keys[Math.abs(hash) % keys.length];
  return {
    prompt,
    name: prompt.slice(0, 28),
    bpm,
    key,
    mood: 'raw·open',
    character: 'dry·direct',
    tags: prompt.toUpperCase().split(/\W+/).filter(Boolean).slice(0, 6),
    padNotes: {
      SUB: 'A1', BUZ: 'E2', VOX: 'C3', FX1: 'G2',
      ARP: 'A3', STB: ['E3', 'G3'], CHD: ['A3', 'C4', 'E4'], END: 'A2',
    },
    effects: { reverb: 0.3, delay: 0.2, distortion: 0.1 },
  };
}

export async function POST(req: NextRequest) {
  let text = '';
  try {
    const body = await req.json() as { text: string };
    text = body.text?.trim() ?? '';
    if (!text) return NextResponse.json({ error: 'empty prompt' }, { status: 400 });

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ kit: fallbackKit(text), fallback: true });
    }

    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM,
      messages: [{ role: 'user', content: text }],
    });

    const raw = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    const parsed = JSON.parse(raw.trim());
    return NextResponse.json({ kit: { prompt: text, ...parsed } as KitConfig, fallback: false });

  } catch {
    return NextResponse.json({ kit: fallbackKit(text || 'unknown'), fallback: true });
  }
}
