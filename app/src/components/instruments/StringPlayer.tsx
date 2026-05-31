'use client';

import React from 'react';
import { T } from '@/tokens/design';
import type { InstrumentDef } from '@/types/instrument';
import { getInstrumentEngine } from '@/audio/InstrumentEngine';
import { useViewport } from '@/hooks/useViewport';
import { now } from 'tone';
import type { HitEvent } from '@/audio/MidiExport';

interface Props {
  instrument: InstrumentDef;
  photo: string;
  hitLog: React.MutableRefObject<HitEvent[]>;
  onHit: () => void;
}

export default function StringPlayer({ instrument, photo, hitLog, onHit }: Props) {
  const viewport = useViewport();
  const [active, setActive] = React.useState<Set<number>>(new Set());
  const timeouts = React.useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  React.useEffect(() => () => { timeouts.current.forEach(clearTimeout); }, []);

  const pluck = async (i: number) => {
    const engine = getInstrumentEngine();
    await engine.init();
    engine.hit(i);
    hitLog.current.push({ time: now(), padType: 'ARP' }); // approximate for MIDI
    onHit();

    setActive((s) => new Set([...s, i]));
    const t = setTimeout(() => {
      setActive((s) => { const n = new Set(s); n.delete(i); return n; });
      timeouts.current.delete(t);
    }, instrument.family === 'strings' ? 800 : 400);
    timeouts.current.add(t);
  };

  const strings = instrument.voices;
  const isVertical = ['sitar', 'violin', 'guitar', 'erhu'].includes(instrument.id);
  const isMobile = viewport?.isMobile ?? true;
  const isTablet = viewport?.isTablet ?? false;

  // Responsive grid layout
  const gridLayout = isMobile
    ? { columns: '1fr', rows: '56px 1fr 48px' }
    : isTablet
    ? { columns: '180px 1fr', rows: '56px 1fr 48px' }
    : { columns: '260px 1fr 220px', rows: '64px 1fr 56px' };

  return (
    <div style={{
      width: '100%', height: '100%', background: T.cream, color: T.ink,
      fontFamily: T.font,
      display: 'grid',
      gridTemplateColumns: gridLayout.columns,
      gridTemplateRows: gridLayout.rows,
    }}>
      {/* Top bar */}
      <div style={{
        gridColumn: '1 / -1',
        borderBottom: `2px solid ${T.ink}`,
        padding: isMobile ? '0 12px' : '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, minWidth: 0 }}>
          <img src={photo} alt="" style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, objectFit: 'cover', border: `2px solid ${instrument.accent}`, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: isMobile ? 14 : 20, letterSpacing: -0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{instrument.name}</div>
            {!isMobile && <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: instrument.accent, opacity: 0.9 }}>
              {instrument.culture.toUpperCase()} · {instrument.family.toUpperCase()}
            </div>}
          </div>
        </div>
        {!isMobile && <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55, flexShrink: 0 }}>
          {instrument.voices.length} STRINGS · TAP TO PLUCK
        </div>}
      </div>

      {/* Left rail — info (hidden on mobile) */}
      {!isMobile && <div style={{
        borderRight: `2px solid ${T.ink}`,
        padding: isTablet ? '16px 12px' : '28px 24px',
        display: 'flex', flexDirection: 'column', gap: isTablet ? 12 : 20,
        overflow: 'hidden',
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: isTablet ? 24 : 36, letterSpacing: -1, lineHeight: 1 }}>{instrument.name}</div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.2, marginTop: 4, color: instrument.accent }}>
            {instrument.culture}
          </div>
        </div>
        {!isTablet && <p style={{
          margin: 0, fontSize: 14, lineHeight: 1.5, opacity: 0.7,
          borderTop: `1.5px solid ${T.ink}22`, paddingTop: 16,
        }}>
          {instrument.description}
        </p>}
        {!isTablet && <div style={{
          marginTop: 'auto', padding: 12,
          background: `${instrument.accent}15`,
          border: `1.5px solid ${instrument.accent}44`,
          fontFamily: T.mono, fontSize: 10, letterSpacing: 1.2,
          color: instrument.accent, lineHeight: 1.6,
        }}>
          TAP ANY STRING<br />TO PLUCK IT
        </div>}
      </div>}

      {/* Centre — strings */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isVertical ? (isMobile ? '16px 0' : '40px 0') : (isMobile ? '0 12px' : '0 40px'),
        gridColumn: isMobile ? '1 / -1' : 'auto',
      }}>
        {/* Background — faint instrument shape suggestion */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${instrument.accent}08 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {isVertical ? (
          // Vertical strings (sitar, guitar, violin, erhu)
          <div style={{
            display: 'flex', gap: isMobile ? 8 : 12, height: '80%', alignItems: 'stretch',
          }}>
            {strings.slice(0, isMobile ? 6 : strings.length).map((s, i) => {
              const on = active.has(i);
              return (
                <div key={i}
                  onPointerDown={() => pluck(i)}
                  style={{
                    width: isMobile ? 20 : 28, cursor: 'pointer', position: 'relative',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                  }}
                >
                  {/* String body */}
                  <div style={{
                    flex: 1, width: on ? 3 : 2,
                    background: on ? instrument.accent : `${T.ink}55`,
                    transition: 'width 80ms, background 80ms',
                    animation: on ? 'vibrate 300ms ease-out' : 'none',
                    transformOrigin: 'top',
                    borderRadius: 1,
                  }} />
                  {/* Note label */}
                  <div style={{
                    marginTop: 8, fontFamily: T.mono, fontSize: 10,
                    letterSpacing: 1, fontWeight: 700,
                    color: on ? instrument.accent : `${T.ink}88`,
                    transition: 'color 80ms',
                  }}>{s.label}</div>
                  {/* Pluck ripple */}
                  {on && <div style={{
                    position: 'absolute', top: '40%',
                    width: 40, height: 40, borderRadius: '50%',
                    background: `${instrument.accent}33`,
                    animation: 'pluckRipple 400ms ease-out forwards',
                    pointerEvents: 'none',
                    marginLeft: -6,
                  }} />}
                </div>
              );
            })}
          </div>
        ) : (
          // Horizontal strings (koto, harp, flute, bansuri, kora)
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10, width: '85%',
          }}>
            {strings.map((s, i) => {
              const on = active.has(i);
              const thick = 1.5 + (strings.length - i) * 0.4;
              return (
                <div key={i}
                  onPointerDown={() => pluck(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                  }}
                >
                  {/* Note label */}
                  <div style={{
                    width: 32, fontFamily: T.mono, fontSize: 10,
                    letterSpacing: 1, fontWeight: 700, textAlign: 'right', flexShrink: 0,
                    color: on ? instrument.accent : `${T.ink}55`,
                    transition: 'color 80ms',
                  }}>{s.label}</div>
                  {/* String */}
                  <div style={{
                    flex: 1, height: on ? thick + 1 : thick,
                    background: on ? instrument.accent : `${T.ink}44`,
                    transition: 'height 80ms, background 80ms',
                    animation: on ? 'vibrate 350ms ease-out' : 'none',
                    borderRadius: 1, position: 'relative',
                  }}>
                    {on && <div style={{
                      position: 'absolute', inset: -8,
                      background: `${instrument.accent}22`,
                      animation: 'pluckRipple 400ms ease-out forwards',
                      pointerEvents: 'none',
                    }} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right rail — tuning (hidden on mobile/tablet) */}
      {!isMobile && !isTablet && <div style={{
        borderLeft: `2px solid ${T.ink}`,
        padding: '28px 20px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, opacity: 0.5, marginBottom: 4 }}>
          TUNING
        </div>
        {strings.map((s, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '5px 8px',
            background: active.has(i) ? `${instrument.accent}22` : 'transparent',
            transition: 'background 200ms',
          }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>{s.label}</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, opacity: 0.5 }}>{s.note}</span>
          </div>
        ))}
      </div>}

      {/* Bottom bar */}
      <div style={{
        gridColumn: '1 / -1',
        borderTop: `2px solid ${T.ink}`,
        display: 'flex', alignItems: 'center',
        padding: isMobile ? '0 12px' : '0 24px', gap: 12,
        fontFamily: T.mono, fontSize: isMobile ? 9 : 10, letterSpacing: 1.4, opacity: 0.55,
        overflow: 'hidden',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: instrument.accent, flexShrink: 0 }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {isMobile ? `${strings.length} STRINGS` : `${instrument.name.toUpperCase()} · ${strings.length} STRINGS · ${instrument.culture.toUpperCase()}`}
        </span>
      </div>

      <style>{`
        @keyframes vibrate {
          0%   { transform: scaleX(1); }
          20%  { transform: scaleX(1.015); }
          40%  { transform: scaleX(0.985); }
          60%  { transform: scaleX(1.008); }
          80%  { transform: scaleX(0.995); }
          100% { transform: scaleX(1); }
        }
        @keyframes pluckRipple {
          0%   { transform: scale(0.3); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
