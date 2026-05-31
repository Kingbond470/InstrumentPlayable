import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/me
 * Check current session. Requires X-Auth-Token header.
 */

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('X-Auth-Token');
    if (!token) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // TODO: Verify token in KV, return user email
    // const session = await kv.get(`session:${token}`);
    // if (!session || (session as any).expiresAt < Date.now()) {
    //   return NextResponse.json({ error: 'session expired' }, { status: 401 });
    // }
    // const { email } = session as { email: string };

    // Stub: accept any token for development
    return NextResponse.json({ email: 'user@example.com' });
  } catch {
    return NextResponse.json({ error: 'auth check failed' }, { status: 500 });
  }
}
