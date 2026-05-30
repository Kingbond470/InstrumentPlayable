'use client';

import React from 'react';
import { T } from '@/tokens/design';
import type { IdentifiedInstrument } from '@/types/instrument';
import { INSTRUMENTS } from '@/lib/instrumentLibrary';

interface Props {
  photo: string;
  identified: IdentifiedInstrument;
  onConfirm: (id: string) => void;
}

export default function ConfirmStep({ photo, identified, onConfirm }: Props) {
  const [correcting, setCorrecting] = React.useState(false);
  const [search, setSearch]         = React.useState('');

  const def = INSTRUMENTS[identified.id] ?? INSTRUMENTS.unknown;
  const bars = Math.round(identified.confidence * 10);

  const allInstruments = Object.values(INSTRUMENTS).filter((i) => i.id !== 'unknown');
  const filtered = search
    ? allInstruments.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.culture.toLowerCase().includes(search.toLowerCase()),
      )
    : allInstruments;

  return (
    <div style={{
      width: '100%', height: '100%', background: T.ink, color: T.cream,
      fontFamily: T.font,
      display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center',
    }}>
      {/* Left — photo + instrument reveal */}
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 48, gap: 24, borderRight: `2px solid ${T.cream}22`,
      }}>
        {/* Photo thumbnail */}
        <img src={photo} alt="instrument" style={{
          width: '100%', maxWidth: 320, aspectRatio: '4/3',
          objectFit: 'cover', display: 'block',
          border: `2px solid ${def.accent}`,
          boxShadow: `8px 8px 0 0 ${def.accent}66`,
        }} />

        {/* Identified instrument name — the reveal moment */}
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 320 }}>
          <div style={{
            fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6,
            color: def.accent, fontWeight: 700, marginBottom: 8,
          }}>{identified.culture.toUpperCase()}</div>
          <div style={{
            fontWeight: 900, fontSize: 56, letterSpacing: -2, lineHeight: 0.9,
            color: T.cream,
          }}>{identified.name}</div>
          <div style={{
            marginTop: 12, fontFamily: T.mono, fontSize: 11, letterSpacing: 0.8,
            opacity: 0.65, lineHeight: 1.5,
          }}>{identified.description}</div>
        </div>

        {/* Confidence */}
        <div style={{ width: '100%', maxWidth: 320 }}>
          <div style={{
            fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6,
            opacity: 0.45, marginBottom: 6,
          }}>CONFIDENCE</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4,
                background: i < bars ? def.accent : `${T.cream}22`,
                transition: 'background 200ms',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right — confirm or correct */}
      <div style={{ padding: '0 56px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {!correcting ? (
          <>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.red, fontWeight: 700 }}>
              03 · IS THIS RIGHT?
            </span>

            <h2 style={{ margin: 0, fontWeight: 900, fontSize: 52, lineHeight: 0.95, letterSpacing: -2 }}>
              Is this a<br />
              <span style={{ color: def.accent }}>{identified.name}</span>?
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 340 }}>
              <button
                onClick={() => onConfirm(identified.id)}
                style={{
                  padding: '16px 24px', background: def.accent, color: T.cream,
                  border: `2px solid ${def.accent}`, fontWeight: 900, fontSize: 18,
                  letterSpacing: -0.3, cursor: 'pointer', borderRadius: 0,
                  boxShadow: `6px 6px 0 0 ${T.cream}33`, textAlign: 'left',
                }}
              >
                YES — PLAY IT →
              </button>
              <button
                onClick={() => setCorrecting(true)}
                style={{
                  padding: '13px 20px', background: 'transparent', color: `${T.cream}88`,
                  border: `1.5px solid ${T.cream}33`,
                  fontFamily: T.mono, fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
                  cursor: 'pointer', borderRadius: 0, textAlign: 'left',
                }}
              >
                WHAT IS IT? → PICK INSTRUMENT
              </button>
            </div>

            <p style={{
              margin: 0, fontFamily: T.mono, fontSize: 10, letterSpacing: 1.2,
              opacity: 0.35, lineHeight: 1.6,
            }}>
              YOUR CORRECTION TRAINS THE MODEL.<br />
              HELPS THE NEXT PERSON.
            </p>
          </>
        ) : (
          <>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.red, fontWeight: 700 }}>
              WHAT IS IT?
            </span>

            <input
              autoFocus
              placeholder="search instruments…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '12px 16px', background: `${T.cream}11`,
                border: `1.5px solid ${T.cream}44`, color: T.cream,
                fontFamily: T.mono, fontSize: 13, letterSpacing: 0.8,
                outline: 'none', borderRadius: 0, width: '100%',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', maxHeight: 280 }}>
              {filtered.map((inst) => (
                <button key={inst.id} onClick={() => onConfirm(inst.id)} style={{
                  padding: '10px 14px', background: 'transparent',
                  border: `1px solid ${T.cream}22`,
                  color: T.cream, cursor: 'pointer', borderRadius: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: T.font, transition: 'background 100ms',
                }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{inst.name}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.2, color: inst.accent, opacity: 0.85 }}>
                    {inst.culture.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCorrecting(false)}
              style={{
                padding: '8px 0', background: 'transparent', color: `${T.cream}55`,
                border: 'none', fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4,
                cursor: 'pointer', textAlign: 'left',
              }}
            >← BACK</button>
          </>
        )}
      </div>
    </div>
  );
}
