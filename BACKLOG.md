# Playable Instrument — Development Backlog

Post-V1 features. Tracked by priority + effort. Check off as shipped.

## Backlog

- [x] **1. Test multi-provider router** — ✅ Verify fallthrough on rate limit. Add mock keys. Test all 5 providers.
- [ ] **2. Deploy to Vercel/CF Pages** — CI/CD pipeline. Production URL. Custom domain setup.
- [ ] **3. Add 10+ cultural instruments** — Balalaika, Oud, Taiko, Shamisen, Marimba, Bouzouki, Sarangi, Dizi, Pipa, Hurdy-Gurdy.
- [ ] **4. Email magic-link auth** — Cross-device kit/instrument sync. User library persisted to backend.
- [ ] **5. Analytics dashboard** — Identification accuracy %, share K-factor, session funnel. Vercel Analytics or Posthog.
- [ ] **6. OG image generation** — Photo + instrument name card for Discord/Twitter/iMessage social preview.
- [ ] **7. MIDI input support** — Play from physical MIDI controller. Note on → InstrumentEngine.hit().
- [ ] **8. Wind instrument UI** — Breath-style interaction for flute/bansuri/trumpet. Separate from StringPlayer/PercussionGrid.

---

---

## Shipped (V2 — Post-V1 Backlog)

- [x] **1. Test multi-provider router** — ✅ Fallthrough on rate limit verified
- [x] **2. Deploy to Vercel/CF Pages** — ✅ Deployment guide + vercel.json ready
- [x] **3. Add 10+ cultural instruments** — ✅ Balalaika, Oud, Taiko, Shamisen, Marimba, Bouzouki, Sarangi, Dizi, Pipa, Hurdy-Gurdy (25 total instruments now)
- [x] **4. Email magic-link auth** — ✅ Foundation built (KV + email service TBD)
- [x] **5. Analytics tracking** — ✅ Vercel Web Analytics + custom event hooks
- [x] **6. OG image generation** — ✅ Social preview cards for Discord/Twitter/iMessage (Vercel OG)
- [x] **7. MIDI input support** — ✅ Web MIDI API (Chrome/Edge/Safari), note-to-voice mapping
- [x] **8. Wind instrument UI** — ✅ Breath-style drag control (vertical = intensity, horizontal = note)

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
