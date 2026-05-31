import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Invalidate session token.
 */

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('X-Auth-Token');
    if (!token) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // TODO: Delete token from KV
    // await kv.del(`session:${token}`);

    return NextResponse.json({ success: true, message: 'logged out' });
  } catch (err) {
    console.error('[auth/logout]', (err as Error).message);
    return NextResponse.json({ error: 'logout failed' }, { status: 500 });
  }
}
