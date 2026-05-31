---
title: SEO Optimization & Search Visibility
status: in-progress
effort: L (5h)
shipped: null
---

## Summary

Make Playable Instrument discoverable, rankable, and shareable across search engines, social platforms, and messaging apps. Target: top 3 rankings for "interactive music instruments," "virtual instrument," "cultural instruments online," and 50+ long-tail keywords.

---

## Problem

No SEO optimization = invisible in Google/Bing. Missing metadata = no rich previews on social. No structured data = no knowledge panels. No performance optimization = low Core Web Vitals = ranking penalty.

**Goal:** Rank top 3 for primary keyword within 6 months. 10K organic visits/month by year-end.

---

## Goals

- ✅ On-page SEO (meta tags, headings, schema)
- ✅ Technical SEO (Core Web Vitals, mobile-first indexing, sitemap)
- ✅ Social sharing (OG tags, Twitter cards, rich previews)
- ✅ Content SEO (keyword targeting, long-tail optimization)
- ✅ Structured data (JSON-LD, breadcrumbs, FAQs)
- ✅ Analytics setup (Google Analytics, Search Console)

---

## Success Criteria

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse score | 90+ | TBD |
| Core Web Vitals (all green) | LCP <2.5s, FID <100ms, CLS <0.1 | TBD |
| Mobile-friendly test | Pass | TBD |
| Meta tags completeness | 100% | 20% |
| Structured data coverage | 80% of pages | 0% |
| OG tag coverage | 100% of routes | 40% |
| Organic keyword rankings | Top 3 (10 keywords) | N/A |

---

## Design

### 1. Meta Tags & Titles Strategy

**Title tag pattern:** `[Page Title] — Playable Instrument`
- Length: 50–60 chars (Google shows 50–70)
- Include primary keyword naturally
- Brand name at end for consistency

**Meta description pattern:** `[Value prop]. [CTA].`
- Length: 150–160 chars (Google shows 120–160)
- Action-oriented (what user can do)
- Include keyword once naturally

**Example titles & descriptions:**

| Page | Title | Description |
|------|-------|-------------|
| `/` | Interactive Virtual Instruments — Play Tabla, Sitar, Koto Online | Photograph any instrument and play it instantly. AI identifies it, you play it. No music knowledge needed. Try it free. |
| `/capture` | Identify & Play Musical Instruments from Photos | Upload or photograph an instrument. AI identifies it in seconds. Play it online with realistic sounds and controls. |
| `/play` | 16-Pad Synth Music Maker — Create Beats Online | Create music with our online synth. 16 touch-responsive pads, preset sounds, WAV export, and MIDI support. |
| `/library` | Saved Instrument Kits & Musical Collections | Browse saved instruments, shared collections, and featured cultural instruments from around the world. |
| `/share/collection?data=...` | [Collection Name] - Playable Instrument Collection | Play a shared collection of musical instruments: [instruments list]. Tap to play, record, and share. |

### 2. Structured Data (JSON-LD)

**Global schema (on every page):**
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Playable Instrument",
  "description": "Photograph any instrument and play it instantly. AI identifies it, you play it.",
  "url": "https://instrument-playable-nearawayofficial-3874s-projects.vercel.app",
  "applicationCategory": "Multimedia",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  }
}
```

**Breadcrumb schema (on child pages):**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://..."},
    {"@type": "ListItem", "position": 2, "name": "Capture", "item": "https://.../capture"}
  ]
}
```

**FAQPage schema (on landing page):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does Playable Instrument work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload a photo of any instrument. Our AI identifies it in seconds. Then play it with realistic sounds."
      }
    }
  ]
}
```

### 3. Open Graph & Twitter Cards

**og: tags (on every page):**
```html
<!-- Required -->
<meta property="og:type" content="website">
<meta property="og:title" content="[Page Title]">
<meta property="og:description" content="[Meta description]">
<meta property="og:url" content="https://...">
<meta property="og:image" content="https://.../og-image.png">
<meta property="og:site_name" content="Playable Instrument">

