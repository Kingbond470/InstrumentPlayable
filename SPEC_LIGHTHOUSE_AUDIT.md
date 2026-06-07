---
title: Lighthouse Audit & Core Web Vitals (Phase 5)
status: in-progress
effort: M (4h)
shipped: null
---

## Summary

Audit production app (Vercel deployment) for Core Web Vitals compliance. Target: 85-95 Lighthouse score across mobile, tablet, and desktop. Measure LCP (<2.5s), FID (<100ms), CLS (<0.1). Identify bottlenecks and implement quick wins.

---

## Goals

- ✅ Measure current Lighthouse scores (mobile, tablet, desktop)
- ✅ Identify Core Web Vitals violations (if any)
- ✅ Implement quick wins (lazy loading, image optimization, deferral)
- ✅ Re-audit and validate improvements
- ✅ Document baseline and improvements

---

## Current State (from build analysis)

### Bundle Breakdown

**Shared baseline: 102 kB**
- Tone.js + audio engine: 46.2 kB (loaded on all routes)
- Claude API + routing: 54.2 kB (loaded on all routes)

**Per-route overhead:**
- Landing (/): 0 kB additional (static prerendered)
- Capture (/capture): 9.88 kB route code
- Play (/play): 11 kB route code
- Library (/library): 3.59 kB route code

### Performance Concerns (High Risk)

| Concern | Impact | Severity |
|---------|--------|----------|
| Tone.js (46 kB) loaded on landing | Delays FCP on mobile | 🔴 High |
| Anthropic SDK (54 kB) for all routes | Network delay on slow 3G | 🔴 High |
| No image optimization (if hero images > 100KB) | Slows LCP | 🔴 High |
| Responsive clamp() may cause CLS | Layout shifts during hydration | 🟡 Medium |
| No lazy loading for modals/routes | Increases initial bundle | 🟡 Medium |

---

## Acceptance Criteria

| Metric | Mobile | Tablet | Desktop | Target |
|--------|--------|--------|---------|--------|
| **Performance** | ≥85 | ≥90 | ≥95 | Core Web Vitals |
| **LCP** (Largest Contentful Paint) | <2.5s | <2.0s | <1.5s | Tier 1 |
| **FID** (First Input Delay) | <100ms | <100ms | <100ms | Tier 1 |
| **CLS** (Cumulative Layout Shift) | <0.1 | <0.1 | <0.1 | Tier 1 |
| **Accessibility** | ≥90 | ≥95 | ≥95 | Baseline |
| **Best Practices** | ≥85 | ≥90 | ≥95 | Baseline |
| **SEO** | ≥90 | ≥95 | ≥95 | Already done |

---

## Implementation Plan

### Phase 1: Measure (0.5h)

**Run Lighthouse via PageSpeed Insights API:**
```bash
# Mobile
curl https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://instrument-playable...&strategy=mobile

# Desktop
curl https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://instrument-playable...&strategy=desktop
```

**Capture:**
- Performance, Accessibility, Best Practices, SEO scores
- LCP, FID, CLS timings
- Opportunity list (what to optimize)

### Phase 2: Quick Wins (1.5h)

**Win 1: Lazy-load Tone.js (30-50ms LCP gain)**
```typescript
// Before: import { Tone } from 'tone' in InstrumentEngine.ts
// After: dynamic import only in /play and /capture routes
const Tone = await import('tone');
```
- File: `src/audio/InstrumentEngine.ts`
- Impact: Landing page no longer waits for 46 kB audio lib

**Win 2: Image optimization (if applicable)**
- Check: Are there any hero images on landing?
- If yes: Compress to <50KB, use WebP + JPEG fallback
- Files: `public/*.png` or `public/*.jpg`

**Win 3: Defer non-critical JS**
- Defer analytics scripts (if any)
- Defer third-party integrations
- Keep critical path minimal

**Win 4: Preconnect to external domains**
```html
<link rel="preconnect" href="https://api.anthropic.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```
- File: `src/app/layout.tsx` (metadata)

**Win 5: Monitor CLS with responsive clamp()**
- Test: Do clamp() values on landing page cause reflow?
- If yes: Use static breakpoints instead
- File: `src/app/page.tsx` (Hero section)

### Phase 3: Medium Effort (2h)

**Optimization 1: Code-split Anthropic SDK**
- Move Claude API client to dynamic import on /capture route only
- Impact: Reduces landing page bundle by ~15 kB

**Optimization 2: Route-level code splitting**
- Use `next/dynamic` for heavy modals (CreateCollectionModal, ShareCollectionModal)
- Defer until user interaction

**Optimization 3: Service Worker (offline caching)**
- Cache landing page assets
- Cache instrument assets after first load
- Enable offline mode

### Phase 4: Validation & Reporting (1h)

**Re-audit after each optimization:**
1. Run Lighthouse after each win
2. Track delta (score improvement)
3. Document which fix had most impact

**Final report:**
- Baseline → Target scores
- LCP/FID/CLS timings (mobile, tablet, desktop)
- Recommendations for post-V1

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Lazy-load Tone.js | 46 kB is largest dep; audio only needed on /play + /capture |
| Keep Anthropic SDK eager | Used on all routes (identify, parse-prompt) — harder to defer |
| Use CSS clamp() as-is | Responsive design already complete; measure first, fix if needed |
| No Service Worker in V1 | Extra complexity; revisit if LCP still failing |

---

## Success Criteria

- [ ] Mobile Lighthouse score ≥85 (currently unknown)
- [ ] Desktop Lighthouse score ≥95 (currently unknown)
- [ ] LCP <2.5s on mobile (measure via Lighthouse)
- [ ] FID <100ms on mobile (measure via Lighthouse)
- [ ] CLS <0.1 on mobile (measure via Lighthouse)
- [ ] All quick wins implemented (lazy-load Tone.js, image optimization, preconnect)
- [ ] Final report + recommendations for future optimization

---

## Timeline

| Phase | Task | Time | Owner |
|-------|------|------|-------|
| 1 | Measure current scores | 30m | Claude |
| 2 | Implement quick wins | 1.5h | Claude |
| 3 | Medium effort optimizations (optional) | 2h | Claude |
| 4 | Validate + report | 1h | Claude |

**Total: 5h (includes optional medium effort)**

---

## Notes

- PageSpeed Insights API (free) provides Lighthouse scores without CLI Chrome dependency
- Vercel Analytics integration (optional) gives real-user metrics
- Core Web Vitals are SEO ranking factors (important for discoverability)
- Test on actual 3G/4G mobile network for realistic timings
