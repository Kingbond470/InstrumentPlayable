'use client';

import { T } from '@/tokens/design';
import type { KitConfig } from '@/types/kit';
import StudioChrome from './StudioChrome';

const PAD_LABELS = ['KIK', 'SNR', 'HAT', 'OPN', 'CLP', 'TOM', 'RIM', 'CYM',
                    'SUB', 'BUZ', 'VOX', 'FX1', 'ARP', 'STB', 'CHD', 'END'];

const ghostBtn: React.CSSProperties = {
  padding: '9px 12px', background: 'transparent', color: T.ink,
  border: `1.5px solid ${T.ink}`, fontFamily: T.mono,
  fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
  cursor: 'pointer', borderRadius: 0,
};

interface Props {
  kit: KitConfig;
  fallback?: boolean;
  onPlay: () => void;
  onRetune: (prompt: string) => void;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ opacity: 0.55 }}>{k}</span>
      <span style={{ fontWeight: 700 }}>{v}</span>
    </div>
  );
}

export default function ReadyStep({ kit, fallback = false, onPlay, onRetune }: Props) {
  return (
    <StudioChrome step={2}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        display: 'grid', gridTemplateColumns: '1fr 360px',
      }}>
        {/* Pad grid (live, click triggers play) */}
        <div style={{
          padding: 28, position: 'relative',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {PAD_LABELS.map((l, i) => (
            <div key={i} onClick={onPlay} style={{
              border: `2px solid ${T.ink}`, background: T.cream, color: T.ink,
              padding: 14, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: `4px 4px 0 0 ${T.ink}`,
            }}>
              <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, opacity: 0.6 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>{l}</span>
            </div>
          ))}

          {/* "HIT IT" callout */}
          <div style={{
            position: 'absolute', left: 84, top: 88, pointerEvents: 'none',
            animation: 'bobUpDown 1.6s ease-in-out infinite alternate',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          }}>
            <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
              <path d="M 70 50 Q 30 40 20 8" stroke={T.red} strokeWidth="2.5" fill="none" />
              <path d="M 16 4 L 20 8 L 26 6" stroke={T.red} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
            <span style={{
              marginLeft: 24, marginTop: -4, padding: '8px 12px',
              background: T.red, color: T.cream,
              fontFamily: T.mono, fontSize: 11, letterSpacing: 1.2, fontWeight: 700,
              boxShadow: `3px 3px 0 0 ${T.ink}`, transform: 'rotate(-3deg)',
            }}>HIT IT ↑</span>
          </div>
        </div>

        {/* Right rail */}
        <div style={{
          borderLeft: `2px solid ${T.ink}`, padding: '32px 28px',
          display: 'flex', flexDirection: 'column', gap: 22,
        }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.red, fontWeight: 700 }}>
            03 · YOUR KIT IS READY
          </span>

          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 42, letterSpacing: -1.5, lineHeight: 0.95 }}>
            "{kit.name}"
          </h2>

          <div style={{
            background: '#fff', border: `2px solid ${T.ink}`, padding: 14,
            fontFamily: T.mono, fontSize: 11, letterSpacing: 0.8,
          }}>
            <Row k="KEY"  v={kit.key} />
            <Row k="TEMPO" v={`${kit.bpm} BPM`} />
            <Row k="MOOD"  v={kit.mood.toUpperCase()} />
            <Row k="CHARACTER" v={kit.character.toUpperCase()} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={onPlay} style={{
              padding: '14px 18px', background: T.red, color: T.cream,
              border: `2px solid ${T.ink}`, fontWeight: 900, fontSize: 15,
              letterSpacing: -0.2, cursor: 'pointer',
              boxShadow: `4px 4px 0 0 ${T.ink}`, borderRadius: 0, textAlign: 'left',
            }}>▶ START PLAYING</button>
            <button style={ghostBtn} onClick={() => onRetune(kit.prompt)}>↻ RETUNE WITH NEW PROMPT</button>
          </div>

          {/* P3 fix: surface fallback mode so users understand why the kit sounds generic. */}
          {fallback && (
            <div style={{
              padding: '8px 10px',
              border: `1.5px solid ${T.ink}33`,
              background: `${T.ink}08`,
              fontFamily: T.mono, fontSize: 10, letterSpacing: 1.2,
              color: T.ink, opacity: 0.65, lineHeight: 1.5,
            }}>
              ⚠ FALLBACK MODE — ADD ANTHROPIC_API_KEY FOR AI-TUNED KITS
            </div>
          )}

          <div style={{
            marginTop: 'auto', fontFamily: T.mono,
            fontSize: 10, letterSpacing: 1.4, opacity: 0.55, lineHeight: 1.6,
          }}>
            TIP: HIT ANY PAD TO START PLAYING.<br />
            RETURN HERE TO RETUNE ANYTIME.
          </div>
        </div>
      </div>
    </StudioChrome>
  );
}
