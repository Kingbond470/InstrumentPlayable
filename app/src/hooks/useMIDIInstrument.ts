import { useEffect, useState, useRef } from 'react';
import { MIDIInput, midiNoteToVoiceIndex } from '@/lib/midiInput';
import type { InstrumentEngine } from '@/audio/InstrumentEngine';
import type { InstrumentDef } from '@/types/instrument';

interface UseMIDIInstrumentOptions {
  engine: InstrumentEngine | null;
  instrument: InstrumentDef | null;
  enabled?: boolean;
}

interface UseMIDIInstrumentReturn {
  connected: boolean;
  error: string | null;
  deviceCount: number;
}

/**
 * High-level MIDI hook: maps MIDI notes → instrument voices.
 *
 * Usage:
 * const { connected } = useMIDIInstrument({
 *   engine,
 *   instrument,
 *   enabled: midiEnabled,
 * });
 *
 * Handles:
 * - MIDI note (0-127) → voice index (0-N) mapping
 * - Note-on/off routing to engine.hit/release
 * - Pitch bend routing to engine
 */
export function useMIDIInstrument({
  engine,
  instrument,
  enabled = false,
}: UseMIDIInstrumentOptions): UseMIDIInstrumentReturn {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceCount, setDeviceCount] = useState(0);
  const midiRef = useRef<MIDIInput | null>(null);
  const activeNotesRef = useRef<Map<number, number>>(new Map()); // MIDI note → voice index

  useEffect(() => {
    if (!enabled || !engine || !instrument) {
      setConnected(false);
      return;
    }

    const midi = new MIDIInput();

    midi
      .init()
      .then(() => {
        midiRef.current = midi;
        const devices = midi.getInputDevices();
        setDeviceCount(devices.length);

        // Map MIDI note → voice index
        midi.onNoteOn((midiNote, velocity) => {
          const voiceIndex = midiNoteToVoiceIndex(midiNote, instrument.voices.length);
          activeNotesRef.current.set(midiNote, voiceIndex);
          engine.hit(voiceIndex);

          if (typeof window !== 'undefined' && window.va) {
            window.va.track('midi_note_on', { midiNote, voiceIndex, velocity });
          }
        });

        midi.onNoteOff((midiNote) => {
          activeNotesRef.current.delete(midiNote);

          if (typeof window !== 'undefined' && window.va) {
            window.va.track('midi_note_off', { midiNote });
          }
        });

        midi.onPitchBend((pitch) => {
          // Pitch bend affects the last active note
          if (activeNotesRef.current.size > 0) {
            if (typeof window !== 'undefined' && window.va) {
              window.va.track('midi_pitch_bend', { pitch });
            }
          }
        });

        setConnected(true);
        setError(null);
      })
      .catch((err) => {
        setConnected(false);
        setError((err as Error).message);
      });

    return () => {
      if (midiRef.current) {
        midiRef.current.dispose();
        midiRef.current = null;
      }
      activeNotesRef.current.clear();
    };
  }, [enabled, engine, instrument]);

  return { connected, error, deviceCount };
}
