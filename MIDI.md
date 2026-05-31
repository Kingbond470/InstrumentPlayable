# MIDI Input Support

Play Playable Instrument from a physical MIDI controller (keyboard, drums, etc.).

## Browser Support

- ✅ Chrome/Edge 25+
- ✅ Safari 14.1+
- ❌ Firefox (no Web MIDI API)
- ❌ Internet Explorer

Web MIDI API requires secure context (HTTPS).

---

## Setup

### Grant Permission

First time you enable MIDI:
1. App requests "Allow MIDI access"
2. Click **Allow**
3. Select controller device(s) to grant access

---

## Usage

### In StringPlayer / PercussionGrid

`<MIDIControls engine={engine} instrument={instrument} />`

Shows:
- Connection status (connected / no device / unsupported)
- Device count
- Enable/disable toggle
- Error messages (if browser doesn't support or permission denied)

### How Notes Map

MIDI note number (0-127) → instrument voice (0-N):

```
voice_index = midi_note % voice_count

Tabla (8 voices):
- MIDI C1 (0) → voice 0 (Bayan)
- MIDI C#1 (1) → voice 1 (Dayan)
- MIDI D1 (2) → voice 2 (Bayan high)
- ...
- MIDI C2 (12) → voice 0 (wraps)
```

Each octave repeats the pattern.

### Velocity

MIDI velocity (0-127) normalized to 0.0-1.0 and passed to `engine.hit()`.

Ignore on percussion (all velocity → full attack).

### Pitch Bend

Detected but not wired to synth modulation yet. Add envelope/pitch sweep in future release.

---

## Example: Tabla + USB Keyboard

1. Plug in USB keyboard
2. Open Playable Instrument
3. Upload photo → select **Tabla**
4. Click **Enable MIDI** (browser prompts for permission)
5. Select keyboard in dialog
6. Play keys — each key triggers one tabla voice

Mapping:
- C1 = Bayan
- C#1 = Dayan
- D1 = Bayan high
- ... (repeat per octave)

---

## Code

### Low-level API

```typescript
import { MIDIInput } from '@/lib/midiInput';

const midi = new MIDIInput();
await midi.init(); // User grants permission

midi.onNoteOn((note, velocity) => {
  console.log(`Note ${note} (velocity ${velocity})`);
});

midi.onNoteOff((note) => {
  console.log(`Note ${note} released`);
});
```

### React Hook

```typescript
import { useMIDIInstrument } from '@/hooks/useMIDIInstrument';

function MyComponent() {
  const { connected, error, deviceCount } = useMIDIInstrument({
    engine,
    instrument,
    enabled: true,
  });

  if (!connected) return <div>MIDI unavailable: {error}</div>;
  return <div>Playing from {deviceCount} device(s)</div>;
}
```

---

## Limitations

- **No polyphony-per-voice yet**: Multiple MIDI notes playing one voice triggers rapid on/off
  - Workaround: Send only monophonic lines or use instruments with many voices (16-voice tabla)
- **No pitch bend effect**: Detected but not modulated
- **No CC messages**: Controllers (mod wheel, sustain) not supported yet
- **No per-device routing**: All MIDI input goes to current instrument

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| "MIDI not supported" | Browser doesn't have Web MIDI API | Use Chrome/Edge/Safari |
| "Grant MIDI permission" | User denied access | Settings → Allow → Grant |
| Device not listed | Not plugged in or detected yet | Plug in controller, refresh page |
| No sound on MIDI | Feature enabled but no output | Check browser volume, engine.init() complete |
| Sound is laggy | Network latency or CPU busy | Try smaller instrument (fewer voices) |

---

## Performance

Typical latency: **10-30ms** (WebAudio synthesis).

For lower latency, native MIDI host (DAW, OS) is better.

---

## Future

- [ ] Pitch bend → synth pitch sweep
- [ ] CC messages (mod wheel, sustain)
- [ ] Polyphonic voice allocation
- [ ] Device-per-track routing (left/right controllers)
- [ ] MIDI file playback
- [ ] Keyboard visualization (piano roll)
