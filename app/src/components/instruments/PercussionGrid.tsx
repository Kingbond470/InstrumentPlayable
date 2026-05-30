'use client';

import React from 'react';
import { T } from '@/tokens/design';
import type { InstrumentDef } from '@/types/instrument';
import { getInstrumentEngine } from '@/audio/InstrumentEngine';
import { now } from 'tone';
import type { HitEvent } from '@/audio/MidiExport';

interface Props {
  instrument: InstrumentDef;
  photo: string;
  hitLog: React.MutableRefObject<HitEvent[]>;
  onHit: () => void;
}

export default function PercussionGrid({ instrument, photo, hitLog, onHit }: Props) {
  const [active, setActive] = React.useState<Record<number, number>>({});
  const [count, setCount]   = React.useState(0);
  const timeouts = React.useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  React.useEffect(() => () => { timeouts.current.forEach(clearTimeout); }, []);

  const hit = async (i: number) => {
    const engine = getInstrumentEngine();
    await engine.init();
    engine.hit(i);
    hitLog.current.push({ time: now(), padType: 'KIK' });
    onHit();
    setCount((c) => c + 1);
    setActive((m) => ({ ...m, [i]: Date.now() }));
    const t = setTimeout(() => {
      setActive((m) => { const n = { ...m }; delete n[i]; return n; });
      timeouts.current.delete(t);
    }, 320);
    timeouts.current.add(t);
  };

  const voices = instrument.voices;
  const cols = voices.length <= 4 ? voices.length : voices.length <= 6 ? 3 : 4;

  return (
    <div style={{
      width: '100%', height: '100%', background: T.cream, color: T.ink,
      fontFamily: T.font,
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gridTemplateRows: '64px 1fr 56px',
    }}>
      {/* Top bar */}
      <div style={{
        gridColumn: '1 / -1',
        borderBottom: `2px solid ${T.ink}`,
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src={photo} alt="" style={{ width: 40, height: 40, objectFit: 'cover', border: `2px solid ${instrument.accent}` }} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>{instrument.name}</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: instrument.accent }}>
              {instrument.culture.toUpperCase()} · PERCUSSION
            </div>
          </div>
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55 }}>
          {voices.length} VOICES · HIT TO PLAY
        </div>
      </div>

      {/* Left rail */}
      <div style={{
        borderRight: `2px solid ${T.ink}`, padding: '28px 24px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div>
          <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 88, fontWeight: 900, letterSpacing: -3, lineHeight: 0.9 }}>
            {String(count).padStart(3, '0')}
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, marginTop: 4, opacity: 0.55 }}>HITS</div>
        </div>

        <p style={{
          margin: 0, fontSize: 14, lineHeight: 1.5, opacity: 0.7,
          borderTop: `1.5px solid ${T.ink}22`, paddingTop: 16,
        }}>
          {instrument.description}
        </p>

        <div style={{
          marginTop: 'auto', padding: 12,
          background: `${instrument.accent}15`,
          border: `1.5px solid ${instrument.accent}44`,
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.2,
          color: instrument.accent, lineHeight: 1.6,
        }}>
          {instrument.id === 'tabla'
            ? 'EACH PAD IS A DIFFERENT\nSTROKE OR SYLLABLE'
            : instrument.id === 'djembe'
            ? 'BASS · TONE · SLAP\nTHREE FUNDAMENTAL VOICES'
            : 'HIT EACH PAD FOR A\nDIFFERENT VOICE'}
        </div>
      </div>

      {/* Pad grid */}
      <div style={{
        padding: 32,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 14,
        alignContent: 'center',
      }}>
        {voices.map((voice, i) => {
          const on = !!active[i];
          return (
            <button key={i}
              onPointerDown={() => hit(i)}
              style={{
                position: 'relative', overflow: 'hidden',
                border: `2px solid ${T.ink}`,
                background: on ? instrument.accent : T.cream,
                color: on ? T.cream : T.ink,
                cursor: 'pointer', padding: '20px 16px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', alignItems: 'flex-start',
                aspectRatio: '1',
                transform: on ? 'translate(2px,2px)' : 'translate(0,0)',
                transition: 'transform 80ms, background 80ms',
                fontFamily: 'inherit', borderRadius: 0,
                boxShadow: on ? 'none' : `4px 4px 0 0 ${T.ink}`,
              }}
            >
              <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, opacity: 0.6 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: voices.length > 6 ? 22 : 30, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1 }}>
                {voice.label}
              </span>
              {on && <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: `radial-gradient(circle, ${T.cream}33 0%, transparent 70%)`,
                animation: 'padRipple 320ms ease-out forwards',
              }} />}
            </button>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div style={{
        gridColumn: '1 / -1',
        borderTop: `2px solid ${T.ink}`,
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 12,
        fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: instrument.accent, flexShrink: 0 }} />
        <span>{instrument.name.toUpperCase()} · {instrument.culture.toUpperCase()}</span>
      </div>
    </div>
  );
}
