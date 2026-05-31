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

export default function PercussionGrid({ instrument, photo, hitLog, onHit }: Props) {
  const viewport = useViewport();
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
  const isMobile = viewport?.isMobile ?? true;
  const isTablet = viewport?.isTablet ?? false;

  // Responsive grid size
  let gridSize = 4;  // mobile: 4x4 = 16 pads max
  if (isTablet) gridSize = 6;  // tablet: 6x6 = 36 pads
  if (!isMobile && !isTablet) gridSize = 8;  // desktop: 8x8 = 64 pads

  const cols = Math.min(gridSize, Math.ceil(Math.sqrt(voices.length)));
  const gridLayout = isMobile
    ? { columns: '1fr', rows: '48px 1fr 48px' }
    : isTablet
    ? { columns: '160px 1fr', rows: '56px 1fr 48px' }
    : { columns: '280px 1fr', rows: '64px 1fr 56px' };

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
            {!isMobile && <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: instrument.accent }}>
              {instrument.culture.toUpperCase()} · PERCUSSION
            </div>}
          </div>
        </div>
        {!isMobile && <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55, flexShrink: 0 }}>
          {voices.length} VOICES · HIT TO PLAY
        </div>}
      </div>

      {/* Left rail (hidden on mobile) */}
      {!isMobile && <div style={{
        borderRight: `2px solid ${T.ink}`, padding: isTablet ? '16px 12px' : '28px 24px',
        display: 'flex', flexDirection: 'column', gap: isTablet ? 12 : 20,
        overflow: 'hidden',
      }}>
        <div>
          <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: isTablet ? 56 : 88, fontWeight: 900, letterSpacing: -3, lineHeight: 0.9 }}>
            {String(count).padStart(3, '0')}
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, marginTop: 4, opacity: 0.55 }}>HITS</div>
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
          {instrument.id === 'tabla'
            ? 'EACH PAD IS A DIFFERENT\nSTROKE OR SYLLABLE'
            : instrument.id === 'djembe'
            ? 'BASS · TONE · SLAP\nTHREE FUNDAMENTAL VOICES'
            : 'HIT EACH PAD FOR A\nDIFFERENT VOICE'}
        </div>}
      </div>}

      {/* Pad grid */}
      <div style={{
        padding: isMobile ? 12 : isTablet ? 16 : 32,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: isMobile ? 8 : isTablet ? 10 : 14,
        alignContent: 'center',
        gridColumn: isMobile ? '1 / -1' : 'auto',
      }}>
        {voices.slice(0, gridSize * gridSize).map((voice, i) => {
          const on = !!active[i];
          const fontSize = isMobile ? 16 : isTablet ? 20 : (voices.length > 6 ? 22 : 30);
          const padding = isMobile ? '12px 8px' : isTablet ? '16px 12px' : '20px 16px';
          return (
            <button key={i}
              onPointerDown={() => hit(i)}
              style={{
                position: 'relative', overflow: 'hidden',
                border: `2px solid ${T.ink}`,
                background: on ? instrument.accent : T.cream,
                color: on ? T.cream : T.ink,
                cursor: 'pointer', padding,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', alignItems: 'flex-start',
                aspectRatio: '1',
                minHeight: isMobile ? 60 : isTablet ? 80 : 'auto',
                transform: on ? 'translate(2px,2px)' : 'translate(0,0)',
                transition: 'transform 80ms, background 80ms',
                fontFamily: 'inherit', borderRadius: 0,
                boxShadow: on ? 'none' : `4px 4px 0 0 ${T.ink}`,
              }}
            >
              {!isMobile && <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, opacity: 0.6 }}>
                {String(i + 1).padStart(2, '0')}
              </span>}
              <span style={{ fontSize, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1 }}>
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
        padding: isMobile ? '0 12px' : '0 24px', gap: 12,
        fontFamily: T.mono, fontSize: isMobile ? 9 : 10, letterSpacing: 1.4, opacity: 0.55,
        overflow: 'hidden',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: instrument.accent, flexShrink: 0 }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {isMobile ? instrument.name.toUpperCase() : `${instrument.name.toUpperCase()} · ${instrument.culture.toUpperCase()}`}
        </span>
      </div>
    </div>
  );
}
