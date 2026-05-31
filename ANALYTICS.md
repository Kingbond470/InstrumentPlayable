# Analytics Setup

Track user behavior: instruments identified, kits saved/shared, recordings made.

## Enable Vercel Web Analytics

1. Log in to **Vercel Dashboard** → Select project
2. Go to **Analytics** (left sidebar)
3. Toggle **Web Analytics** ON
4. Deploy (if not already deployed)

Vercel automatically injects tracking script. No config needed.

---

## Custom Events

Track in code via `trackEvent()`:

```typescript
import { trackEvent, Events } from '@/lib/analytics';

// Instrument identified
trackEvent(Events.INSTRUMENT_IDENTIFIED, {
  instrument: 'sitar',
  confidence: 0.94,
});

// Kit saved
trackEvent(Events.KIT_SAVED, {
  kitName: 'Rainy Detroit',
  via: 'localStorage', // or 'backend' after auth
});

// Recording exported
trackEvent(Events.WAV_EXPORTED, {
  duration: 42, // seconds
  instruments: 'tabla,sitar',
});
```

## Metrics to Monitor

| Event | Why | Target |
|-------|-----|--------|
| `instrument_identified` | Accuracy of Claude Vision | ≥85% identified correctly |
| `kit_saved` | Engagement / "aha moment" | ≥30% of sessions |
| `kit_shared` | Virality — share K-factor | K > 0.5 |
| `instrument_played` | Time-to-value | <10s from upload |
| `recording_stopped` | Commit — they finished | ≥15% of sessions |

## Dashboard

In Vercel **Analytics** tab:

- **Core Web Vitals** — FCP, LCP, CLS (Lighthouse-style)
- **Edge Functions** — `/api/*` route latency + invocations
- **Traffic** — requests/day, unique visitors, top pages
- **Custom Events** — your `trackEvent()` calls (requires instrumentation)

---

## Development

In dev, events log to console (removes in production).

```bash
npm run dev
# In browser console:
# [analytics] instrument_identified {instrument: 'tabla', confidence: 0.94}
```

To test custom events:

```typescript
// In any component
import { trackEvent } from '@/lib/analytics';

useEffect(() => {
  trackEvent('test_event', { test: true });
}, []);
```

View in Vercel dashboard **Analytics** → **Events** tab (may take 5-10 min to appear).

---

## Win Conditions

Track these for Q3 (post-V1 beta):

1. **Identification Accuracy** — % of photos correctly identified
   - Baseline: set after first 1k photos
   - Target: ≥85% on first-guess

2. **Engagement Funnel**
   - Photo upload → Instrument identified → Kit played → Kit saved
   - Target: 60% → 90% → 70% → 30%

3. **Share K-factor**
   - Users who share → friends who play (from shared link) → friends who save
   - Target: K > 0.5 (1 user brings >0.5 new users)

4. **Time-to-Value**
   - Upload → Play ≤ 10 seconds
   - Target: p95 ≤ 8s

---

## Opt-Out

Users can disable analytics in browser:

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'gtm.blacklist': ['v', 'cl'],
});
```

(Vercel respects Do-Not-Track headers)

---

## Export Data

In Vercel dashboard **Analytics**:
- Click **Export** (CSV, JSON)
- Last 30 days of raw events
- Useful for custom BI tooling (Google Sheets, Tableau)
