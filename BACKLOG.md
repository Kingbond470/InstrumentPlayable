# Playable Instrument — Development Backlog

Post-V1 features. Tracked by priority + effort. Check off as shipped.

See [SPEC_KIT_GUIDE.md](SPEC_KIT_GUIDE.md) for how specs work.

Each feature has:
- Backlog item (here)
- Detailed spec (SPEC_<feature>.md)
- Acceptance tests
- Performance targets

## Backlog

- [x] **0. Responsive Design** — [SPEC_RESPONSIVE_DESIGN.md](SPEC_RESPONSIVE_DESIGN.md) Mobile-first. Phase 1-4 complete (100% ✅ — StringPlayer, PercussionGrid, PhotoStep, Modals, PadGrid, landing page, library grid). Lighthouse audit next.
- [~] **0.5. SEO Optimization** — [SPEC_SEO.md](SPEC_SEO.md) On-page + structured data + technical SEO ✅. Meta tags, JSON-LD, Open Graph, sitemap, robots.txt. Keyword targeting 10+ terms. Post-launch: Google Search Console, backlink outreach.
- [x] **1. Test multi-provider router** — ✅ Verify fallthrough on rate limit. Add mock keys. Test all 5 providers.
- [x] **2. Deploy to Vercel/CF Pages** — ✅ Deployed to Vercel. Production URL live.
- [ ] **3. Add 10+ cultural instruments** — Balalaika, Oud, Taiko, Shamisen, Marimba, Bouzouki, Sarangi, Dizi, Pipa, Hurdy-Gurdy.
- [ ] **4. Email magic-link auth** — Cross-device kit/instrument sync. User library persisted to backend.
- [ ] **5. Analytics dashboard** — Identification accuracy %, share K-factor, session funnel. Vercel Analytics or Posthog.
- [ ] **6. OG image generation** — Photo + instrument name card for Discord/Twitter/iMessage social preview.
- [ ] **7. MIDI input support** — Play from physical MIDI controller. Note on → InstrumentEngine.hit().
- [ ] **8. Wind instrument UI** — Breath-style interaction for flute/bansuri/trumpet. Separate from StringPlayer/PercussionGrid.

---

---

## Shipped (V2 — Post-V1 Backlog)

| # | Feature | Spec | Status |
|---|---------|------|--------|
| 1 | Test multi-provider router | [SPEC_ROUTER_TESTING.md](SPEC_ROUTER_TESTING.md) | ✅ Shipped 2026-05-31 |
| 2 | Deploy to Vercel/CF Pages | [SPEC_DEPLOY.md](SPEC_DEPLOY.md) | ✅ Shipped 2026-05-31 |
| 3 | Add 10+ cultural instruments | [SPEC_INSTRUMENTS.md](SPEC_INSTRUMENTS.md) | ✅ Shipped 2026-05-31 |
| 4 | Email magic-link auth | [SPEC_AUTH.md](SPEC_AUTH.md) | ✅ Shipped 2026-05-31 |
| 5 | Analytics tracking | [SPEC_ANALYTICS.md](SPEC_ANALYTICS.md) | ✅ Shipped 2026-05-31 |
| 6 | OG image generation | [SPEC_OG_IMAGES.md](SPEC_OG_IMAGES.md) | ✅ Shipped 2026-05-31 |
| 7 | MIDI input support | [SPEC_MIDI.md](SPEC_MIDI.md) | ✅ Shipped 2026-05-31 |
| 8 | Wind instrument UI | [SPEC_WIND_UI.md](SPEC_WIND_UI.md) | ✅ Shipped 2026-05-31 |

---

---

## Shipped (V3 — Option A: Quick Win)

Target ship date: 2026-05-31 ✅ DONE (ahead of schedule!)

| # | Feature | Spec | Status | Effort | Shipped |
|---|---------|------|--------|--------|---------|
| 1 | Multi-language support | [SPEC_MULTI_LANGUAGE.md](SPEC_MULTI_LANGUAGE.md) | ✅ shipped | M (3h) | 2026-05-31 |
| 2 | Instrument history & favorites | [SPEC_HISTORY.md](SPEC_HISTORY.md) | ✅ shipped | M (3h) | 2026-05-31 |
| 3 | Collection sharing | [SPEC_COLLECTIONS.md](SPEC_COLLECTIONS.md) | ✅ shipped | M (3h) | 2026-05-31 |

**Completed: 3/3 (11h total, 100%)**

**Actual timeline: 1 day (instead of 2 weeks)**

---

## Future Candidates (V3.1+)

If V3 ships early, or for future planning:

- [ ] **Breath modulation** — wind instruments: envelope affected by intensity (M, 3h) [SPEC_WIND_MODULATION.md]
- [ ] **Vibrato/tremolo** — wind UI micro-movements → pitch/amplitude wobble (L, 5h) [SPEC_WIND_EFFECTS.md]
- [ ] **MIDI file playback** — drag SMF → playback over instrument (L, 6h) [SPEC_MIDI_PLAYBACK.md]
- [ ] **Keyboard visualization** — piano roll / note names overlay (M, 4h) [SPEC_KEYBOARD_VIZ.md]
- [ ] **User library sync** — authenticated kits persist across devices (XL, 10h) [SPEC_LIBRARY_SYNC.md]

---

## Shipped (V1)

- [x] Photo-to-instrument flow (CaptureFlow 4-state machine)
- [x] 15 instruments across 10 cultures
- [x] StringPlayer + PercussionGrid UIs
- [x] 16-voice audio engine (InstrumentEngine + AudioEngine)
- [x] WAV/WebM recording + MIDI export
- [x] Save/library/share (localStorage + URL encoding)
- [x] Multi-provider AI router (fallthrough on rate limit)
- [x] Mobile guard + responsive design
- [x] Dynamic OG meta tags + page title
- [x] Text-prompt mode (PAD/01) as secondary

---

## Effort Guide

- **S** — <2h, trivial
- **M** — 2–4h, straightforward
- **L** — 4–8h, requires design+testing
- **XL** — 8h+, complex, multi-file

| # | Task | Effort | Blocker |
|---|---|---|---|
| 1 | Test router | S | None |
| 2 | Deploy | M | None |
| 3 | Add instruments | S | None (library + frontend) |
| 4 | Auth | L | Backend (auth service or Firebase) |
| 5 | Analytics | M | Third-party service (Vercel/Posthog) |
| 6 | OG images | L | Image generation service (Sharp? Vercel OG?) |
| 7 | MIDI input | M | Web MIDI API (browser support varies) |
| 8 | Wind UI | L | New component type, breath model training |
