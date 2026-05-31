---
title: Multi-Provider AI Router Testing
status: shipped
effort: S (2h)
shipped: 2026-05-31
---

## Summary

Verify fallthrough logic: if Anthropic API fails (rate limit, invalid key), route to OpenAI. If OpenAI fails, try Gemini. Continue until one succeeds or all exhaust.

---

## Problem

Single LLM provider = single point of failure. Rate limits (429) or key exhaustion block the app. Need resilience.

---

## Goals

- ✅ Route text requests through 5 providers in priority order
- ✅ Route vision requests through 4 providers (DeepSeek excluded, no vision)
- ✅ Automatic fallthrough on 429, timeout, auth errors
- ✅ Fallback mode when all providers exhausted (hash-based kit, no LLM)
- ✅ Track provider attribution in response

---

## Success Criteria

- [x] Router catches 429 (rate limit) and falls through to next provider
- [x] Router catches 401 (auth failure) and falls through
- [x] Router catches network timeout and falls through
- [x] When all fail, returns `{ text: fallback, provider: 'none' }`
- [x] Response includes `provider` field for analytics
- [x] No API keys hardcoded; reads from env vars
- [x] Works with 0-5 keys (subset or all providers available)

---

## Design

### aiRouter.ts

```typescript
routeText(prompt, systemPrompt?) → { text, provider }
routeVision(imageBase64, prompt?) → { identified, provider }
```

Priority order (text):
1. Anthropic (ANTHROPIC_API_KEY)
2. OpenAI (OPENAI_API_KEY)
3. Gemini (GEMINI_API_KEY)
4. DeepSeek (DEEPSEEK_API_KEY)
5. xAI (XAI_API_KEY)

Priority order (vision):
1. Anthropic
2. OpenAI
3. Gemini
4. xAI
(DeepSeek skipped — no vision API)

Error handling:
- 429 → sleep 1s, try next
- 401 → skip provider (auth failed)
- 5xx → try next (server error)
- timeout (10s) → try next
- all fail → return fallback + provider='none'

---

## Acceptance Tests

| Scenario | Input | Expected |
|----------|-------|----------|
| All providers available | "test prompt" + all 5 keys | Uses Anthropic (first), returns provider='anthropic' |
| Anthropic 429 | Rate-limited Anthropic key | Falls through to OpenAI, returns provider='openai' |
| Anthropic + OpenAI fail | Both rate-limited | Falls through to Gemini, returns provider='gemini' |
| All providers fail | All 429 | Returns fallback kit, provider='none' |
| Single provider | Only OPENAI_API_KEY set | Uses OpenAI, skips others |
| No providers | No API keys | Returns fallback, provider='none', app still works |

---

## References

- [aiRouter.ts](app/src/lib/aiRouter.ts)
- [TEST_ROUTER.md](TEST_ROUTER.md)
- [/api/parse-prompt](app/src/app/api/parse-prompt/route.ts)
- [/api/identify-instrument](app/src/app/api/identify-instrument/route.ts)

---

## Notes

Fallback mode: hash-based kit generation (no Claude call). User gets playable instrument even if all LLMs down. UX degrades gracefully, doesn't break.
