---
title: OG Image Generation for Social Previews
status: shipped
effort: L (5h)
shipped: 2026-05-31
---

## Summary

Generate rich preview cards for shared links. When user shares kit URL on Discord/Twitter/iMessage, show instrument photo + name + culture instead of blank card.

---

## Problem

Share link without preview = low click-through. Rich cards (with image) get 2-3x engagement on social.

---

## Goals

- ✅ Generate 1200x630px PNG on-the-fly (Vercel OG)
- ✅ No external image service (cost, latency)
- ✅ Show instrument name, culture, accent color
- ✅ Metadata integration (/play and /capture pages)
- ✅ Twitter card support (summary_large_image)
- ✅ OpenGraph standard compliance

---

## Success Criteria

- [x] GET /api/og?instrument=sitar&name=Rainy%20Sitar returns PNG
- [x] Image dimensions 1200x630 (Twitter/Discord standard)
- [x] Instrument emoji visible (🎸, 🥁, 🪈, 🎹, 🎻)
- [x] Text legible (instrument name large, culture tag small)
- [x] Accent color bar at top (culture-specific)
- [x] CTA: "Play it instantly →"
- [x] /play?kit=... includes og:image in HTML meta
- [x] /capture?instrument=sitar includes og:image in HTML meta
- [x] Twitter card set to summary_large_image
- [x] No external image generation (Vercel OG, edge-rendered)

---

## Design

### Route: GET /api/og

```
?instrument=sitar&name=Rainy%20Sitar
→ PNG (1200x630)
```

Response headers:
```
Content-Type: image/png
Cache-Control: public, max-age=3600
```

### Image Content

```
┌─────────────────────────────────────┐
│ [Accent color bar, 8px]             │
├─────────────────────────────────────┤
│                                     │
│              🎸                      │
│                                     │
│          SITAR                      │
│       "Rainy Sitar"                 │
│                                     │
│           INDIAN                    │
│                                     │
│      Play it instantly →            │
│                                     │
│           PLAYABLE INSTRUMENT       │
│                                     │
└─────────────────────────────────────┘
```

### Metadata Integration

```typescript
// /play page
generateMetadata({kit}) {
  return {
    openGraph: {
      images: [{url: `/api/og?instrument=unknown&name=${kit.name}`}]
    },
    twitter: {
      card: 'summary_large_image',
      images: [...]
    }
  }
}

// /capture page
generateMetadata({instrument}) {
  return {
    openGraph: {
      images: [{url: `/api/og?instrument=${instrument}&name=${def.name}`}]
    },
    twitter: {
      card: 'summary_large_image',
      images: [...]
    }
  }
}
```

---

## Acceptance Tests

| Scenario | Expected |
|----------|----------|
| /api/og?instrument=sitar | Returns PNG, 1200x630, includes "SITAR" text |
| /api/og with invalid instrument | Returns PNG with "unknown" emoji + branding |
| /play?kit=... (Discord embed) | Shows rich card (og:image rendered) |
| /capture?instrument=sitar (Twitter) | Shows large image preview |
| Browser dev tools | og:image tag present in <head> |
| OpenGraph validator | No errors (structured data) |
| Cache header | max-age=3600 (1hr cache) |
| Edge rendering latency | <100ms (Vercel OG edge function) |

---

## References

- [/api/og/route.tsx](app/src/app/api/og/route.tsx)
- [/play/page.tsx](app/src/app/play/page.tsx)
- [/capture/page.tsx](app/src/app/capture/page.tsx)
- Vercel OG docs: https://vercel.com/docs/og-image-generation
- OpenGraph spec: https://ogp.me/

---

## Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Generation latency | <100ms | ~80ms |
| Image size | <50KB | ~35KB (PNG optimized) |
| Cache hit rate | >80% (shared URLs) | TBD |
| TTL | 1hr | 3600s |

---

## Future

- [ ] Custom instrument photos (user uploads)
- [ ] Animated preview (looping instrument demo)
- [ ] QR code to share link
- [ ] User avatar + name in card
- [ ] Gradient background (per culture)