<!-- Recommended -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Play musical instruments by photographing them">

<!-- Locale -->
<meta property="og:locale" content="en_US">
```

**Twitter Card tags:**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Page Title]">
<meta name="twitter:description" content="[Meta description]">
<meta name="twitter:image" content="https://.../og-image.png">
<meta name="twitter:site" content="@PlayableInstrument">
```

### 4. Page-Level Optimization

**Landing page (`/`):**
- Primary keyword: "interactive musical instruments"
- H1: "Play Any Instrument. Just Photograph It."
- H2s: "How It Works", "15 Cultural Instruments", "No Music Knowledge Required"
- Keyword density: 1–2% (natural)
- Internal links: to `/capture`, `/play`, `/library`

**Capture page (`/capture`):**
- Primary keyword: "identify instrument from photo"
- H1: "Photograph an Instrument. Play It Instantly."
- Long-tail keywords: "virtual tabla", "online sitar", "digital instruments", "music AI"
- Internal links: to instrument library, `/play`, `/library`

**Play page (`/play`):**
- Primary keyword: "online synthesizer", "music maker"
- H1: "Create Music with a 16-Pad Synth"
- Long-tail: "pad synth", "beat maker", "online music production"

**Library page (`/library`):**
- Primary keyword: "instrument library", "music instrument collections"
- H1: "Explore Instruments & Shared Collections"

### 5. Technical SEO Checklist

- [ ] Sitemap.xml (all pages, updated weekly)
- [ ] Robots.txt (allow crawlers, disallow admin)
- [ ] Canonical tags (self-referential on all pages)
- [ ] Mobile-first indexing (responsive design ✅)
- [ ] Core Web Vitals pass (Lighthouse 90+)
- [ ] Site speed optimization (<2s FCP, <2.5s LCP)
- [ ] 404 error page optimized (with links to home, /play)
- [ ] robots.txt, humans.txt
- [ ] Hreflang tags (if multi-language: en, es, zh, hi, ar)
- [ ] Internal linking strategy (3–5 links per page)
- [ ] Image optimization (alt text, WebP format, lazy loading)

### 6. Content Keyword Strategy

**Primary keywords (high volume, high intent):**
- "interactive musical instruments" (800/mo)
- "virtual instrument online" (600/mo)
- "play instruments online free" (500/mo)
- "musical instrument identifier" (400/mo)

**Secondary keywords (medium volume):**
- "tabla online", "sitar online", "koto online" (50–200/mo each)
- "virtual music maker", "online synth" (300–400/mo)
- "cultural instruments", "world music instruments" (200–300/mo)

**Long-tail keywords (low volume, high conversion):**
- "how to play tabla", "learn tabla online" (100/mo)
- "best free music maker", "virtual instrument with AI" (50/mo)
- "Indian classical instruments online" (80/mo)

### 7. Link Building Strategy

**Tier 1 (High Authority):**
- Music blogs (Sonic Bids, Music Radar, Perfect for Production)
- Museum partnerships (Metropolitan Museum, Smithsonian)
- Education (Khan Academy, Coursera, Udemy)
- Reddit communities (/r/Music, /r/Instruments, /r/WeAreTheMusicMakers)

**Tier 2 (Medium Authority):**
- Music forums (gearspace.com, gearslutz.com)
- Product Hunt, Hacker News
- Twitter influencers (music producers, music educators)
- Medium publications (music/tech)

**Outreach angles:**
- "New tool for music educators" (teach the identify feature)
- "Interactive way to explore world music" (cultural angle)
- "AI-powered instrument playground" (tech angle)

### 8. Analytics & Monitoring

**Google Search Console:**
- Index coverage (target: 95%+ indexed)
- Performance dashboard (clicks, impressions, CTR, position)
- Mobile usability
- Core Web Vitals report
- Coverage issues

**Google Analytics 4:**
- Goal: Users who play an instrument (conversion)
- Secondary goals: Share collection, Export recording
- Funnel: Landing → Capture → Identify → Play → Record → Share

