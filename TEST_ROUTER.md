# Test Multi-Provider Router

Verify fallthrough behavior when one provider hits rate limit or fails.

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Add **only one** API key first (e.g., `ANTHROPIC_API_KEY=sk-ant-...`)
3. Run: `npm run dev` (port 3000)

## Test 1: Text Generation (Kit)

**Single provider (Anthropic):**

```bash
curl -X POST http://localhost:3000/api/parse-prompt \
  -H "Content-Type: application/json" \
  -d '{"text":"rainy detroit warehouse at 4am"}' | jq .
```

Expected response:
```json
{
  "kit": { "prompt": "...", "name": "...", "bpm": 124, ... },
  "fallback": false,
  "provider": "Claude"
}
```

---

## Test 2: Vision (Instrument Identification)

**Single provider (Anthropic):**

```bash
# Create a test image (1x1 pixel PNG in base64)
IMG_B64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

curl -X POST http://localhost:3000/api/identify-instrument \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"data:image/png;base64,$IMG_B64\"}" | jq .
```

Expected response:
```json
{
  "identified": {
    "id": "unknown",
    "name": "Mystery Instrument",
    "family": "percussion",
    "culture": "Unknown",
    "confidence": 0,
    "description": "Could not identify..."
  },
  "fallback": true,
  "provider": "Claude"
}
```

---

## Test 3: Add Second Provider & Verify Fallthrough

1. Open `.env.local`
2. Add: `OPENAI_API_KEY=sk-...`
3. Restart dev server (`npm run dev`)
4. Run test again:

```bash
curl -X POST http://localhost:3000/api/parse-prompt \
  -H "Content-Type: application/json" \
  -d '{"text":"upbeat synth pop"}' | jq .provider
```

**Expected:** `"Claude"` (Anthropic tried first, succeeds)

---

## Test 4: Simulate Anthropic Rate Limit

To test fallthrough (without hitting actual rate limit):

1. Edit `.env.local`: comment out `ANTHROPIC_API_KEY`
2. Ensure `OPENAI_API_KEY=sk-...` exists
3. Run test:

```bash
curl -X POST http://localhost:3000/api/parse-prompt \
  -H "Content-Type: application/json" \
  -d '{"text":"dark ambient"}' | jq .provider
```

**Expected:** `"GPT-4o"` (Claude skipped, OpenAI tried next, succeeds)

---

## Test 5: All Providers Present

1. Add all 5 keys to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   OPENAI_API_KEY=sk-...
   GEMINI_API_KEY=...
   DEEPSEEK_API_KEY=sk-...
   XAI_API_KEY=...
   ```

2. Test text (should try Claude first):
   ```bash
   curl -X POST http://localhost:3000/api/parse-prompt \
     -H "Content-Type: application/json" \
     -d '{"text":"test"}' | jq .provider
   ```
   **Expected:** `"Claude"`

3. Test vision (should skip DeepSeek, try Claude):
   ```bash
   curl -X POST http://localhost:3000/api/identify-instrument \
     -H "Content-Type: application/json" \
     -d "{\"image\":\"data:image/png;base64,iVBORw0KGgo...\"}" | jq .provider
   ```
   **Expected:** `"Claude"` (not `"DeepSeek"`)

---

## Test 6: No Providers

1. Comment out all API keys in `.env.local`
2. Run test:

```bash
curl -X POST http://localhost:3000/api/parse-prompt \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}' | jq .
```

**Expected:**
```json
{
  "kit": { "prompt": "test", "name": "test", "bpm": 120, ... },
  "fallback": true,
  "provider": "none"
}
```

Note: Returns hash-based fallback kit, **not an error**.

---

## Pass Criteria

- ✅ Single provider: uses that provider
- ✅ Multiple providers: tries in order (Anthropic → OpenAI → Gemini → DeepSeek → xAI)
- ✅ Vision skips DeepSeek (no vision capability)
- ✅ No providers: falls back to hash-based, no error
- ✅ Response includes `provider` field showing which answered

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `provider: "none"` but should be Claude | Check `ANTHROPIC_API_KEY` in `.env.local`. Restart dev server. |
| `provider: "Claude"` fails with 401 | API key invalid. Check at console.anthropic.com. |
| Response times slow | Expected for vision (Sonnet is slower than Haiku). Text should be <500ms. |
| Provider not switching when key added | `.env.local` changes require `npm run dev` restart. |
