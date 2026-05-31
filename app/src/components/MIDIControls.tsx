'use client';

import { useMIDIInstrument } from '@/hooks/useMIDIInstrument';
import type { InstrumentEngine } from '@/audio/InstrumentEngine';
import type { InstrumentDef } from '@/types/instrument';
import { useState } from 'react';

interface MIDIControlsProps {
  engine: InstrumentEngine | null;
  instrument: InstrumentDef | null;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

/**
 * MIDI controller interface.
 * Shows connection status, enable/disable toggle, device count.
 * High-level: handles MIDI note → voice mapping automatically.
 */
export default function MIDIControls({
  engine,
  instrument,
  enabled = false,
  onToggle,
}: MIDIControlsProps) {
  const [localEnabled, setLocalEnabled] = useState(enabled);
  const { connected, error, deviceCount } = useMIDIInstrument({
    engine,
    instrument,
    enabled: localEnabled,
  });

  const handleToggle = () => {
    const newState = !localEnabled;
    setLocalEnabled(newState);
    onToggle?.(newState);
  };

  if (!engine || !instrument) return null;

  return (
    <div
      style={{
        padding: '12px 16px',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '6px',
        fontSize: '13px',
        fontFamily: 'ui-monospace, monospace',
      }}
    >
      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label>
          <input
            type="checkbox"
            checked={localEnabled}
            onChange={handleToggle}
            disabled={!connected}
            style={{ marginRight: '6px' }}
          />
          MIDI Input
        </label>
        <span style={{ opacity: 0.5, fontSize: '11px' }}>
          {connected ? '(connected)' : '(no device)'}
        </span>
      </div>

      {error && !connected && (
        <div style={{ color: '#f44336', marginBottom: '8px', fontSize: '12px' }}>
          {error === 'Web MIDI API not supported in this browser'
            ? 'MIDI not supported. Try Chrome/Edge 25+, Safari 14.1+'
            : 'Grant MIDI permission in browser settings'}
        </div>
      )}

      {connected && deviceCount > 0 && (
        <div style={{ opacity: 0.7, fontSize: '12px', marginBottom: '6px' }}>
          {deviceCount} device{deviceCount === 1 ? '' : 's'} detected
        </div>
      )}

      {connected && localEnabled && (
        <div style={{ color: '#4caf50', fontSize: '12px' }}>
          Ready. Play on controller (maps to {instrument.voices.length} voices)
        </div>
      )}
    </div>
  );
}