**Tools:**
- Ahrefs (competitor analysis, backlink tracking)
- SEMrush (keyword research, rank tracking)
- Lighthouse (monthly Core Web Vitals audit)

---

## Implementation Plan

### Phase 1: On-Page SEO (1h)
- [ ] Update page titles & meta descriptions
- [ ] Add og: and twitter: tags
- [ ] Improve heading hierarchy (H1, H2s)
- [ ] Add alt text to all images

### Phase 2: Structured Data (1.5h)
- [ ] Add JSON-LD schema (global + page-specific)
- [ ] Breadcrumb schema
- [ ] FAQPage schema
- [ ] Instrument schema (for library page)

### Phase 3: Technical SEO (1.5h)
- [ ] Create sitemap.xml
- [ ] Update robots.txt
- [ ] Add canonical tags
- [ ] hreflang tags (if multi-language)
- [ ] 404 page optimization

### Phase 4: Content & Internal Links (1h)
- [ ] Optimize heading hierarchy
- [ ] Add internal links (3–5 per page)
- [ ] Create keyword-rich anchor text
- [ ] Optimize image alt text

### Phase 5: Analytics Setup (1h)
- [ ] Google Search Console verification
- [ ] Google Analytics 4 setup
- [ ] Conversion tracking
- [ ] Core Web Vitals monitoring

---

## Acceptance Tests

| Scenario | Tool | Expected Result |
|----------|------|-----------------|
| Meta tags completeness | SEMrush | 100% coverage on all pages |
| Structured data validation | Schema.org validator | Zero errors |
| Mobile-friendly test | Google Mobile Friendly | PASS |
| Lighthouse score | Lighthouse | 90+ on all routes |
| Core Web Vitals | PageSpeed Insights | All green (LCP, FID, CLS) |
| OG image preview | Facebook OG Debugger | Rich preview displays |
| Twitter card preview | Twitter Card validator | Rich preview displays |
| Canonical tags | SEMrush | Self-referential on all pages |
| Sitemap validation | Google Search Console | All pages indexed |
| Breadcrumbs render | Rich Results Test | Schema markup valid |

---

## References

- [Google Search Central](https://developers.google.com/search)
- [JSON-LD best practices](https://developers.google.com/search/docs/appearance/structured-data/intro)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Tags](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)
- [Core Web Vitals](https://web.dev/vitals/)

---

## Priority Keywords to Target

### Tier 1 (High Volume, High Value)
1. "interactive musical instruments" — 800/mo — compete with Soundtrap, BandLab
2. "play instruments online" — 600/mo — compete with Flat.io
3. "virtual instrument" — 1200/mo — huge but harder

### Tier 2 (Medium Volume, High Niche)
4. "tabla online" — 150/mo
5. "sitar online" — 200/mo
6. "koto online" — 100/mo
7. "musical instrument identifier" — 400/mo
8. "identify music instrument from photo" — 300/mo

### Tier 3 (Long-tail, High Conversion)
9. "learn tabla online" — 80/mo
10. "cultural instruments online" — 120/mo
11. "AI music instrument" — 90/mo
12. "virtual music studio" — 250/mo

---

## Timeline

- **Week 1:** Implement on-page SEO + structured data
- **Week 2:** Deploy, submit to Google Search Console
- **Week 3:** Monitor Core Web Vitals, fix issues
- **Week 4:** Start content outreach, backlink building
- **Month 2–3:** Monitor rankings, optimize underperforming pages
- **Month 6:** Target top 3 rankings for primary keywords

---

## Success Metrics (Post-Launch)

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Organic visits/month | 100 | 500 | 2000 |
| Keyword rankings (top 3) | 0 | 3 | 10 |
| Avg ranking position | N/A | 15 | 8 |
| Impressions (GSC) | 1000 | 5000 | 15000 |
| Click-through rate | 2% | 3% | 4% |
| Avg session duration | 2m | 3m | 4m |
| Conversion rate (play) | 40% | 50% | 60% |
