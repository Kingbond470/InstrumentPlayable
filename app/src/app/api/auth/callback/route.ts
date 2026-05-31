import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/callback?token=...
 * User clicked magic link. Verify token, issue session, redirect to play.
 */

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json({ error: 'no token' }, { status: 400 });
    }

    // TODO: Verify token in KV
    // const session = await kv.get(`session:${token}`);
    // if (!session) throw new Error('token expired or invalid');
    // const { email, expiresAt, used } = session as { email: string; expiresAt: number; used: boolean };
    // if (used || expiresAt < Date.now()) throw new Error('token expired or already used');

    // Mark session as used
    // await kv.set(`session:${token}`, { ...session, used: true }, { ex: 900 });

    // Stub: accept any token for development
    const email = 'user@example.com'; // Would come from KV in production

    // Redirect with token in URL fragment (not sent to server)
    const redirectUrl = new URL('/play', req.nextUrl.origin);
    redirectUrl.searchParams.set('auth_token', token);
    redirectUrl.searchParams.set('email', email);

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('[auth/callback]', (err as Error).message);
    const errorUrl = new URL('/auth/error', req.nextUrl.origin);
    errorUrl.searchParams.set('reason', (err as Error).message);
    return NextResponse.redirect(errorUrl);
  }
}
