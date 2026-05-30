# Playable Instrument

> **Photograph it. Play it.**

Point your camera at any instrument — real, painted, or sculpted. AI identifies it. You play it instantly. No music knowledge. No account.

```
📷 Photo of a Sitar  →  AI: "Sitar · Indian Classical · 0.94 confidence"
                      →  8 pluckable strings · Sa Re Ga Ma Pa Dha Ni SA
                      →  Record · Export WAV + MIDI · Share link
```

**Origin:** Won first place at a Claude × Metropolitan Museum of Art hackathon, New York City.

Live at → `http://localhost:3000` (see [Getting Started](#getting-started))

---

## Table of Contents

1. [Origin Story](#origin-story)
2. [Product](#product) ← SPM
3. [Getting Started](#getting-started) ← TL
4. [Architecture](#architecture) ← TL
5. [Instrument Library](#instrument-library)
6. [Design System](#design-system) ← Designer
7. [Design Directions](#design-directions) ← Designer
8. [Roadmap](#roadmap)
9. [File Structure](#file-structure)

---

## Origin Story

This project was built at a hackathon hosted by Anthropic (Claude) and The Metropolitan Museum of Art in New York City. The challenge: make art more immersive for museum visitors in the Asian Art Department.

The idea: **let anyone photograph an instrument in a painting and play it.**

Built with Claude Code. Zero prior coding experience. Won first place.

The product now extends that original idea into a full browser application — any instrument, any culture, any era. Real instruments or painted ones. A tabla at the Met or a sitar at home.

---

## Product

### The problem

Every music tool assumes you already play. "Pick a synth." "Set a key." "Choose BPM." Wrong first questions for the 95% who've never made music — but *have* seen an instrument that made them curious.

### The bet

The barrier to music isn't ability. It's the first step. **Photograph it** removes that step entirely.

### Who it's for

Three segments:
- **Museum visitor** standing in front of a 17th-century painting with a sitar in it
- **Cultural explorer** curious about an instrument they've never heard
- **Non-musician** who has a real instrument at home and wants to touch it musically

**Their goal:** Feel connected to an instrument they see — even for 60 seconds.

**Success state:** User photographs a tabla in a museum exhibit → phone says "Tabla — Indian Classical" → 10 seconds later they're playing it. They send the recording to a friend. That friend opens the link and plays it too.

### Core flow

```
/ (landing — dark, photo-first)
    ↓
/capture  →  📷 Photo upload
              ↓
          AI Identification  (Claude Sonnet Vision)
              ↓
          "Is this a Tabla?" Confirm / Correct
              ↓
          Play — StringPlayer or PercussionGrid
              ↓
          Save · Share · Record · Export MIDI
```

**Secondary mode** (kept from v0): `/play` — type a vibe → 16-pad synth grid (PAD/01)

### Win conditions

| Metric | Target |
|---|---|
| Session → instrument played | ≥ 60% |
| Session → recording shared | ≥ 30% |
| Identification accuracy | ≥ 85% correct first-guess |
| D7 retention | ≥ 10% |

### Key product decisions

| Decision | Rationale |
|---|---|
| Photo-first, text-prompt secondary | Original winning hackathon idea; more differentiated |
| Claude Sonnet for vision (not Haiku) | Identification accuracy > cost ($0.002/call) |
| Confirm step ("Is this right?") | Delight moment + training data collection (Quick Draw pattern) |
| 15 instruments, not 150 | Depth over breadth; each instrument has a tuned playable UI |
| Share = instrument ID, not photo | Photo is ephemeral (your camera); instrument identity is shareable |
| Cultural instruments prioritised | Tabla, sitar, erhu, koto, mbira — no competitor has built this |
| The Met origin story on landing | Authenticity that can't be manufactured |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
cd app
npm install
```

### Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get a key at **console.anthropic.com → API Keys**.

> **Note:** This is separate from the claude.ai subscription. It's pay-as-you-go.
> - Identification (Sonnet Vision): ~$0.002 per photo
> - Kit generation (Haiku): ~$0.001 per text prompt
>
> **No key?** App still works — identification returns a fallback "Mystery Instrument" and the text-prompt mode uses hash-based kits. All audio, recording, and export still function.

### Run

```bash
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve production build
```

### Routes

| Route | Description |
|---|---|
| `/` | Landing page — photo-first CTA, origin story |
| `/capture` | **Primary flow** — photo upload → identify → confirm → play |
| `/capture?instrument=tabla` | Opens capture flow pre-seeded with an instrument |
| `/play` | Secondary mode — text prompt → 16-pad synth (PAD/01) |
| `/play?kit={base64}` | Shared kit URL — opens directly to playing |
| `/library` | Saved kits + featured instruments |
| `/api/identify-instrument` | POST `{ image: base64DataUrl }` → `{ identified, fallback }` |
| `/api/parse-prompt` | POST `{ text: string }` → `{ kit, fallback }` |

---

## Architecture

### System overview

```
Browser
├── React UI (Next.js 15, App Router)
│   ├── /              — Landing (server component, dark theme)
│   ├── /capture       — CaptureFlow: 4-state machine (client)
│   │   ├── PhotoStep       — drag-drop + file upload + camera
│   │   ├── IdentifyStep    — scan animation while AI runs
│   │   ├── ConfirmStep     — reveal moment + correction picker
│   │   └── InstrumentPlayer→ StringPlayer | PercussionGrid
│   ├── /play          — OnboardingFlow → PadGrid (text-prompt mode)
│   └── /library       — Kit library
│
├── InstrumentEngine (Tone.js 14, singleton — for photo flow)
│   ├── PluckSynth     — all string instruments (sitar, guitar, koto, harp, kora…)
│   ├── MembraneSynth  — percussion (tabla, djembe)
│   ├── MetalSynth     — metallic percussion (mbira, trumpet pads)
│   ├── FMSynth        — wind + brass (bansuri, flute, trumpet)
│   └── PolySynth      — keys (piano, harpsichord)
│
├── AudioEngine (Tone.js 14, singleton — for text-prompt mode)
│   └── 16 fixed synth voices for PAD/01 pad grid
│
└── Persistence
    ├── localStorage   — saved kits/instruments (max 24)
    └── URL encoding   — base64 kit config in /play?kit=

API (Next.js Route Handlers)
├── /api/identify-instrument — Claude Sonnet Vision → InstrumentDef
└── /api/parse-prompt        — Claude Haiku text → KitConfig
```

### Photo → instrument data flow

```
User uploads photo (file input or drag-drop)
  │
  ├─ PhotoStep converts to base64 data URL
  │
  ▼
POST /api/identify-instrument { image: "data:image/jpeg;base64,..." }
  │
  ├─ No API key? → fallback "Mystery Instrument"
  │
  ├─ Claude Sonnet Vision
  │   system: "identify instrument, return JSON from 15-instrument list"
  │   content: [image, text]
  │   max_tokens: 256
  │
  ▼
{ id: "sitar", name: "Sitar", culture: "Indian Classical", confidence: 0.94, ... }
  │
  ├─ resolveInstrument(id) → InstrumentDef from instrumentLibrary
  │
  ▼
ConfirmStep: "Is this a Sitar?" → YES → CaptureFlow.handleConfirm("sitar")
  │
  ├─ InstrumentEngine.loadInstrument(def)  — builds synth voices for this instrument
  │   Sitar → PluckSynth × 8, attackNoise: 3, resonance: 0.99
  │
  ▼
StringPlayer: 8 pluckable strings (Sa Re Ga Ma Pa Dha Ni SA)
  → user taps → InstrumentEngine.hit(i) → PluckSynth.triggerAttack(note)
```

### InstrumentEngine synth selection

```typescript
family === 'strings'    → PluckSynth  (attackNoise/dampening tuned per instrument)
family === 'percussion' → MembraneSynth or MetalSynth (mbira, trumpet = metal)
family === 'wind'       → FMSynth     (sine oscillator, breathy envelope)
family === 'brass'      → FMSynth     (sawtooth, harmonicity 3)
family === 'keys'       → PolySynth   (triangle oscillator)
```

### Two parallel modes

| Mode | Entry | AI | Engine | UI |
|---|---|---|---|---|
| **Photo** | `/capture` | Claude Sonnet Vision | InstrumentEngine | StringPlayer / PercussionGrid |
| **Text** | `/play` | Claude Haiku text | AudioEngine | PadGrid (PAD/01) |

Both share: localStorage persistence, share URL, WAV export, MIDI export, OG meta tags, mobile guard.

### Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router | Server meta for OG tags; easy deploy |
| Audio | Tone.js 14.7.77 (pinned) | PluckSynth + 14.9 has broken ESM |
| Vision AI | Claude Sonnet (`claude-sonnet-4-6`) | Best vision accuracy in the model family |
| Text AI | Claude Haiku (`claude-haiku-4-5-20251001`) | Fast + cheap for tag extraction |
| Styling | Inline styles only | Brutalist aesthetic needs pixel control |
| Storage | localStorage + URL base64 | No backend needed for V1 |

---

## Instrument Library

15 instruments across 10 cultures. Each has a Tone.js synth config, cultural tuning, accent colour, and UI type.

| Instrument | Culture | UI | Synth | Accent |
|---|---|---|---|---|
| **Tabla** | Indian Classical | Pads (8 voices: NA, TIN, TA, DHA…) | MembraneSynth | `#C2703A` |
| **Sitar** | Indian Classical | Strings (Sa Re Ga Ma Pa Dha Ni SA) | PluckSynth | `#8B5E3C` |
| **Bansuri** | Indian Classical | Strings (7 holes) | FMSynth | `#4A7C59` |
| **Erhu** | Chinese Classical | Strings (8 notes) | PluckSynth | `#A0522D` |
| **Koto** | Japanese Classical | Strings (Yo scale, 8 strings) | PluckSynth | `#6B4C3B` |
| **Mbira** | Shona / Zimbabwe | Pads (8 tines) | MetalSynth | `#7B6B3D` |
| **Kora** | West African | Strings (pentatonic, 8 strings) | PluckSynth | `#8B7355` |
| **Djembe** | West African | Pads (Bass, Tone, Slap, 8 voices) | MembraneSynth | `#8B4513` |
| **Guitar** | Western | Strings (standard EADGBE) | PluckSynth | `#6B3A2A` |
| **Piano** | Western | Keys (C major, 8 notes) | PolySynth | `#1A1A2E` |
| **Violin** | Western | Strings (GDAE + positions) | PluckSynth | `#7B3F00` |
| **Harp** | Western / Ancient | Strings (C major, 8 strings) | PluckSynth | `#4A4A8A` |
| **Flute** | Western | Strings (C major, 7 notes) | FMSynth | `#2E6B4F` |
| **Trumpet** | Western | Pads (harmonic series, 8 notes) | FMSynth | `#B8860B` |
| **Unknown** | — | Pads (pentatonic fallback) | Synth | `#555555` |

### Adding a new instrument

1. Add an entry to `src/lib/instrumentLibrary.ts`
2. Define `id`, `name`, `aliases`, `family`, `uiType`, `accent`, `description`, `voices[]`
3. The `InstrumentEngine` picks the right synth automatically based on `family`
4. Claude's identify prompt includes the new ID — no other changes needed

---

## Design System

### Tokens

```typescript
// src/tokens/design.ts
export const T = {
  cream: '#efece4',   // warm off-white — surfaces, cards
  ink:   '#0a0a0a',   // near-black — text, borders
  red:   '#ff3b1f',   // global accent — CTAs, recording indicator
  font:  '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono:  'ui-monospace, "SF Mono", Menlo, monospace',
}
```

Instrument-specific accent colours come from `InstrumentDef.accent` — they override `T.red` in instrument UIs. The base cream/ink system stays constant across all screens.

### Two visual modes

| Mode | Background | Foreground | Accent |
|---|---|---|---|
| **Landing / capture flow** | `T.ink` (dark) | `T.cream` | `T.red` + per-instrument |
| **Play screens / library** | `T.cream` (light) | `T.ink` | per-instrument |

The dark landing differentiates from every other music app. The switch to light on playing screens mirrors the "lights on" feeling of actually performing.

### Brutalist aesthetic rules

- `border-radius: 0` — everywhere, no exceptions
- Borders: `2px solid ink` — heavy, present, printed
- Shadows: `4px 4px 0 0 ink` — offset only, never blur
- Active state: `translate(2px, 2px)` + shadow disappears → press-down feel
- Per-instrument accent overrides `T.red` only within that instrument's context
- Monospace for all metadata, labels, and technical readouts
- No utility CSS classes — inline styles throughout

### Shared components

| Component | File | Purpose |
|---|---|---|
| `PromptPill` | `shared/PromptPill.tsx` | Editable prompt input in PadGrid top bar |
| `Ticker` | `shared/Ticker.tsx` | Hit count display |
| `MobileGuard` | `components/MobileGuard.tsx` | < 768px → desktop-required screen with copy-link |

### Instrument UIs

| Component | File | Used for |
|---|---|---|
| `StringPlayer` | `instruments/StringPlayer.tsx` | strings + wind (sitar, guitar, koto, harp, bansuri, flute…) |
| `PercussionGrid` | `instruments/PercussionGrid.tsx` | percussion + brass pads (tabla, djembe, mbira, trumpet) |
| `PadGrid` | `instruments/PadGrid.tsx` | PAD/01 text-prompt mode only |

**StringPlayer** has two layouts:
- **Vertical** — sitar, guitar, violin, erhu (strings go top to bottom, like holding the instrument)
- **Horizontal** — koto, harp, bansuri, flute, kora (strings go left to right, like laying the instrument flat)

Layout is automatically selected by instrument ID.

---

## Design Directions

Five directions were prototyped in `additional_file/instruments/`. **Photo-to-instrument is the primary product** (shipped). PAD/01 text-prompt is the secondary mode (kept).

| # | Name | File | Mechanic | Status |
|---|---|---|---|---|
| — | **Photo → Instrument** | `capture/CaptureFlow.tsx` | Camera → Claude Vision → StringPlayer / PercussionGrid | **Built — Primary** |
| 1 | **PAD/01** | `pad-grid.jsx` | Text prompt → 4×4 synth grid | **Built — Secondary** |
| 2 | **HARP/02** | `radial-harp.jsx` | Radial SVG harp, 120 strings | Prototype only |
| 3 | **PULSE/03** | `sequencer.jsx` | 16-step × 8-track sequencer | Prototype only |
| 5 | **BLOOM/05** | `orbs.jsx` | Ambient orbs, chord on tap | Prototype only |

---

## Roadmap

### Shipped (V1)

**Photo-to-instrument flow**
- [x] Photo upload (file input + camera button)
- [x] Claude Sonnet Vision identification
- [x] Confirm / correct step with instrument search
- [x] 15 instruments across 10 cultures
- [x] StringPlayer — vertical + horizontal layouts
- [x] PercussionGrid — instrument-specific voice labels
- [x] Per-instrument accent colours + cultural context

**Text-prompt mode (PAD/01 — kept as secondary)**
- [x] 3-step onboarding (Prompt → Tune → Ready → Play)
- [x] Claude Haiku prompt → kit config pipeline
- [x] 16-voice Tone.js synth engine

**Shared infrastructure**
- [x] WAV/WebM recording via MediaRecorder
- [x] MIDI export (GM drums, channel 10, tempo meta event)
- [x] Save to localStorage (max 24)
- [x] Share URL — `/play?kit=` or `/capture?instrument=`
- [x] Dynamic OG meta tags on shared URLs
- [x] Page title updates per instrument / kit
- [x] Mobile guard (desktop-only notice + copy link)
- [x] AudioContext resume on tab visibility change
- [x] Kit library `/library` — mine + featured tabs

### Post-beta (Stage 2)

- [ ] **Real-time camera viewfinder** — live preview before capture (not just file upload)
- [ ] **More instruments** — Sarangi, Dizi, Taiko, Balalaika, Oud, Bouzouki, Marimba
- [ ] **Auth** — email magic-link for cross-device kit/instrument sync
- [ ] **Multiplayer** — two people photograph instruments, play together in shared session
- [ ] **OG image generation** — visual card showing the photo + instrument name for social
- [ ] **Analytics** — measure identification accuracy + share rate win conditions
- [ ] **The Met partnership** — deep link from museum exhibit QR codes to `/capture`
- [ ] **MIDI input** — play instrument UI from a physical MIDI controller

### Later

- [ ] HARP/02, BLOOM/05, PULSE/03 directions as alternate modes
- [ ] Wind instrument playable UI (breath-style interaction)
- [ ] Vercel / Cloudflare Pages production deploy
- [ ] PWA — installable, offline play of saved instruments
- [ ] Instrument recording extraction from paintings (CV pose estimation)

---

## File Structure

```
InstrumentPlayable/
├── additional_file/           # Design prototypes + research (not deployed)
│   ├── instruments/           # 5 direction prototypes (JSX, no build step)
│   ├── design-canvas.jsx      # Figma-like canvas wrapper
│   └── InstrumentPlayable.pdf # 55-platform competitive intelligence report
│
└── app/                       # Next.js application
    ├── .env.local.example     # → copy to .env.local, add ANTHROPIC_API_KEY
    ├── next.config.ts
    ├── package.json           # tone pinned to 14.7.77 (14.9 has broken ESM)
    └── src/
        ├── app/
        │   ├── page.tsx                          # Landing — dark, photo-first
        │   ├── layout.tsx
        │   ├── globals.css                       # Reset + keyframe animations
        │   ├── capture/page.tsx                  # /capture — primary flow
        │   ├── play/page.tsx                     # /play — text-prompt secondary
        │   ├── library/page.tsx                  # /library
        │   └── api/
        │       ├── identify-instrument/route.ts  # Claude Sonnet Vision → InstrumentDef
        │       └── parse-prompt/route.ts         # Claude Haiku → KitConfig
        │
        ├── audio/
        │   ├── InstrumentEngine.ts  # Tone.js for photo flow (PluckSynth, MembraneSynth…)
        │   ├── AudioEngine.ts       # Tone.js for PAD/01 text-prompt mode
        │   └── MidiExport.ts        # Hit log → MIDI file (GM drums, tempo meta event)
        │
        ├── components/
        │   ├── capture/
        │   │   ├── CaptureFlow.tsx    # State machine: photo→identify→confirm→play
        │   │   ├── PhotoStep.tsx      # Drag-drop + file upload + camera
        │   │   ├── IdentifyStep.tsx   # Scan animation while Claude Vision runs
        │   │   └── ConfirmStep.tsx    # Reveal moment + correction picker
        │   ├── instruments/
        │   │   ├── StringPlayer.tsx   # Pluckable strings (vertical + horizontal)
        │   │   ├── PercussionGrid.tsx # Drum pads with instrument voice labels
        │   │   └── PadGrid.tsx        # PAD/01 pad grid (text-prompt mode)
        │   ├── onboarding/            # PAD/01 onboarding steps
        │   ├── library/
        │   │   └── KitCard.tsx
        │   ├── shared/
        │   │   ├── PromptPill.tsx
        │   │   └── Ticker.tsx
        │   └── MobileGuard.tsx
        │
        ├── lib/
        │   ├── instrumentLibrary.ts  # 15 instruments: Tone.js configs + tunings + accents
        │   ├── kitStore.ts           # localStorage CRUD (max 24)
        │   └── shareUrl.ts           # KitConfig ↔ base64 URL
        │
        ├── tokens/
        │   └── design.ts             # cream / ink / red — one file, used everywhere
        │
        └── types/
            ├── instrument.ts         # InstrumentDef, IdentifiedInstrument, UIType
            └── kit.ts                # KitConfig, PadType, PAD_SEQUENCE
```

---

## Contributing

Three rules:

1. **No comments on what the code does** — identifiers already do that
2. **Inline styles only** — no utility classes, the aesthetic needs control
3. **No abstractions beyond what the task requires**

Token changes: edit `src/tokens/design.ts` — propagates everywhere.
New instrument: add one entry to `src/lib/instrumentLibrary.ts` — no other files change.

---

*Playable Instrument — Born at The Met. Built with Claude Code. 2026.*
