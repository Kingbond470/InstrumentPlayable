---
title: Analytics Tracking (Vercel Web Analytics)
status: shipped
effort: M (3h)
shipped: 2026-05-31
---

## Summary

Track user behavior: instrument identification, kit saves, shares, recordings. Vercel Web Analytics + custom events. Measure engagement funnel, share K-factor, identification accuracy.

---

## Problem

No visibility into how users interact with app. What's working? What's not? Can't improve without data.

---

## Goals

- ✅ Track core events (identify, save, share, record, export)
- ✅ Measure engagement funnel (upload → identify → play → save)
- ✅ Calculate share K-factor (virality metric)
- ✅ Monitor identification accuracy (% correct first-guess)
- ✅ Zero PII (anonymous by default)
- ✅ Vercel Web Analytics integration (built-in, no external service)

---

## Success Criteria

- [x] trackEvent() function works
- [x] Events object defines 18+ event names
- [x] Window.va integration for Vercel Web Analytics
- [x] Fallback console.log in dev mode
- [x] usePageView hook for page tracking
- [x] No PII in events (no email, no user IDs)
- [x] Custom properties tracked (instrument, kit name, duration, etc.)
- [x] Dashboard shows events in Vercel (5-10min delay)
- [x] Export to CSV/JSON for analysis

---

## Design

### Core Events

| Event | When | Properties |
|-------|------|-----------|
| `photo_uploaded` | User picks image | format (jpeg/png) |
| `instrument_identified` | Claude Vision responds | instrument, confidence |
| `instrument_confirmed` | User confirms identification | instrument, via (photo/text) |
| `instrument_played` | User hits pad/voice | voice_index, intensity |
| `prompt_entered` | Text prompt flow | prompt_length |
| `kit_generated` | LLM generates kit | instruments, bpm, key |
| `pad_hit` | Drum pad struck | pad_index, velocity |
| `kit_saved` | User saves kit | kit_name, via (localStorage/backend) |
| `kit_shared` | User generates share link | kit_id, platform (inferred from UA) |
| `recording_started` | MediaRecorder starts | instrument |
| `recording_stopped` | MediaRecorder stops | duration (seconds) |
| `midi_exported` | MIDI file downloaded | instrument_count, duration |
| `wav_exported` | WAV file downloaded | duration, format |
| `login_attempted` | Email submitted | provider (magic-link) |
| `login_succeeded` | Session created | email_domain |
| `logout` | User logs out | session_duration_seconds |
| `library_opened` | User clicks library | via_page (play/capture) |
| `kit_loaded_from_library` | User loads saved kit | kit_name, age_days |

### Implementation

```typescript
// lib/analytics.ts
trackEvent(name, properties?)
  ↓
  if (window.va) window.va.track(name, properties)
  else console.log('[analytics]', name, properties) // dev fallback
```

### Vercel Integration

1. Enable in Vercel dashboard (one toggle)
2. Deploy code
3. Events appear in Vercel Analytics tab (5-10min)
4. Export to CSV: Vercel dashboard → Analytics → Export

---

## Acceptance Tests

| Scenario | Expected |
|----------|----------|
| Upload photo | trackEvent('photo_uploaded', {format: 'jpeg'}) called |
| Identify instrument | trackEvent('instrument_identified', {instrument: 'sitar', confidence: 0.94}) |
| Save kit to localStorage | trackEvent('kit_saved', {via: 'localStorage'}) |
| Share kit | trackEvent('kit_shared', {kit_id: '...'}) |
| Export WAV | trackEvent('wav_exported', {duration: 42}) |
| Page load | trackEvent('page_view', {page: '/play'}) |
| Dev console | Events log to console (remove in prod) |
| Vercel dashboard | Events appear after 5-10min |
| Export CSV | Includes all events for last 30 days |

---

## References

- [analytics.ts](app/src/lib/analytics.ts)
- [ANALYTICS.md](ANALYTICS.md) — setup guide
- Vercel Web Analytics docs: https://vercel.com/docs/analytics

---

## Metrics to Monitor

| Metric | Baseline | Target | Why |
|--------|----------|--------|-----|
| Identification accuracy | TBD after 1k samples | ≥85% | Quality of Claude Vision |
| Engagement funnel | TBD | Upload→Identify: 90%, Identify→Play: 70%, Play→Save: 30% | Conversion rates |
| Share K-factor | TBD | >0.5 | Virality (1 user brings 0.5 new users) |
| Time-to-value | TBD | <10s upload→play | Product delight |
| Session length | TBD | >2min median | Time-on-site |
| Bounce rate | TBD | <40% | Engagement |

---

## Future

- [ ] Cohort analysis (compare users who share vs. don't)
- [ ] Retention curves (day 1, 7, 30 return rates)
- [ ] A/B testing (UI variants)
- [ ] Funnels (multi-step flows)
- [ ] Heatmaps (on-screen interaction)
- [ ] Custom dashboard (Datadog, Mixpanel)
