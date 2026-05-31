import { NextRequest, NextResponse } from 'next/server';
import { generateToken, getMagicLinkUrl } from '@/lib/auth';

/**
 * POST /api/auth/request
 * User requests magic link to their email.
 * Generates token, stores in KV, sends email (stub for now).
 */

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email: string };
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 });
    }

    const token = generateToken();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 min

    // TODO: Store in Vercel KV
    // await kv.set(`session:${token}`, { email, expiresAt, used: false }, { ex: 900 });

    const magicLink = getMagicLinkUrl(token);

    // TODO: Send email via Resend / SendGrid
    // await resend.emails.send({
    //   from: 'noreply@playable.app',
    //   to: email,
    //   subject: 'Your Playable Instrument Link',
    //   html: `<a href="${magicLink}">Click to log in</a>`,
    // });

    console.log('[auth/request] Magic link for', email, ':', magicLink);

    return NextResponse.json({
      success: true,
      message: 'Check your email for the magic link.',
      // For development only: return the link directly (remove in production)
      ...(process.env.NODE_ENV === 'development' && { magicLink }),
    });
  } catch (err) {
    console.error('[auth/request]', (err as Error).message);
    return NextResponse.json({ error: 'request failed' }, { status: 500 });
  }
}
