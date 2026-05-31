import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { resolveInstrument } from '@/lib/instrumentLibrary';

/**
 * GET /api/og?instrument=sitar&name=Rainy%20Sitar
 * Generate OG image for social share previews (Discord, Twitter, iMessage).
 * Returns PNG.
 */

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const instrument = req.nextUrl.searchParams.get('instrument') || 'unknown';
    const name = req.nextUrl.searchParams.get('name') || 'Untitled';

    const def = resolveInstrument(instrument);

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#0a0a0a',
            color: '#efece4',
            fontFamily: '"Helvetica Neue", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            gap: '40px',
          }}
        >
          {/* Accent color bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: def.accent,
            }}
          />

          {/* Instrument emoji / icon */}
          <div style={{ fontSize: '120px', lineHeight: 1 }}>
            {['tabla', 'djembe', 'taiko', 'marimba'].includes(def.id) ? '🥁' :
             ['sitar', 'guitar', 'violin', 'harp'].includes(def.id) ? '🎸' :
             ['flute', 'bansuri', 'dizi'].includes(def.id) ? '🪈' :
             ['piano', 'keyboard'].includes(def.id) ? '🎹' :
             ['erhu', 'hurdy_gurdy'].includes(def.id) ? '🎻' :
             '🎵'}
          </div>

          {/* Instrument name */}
          <div style={{ fontSize: '72px', fontWeight: 900, letterSpacing: '-2px' }}>
            {def.name}
          </div>

          {/* Kit/vibe name */}
          <div style={{ fontSize: '40px', fontWeight: 700, opacity: 0.85 }}>
            "{name}"
          </div>

          {/* Culture tag */}
          <div
            style={{
              fontSize: '16px',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '1.2px',
              opacity: 0.55,
              textTransform: 'uppercase',
            }}
          >
            {def.culture}
          </div>

          {/* CTA */}
          <div
            style={{
              fontSize: '18px',
              fontFamily: 'ui-monospace, monospace',
              marginTop: '20px',
              opacity: 0.65,
            }}
          >
            Play it instantly →
          </div>

          {/* Branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '14px',
              fontFamily: 'ui-monospace, monospace',
              opacity: 0.4,
              letterSpacing: '1.4px',
            }}
          >
            PLAYABLE INSTRUMENT
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error('[og]', (err as Error).message);
    return new Response('OG image generation failed', { status: 500 });
  }
}
