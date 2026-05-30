'use client';

import React from 'react';
import { T } from '@/tokens/design';
import { resolveInstrument } from '@/lib/instrumentLibrary';
import { getInstrumentEngine } from '@/audio/InstrumentEngine';
import { buildMidi, type HitEvent } from '@/audio/MidiExport';
import { saveKit } from '@/lib/kitStore';
import type { IdentifiedInstrument } from '@/types/instrument';
import PhotoStep   from './PhotoStep';
import IdentifyStep from './IdentifyStep';
import ConfirmStep  from './ConfirmStep';
import StringPlayer from '@/components/instruments/StringPlayer';
import PercussionGrid from '@/components/instruments/PercussionGrid';

type FlowState = 'photo' | 'identifying' | 'confirm' | 'playing';

const STEP_LABELS = ['PHOTOGRAPH', 'IDENTIFY', 'CONFIRM', 'PLAY'];

function safeFilename(s: string) {
  return s.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase().slice(0, 60) || 'instrument';
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

export default function CaptureFlow() {
  const [state, setState]         = React.useState<FlowState>('photo');
  const [photo, setPhoto]         = React.useState<string>('');
  const [identified, setIdentified] = React.useState<IdentifiedInstrument | null>(null);
  const [scanStep, setScanStep]   = React.useState(0);
  const [instrumentId, setInstrumentId] = React.useState<string>('unknown');
  const [hitCount, setHitCount]   = React.useState(0);
  const [saved, setSaved]         = React.useState(false);
  const [copied, setCopied]       = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [recSecs, setRecSecs]     = React.useState(0);
  const [midiDone, setMidiDone]   = React.useState(false);
  const hitLog = React.useRef<HitEvent[]>([]);

  const instrument = resolveInstrument(instrumentId);

  // Load instrument into engine when confirmed
  React.useEffect(() => {
    if (state === 'playing') {
      getInstrumentEngine().loadInstrument(instrument);
      hitLog.current = [];
      setHitCount(0);
      setSaved(false);
    }
  }, [state, instrumentId]);

  // Recording timer
  React.useEffect(() => {
    if (!recording) return;
    setRecSecs(0);
    const id = setInterval(() => setRecSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  // Identify: animate scan steps while waiting for API
  const handlePhoto = async (dataUrl: string) => {
    setPhoto(dataUrl);
    setState('identifying');
    setScanStep(0);

    // Animate the steps
    const stepTimer = setInterval(() => setScanStep((s) => Math.min(s + 1, 4)), 600);

    try {
      const res  = await fetch('/api/identify-instrument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json() as { identified: IdentifiedInstrument; fallback: boolean };
      clearInterval(stepTimer);
      setScanStep(4);
      setIdentified(data.identified);
      setTimeout(() => setState('confirm'), 400);
    } catch {
      clearInterval(stepTimer);
      setIdentified({ id: 'unknown', name: 'Mystery Instrument', family: 'percussion', culture: 'Unknown', confidence: 0.5, description: 'Could not identify — play it anyway.' });
      setTimeout(() => setState('confirm'), 400);
    }
  };

  const handleConfirm = (id: string) => {
    setInstrumentId(id);
    setState('playing');
    document.title = `${resolveInstrument(id).name} — Playable Instrument`;
  };

  const handleSave = () => {
    // Save as a kit-compatible object for the library
    saveKit({
      prompt: `[photo] ${instrument.name}`,
      name: instrument.name,
      bpm: 120,
      key: 'C',
      mood: instrument.culture,
      character: instrument.family,
      tags: [instrument.name.toUpperCase(), instrument.culture.toUpperCase().split(' ')[0]],
      padNotes: {},
      effects: { reverb: 0.3, delay: 0, distortion: 0 },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/capture?instrument=${instrument.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* no-op */ }
  };

  const toggleRec = async () => {
    const engine = getInstrumentEngine();
    await engine.init();
    if (engine.isRecording) {
      const blob = await engine.stopRecording();
      setRecording(false);
      const ext = blob.type.includes('ogg') ? 'ogg' : 'webm';
      downloadBlob(blob, `${safeFilename(instrument.name)}.${ext}`);
    } else {
      engine.startRecording();
      setRecording(true);
    }
  };

  const exportMidi = () => {
    if (hitLog.current.length === 0) return;
    const t0   = hitLog.current[0].time;
    const hits = hitLog.current.map((h) => ({ ...h, time: h.time - t0 }));
    const bytes = buildMidi(hits, 120);
    downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: 'audio/midi' }), `${safeFilename(instrument.name)}.mid`);
    setMidiDone(true);
    setTimeout(() => setMidiDone(false), 1600);
  };

  const stepIndex = { photo: 0, identifying: 1, confirm: 2, playing: 3 }[state];

  const ghostBtn: React.CSSProperties = {
    padding: '7px 10px', background: 'transparent', color: T.ink,
    border: `1.5px solid ${T.ink}`, fontFamily: T.mono,
    fontSize: 10, letterSpacing: 1.2, fontWeight: 700,
    cursor: 'pointer', borderRadius: 0,
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Global chrome — step bar */}
      {state !== 'playing' && (
        <div style={{
          height: 52, borderBottom: `2px solid ${T.ink}`,
          background: T.cream, color: T.ink, fontFamily: T.mono,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', flexShrink: 0, zIndex: 10,
        }}>
          <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.5 }}>PLAYABLE INSTRUMENT</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {STEP_LABELS.map((label, i) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  padding: '5px 10px',
                  background: i === stepIndex ? T.ink : 'transparent',
                  color: i === stepIndex ? T.cream : i < stepIndex ? T.ink : `${T.ink}44`,
                  border: `1.5px solid ${i <= stepIndex ? T.ink : `${T.ink}22`}`,
                  fontSize: 10, letterSpacing: 1.4, fontWeight: 700,
                }}>{i + 1} · {label}</span>
                {i < 3 && <span style={{ opacity: 0.3 }}>—</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Step content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {state === 'photo' && <PhotoStep onPhoto={handlePhoto} />}
        {state === 'identifying' && <IdentifyStep photo={photo} step={scanStep} />}
        {state === 'confirm' && identified && (
          <ConfirmStep photo={photo} identified={identified} onConfirm={handleConfirm} />
        )}
        {state === 'playing' && (
          <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 200px' }}>
            <div style={{ overflow: 'hidden' }}>
              {instrument.uiType === 'strings' || instrument.uiType === 'keys' ? (
                <StringPlayer
                  instrument={instrument} photo={photo} hitLog={hitLog}
                  onHit={() => setHitCount((c) => c + 1)}
                />
              ) : (
                <PercussionGrid
                  instrument={instrument} photo={photo} hitLog={hitLog}
                  onHit={() => setHitCount((c) => c + 1)}
                />
              )}
            </div>

            {/* Action rail */}
            <div style={{
              borderLeft: `2px solid ${T.ink}`, background: T.cream,
              padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, opacity: 0.5, marginBottom: 4 }}>ACTIONS</div>

              <button onClick={handleSave} style={{
                ...ghostBtn,
                background: saved ? T.ink : 'transparent',
                color: saved ? T.cream : T.ink,
              }}>{saved ? '✓ SAVED' : '+ SAVE'}</button>

              <button onClick={handleShare} style={{
                ...ghostBtn,
                background: copied ? instrument.accent : 'transparent',
                color: copied ? T.cream : T.ink,
                border: `1.5px solid ${copied ? instrument.accent : T.ink}`,
              }}>{copied ? '✓ COPIED' : '⎋ SHARE'}</button>

              <div style={{ borderTop: `1px solid ${T.ink}22`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={toggleRec} style={{
                  ...ghostBtn,
                  border: `2px solid ${recording ? T.red : T.ink}`,
                  background: recording ? T.red : 'transparent',
                  color: recording ? T.cream : T.ink,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: recording ? T.cream : T.red,
                    animation: recording ? 'blink 1s steps(2) infinite' : 'none',
                    flexShrink: 0,
                  }} />
                  {recording ? fmtSecs(recSecs) : 'REC'}
                </button>

                <button onClick={exportMidi} disabled={hitCount === 0} style={{
                  ...ghostBtn,
                  background: midiDone ? T.ink : 'transparent',
                  color: midiDone ? T.cream : T.ink,
                  opacity: hitCount === 0 ? 0.35 : 1,
                  cursor: hitCount === 0 ? 'not-allowed' : 'pointer',
                }}>{midiDone ? '✓ DONE' : '↓ MIDI'}</button>
              </div>

              <div style={{ borderTop: `1px solid ${T.ink}22`, paddingTop: 10 }}>
                <button onClick={() => { setState('photo'); setPhoto(''); setHitCount(0); hitLog.current = []; document.title = 'Playable Instrument'; }} style={{
                  ...ghostBtn, width: '100%', opacity: 0.55,
                }}>↩ NEW PHOTO</button>
              </div>

              <div style={{
                marginTop: 'auto', fontFamily: T.mono, fontSize: 9,
                letterSpacing: 1.2, opacity: 0.4, lineHeight: 1.5,
              }}>
                {hitCount} HITS
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
