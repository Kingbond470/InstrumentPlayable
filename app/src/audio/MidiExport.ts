import type { PadType } from '@/types/kit';

// General MIDI drum map (channel 10 = percussion)
const PAD_NOTE: Record<PadType, number> = {
  KIK: 36,  // Bass Drum 1
  SNR: 38,  // Acoustic Snare
  HAT: 42,  // Closed Hi-Hat
  OPN: 46,  // Open Hi-Hat
  CLP: 39,  // Hand Clap
  TOM: 45,  // Low Floor Tom
  RIM: 37,  // Side Stick
  CYM: 49,  // Crash Cymbal 1
  SUB: 35,  // Acoustic Bass Drum
  BUZ: 41,  // Low Floor Tom 2
  VOX: 52,  // Chinese Cymbal
  FX1: 55,  // Splash Cymbal
  ARP: 80,  // Mute Triangle
  STB: 50,  // High Tom
  CHD: 48,  // Hi-Mid Tom
  END: 56,  // Cowbell
};

export interface HitEvent {
  time: number;    // seconds from t0
  padType: PadType;
}

function varLen(n: number): number[] {
  if (n < 0x80) return [n];
  const out: number[] = [];
  out.unshift(n & 0x7F);
  n >>= 7;
  while (n > 0) { out.unshift((n & 0x7F) | 0x80); n >>= 7; }
  return out;
}

export function buildMidi(hits: HitEvent[], bpm: number): Uint8Array {
  if (hits.length === 0) return new Uint8Array(0);

  const TPB = 480;
  const secPerTick = 60 / (bpm * TPB);
  const CH = 0x9; // MIDI channel 10 (0-indexed) = drums

  // B2 fix: tempo meta event so DAWs import at the correct BPM.
  const uspb = Math.round(60_000_000 / bpm); // microseconds per beat
  const tempoEvent = [
    0x00, 0xFF, 0x51, 0x03,
    (uspb >> 16) & 0xFF, (uspb >> 8) & 0xFF, uspb & 0xFF,
  ];

  const events: Array<{ tick: number; bytes: number[] }> = [];
  for (const hit of hits) {
    const tick = Math.round(hit.time / secPerTick);
    const n    = PAD_NOTE[hit.padType];
    events.push({ tick,          bytes: [(0x90 | CH), n, 100] }); // note on
    events.push({ tick: tick + 24, bytes: [(0x80 | CH), n, 0]  }); // note off (~50ms)
  }
  events.sort((a, b) => a.tick - b.tick);

  const track: number[] = [...tempoEvent];
  let cursor = 0;
  for (const ev of events) {
    track.push(...varLen(ev.tick - cursor), ...ev.bytes);
    cursor = ev.tick;
  }
  track.push(0x00, 0xFF, 0x2F, 0x00); // end of track

  const tLen = track.length;
  return new Uint8Array([
    // MThd
    0x4D,0x54,0x68,0x64, 0x00,0x00,0x00,0x06,
    0x00,0x00,                           // format 0
    0x00,0x01,                           // 1 track
    (TPB >> 8) & 0xFF, TPB & 0xFF,
    // MTrk
    0x4D,0x54,0x72,0x6B,
    (tLen >> 24) & 0xFF, (tLen >> 16) & 0xFF, (tLen >> 8) & 0xFF, tLen & 0xFF,
    ...track,
  ]);
}
