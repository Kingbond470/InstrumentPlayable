# PAD/01 — A Playable Instrument

> **Type a vibe. Hit a pad. That's it.**

PAD/01 turns a sentence into a 16-pad instrument — in the browser, in under 3 seconds, no account required.

```
"rainy detroit warehouse at 4am"  →  124 BPM · Am · dark·wet · 16 synth pads
```

Live at → `http://localhost:3000` (run locally, see [Getting Started](#getting-started))

---

## Table of Contents

1. [Product](#product)
2. [Getting Started](#getting-started) ← TL
3. [Architecture](#architecture) ← TL
4. [Design System](#design-system) ← Designer
5. [Design Directions](#design-directions) ← Designer
6. [Roadmap](#roadmap)
7. [File Structure](#file-structure)

---

## Product

### The problem

Every creative music tool gatekeeps behind vocabulary people don't have. "Pick a synth." "Choose a key." "Set BPM." These are wrong first questions for the 95% who have never made music — but *have* a feeling in their head that sounds like something.

### The bet

People can describe a feeling long before they can name a sound. **The prompt is the instrument.**

### Who it's for

Non-musicians, 18–35, who feel music but can't make it. They hum in the shower. They have very specific vibes. They've never opened a DAW and never will. The moment they want: type something → hear it → feel like *they* made it → send it to someone.

### Core flow

```
/ (landing)
  → /play  → Prompt → Tune (AI) → Ready → Play pads
                                              ↓
                                       + SAVE KIT   ⎋ SHARE
                                              ↓           ↓
                                         /library    /play?kit={encoded}
                                                      (friend opens, straight to pads)
```

### Win conditions (W7 beta target)

| Metric | Target |
|---|---|
| Session → saved kit | ≥ 30% |
| D7 retention | ≥ 10% |
| Share K-factor | > 0.5 from shared links |

### What's deliberately out of scope for V1

- Multi-track sequencer (Pulse/03 direction — designed, not built)
- Collab / multiplayer
- Effects rack / DAW-level controls
- Auth / cross-device sync (magic-link — post-beta)
- Native mobile app

### Key product decisions made

| Decision | Rationale |
|---|---|
| PAD/01 direction over 4 others | Most accessible, Incredibox-proven pattern |
| Tone.js synths over sample files | Zero licensing risk; instant load |
| `?kit=` share URL | Recipient goes straight to playing — no friction |
| Fallback mode when no API key | App still works; ships sooner |
| Mobile guard (desktop-only for audio) | iOS AudioContext restrictions; avoid broken first impression |

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

Get a key at **console.anthropic.com → API Keys**. This is separate from the claude.ai subscription — it's pay-as-you-go. Claude Haiku costs ~$0.001 per kit generation.

**No key?** The app runs in fallback mode — kits are generated from a deterministic hash of the prompt. All 16 synths, save/share/library, WAV/MIDI export still work. Only AI-tuning is absent.

### Run

```bash
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve production build
```

### Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/play` | Main instrument — onboarding + pad grid |
| `/play?kit={base64}` | Opens a shared kit directly to playing |
| `/library` | Saved kits + featured examples |
| `/api/parse-prompt` | POST `{ text: string }` → `{ kit: KitConfig, fallback: boolean }` |

---

## Architecture

### System overview

```
Browser
├── React UI (Next.js 15, App Router)
│   ├── /          — Landing (server component)
│   ├── /play      — OnboardingFlow → PadGrid (client)
│   └── /library   — Kit library (client)
│
├── AudioEngine (Tone.js 14, singleton)
│   ├── 16 synths  — MembraneSynth, MetalSynth, NoiseSynth,
│   │                Synth, FMSynth, AMSynth, PolySynth
│   ├── Effects    — Reverb + FeedbackDelay + Distortion
│   └── Recording  — MediaRecorder → .webm/.ogg download
│
└── Persistence
    ├── localStorage  — anonymous kits (up to 24)
    └── URL encoding  — base64 kit config in ?kit= param

API (Next.js Route Handler — /api/parse-prompt)
├── Claude Haiku  — prompt → structured kit config JSON (≤200 tokens)
└── Fallback      — deterministic hash-based kit when no API key
```

### Prompt → kit data flow

```
User types "rainy detroit warehouse at 4am"
  │
  ├─ debounce 500ms
  │
  ▼
POST /api/parse-prompt { text: "..." }
  │
  ├─ No ANTHROPIC_API_KEY? → fallbackKit(text)   returns fallback: true
  │
  ├─ Claude Haiku (claude-haiku-4-5-20251001)
  │   system: extract music tags, return JSON
  │   max_tokens: 512
  │
  ▼
{ bpm, key, mood, character, tags[], padNotes{}, effects{} }
  │
  ├─ Client animates tag-discovery (TuneStep)
  ├─ AudioEngine.loadKit(kit)  — sets BPM, effect wet values
  └─ User hits pads → AudioEngine.hit(padType)
```

### AudioContext lifecycle

```
Page loads           → AudioContext NOT created (browser policy)
User: onPointerDown  → hit() → engine.init() → Tone.start()
                       AudioContext created + resumed here (user gesture)
User: tabs away      → visibilitychange listener → context.resume()
engine.dispose()     → listener removed, synths disposed
```

### Kit persistence & sharing

```typescript
// Save
saveKit(kit)             // → localStorage["pad01:kits"]

// Share
kitShareUrl(kit)         // → origin/play?kit={base64(JSON)}
decodeKit(encoded)       // → KitConfig | null

// OG meta (server-side, generateMetadata in play/page.tsx)
title:       "Rainy Detroit Warehouse — PAD/01"
description: '"rainy detroit warehouse at 4am" — 124 BPM · Am · dark·wet'
```

### MIDI export

Each pad maps to a General MIDI drum note (channel 10). Hit log accumulates from kit load; exported on demand. Includes tempo meta event so DAWs import at the correct BPM.

```
KIK → 36  SNR → 38  HAT → 42  OPN → 46
CLP → 39  TOM → 45  RIM → 37  CYM → 49
SUB → 35  BUZ → 41  VOX → 52  FX1 → 55
ARP → 80  STB → 50  CHD → 48  END → 56
```

### Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components for OG meta; easy CF Pages deploy |
| Audio | Tone.js 14.7.77 | Proven browser audio; 16-voice polyphony; no sample files |
| AI | Claude Haiku (`claude-haiku-4-5-20251001`) | ≤200 tokens, ~$0.001/kit, fast |
| Styling | Inline styles, no CSS framework | Brutalist aesthetic requires total pixel control |
| Persistence | localStorage + URL encoding | No backend needed for V1 |

---

## Design System

### Tokens

Three colours. One font. Everything derived from these.

```typescript
// src/tokens/design.ts
export const T = {
  cream: '#efece4',   // background, card surfaces
  ink:   '#0a0a0a',   // text, borders, active pads
  red:   '#ff3b1f',   // accent — recording, CTAs, active states
  font:  '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono:  'ui-monospace, "SF Mono", Menlo, monospace',
}
```

### Aesthetic: PAD/01 (Brutalist)

The design language is **brutalism applied to audio tools** — not dark-mode producer software, not toy-bright music apps. Think a screenprinted gig poster that also plays music.

Rules:
- `border-radius: 0` everywhere. No rounded corners.
- Borders are `2px solid ink`. Heavy. Present.
- Shadows are `4px 4px 0 0 ink` — offset, not blur. Printed.
- Active state: element shifts `translate(2px, 2px)` and shadow disappears. Press-down feel.
- Red is used sparingly: one CTA per screen, recording indicator, hover accents. Never decorative.
- Monospace for all metadata/labels. Proportional serif for display headings.

### Shared components

| Component | Location | Purpose |
|---|---|---|
| `PromptPill` | `shared/PromptPill.tsx` | Editable prompt input in top bar. Enter key = retune. |
| `Ticker` | `shared/Ticker.tsx` | Hit count / BPM numeric display |
| `StudioChrome` | `onboarding/StudioChrome.tsx` | 3-step progress bar + status footer wrapper |
| `MobileGuard` | `components/MobileGuard.tsx` | Detects < 768px, shows desktop-required screen |

---

## Design Directions

Five directions were explored and prototyped (see `additional_file/instruments/`). **PAD/01 was chosen for V1** — all others are valid future directions.

| # | Name | File | Mechanic | Status |
|---|---|---|---|---|
| 1 | **PAD/01** | `pad-grid.jsx` | 4×4 drum pad grid, prompt-tuned | **Built — V1** |
| 2 | **HARP/02** | `radial-harp.jsx` | Radial SVG harp, 120 strings, 5 rings × 24 segments, pentatonic | Prototype only |
| 3 | **PULSE/03** | `sequencer.jsx` | 16-step × 8-track step sequencer, playhead-driven | Prototype only |
| 4 | — | `hardware.jsx` | Hardware concept exploration | Prototype only |
| 5 | **BLOOM/05** | `orbs.jsx` | Ambient orbs, floating, chord on tap | Prototype only |

### Why PAD/01 over the others

- Lowest barrier: tap a square, it sounds good. No learning curve.
- Closest to Incredibox's "impossible to fail" design pattern — the benchmark at 106M players.
- Grid format is universally understood (MPC, phone keyboard, drum machines).
- HARP/02 and BLOOM/05 are beautiful but the interaction is novel enough to need onboarding. PAD/01 needs none.
- PULSE/03 (sequencer) is post-beta — it implies the user wants to compose, not just play.

### Design files

| File | Contents |
|---|---|
| `additional_file/design-canvas.jsx` | Figma-like canvas wrapper (pan/zoom, artboards, reorder, export PNG/HTML) |
| `additional_file/instruments/` | All 5 direction prototypes — self-contained JSX, no build step |
| `additional_file/InstrumentPlayable.pdf` | Competitive intel: 55+ platforms surveyed (2000–2026) |
| `additional_file/uploads/playableinstrument.pdf` | Original brief |
| `additional_file/Playable Instrument.html` | Prototype HTML shell |

To preview any direction prototype, open `Playable Instrument.html` in a browser.

---

## Roadmap

### Done (V1 / W1–W8)

- [x] Landing page (`/`)
- [x] 3-step onboarding (Prompt → Tune → Ready)
- [x] 16-voice Tone.js synth engine
- [x] Claude Haiku prompt → kit config pipeline
- [x] Fallback mode (no API key required)
- [x] Save kit to localStorage
- [x] Share URL (`/play?kit=...`) — base64 encoded, no backend
- [x] Kit library (`/library`) — mine + featured tabs, search, delete
- [x] WAV/WebM export via MediaRecorder
- [x] MIDI export (GM drums, channel 10, tempo meta event)
- [x] Dynamic OG meta tags on shared URLs
- [x] Page title updates to kit name
- [x] Mobile guard (desktop-only notice + copy link)
- [x] AudioContext resume on tab visibility change

### Post-beta (Stage 2)

- [ ] Auth — email magic-link for cross-device kit sync
- [ ] Analytics — measure 30% save-rate win condition
- [ ] Cultural instrument library — tabla, sitar, veena, dizi, mbira
- [ ] PULSE/03 — step sequencer (for users who want to compose)
- [ ] Instrument combining — layer two photographed instruments into one shareable jam
- [ ] OG image generation — visual kit card for social previews
- [ ] MIDI input — play pads from a physical MIDI controller

### Later

- [ ] HARP/02, BLOOM/05 directions as alternate instrument modes
- [ ] Vercel deployment + CF Pages setup
- [ ] PWA (installable, offline play of saved kits)

---

## File Structure

```
InstrumentPlayable/
├── additional_file/           # Design prototypes + research (not deployed)
│   ├── instruments/           # 5 direction prototypes (JSX, no build step)
│   ├── design-canvas.jsx      # Canvas wrapper for prototypes
│   └── InstrumentPlayable.pdf # 55-platform competitive intelligence report
│
└── app/                       # Next.js application (ships to production)
    ├── .env.local.example     # Copy to .env.local, add ANTHROPIC_API_KEY
    ├── next.config.ts
    ├── package.json
    └── src/
        ├── app/
        │   ├── page.tsx                     # Landing (server component)
        │   ├── layout.tsx
        │   ├── globals.css                  # Reset + keyframe animations
        │   ├── play/page.tsx                # /play — OG meta + client boundary
        │   ├── library/page.tsx             # /library
        │   └── api/parse-prompt/route.ts    # Claude Haiku → KitConfig
        │
        ├── audio/
        │   ├── AudioEngine.ts              # Tone.js singleton: 16 synths + effects + recording
        │   └── MidiExport.ts               # Hit log → MIDI file bytes
        │
        ├── components/
        │   ├── instruments/
        │   │   └── PadGrid.tsx             # 4×4 grid, audio, save/share/rec/MIDI
        │   ├── onboarding/
        │   │   ├── OnboardingFlow.tsx       # State machine: prompt→tuning→ready→playing
        │   │   ├── PromptStep.tsx
        │   │   ├── TuneStep.tsx
        │   │   ├── ReadyStep.tsx
        │   │   └── StudioChrome.tsx         # 3-step progress wrapper
        │   ├── library/
        │   │   └── KitCard.tsx
        │   ├── shared/
        │   │   ├── PromptPill.tsx
        │   │   └── Ticker.tsx
        │   └── MobileGuard.tsx
        │
        ├── lib/
        │   ├── kitStore.ts                 # localStorage CRUD (max 24 kits)
        │   └── shareUrl.ts                 # KitConfig ↔ base64 URL encoding
        │
        ├── tokens/
        │   └── design.ts                   # cream / ink / red — single source of truth
        │
        └── types/
            └── kit.ts                      # KitConfig, PadType, PAD_SEQUENCE
```

---

## Contributing

The codebase follows three principles:

1. **No comments on what the code does** — well-named identifiers do that
2. **Inline styles only** — the brutalist aesthetic requires total control; no utility classes
3. **No abstractions beyond what the task requires** — three similar lines is better than a premature helper

Design token changes: edit `src/tokens/design.ts` — one file, propagates everywhere.

---

*PAD/01 — Made in 2026*
