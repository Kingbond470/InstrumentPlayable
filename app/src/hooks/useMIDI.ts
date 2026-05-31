import { useEffect, useState, useRef } from 'react';
import { MIDIInput, MIDIEventCallback, MIDIInputDevice, midiNoteToVoiceIndex } from '@/lib/midiInput';
import type { InstrumentEngine } from '@/audio/InstrumentEngine';

interface UseMIDIOptions {
  onNoteOn?: MIDIEventCallback;
  onNoteOff?: MIDIEventCallback;
  onPitchBend?: (pitch: number) => void;
}

interface UseMIDIReturn {
  connected: boolean;
  error: string | null;
  devices: MIDIInputDevice[];
}

/**
 * React hook for Web MIDI input.
 *
 * Usage:
 * const { connected, error, devices } = useMIDI({
 *   onNoteOn: (note, velocity, pitch) => engine.hit(note, velocity),
 *   onNoteOff: (note) => engine.release(note),
 *   onPitchBend: (pitch) => engine.bend(pitch),
 * });
 *
 * if (error) return <p>MIDI unavailable: {error}</p>;
 * if (!connected) return <p>Waiting for MIDI...</p>;
 * return <div>MIDI ready. Devices: {devices.length}</div>;
 */
export function useMIDI(options: UseMIDIOptions = {}): UseMIDIReturn {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MIDIInputDevice[]>([]);
  const midiRef = useRef<MIDIInput | null>(null);

  useEffect(() => {
    const midi = new MIDIInput();

    midi
      .init()
      .then(() => {
        midiRef.current = midi;

        if (options.onNoteOn) {
          midi.onNoteOn(options.onNoteOn);
        }
        if (options.onNoteOff) {
          midi.onNoteOff(options.onNoteOff);
        }
        if (options.onPitchBend) {
          midi.onPitchBend(options.onPitchBend);
        }

        setDevices(midi.getInputDevices());
        setConnected(true);
        setError(null);
      })
      .catch((err) => {
        setConnected(false);
        setError((err as Error).message);
      });

    return () => {
      midi.dispose();
      midiRef.current = null;
    };
  }, [options]);

  return { connected, error, devices };
}
