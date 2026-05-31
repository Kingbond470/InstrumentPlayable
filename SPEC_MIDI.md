---
title: MIDI Input Support (Web MIDI API)
status: shipped
effort: M (4h)
shipped: 2026-05-31
---

## Summary

Play from physical MIDI controllers (keyboards, drum pads, etc.). MIDI note (0-127) maps to instrument voice. Browser permission required (secure context / HTTPS).

---

## Problem

On-screen pads = fun for demos. Real musicians want physical controller. MIDI = industry standard input.

---

## Goals

- ✅ Initialize Web MIDI API (user grants permission)
- ✅ Detect connected MIDI devices
- ✅ Map MIDI note → voice index (modulo voice count)
- ✅ Handle note-on, note-off, pitch bend
- ✅ Graceful fallback (browser without MIDI, no crash)
- ✅ Works on Chrome/Edge/Safari (not Firefox)

---

## Success Criteria

- [x] MIDIInput class initializes without errors
- [x] Browser permission dialog appears (first use)
- [x] Connected devices enumerated
- [x] Note-on (0x90) triggers engine.hit(voiceIndex)
- [x] Note-off (0x80) registered
- [x] Pitch bend (0xe0) detected
- [x] Velocity 0-127 passed to engine
- [x] Error handling (unsupported browser, permission denied)
- [x] React hook (useMIDIInstrument) abstracts complexity
- [x] MIDIControls component UI toggles MIDI on/off

---

## Design

### MIDIInput Class (Low-Level)

```typescript
class MIDIInput {
  async init(): Promise<void>
  getInputDevices(): MIDIInputDevice[]
  onNoteOn(callback: MIDIEventCallback): void
  onNoteOff(callback: MIDIEventCallback): void
  onPitchBend(callback: (pitch: number) => void): void
  dispose(): void
}
```

### Note-to-Voice Mapping

```typescript
midiNoteToVoiceIndex(midiNote: number, voiceCount: number): number {
  return midiNote % voiceCount;
}

// Example: 8-voice tabla
midiNote=0 (C1) → voice 0 (Bayan)
midiNote=1 (C#1) → voice 1 (Dayan)
midiNote=12 (C2) → voice 0 (wraps)
```

### React Hook (High-Level)

```typescript
useMIDIInstrument({
  engine,
  instrument,
  enabled: true
}): { connected, error, deviceCount }

// Internally:
// - Maps MIDI note → voice
// - Calls engine.hit(voiceIndex)
// - Tracks analytics events
```

### Component

```tsx
<MIDIControls
  engine={engine}
  instrument={instrument}
  enabled={midiEnabled}
  onToggle={(enabled) => setMidiEnabled(enabled)}
/>
```

Shows:
- Enable/disable checkbox
- Connection status
- Device count
- Error message (if unsupported)

---

## Acceptance Tests

| Scenario | Expected |
|----------|----------|
| Browser supports MIDI | init() succeeds, no error |
| Browser doesn't support MIDI | init() throws, error message shown |
| User denies permission | Error: "Grant MIDI permission in browser settings" |
| User grants permission | Permission dialog gone, devices enumerated |
| Connect USB keyboard | 1 device appears in list |
| Play middle C | engine.hit(0) called (voice 0) |
| Play C# (semitone up) | engine.hit(1) called (voice 1) |
| Play C one octave up | engine.hit(0) called (wraps) |
| Note-off | Note stops |
| High velocity (127) | Passed to engine |
| Low velocity (1) | Passed to engine |
| Pitch bend wheel | Detected, logged (not modulated yet) |
| Device disconnected | Gracefully handled, error shown |

---

## References

- [midiInput.ts](app/src/lib/midiInput.ts)
- [useMIDI.ts](app/src/hooks/useMIDI.ts)
- [useMIDIInstrument.ts](app/src/hooks/useMIDIInstrument.ts)
- [MIDIControls.tsx](app/src/components/MIDIControls.tsx)
- [MIDI.md](MIDI.md) — user guide
- Web MIDI API spec: https://www.w3.org/TR/webmidi/

---

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 25+ | ✅ Full support |
| Edge | 12+ | ✅ Full support |
| Safari | 14.1+ | ✅ Full support |
| Firefox | All | ❌ No Web MIDI API |
| IE | All | ❌ Legacy, unsupported |

Requires HTTPS (secure context).

---

## Limitations

- **No polyphony per voice** — Multiple MIDI notes on one voice cause rapid on/off
  - Workaround: use instruments with many voices (16-voice tabla)
- **No pitch bend modulation** — Detected but not applied to synth
- **No CC messages** — Mod wheel, sustain, etc. not supported
- **No MIDI file playback** — SMF → playback not implemented

---

## Future

- [ ] Pitch bend → envelope pitch sweep
- [ ] CC messages (mod wheel → vibrato, sustain → release)
- [ ] Polyphonic voice allocation
- [ ] MIDI file drag-drop playback
- [ ] Keyboard visualization (piano roll overlay)
- [ ] Per-device routing (left controller → strings, right → percussion)
