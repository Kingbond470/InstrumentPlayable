/**
 * Magic-link email auth. No passwords. No OAuth.
 * User emails self a link, clicks it, gets session token in URL.
 * Token valid for 15 min, then expires.
 *
 * Storage: Vercel KV (serverless key-value)
 * - user:{email} → { email, createdAt, lastLogin }
 * - session:{token} → { email, expiresAt, used }
 */

export interface AuthUser {
  email: string;
  createdAt: number;
  lastLogin: number;
}

export interface AuthSession {
  email: string;
  expiresAt: number;
  used: boolean;
}

// Generate cryptographically secure token for magic link
export function generateToken(): string {
  const arr = new Uint8Array(32);
  if (typeof window === 'undefined') {
    // Server-side: use Node crypto
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
  // Client-side: use SubtleCrypto
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Magic link URL
export function getMagicLinkUrl(token: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/auth/callback?token=${encodeURIComponent(token)}`;
}

// Parse token from URL
export function getTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

// Store auth token in localStorage
export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token');
}

// Check if logged in
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

// Get current user email from token
export async function getCurrentUser(): Promise<string | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: { 'X-Auth-Token': token },
    });
    if (!res.ok) return null;
    const data = await res.json() as { email: string };
    return data.email;
  } catch {
    return null;
  }
}

export async function logout() {
  const token = getAuthToken();
  if (token) {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'X-Auth-Token': token },
    }).catch(() => {});
  }
  clearAuthToken();
}
