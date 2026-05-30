'use client';

import React from 'react';
import { T } from '@/tokens/design';
import StudioChrome from './StudioChrome';

const EXAMPLES = [
  'rainy detroit warehouse at 4am',
  "kid's birthday party, plastic instruments",
  'tape‑warped shoegaze, slow',
  'mechanic shop closing time',
  'cat investigating a paper bag',
  'thunderstorm two blocks over',
];

interface Props {
  onSubmit: (prompt: string) => void;
  error?: string | null;
}

export default function PromptStep({ onSubmit, error }: Props) {
  const [value, setValue] = React.useState('');

  const submit = () => { if (value.trim()) onSubmit(value.trim()); };

  return (
    <StudioChrome step={0}>
      <div style={{
        width: '100%', height: '100%',
        display: 'grid', gridTemplateColumns: '1fr 320px',
      }}>
        {/* Left — prompt input */}
        <div style={{
          padding: '64px 56px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.red, fontWeight: 700 }}>
            01 · START WITH A VIBE
          </span>
          <h1 style={{
            margin: '12px 0 28px', fontWeight: 900, fontSize: 76,
            letterSpacing: -3, lineHeight: 0.9,
          }}>
            Describe how it should feel.
          </h1>

          <div style={{
            border: `2.5px solid ${T.ink}`, padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: `6px 6px 0 0 ${T.ink}`, background: '#fff',
          }}>
            <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: 1.4, opacity: 0.5 }}>{'>'}</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              placeholder="type anything — a place, a mood, a memory…"
              autoFocus
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 22, fontWeight: 500, color: T.ink,
              }}
            />
            <span style={{
              display: 'inline-block', width: 2, height: 26, background: T.red,
              animation: 'blink 1s steps(2) infinite',
            }} />
            <button
              disabled={!value.trim()}
              onClick={submit}
              style={{
                padding: '12px 22px',
                background: value.trim() ? T.red : '#cfc9bd',
                color: T.cream, border: 'none',
                fontWeight: 900, fontSize: 14, letterSpacing: -0.2,
                cursor: value.trim() ? 'pointer' : 'not-allowed',
                boxShadow: value.trim() ? `4px 4px 0 0 ${T.ink}` : 'none',
                borderRadius: 0,
              }}
            >TUNE PADS →</button>
          </div>

          {error && (
            <p style={{ margin: '12px 0 0', fontFamily: T.mono, fontSize: 11, color: T.red }}>{error}</p>
          )}

          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, opacity: 0.55, marginBottom: 10 }}>
              OR TRY ONE OF THESE ↓
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {EXAMPLES.map((ex) => (
                <button key={ex} onClick={() => setValue(ex)} style={{
                  padding: '10px 14px',
                  border: `1.5px solid ${T.ink}`, background: T.cream, color: T.ink,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: 0,
                }}>"{ex}"</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — empty pad grid */}
        <div style={{
          borderLeft: `2px solid ${T.ink}`, padding: 20,
          background: `repeating-linear-gradient(135deg, ${T.cream} 0 8px, #e8e3d4 8px 9px)`,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55 }}>
            PADS · AWAITING PROMPT
          </div>
          <div style={{
            flex: 1, display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
            gap: 8,
          }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                border: `1.5px dashed ${T.ink}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: T.mono, fontSize: 10, opacity: 0.3,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudioChrome>
  );
}
