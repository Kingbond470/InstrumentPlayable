import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { resolveInstrument, INSTRUMENT_IDS } from '@/lib/instrumentLibrary';
import type { IdentifiedInstrument } from '@/types/instrument';

const client = new Anthropic();

const SYSTEM = `You are an expert musicologist and instrument identifier. Given an image, identify the musical instrument shown — whether real, painted, sculpted, or illustrated.

Return ONLY valid JSON. No markdown, no explanation.

{
  "id": "one of: ${INSTRUMENT_IDS}",
  "name": "the instrument's exact cultural name",
  "family": "strings|percussion|keys|wind|brass",
  "culture": "specific cultural origin e.g. Indian Classical, West African, Japanese",
  "confidence": 0.0-1.0,
  "description": "one vivid sentence about this instrument's sound or history"
}

Rules:
- If multiple instruments are visible, identify the most prominent one
- If the image shows a painting or artwork, still identify the instrument depicted
- If no instrument is visible, use id: "unknown"
- Always choose the closest match from the provided id list`;

function fallbackIdentification(reason: string): IdentifiedInstrument {
  return {
    id: 'unknown', name: 'Mystery Instrument',
    family: 'percussion', culture: 'Unknown',
    confidence: 0, description: reason,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json() as { image: string };
    if (!image) return NextResponse.json({ error: 'no image' }, { status: 400 });

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        identified: fallbackIdentification('Add ANTHROPIC_API_KEY to enable AI identification.'),
        fallback: true,
      });
    }

    // Strip data URL prefix to get raw base64 + media type
    const match   = image.match(/^data:(image\/\w+);base64,([^]+)$/);
    const mtype   = (match?.[1] ?? 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    const b64data = match?.[2] ?? image;

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mtype, data: b64data } },
          { type: 'text',  text: 'Identify the instrument in this image.' },
        ],
      }],
    });

    const raw  = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '{}';
    const parsed = JSON.parse(raw) as IdentifiedInstrument;

    // Resolve the id to ensure it exists in our library
    const def = resolveInstrument(parsed.id);
    const identified: IdentifiedInstrument = {
      id:          def.id,
      name:        parsed.name || def.name,
      family:      parsed.family || def.family,
      culture:     parsed.culture || def.culture,
      confidence:  Math.max(0, Math.min(1, parsed.confidence ?? 0.8)),
      description: parsed.description || def.description,
    };

    return NextResponse.json({ identified, fallback: false });

  } catch {
    return NextResponse.json({
      identified: fallbackIdentification('Could not identify instrument.'),
      fallback: true,
    });
  }
}
