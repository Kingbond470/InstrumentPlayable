'use client';

import { T } from '@/tokens/design';
import type { KitConfig } from '@/types/kit';
import { deleteKit } from '@/lib/kitStore';

interface Props {
  kit: KitConfig;
  featured?: boolean;
  onOpen: (kit: KitConfig) => void;
  onDelete?: (prompt: string) => void;
}

// Deterministic pad layout from kit name hash.
function activePads(name: string): Set<number> {
  let h = [...name].reduce((acc, c) => (Math.imul(31, acc) + c.charCodeAt(0)) | 0, 0);
  const out = new Set<number>();
  while (out.size < 5) { out.add(Math.abs(h) % 16); h = (Math.imul(h, 1103515245) + 12345) | 0; }
  return out;
}

export default function KitCard({ kit, featured = false, onOpen, onDelete }: Props) {
  const on = activePads(kit.name);
  const bg = featured ? T.ink  : T.cream;
  const fg = featured ? T.cream : T.ink;

  return (
    <div style={{
      background: bg, color: fg,
      border: `2px solid ${T.ink}`,
      boxShadow: featured ? `8px 8px 0 0 ${T.red}` : `4px 4px 0 0 ${T.ink}`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Mini pad preview */}
      <div
        onClick={() => onOpen(kit)}
        style={{ padding: 14, borderBottom: `1.5px solid ${featured ? `${T.cream}33` : T.ink}`, cursor: 'pointer' }}
      >
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, aspectRatio: '4/3',
        }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{
              border: `1.5px solid ${featured ? T.cream : T.ink}`,
              background: on.has(i) ? (featured ? T.red : T.ink) : 'transparent',
            }} />
          ))}
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3
            onClick={() => onOpen(kit)}
            style={{
              margin: 0, fontWeight: 900, fontSize: 20, letterSpacing: -0.5,
              lineHeight: 1.05, flex: 1, minWidth: 0, cursor: 'pointer',
            }}
          >{kit.name}</h3>
        </div>

        <p style={{
          margin: 0, fontFamily: T.mono, fontSize: 11, letterSpacing: 0.3,
          opacity: 0.65, lineHeight: 1.4,
        }}>"{kit.prompt}"</p>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 'auto', paddingTop: 8,
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.2,
        }}>
          <span style={{ opacity: 0.6 }}>{kit.bpm} BPM · {kit.key}</span>
          <span style={{ opacity: 0.55 }}>{kit.mood.toUpperCase()}</span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onOpen(kit)}
            style={{
              flex: 1, padding: '7px 0',
              background: featured ? T.red : T.ink, color: T.cream,
              border: 'none', fontFamily: T.mono, fontSize: 10,
              letterSpacing: 1.2, fontWeight: 700, cursor: 'pointer',
            }}
          >▶ PLAY</button>
          {onDelete && (
            <button
              onClick={() => { deleteKit(kit.prompt); onDelete(kit.prompt); }}
              style={{
                padding: '7px 10px', background: 'transparent', color: fg,
                border: `1.5px solid ${fg}`, fontFamily: T.mono, fontSize: 10,
                letterSpacing: 1.2, fontWeight: 700, cursor: 'pointer', opacity: 0.5,
              }}
            >✕</button>
          )}
        </div>
      </div>
    </div>
  );
}
