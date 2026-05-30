'use client';

import React from 'react';
import { T } from '@/tokens/design';

function MobileScreen() {
  const [copied, setCopied] = React.useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* no-op */ }
  };

  return (
    <div style={{
      width: '100vw', height: '100dvh',
      background: T.ink, color: T.cream,
      fontFamily: T.font,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 32, textAlign: 'center',
      gap: 0,
    }}>
      {/* Logo */}
      <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5, marginBottom: 48 }}>
        PAD/01
      </div>

      {/* Big message */}
      <h1 style={{
        margin: '0 0 20px', fontWeight: 900, fontSize: 52, lineHeight: 0.9,
        letterSpacing: -2,
      }}>
        This one needs<br />a bigger screen.
      </h1>

      <p style={{
        margin: '0 0 40px', fontFamily: T.mono, fontSize: 12,
        letterSpacing: 1.2, opacity: 0.55, lineHeight: 1.6,
      }}>
        PAD/01 IS DESKTOP-FIRST.<br />OPEN THIS LINK ON YOUR LAPTOP.
      </p>

      {/* Copy link */}
      <button onClick={copyLink} style={{
        padding: '14px 24px',
        background: copied ? T.red : 'transparent',
        color: T.cream,
        border: `2px solid ${copied ? T.red : T.cream}`,
        fontFamily: T.mono, fontSize: 12, letterSpacing: 1.4, fontWeight: 700,
        cursor: 'pointer', borderRadius: 0,
        transition: 'background 150ms, border-color 150ms',
      }}>
        {copied ? '✓ LINK COPIED' : '⎋ COPY LINK TO OPEN ON DESKTOP'}
      </button>

      {/* Red accent dot */}
      <div style={{
        position: 'absolute', bottom: 28,
        width: 8, height: 8, borderRadius: '50%', background: T.red,
      }} />
    </div>
  );
}

export default function MobileGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = React.useState(false);
  const [mobile,  setMobile]  = React.useState(false);

  React.useEffect(() => {
    const isMobile =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setMobile(isMobile);
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (mobile)   return <MobileScreen />;
  return <>{children}</>;
}
