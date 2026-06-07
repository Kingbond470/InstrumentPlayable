---
title: Analytics Tracking & Measurement
status: in-progress
effort: M (3h)
shipped: null
---

## Summary

Instrument Playable has no observability. Can't measure identification accuracy, share rate, session funnel, or user retention. Add event tracking to answer: *what's working?*

---

## Goals

- Track user journey (session start → instrument played → recording → share)
- Measure identification accuracy (AI confidence, user confirm/correct rate)
- Measure engagement (share rate, save rate, time-on-instrument)
- Measure retention (D1, D7 return rate via localStorage)
- Instrument popularity (which instruments most played)
- Device breakdown (mobile vs desktop performance)

---

## Success Criteria

| Metric | Target | Why |
|--------|--------|-----|
| Session → instrument played | ≥60% | Core funnel |
| Session → recording shared | ≥30% | Viral coefficient |
| Identification accuracy | ≥85% first-guess | Claude Sonnet quality |
| D1 retention | ≥10% | Casual engagement |
| D7 retention | ≥5% | Habit formation |
| Avg session duration | ≥2 min | Engagement depth |
| Instruments per session | ≥1.5 | Exploration |

---

## Implementation (3.5h)

**Phase 1: Vercel Analytics (0.5h)**
- Enable in Vercel dashboard (free, included)
- Automatic Core Web Vitals + page views

**Phase 2: Custom Event Tracking (1.5h)**
- Create src/lib/analytics.ts with trackEvent()
- Place tracking in 8 components (photo, identify, play, export, save, share, create, session)

**Phase 3: Backend Endpoint (1h)**
- Create src/app/api/analytics/route.ts
- Collect events via sendBeacon()

**Phase 4: Test (0.5h)**
- End-to-end test on staging
- Verify events flow to /api/analytics

---

## Events to Track

| Event | When | Data |
|-------|------|------|
| session_start | Page load | device, source |
| photo_captured | File selected | timestamp |
| instrument_identified | AI response | instrumentId, confidence, time_ms |
| user_confirmed | User confirms | instrumentId |
| user_corrected | User corrects | original, corrected |
| instrument_played | Component unmount | instrumentId, duration_sec |
| recording_exported | Download | format (wav/webm/midi) |
| kit_saved | Save button | kitName |
| kit_shared | Share button | via (copy/twitter/discord) |
| collection_created | Modal submit | instrumentCount |
| session_end | Page unload | duration_sec, eventCount |

---

## Component Placement

- layout.tsx: session_start, session_end
- PhotoStep.tsx: photo_captured
- identify-instrument API: instrument_identified
- ConfirmStep.tsx: user_confirmed, user_corrected
- StringPlayer.tsx: instrument_played
- InstrumentEngine.ts: recording_exported
- KitCard.tsx: kit_saved, kit_shared
- CreateCollectionModal.tsx: collection_created

---

## MVP Success = Week 1 Data

Can answer:
- What % of sessions play an instrument? (target: 60%)
- What % of players share? (target: 30%)
- Top 3 instruments by plays?
- Avg time per instrument? (target: >30s)
- Mobile vs desktop engagement?
