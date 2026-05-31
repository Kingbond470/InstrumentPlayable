'use client';

import { useRef, useEffect, useState } from 'react';
import type { InstrumentEngine } from '@/audio/InstrumentEngine';
import type { InstrumentDef } from '@/types/instrument';
import { trackEvent, Events } from '@/lib/analytics';

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '201, 63, 79';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

interface WindPlayerProps {
  engine: InstrumentEngine | null;
  instrument: InstrumentDef | null;
}

/**
 * Wind instrument UI: breath + note control.
 *
 * Vertical fader (0-100) = breath intensity.
 * Horizontal position = note selection (0-7, or full voice range).
 *
 * Interaction:
 * - Vertical drag: control breath (volume/intensity)
 * - Horizontal swipe: change note
 * - Release: stop playing
 *
 * Renders as single column with visual feedback.
 */
export default function WindPlayer({ engine, instrument }: WindPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [breathing, setBreathing] = useState(false);
  const [breathIntensity, setBreathIntensity] = useState(0); // 0-100
  const [activeVoice, setActiveVoice] = useState<number | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const maxVoices = instrument?.voices.length ?? 8;

  useEffect(() => {
    if (!engine || !instrument || !containerRef.current) return;

    const container = containerRef.current;

    const handlePointerDown = (e: PointerEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Intensity = vertical position (0 at top = max, height at bottom = min)
      const intensity = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));

      // Voice = horizontal position divided into voice zones
      const voiceIndex = Math.floor((x / rect.width) * maxVoices);

      setBreathing(true);
      setPointer({ x, y });
      setBreathIntensity(intensity);
      setActiveVoice(Math.min(voiceIndex, maxVoices - 1));

      engine.hit(Math.min(voiceIndex, maxVoices - 1));
      trackEvent(Events.INSTRUMENT_PLAYED, {
        voice: Math.min(voiceIndex, maxVoices - 1),
        intensity: Math.round(intensity),
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!breathing || !container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const intensity = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
      const voiceIndex = Math.floor((x / rect.width) * maxVoices);

      setPointer({ x, y });
      setBreathIntensity(intensity);

      // Switch voice if crossed boundary
      if (activeVoice !== null && voiceIndex !== activeVoice) {
        const newVoice = Math.min(voiceIndex, maxVoices - 1);
        setActiveVoice(newVoice);
        engine.hit(newVoice);
      }
    };

    const handlePointerUp = () => {
      setBreathing(false);
      setPointer(null);
      setActiveVoice(null);
      setBreathIntensity(0);
      trackEvent(Events.PAD_HIT, { action: 'wind_release' });
    };

    container.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [engine, instrument, maxVoices, activeVoice, breathing]);

  if (!engine || !instrument) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        background: `linear-gradient(to bottom,
          rgba(${hexToRgb(instrument.accent)}, 0.1) 0%,
          rgba(${hexToRgb(instrument.accent)}, 0) 100%)`,
        border: `2px solid ${instrument.accent}`,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: breathing ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* Voice dividers */}
      {Array.from({ length: maxVoices - 1 }).map((_, i) => (
        <div
          key={`divider-${i}`}
          style={{
            position: 'absolute',
            left: `${((i + 1) / maxVoices) * 100}%`,
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      ))}

      {/* Breath intensity bar (left side, vertical) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '8px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRight: `2px solid ${instrument.accent}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${breathIntensity}%`,
            background: instrument.accent,
            transition: breathing ? 'none' : 'height 0.1s ease-out',
          }}
        />
      </div>

      {/* Voice labels */}
      {instrument.voices.map((voice, idx) => {
        const isActive = activeVoice === idx;
        return (
          <div
            key={`voice-${idx}`}
            style={{
              position: 'absolute',
              left: `${(idx / maxVoices) * 100}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              width: `${100 / maxVoices}%`,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isActive ? 1 : 0.4,
              transition: 'opacity 0.1s',
              pointerEvents: 'none',
              fontSize: '12px',
              fontFamily: 'ui-monospace, monospace',
              color: isActive ? instrument.accent : '#999',
              fontWeight: isActive ? 'bold' : 'normal',
              textAlign: 'center',
              padding: '0 4px',
            }}
          >
            <span style={{ lineHeight: 1.2 }}>{voice.label || `V${idx}`}</span>
          </div>
        );
      })}

      {/* Pointer feedback */}
      {pointer && breathing && (
        <div
          style={{
            position: 'absolute',
            left: pointer.x,
            top: pointer.y,
            width: '32px',
            height: '32px',
            background: instrument.accent,
            borderRadius: '50%',
            opacity: 0.5,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Intensity label */}
      {breathing && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            fontSize: '14px',
            fontFamily: 'ui-monospace, monospace',
            color: instrument.accent,
            fontWeight: 'bold',
            pointerEvents: 'none',
          }}
        >
          {Math.round(breathIntensity)}%
        </div>
      )}

      {/* Instruction (when idle) */}
      {!breathing && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: 0.5,
            pointerEvents: 'none',
            fontSize: '13px',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          <div>Drag to control</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>vertical: breath | horizontal: note</div>
        </div>
      )}
    </div>
  );
}
