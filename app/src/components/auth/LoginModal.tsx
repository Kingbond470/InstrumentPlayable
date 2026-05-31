'use client';

import React from 'react';
import { T } from '@/tokens/design';
import { setAuthToken, getAuthToken } from '@/lib/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (email: string) => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: Props) {
  const [email, setEmail] = React.useState('');
  const [step, setStep] = React.useState<'email' | 'check' | 'error'>('email');
  const [loading, setLoading] = React.useState(false);
  const [magicLink, setMagicLink] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { magicLink?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'request failed');

      // For development: show magic link directly (remove in production)
      if (data.magicLink) {
        setMagicLink(data.magicLink);
      }

      setStep('check');
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleUseMagicLink = () => {
    if (magicLink) {
      // Extract token from URL, set it, close modal
      const url = new URL(magicLink);
      const token = url.searchParams.get('token');
      if (token) {
        setAuthToken(token);
        onSuccess?.(email);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: `${T.ink}99`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50,
    }}>
      <div style={{
        background: T.cream, color: T.ink, fontFamily: T.font,
        padding: 32, maxWidth: 400, borderRadius: 0,
        border: `2px solid ${T.ink}`,
      }}>
        {step === 'email' && (
          <>
            <h2 style={{ margin: '0 0 20px', fontWeight: 900, fontSize: 28, letterSpacing: -1 }}>
              Magic Link Auth
            </h2>
            <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '12px 14px', border: `1.5px solid ${T.ink}`,
                  fontFamily: T.font, fontSize: 14, background: T.cream,
                  color: T.ink,
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 16px', background: T.red, color: T.cream,
                  border: `2px solid ${T.red}`, fontWeight: 900,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 14px', background: 'transparent', color: `${T.ink}77`,
                  border: `1px solid ${T.ink}33`, fontFamily: T.mono, fontSize: 11,
                  letterSpacing: 1.2, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {step === 'check' && (
          <>
            <h2 style={{ margin: '0 0 16px', fontWeight: 900, fontSize: 24 }}>Check your email</h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, lineHeight: 1.5, opacity: 0.7 }}>
              Click the magic link sent to <strong>{email}</strong>
            </p>
            {magicLink && (
              <div style={{ marginBottom: 16, padding: 12, background: `${T.ink}08`, border: `1px solid ${T.ink}22` }}>
                <p style={{ margin: '0 0 8px', fontFamily: T.mono, fontSize: 11, opacity: 0.6 }}>
                  Dev mode: use this link directly
                </p>
                <button
                  onClick={handleUseMagicLink}
                  style={{
                    width: '100%', padding: '8px 12px',
                    background: T.red, color: T.cream,
                    border: `1px solid ${T.red}`, fontWeight: 700,
                    cursor: 'pointer', fontSize: 12,
                  }}
                >
                  Use Magic Link
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '10px 14px', background: 'transparent', color: T.ink,
                border: `1.5px solid ${T.ink}`, fontWeight: 700, fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </>
        )}

        {step === 'error' && (
          <>
            <h2 style={{ margin: '0 0 16px', fontWeight: 900, fontSize: 24, color: T.red }}>Error</h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, opacity: 0.7 }}>{errorMsg}</p>
            <button
              onClick={() => { setStep('email'); setErrorMsg(''); }}
              style={{
                width: '100%', padding: '12px 16px', background: T.ink, color: T.cream,
                border: `2px solid ${T.ink}`, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
