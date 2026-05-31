---
title: Multi-Language Support (i18n)
status: planning
effort: L (5h)
---

## Summary

Internationalize app for non-English markets. Spanish, Mandarin, Hindi, Arabic. Unlocks growth in 3B+ users.

---

## Problem

Currently English-only. Blocks ~80% of world population. Can't identify instruments if labels are foreign. Need i18n.

---

## Goals

- ✅ Support 4 languages: Spanish, Mandarin (Simplified), Hindi, Arabic
- ✅ Instrument names + descriptions translated
- ✅ UI strings translated (buttons, labels, error messages)
- ✅ Language selector in UI (flags or dropdown)
- ✅ Persist language choice (localStorage)
- ✅ Default to browser language (if supported)
- ✅ No performance hit (<100ms language switch)

---

## Success Criteria

- [ ] All 25 instrument names in 4 languages
- [ ] All instrument descriptions in 4 languages
- [ ] Core UI strings translated (50+ strings)
- [ ] Language selector visible on play page
- [ ] Switching language updates page instantly
- [ ] localStorage persists choice across sessions
- [ ] Browser language detection works (accept-language header)
- [ ] No missing translation keys (fallback to English)
- [ ] RTL languages supported (Arabic layout, text direction)

---

## Design

### i18n Library

Use `next-intl` (Next.js 15 native):
```bash
npm install next-intl
```

### File Structure

```
app/
├── [locale]/
│   ├── play/
│   ├── capture/
│   └── layout.tsx
└── api/
    └── (no locale prefix)

messages/
├── en.json
├── es.json
├── zh.json
├── hi.json
└── ar.json
```

### Language Config

```typescript
// app/config.ts
export const locales = ['en', 'es', 'zh', 'hi', 'ar'];
export const defaultLocale = 'en';

// Detect from browser
export function getInitialLocale(acceptLanguage: string): string {
  const preferred = acceptLanguage.split(',')[0].split('-')[0];
  return locales.includes(preferred) ? preferred : defaultLocale;
}
```

### Translation Keys

```json
// messages/en.json
{
  "home": {
    "title": "Playable Instrument",
    "subtitle": "Take a photo. Play it instantly."
  },
  "instruments": {
    "sitar": {
      "name": "Sitar",
      "description": "Indian stringed instrument with sympathetic strings"
    }
  },
  "buttons": {
    "save": "Save Kit",
    "share": "Share",
    "export": "Export WAV"
  }
}
```

### Components

```typescript
// Use in component
import { useTranslations } from 'next-intl';

export function PlayPage() {
  const t = useTranslations();
  
  return <h1>{t('home.title')}</h1>;
}

// Language selector
<select onChange={(e) => router.push(`/${e.target.value}/play`)}>
  <option value="en">English</option>
  <option value="es">Español</option>
  <option value="zh">中文</option>
  <option value="hi">हिन्दी</option>
  <option value="ar">العربية</option>
</select>
```

---

## Acceptance Tests

| Scenario | Expected |
|----------|----------|
| Load app, browser = Spanish | Default language is Spanish |
| Select Arabic from dropdown | Page switches to Arabic, RTL layout applied |
| Reload page | Language persists (localStorage) |
| Open /en/play | English page loads |
| Open /es/play | Spanish page loads |
| Instrument description (Sitar) | Shows translated description in current language |
| Error message (upload failed) | Translated error message |
| All 25 instruments | Name + description in all 4 languages |
| Missing translation key | Fallback to English (graceful) |
| API response | Returns JSON (untranslated, language-agnostic) |

---

## References

- next-intl docs: https://next-intl-docs.vercel.app/
- CLDR: https://cldr.unicode.org/ (language codes, plurals, formatting)
- [instrumentLibrary.ts](app/src/lib/instrumentLibrary.ts) — translations needed here

---

## Translation Scope

### Tier 1 (Required)

- All 25 instrument names
- All 25 instrument descriptions
- Core UI (buttons, labels, 50+ strings)

### Tier 2 (Optional, defer to V3.1)

- Error messages (all 20+ error cases)
- Analytics event names
- Help text

### Out of Scope

- Tone.js synth parameters (technical, not user-facing)
- Code comments (internal, not visible to users)
- Log messages (developer-facing)

---

## Implementation Plan

1. **Setup next-intl** (0.5h)
   - Install, configure routing
   - Add [locale] middleware

2. **Extract strings** (1h)
   - Create messages/en.json with all UI strings
   - Identify 50+ keys to translate

3. **Translate** (2h)
   - Spanish: ~50 strings + 25 instruments
   - Mandarin: ~50 strings + 25 instruments
   - Hindi: ~50 strings + 25 instruments
   - Arabic: ~50 strings + 25 instruments (RTL)
   - Use Google Translate as baseline, manual review

4. **Integrate** (1h)
   - Update components (useTranslations)
   - Language selector component
   - localStorage persistence
   - RTL detection (document direction)

5. **Test** (0.5h)
   - Manual: each language works
   - Fallback: missing keys default to English
   - RTL: Arabic layout correct

---

## Performance

| Metric | Target |
|--------|--------|
| Language switch latency | <100ms (no server call) |
| Bundle size increase | <20KB (all 4 languages) |
| First load time | <2s (same as English) |

---

## Blockers / Unknowns

- [ ] Translator availability (can find on Fiverr if needed)
- [ ] RTL testing (need to test in Safari, Chrome on iOS/Android)
- [ ] Accents/diacritics in instrument names (é, ü, ñ, etc.) — UTF-8 should handle

---

## Future

- [ ] More languages (Japanese, Portuguese, French)
- [ ] Community translations (Crowdin, Localazy)
- [ ] Instrument names in local scripts (Devanagari for Hindi, Arabic script for Arabic)
- [ ] Localized music terminology (cultural notes per language)
