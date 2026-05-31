---
title: Add 10+ Cultural Instruments
status: shipped
effort: S (2h)
shipped: 2026-05-31
---

## Summary

Expand from 15 to 25 instruments. Add: Balalaika, Oud, Taiko, Shamisen, Marimba, Bouzouki, Sarangi, Dizi, Pipa, Hurdy-Gurdy. Each with 8-voice tuning, culture tag, UI type (StringPlayer/PercussionGrid).

---

## Problem

Limited cultural representation. Most UI can only identify Western instruments. Goal: 25 instruments across 10+ cultures.

---

## Goals

- ✅ Add 10 new instruments (V2 = 25 total)
- ✅ Each instrument has 8 voices (tuned notes)
- ✅ Each has correct UI (strings → StringPlayer, percussion → PercussionGrid, wind → WindPlayer)
- ✅ Culture metadata for filtering + learning
- ✅ No duplicate tunings
- ✅ AI can identify them (Claude Vision trained on musical images)

---

## Success Criteria

- [x] 25 instruments in instrumentLibrary.ts
- [x] Each has: id, name, family, culture, aliases, uiType, accent, description, voices[]
- [x] Voices: 8 entries with label + note tuning
- [x] No TypeScript errors
- [x] UI renders correct component per instrument
- [x] Photo identification works for new instruments
- [x] StringPlayer vertical/horizontal layout per instrument

---

## Design

### InstrumentDef Type

```typescript
interface InstrumentDef {
  id: string;
  name: string;
  family: 'strings' | 'percussion' | 'wind' | 'brass' | 'keys';
  culture: string;
  aliases: string[];
  uiType: 'StringPlayer' | 'PercussionGrid' | 'WindPlayer';
  accent: string; // hex color
  description: string;
  voices: VoiceDef[];
}
```

### New Instruments (10)

| Instrument | Family | Culture | UI Type | Notes |
|-----------|--------|---------|---------|-------|
| Balalaika | Strings | Russian | StringPlayer | Triangular, plucked |
| Oud | Strings | Arabic | StringPlayer | Fretless, pear-shaped |
| Taiko | Percussion | Japanese | PercussionGrid | Large drum, 8 zones |
| Shamisen | Strings | Japanese | StringPlayer | 3-string, long neck |
| Marimba | Percussion | African | PercussionGrid | Wooden bars, 8 zones |
| Bouzouki | Strings | Greek | StringPlayer | Paired strings |
| Sarangi | Strings | Indian | StringPlayer | Bowed, resonant |
| Dizi | Wind | Chinese | WindPlayer | Bamboo flute |
| Pipa | Strings | Chinese | StringPlayer | Pear-shaped lute |
| Hurdy-Gurdy | Strings | European | StringPlayer | Wheel-driven |

### Tuning Strategy

Standard pitch: A=440Hz, C = middle C (60 MIDI).

Example: Tabla (percussion, 8 zones)
```
voice[0]: label="Bayan", note="C3"
voice[1]: label="Dayan", note="G3"
voice[2]: label="Bayan Hi", note="C4"
...
```

Example: Sitar (strings, 8 voices)
```
voice[0]: label="SA", note="C4"
voice[1]: label="RE", note="D4"
...
voice[7]: label="SA Hi", note="C5"
```

---

## Acceptance Tests

| Scenario | Expected |
|----------|----------|
| Load app | 25 instruments available in library |
| Select Taiko | PercussionGrid renders with 8 pads |
| Select Dizi | WindPlayer renders (drag control) |
| Upload photo of sitar | Identification returns sitar ID |
| StringPlayer vertical | Plays 8-voice sitar (top to bottom) |
| StringPlayer horizontal | Plays 8-voice koto (left to right per instrument) |
| MIDI input | Maps MIDI note → voice (modulo 8) |
| OG image | Renders instrument name + culture |

---

## References

- [instrumentLibrary.ts](app/src/lib/instrumentLibrary.ts)
- [StringPlayer.tsx](app/src/components/StringPlayer.tsx)
- [PercussionGrid.tsx](app/src/components/PercussionGrid.tsx)
- [WindPlayer.tsx](app/src/components/WindPlayer.tsx)

---

## Tuning Reference

### Strings (C-major scale per octave)

C, D, E, F, G, A, B, C (next octave)

MIDI notes: C4=60, D4=62, E4=64, F4=65, G4=67, A4=69, B4=71, C5=72

### Percussion (chromatic, C3-B3)

C3=36, C#3=37, D3=38, D#3=39, E3=40, F3=41, F#3=42, G3=43, ...

### Wind (C4-B4 or C3-B3 per instrument)

Same as strings, different octave.

---

## Future

- [ ] Add 10+ more instruments (V3)
- [ ] Per-culture filtering in UI
- [ ] Instrument history (recently played)
- [ ] Share collections (user's favorite 5 instruments)
