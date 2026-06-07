import { NextRequest, NextResponse } from 'next/server';

// Simple event collection endpoint
// Events are logged to console for MVP (can be persisted to DB later)

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // Log event (in production, save to Vercel KV, PostgreSQL, or third-party service)
    console.log('[analytics]', JSON.stringify(event, null, 2));

    // TODO: Persist to:
    // - Vercel KV: await kv.lpush('analytics:events', JSON.stringify(event))
    // - PostgreSQL: INSERT INTO analytics_events (name, data, created_at) VALUES (...)
    // - Third-party: POST to Posthog, Mixpanel, or Plausible

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[analytics] POST error:', err);
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  }
}
