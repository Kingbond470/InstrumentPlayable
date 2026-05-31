'use client';

import React from 'react';
import Link from 'next/link';
import { T } from '@/tokens/design';
import { useViewport } from '@/hooks/useViewport';
import { PAD_SEQUENCE, type KitConfig, type PadType } from '@/types/kit';
import { getAudioEngine } from '@/audio/AudioEngine';
import { buildMidi, type HitEvent } from '@/audio/MidiExport';
import { now } from 'tone';
import { saveKit } from '@/lib/kitStore';
import { kitShareUrl } from '@/lib/shareUrl';
import PromptPill from '@/components/shared/PromptPill';
import Ticker     from '@/components/shared/Ticker';

// B6 fix: strip all chars that break filenames on Windows/macOS.
function safeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase().slice(0, 60) || 'kit';
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a   = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fmtSecs(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

interface Props {
  kit: KitConfig;
  onRetune: (prompt: string) => void;
}

const ghostBtn: React.CSSProperties = {
  padding: '7px 10px', background: 'transparent', color: T.ink,
  border: `1.5px solid ${T.ink}`, fontFamily: T.mono,
  fontSize: 10, letterSpacing: 1.2, fontWeight: 700,
  cursor: 'pointer', borderRadius: 0, transition: 'background 120ms',
};

export default function PadGrid({ kit, onRetune }: Props) {
  const viewport = useViewport();
  const [active, setActive]       = React.useState<Record<number, number>>({});
  const [count, setCount]         = React.useState(0);
  const [bar, setBar]             = React.useState(0);
  const [promptVal, setPromptVal] = React.useState(kit.prompt);
  const [saved, setSaved]         = React.useState(false);
  const [copied, setCopied]       = React.useState(false);
  const [recSecs, setRecSecs]     = React.useState(0);
  const [recording, setRecording] = React.useState(false);
  const [midiDone, setMidiDone]   = React.useState(false); // B5
  // B1 fix: track hit count in state so MIDI button reacts.
  const [hitCount, setHitCount]   = React.useState(0);
  const hitLog = React.useRef<HitEvent[]>([]);
  // B4 fix: removed unused recT0 ref.

  const isMobile = viewport?.isMobile ?? true;
  const isTablet = viewport?.isTablet ?? false;

  // Responsive grid layout
  const gridLayout = isMobile
    ? { columns: '1fr', rows: 'auto auto 1fr 56px' }
    : isTablet
    ? { columns: '180px 1fr', rows: '48px 1fr 56px' }
    : { columns: '320px 1fr', rows: '64px 1fr 56px' };

  // P2 fix: update browser tab title to the current kit.
  React.useEffect(() => {
    document.title = `${kit.name} — PAD/01`;
    return () => { document.title = 'PAD/01 — A Playable Instrument'; };
  }, [kit.name]);

  React.useEffect(() => {
    setPromptVal(kit.prompt);
    setSaved(false);
    hitLog.current = [];
    setHitCount(0); // B1
  }, [kit.prompt]);

  React.useEffect(() => {
    const ms = 60000 / kit.bpm;
    const id = setInterval(() => setBar((b) => (b + 1) % 16), ms / 4);
    return () => clearInterval(id);
  }, [kit.bpm]);

  React.useEffect(() => { getAudioEngine().loadKit(kit); }, [kit]);

  const timeouts = React.useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  React.useEffect(() => () => { timeouts.current.forEach(clearTimeout); }, []);

  // Recording elapsed timer
  React.useEffect(() => {
    if (!recording) return;
    setRecSecs(0);
    const id = setInterval(() => setRecSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  const toggleRec = async () => {
    const engine = getAudioEngine();
    await engine.init();
    if (engine.isRecording) {
      const blob = await engine.stopRecording();
      setRecording(false);
      const ext = blob.type.includes('ogg') ? 'ogg' : 'webm';
      downloadBlob(blob, `${safeFilename(kit.name)}.${ext}`); // B6
    } else {
      hitLog.current = [];
      setHitCount(0); // B1
      engine.startRecording();
      setRecording(true);
    }
  };

  const exportMidi = () => {
    if (hitLog.current.length === 0) return;
    const t0   = hitLog.current[0].time;
    const hits = hitLog.current.map((h) => ({ ...h, time: h.time - t0 }));
    const bytes = buildMidi(hits, kit.bpm);
    downloadBlob(
      new Blob([bytes.buffer as ArrayBuffer], { type: 'audio/midi' }),
      `${safeFilename(kit.name)}.mid`, // B6
    );
    // B5 fix: flash confirmation like save/share.
    setMidiDone(true);
    setTimeout(() => setMidiDone(false), 1600);
  };

  const hit = React.useCallback(async (i: number, padType: PadType) => {
    const engine = getAudioEngine();
    await engine.init();
    engine.hit(padType);
    hitLog.current.push({ time: now(), padType });
    setHitCount((c) => c + 1); // B1: reactive counter for MIDI button
    setActive((m) => ({ ...m, [i]: Date.now() }));
    setCount((c) => c + 1);
    const t = setTimeout(() => {
      setActive((m) => { const n = { ...m }; delete n[i]; return n; });
      timeouts.current.delete(t);
    }, 380);
    timeouts.current.add(t);
  }, []);

  const handleSave = () => {
    saveKit(kit);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(kitShareUrl(kit));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable */ }
  };

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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 12px' : isTablet ? '0 16px' : '0 24px',
        borderBottom: `2px solid ${T.ink}`,
        gap: isMobile ? 8 : 12,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: isMobile ? 6 : 14 }}>
          <Link href="/" style={{
            fontWeight: 900,
            fontSize: isMobile ? 16 : isTablet ? 18 : 22,
            letterSpacing: -0.5,
            textDecoration: 'none',
            color: T.ink,
          }}>
            PAD/01
          </Link>
          {!isMobile && (
            <span style={{ fontFamily: T.mono, fontSize: isMobile ? 8 : 10, letterSpacing: 1.6, opacity: 0.55 }}>
              {kit.key} · {kit.bpm} BPM · {kit.mood.toUpperCase()}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 12, flex: isMobile ? '1 1 100%' : 'auto' }}>
          <PromptPill value={promptVal} onChange={setPromptVal} onSubmit={onRetune} accent={T.red} />
          <Link href="/library" style={{
            fontFamily: T.mono, fontSize: isMobile ? 8 : 10, letterSpacing: 1.4, fontWeight: 700,
            textDecoration: 'none', color: T.ink, opacity: 0.6,
            padding: isMobile ? '4px 6px' : '6px 10px', border: `1.5px solid ${T.ink}44`,
          }}>LIBRARY</Link>
        </div>
      </div>

      {/* Left rail */}
      {!isMobile && (
      <div style={{
        borderRight: `2px solid ${T.ink}`,
        padding: isTablet ? '12px 16px' : '28px 24px',
        display: 'flex', flexDirection: 'column', gap: isTablet ? 12 : 20,
        overflow: 'hidden',
      }}>
        <div>
          <div style={{
            fontSize: 92, fontWeight: 900, letterSpacing: -3,
            lineHeight: 0.9, fontVariantNumeric: 'tabular-nums',
          }}>{kit.bpm}</div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, marginTop: 4 }}>
            BPM · {kit.key}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {kit.tags.map((tag) => (
            <span key={tag} style={{
              padding: '3px 7px', background: T.ink, color: T.cream,
              fontFamily: T.mono, fontSize: 10, letterSpacing: 1.2, fontWeight: 700,
            }}>{tag}</span>
          ))}
        </div>

        {/* Save + Share */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleSave} style={{
            ...ghostBtn, flex: 1,
            background: saved ? T.ink : 'transparent',
            color: saved ? T.cream : T.ink,
          }}>
            {saved ? '✓ SAVED' : '+ SAVE KIT'}
          </button>
          <button onClick={handleShare} style={{
            ...ghostBtn, flex: 1,
            background: copied ? T.red : 'transparent',
            color: copied ? T.cream : T.ink,
            border: `1.5px solid ${copied ? T.red : T.ink}`,
          }}>
            {copied ? '✓ COPIED' : '⎋ SHARE'}
          </button>
        </div>

        {/* Record + MIDI export */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={toggleRec} style={{
            padding: '9px 12px', border: `2px solid ${recording ? T.red : T.ink}`,
            background: recording ? T.red : 'transparent',
            color: recording ? T.cream : T.ink,
            fontFamily: T.mono, fontSize: 11, letterSpacing: 1.2, fontWeight: 700,
            cursor: 'pointer', borderRadius: 0, textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: recording ? T.cream : T.red,
              animation: recording ? 'blink 1s steps(2) infinite' : 'none',
            }} />
            {recording ? `■ STOP  ${fmtSecs(recSecs)}` : '● REC'}
          </button>

          {/* B1 + B5 fix: uses hitCount (state) not hitLog.current (ref). Flashes ✓ after export. */}
          <button
            onClick={exportMidi}
            disabled={hitCount === 0}
            style={{
              ...ghostBtn,
              background: midiDone ? T.ink : 'transparent',
              color: midiDone ? T.cream : T.ink,
              opacity: hitCount === 0 ? 0.35 : 1,
              cursor: hitCount === 0 ? 'not-allowed' : 'pointer',
            }}
          >{midiDone ? '✓ DONE' : '↓ MIDI'}</button>
        </div>

        <div style={{ borderTop: `2px solid ${T.ink}`, paddingTop: 20, marginTop: 'auto' }}>
          <p style={{
            margin: 0, fontWeight: 900, fontSize: 30, lineHeight: 0.95,
            letterSpacing: -0.8, textTransform: 'uppercase',
          }}>
            Type a vibe.<br />Hit a pad.<br />That&apos;s it.
          </p>
          <p style={{
            margin: '14px 0 0', fontFamily: T.mono,
            fontSize: 10, lineHeight: 1.6, letterSpacing: 0.6, opacity: 0.65,
          }}>
            Change the prompt + hit Enter to retune all 16 voices.
          </p>
        </div>

        <Ticker value={String(count).padStart(4, '0')} label="HITS" />
      </div>
      )}


      {/* 4×4 pad grid */}
      <div style={{
        position: 'relative',
        padding: isMobile ? 12 : isTablet ? 16 : 28,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: isMobile ? 8 : isTablet ? 10 : 14,
      }}>
        {PAD_SEQUENCE.map((padType, i) => {
          const on = !!active[i];
          return (
            <button
              key={padType}
              onPointerDown={() => hit(i, padType)}
              style={{
                position: 'relative', overflow: 'hidden',
                border: `2px solid ${T.ink}`,
                background: on ? T.ink : T.cream,
                color: on ? T.cream : T.ink,
                cursor: 'pointer',
                padding: isMobile ? 10 : isTablet ? 12 : 18,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', alignItems: 'flex-start',
                textAlign: 'left',
                transform: on ? 'translate(2px,2px)' : 'translate(0,0)',
                transition: 'transform 80ms, background 80ms, color 80ms',
                fontFamily: 'inherit', borderRadius: 0,
                boxShadow: on ? 'none' : `4px 4px 0 0 ${T.ink}`,
              }}
            >
              <span style={{ fontFamily: T.mono, fontSize: isMobile ? 8 : 10, letterSpacing: 1.4, opacity: 0.6 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{
                fontSize: isMobile ? 24 : isTablet ? 28 : 38,
                fontWeight: 900,
                letterSpacing: -1,
                lineHeight: 1,
              }}>
                {padType}
              </span>
              {on && (
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: `radial-gradient(circle at 50% 50%, ${T.cream}33 0%, transparent 60%)`,
                  animation: 'padRipple 380ms ease-out forwards',
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Beat transport */}
      <div style={{
        gridColumn: '1 / -1', borderTop: `2px solid ${T.ink}`,
        display: 'flex', alignItems: 'stretch',
      }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '100%',
            borderRight: i < 15 ? `1px solid ${T.ink}22` : 'none',
            background: bar === i ? T.ink : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.mono,
            fontSize: isMobile ? 7 : 10,
            letterSpacing: 1,
            color: bar === i ? T.cream : `${T.ink}66`,
            transition: 'background 60ms',
          }}>
            {String(i + 1).padStart(2, '0')}
          </div>
        ))}
      </div>
    </div>
  );
}
