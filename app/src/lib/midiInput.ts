/**
 * Web MIDI API integration.
 * Listen to physical MIDI controllers → InstrumentEngine.
 *
 * Usage:
 * const midi = new MIDIInput();
 * midi.init()
 *   .then(() => console.log('MIDI ready'))
 *   .catch(err => console.error('MIDI not supported or denied'));
 */

export type MIDIEventCallback = (note: number, velocity: number, pitch: number) => void;

export interface MIDIInputDevice {
  id: string;
  name: string;
  manufacturer: string;
}

export class MIDIInput {
  private access: MIDIAccess | null = null;
  private activeInputs: Map<string, MIDIInput> = new Map();
  private noteOnHandlers: MIDIEventCallback[] = [];
  private noteOffHandlers: MIDIEventCallback[] = [];
  private pitchBendHandlers: ((pitch: number) => void)[] = [];

  /**
   * Initialize Web MIDI access. User must grant permission.
   * Throws if browser doesn't support Web MIDI or user denies permission.
   */
  async init(): Promise<void> {
    if (!navigator.requestMIDIAccess) {
      throw new Error('Web MIDI API not supported in this browser');
    }

    try {
      this.access = await navigator.requestMIDIAccess();
      this.attachInputListeners();
    } catch (err) {
      throw new Error(
        `MIDI access denied. Grant permission in browser settings: ${(err as Error).message}`
      );
    }
  }

  /**
   * List available MIDI input devices.
   */
  getInputDevices(): MIDIInputDevice[] {
    if (!this.access) return [];

    const devices: MIDIInputDevice[] = [];
    for (const entry of this.access.inputs.values()) {
      devices.push({
        id: entry.id,
        name: entry.name || 'Unknown Device',
        manufacturer: entry.manufacturer || 'Unknown',
      });
    }
    return devices;
  }

  /**
   * Register callback for note-on events.
   */
  onNoteOn(callback: MIDIEventCallback): void {
    this.noteOnHandlers.push(callback);
  }

  /**
   * Register callback for note-off events.
   */
  onNoteOff(callback: MIDIEventCallback): void {
    this.noteOffHandlers.push(callback);
  }

  /**
   * Register callback for pitch bend.
   */
  onPitchBend(callback: (pitch: number) => void): void {
    this.pitchBendHandlers.push(callback);
  }

  /**
   * Remove all handlers (cleanup on unmount).
   */
  clearHandlers(): void {
    this.noteOnHandlers = [];
    this.noteOffHandlers = [];
    this.pitchBendHandlers = [];
  }

  /**
   * Dispose MIDI access (cleanup).
   */
  dispose(): void {
    this.clearHandlers();
    this.access = null;
  }

  private attachInputListeners(): void {
    if (!this.access) return;

    for (const input of this.access.inputs.values()) {
      input.onmidimessage = (event: MIDIMessageEvent) => {
        this.handleMIDIMessage(event);
      };
    }

    // Listen for device connect/disconnect
    this.access.onstatechange = () => {
      this.attachInputListeners();
    };
  }

  private handleMIDIMessage(event: MIDIMessageEvent): void {
    if (!event.data) return;
    const data = event.data;
    const status = data[0] || 0;
    const note = data[1] || 0;
    const velocity = data[2] || 0;

    // Note on (0x90 + channel)
    if ((status & 0xf0) === 0x90 && velocity > 0) {
      this.noteOnHandlers.forEach((handler) => handler(note, velocity, 0));
    }

    // Note off (0x80 + channel)
    if ((status & 0xf0) === 0x80) {
      this.noteOffHandlers.forEach((handler) => handler(note, velocity, 0));
    }

    // Note on with velocity 0 also means note off
    if ((status & 0xf0) === 0x90 && velocity === 0) {
      this.noteOffHandlers.forEach((handler) => handler(note, 0, 0));
    }

    // Pitch bend (0xe0 + channel)
    if ((status & 0xf0) === 0xe0) {
      const lsb = data[1] || 0;
      const msb = data[2] || 0;
      const bend = ((msb << 7) | lsb) - 8192; // 14-bit, centered at 8192
      const pitch = bend / 8192; // -1.0 to 1.0
      this.pitchBendHandlers.forEach((handler) => handler(pitch));
    }
  }
}

/**
 * Map MIDI note (0-127) to voice index (0-N).
 * Simple strategy: modulo by voice count.
 * E.g., 8-voice tabla: C1→0, C#1→1, D1→2, ..., C2→0 (wraps)
 */
export function midiNoteToVoiceIndex(midiNote: number, voiceCount: number): number {
  return midiNote % voiceCount;
}

/**
 * Convert MIDI velocity (0-127) to normalized 0-1.
 */
export function midiVelocityToNormalized(velocity: number): number {
  return Math.max(0, Math.min(1, velocity / 127));
}

// Global singleton (optional, for convenience)
let globalMIDI: MIDIInput | null = null;

export function getGlobalMIDI(): MIDIInput {
  if (!globalMIDI) {
    globalMIDI = new MIDIInput();
  }
  return globalMIDI;
}
