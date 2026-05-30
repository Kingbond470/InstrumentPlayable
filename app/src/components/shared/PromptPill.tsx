'use client';

import { T } from '@/tokens/design';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  accent?: string;
  theme?: 'light' | 'dark';
}

export default function PromptPill({ value, onChange, onSubmit, accent = T.ink, theme = 'light' }: Props) {
  const dark = theme === 'dark';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '10px 14px 10px 12px',
      borderRadius: 999,
      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
      color: dark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.82)',
      fontFamily: T.mono,
      fontSize: 12,
      maxWidth: 540,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: 999, background: accent,
        boxShadow: `0 0 0 3px ${accent}22`, flexShrink: 0,
      }} />
      <span style={{ flexShrink: 0, opacity: 0.5, fontSize: 10, letterSpacing: 1 }}>PROMPT</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && onSubmit) { e.preventDefault(); onSubmit(value); } }}
        spellCheck={false}
        style={{
          flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
          color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit',
        }}
      />
    </div>
  );
}
