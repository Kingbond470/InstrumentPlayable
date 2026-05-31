# Wind Instrument UI — Breath Control

Play wind instruments (flute, bansuri, dizi) with continuous, expressive control.

---

## Design

**Vertical drag = breath intensity** (0-100%)
- Top of screen: breath off (0%)
- Bottom of screen: full breath (100%)
- Visual feedback: bar grows from bottom

**Horizontal position = note selection**
- Left side: voice 0 (low note)
- Right side: voice N (high note)
- Dividers show voice zones (8 zones for 8-voice instrument)

**Pointer feedback**
- Circle follows finger/mouse
- Intensity % displayed (bottom right, while breathing)
- Voice labels highlight when active

---

## Interaction

```
1. Touch/click anywhere on screen
   → Instrument starts playing (voice = horizontal zone)

2. Drag vertically (up/down)
   → Breath intensity changes
   → Volume/sustain affected (in future: envelope modulation)

3. Drag horizontally
   → Switch between voice zones (notes)
   → Smooth transition to new note

4. Release
   → Instrument stops
   → Intensity resets to 0
```

---

## Technical

### Component: WindPlayer

```typescript
<WindPlayer engine={engine} instrument={instrument} />
```

Props:
- `engine: InstrumentEngine` — audio synthesis
- `instrument: InstrumentDef` — voice definitions + labels

Events tracked:
- `instrument_played` — when note starts (voice, intensity)
- `pad_hit` (action: wind_release) — when note stops

### Pointer Handling

Uses Pointer Events API (cross-device: mouse, touch, pen).

```
pointerdown → set breathing = true
pointermove → update intensity + voice
pointerup → stop breathing
```

Canvas is full-width, 400px tall. No separate buttons.

---

## Instrument Mapping

Wind instruments in library:
- **Flute** (8 voices: C4-C5 scale)
- **Bansuri** (8 voices: C3-C4 scale)
- **Dizi** (8 voices: C4-C5 scale)

Each voice has a `.label` (e.g., "Low", "High"):
- Horizontal zones map voice index to screen position
- Labels displayed in each zone

---

## Visualization

### Colors

- **Accent bar** (left edge, 8px wide): breath intensity grows upward
- **Voice dividers**: light horizontal lines (0.1 opacity)
- **Active voice label**: bright (instrument.accent color, bold)
- **Inactive voice labels**: dim (0.4 opacity)

### States

| State | Appearance |
|-------|-----------|
| Idle | Instruction text centered, dividers visible |
| Breathing | Intensity bar growing, pointer feedback circle, % display |
| Transition (voice change) | New label highlights, old label dims |

---

## Performance

- ~60 FPS pointer tracking (throttled to animation frame)
- No lag on breath changes (state updates only)
- No re-renders outside active zone (React optimization)

---

## Limitations & Future

❌ **Current:**
- No pitch bend effect (breath doesn't modulate pitch envelope yet)
- Fixed voice zones (no dynamic remapping)
- No vibrato or tremolo

✅ **Future:**
- Breath modulates synth envelope (attack, sustain, release)
- X-axis vibrato: horizontal oscillation → pitch wobble
- Y-axis tremolo: vertical micro-movements → amplitude wobble
- Pressure sensitivity (if pen device available)
- Visual keyboard overlay (show notes in solfège or absolute pitch)

---

## Browser Support

✅ All modern browsers (Pointer Events standard since 2018)

---

## Example: Playing Bansuri

1. Select **Bansuri** (8-voice flute)
2. Screen shows 8 vertical zones
3. Tap **left side** → low note (C3) plays
4. **Drag up** → breath intensifies (soft→loud)
5. **Drag right** → slides to next zone (D3)
6. **Release** → stops
7. **Tap lower** → jumps to lower octave (A2)

---

## Code

### Voice Access in WindPlayer

```typescript
const maxVoices = instrument?.voices.length ?? 8;
const voiceIndex = Math.floor((x / rect.width) * maxVoices);
engine.hit(voiceIndex); // Trigger synth voice
```

### Breath Intensity

Currently stored in state (`breathIntensity: 0-100`). In future:
- Pass to InstrumentEngine for envelope modulation
- Scale to synth gain (0-1): `gain = breathIntensity / 100`

---

## See Also

- [InstrumentEngine.ts](app/src/audio/InstrumentEngine.ts) — synthesis backend
- [instrumentLibrary.ts](app/src/lib/instrumentLibrary.ts) — wind instrument definitions
- [StringPlayer.tsx](app/src/components/StringPlayer.tsx) — similar UI for strings (reference)
