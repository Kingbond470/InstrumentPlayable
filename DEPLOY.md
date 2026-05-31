# Deployment Guide — Vercel

Deploy Playable Instrument to production on Vercel. Zero downtime. Automatic previews on PR.

## Option 1: GitHub UI (Easiest)

1. Go to https://vercel.com/new
2. Import GitHub repo: `Kingbond470/InstrumentPlayable`
3. Configure:
   - **Root Directory:** `app/` (because monorepo with app + additional_file)
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
   - **Output Directory:** `.next`
4. Add env vars (optional, can add later):
   - `ANTHROPIC_API_KEY=sk-ant-...` (if you have key)
   - (OpenAI, Gemini, DeepSeek, xAI keys — at least one recommended)
5. Click **Deploy**
6. Wait 2–3 min. Get production URL.

---

## Option 2: CLI

```bash
cd app
npm install -g vercel
vercel login
vercel deploy --prod
```

Follows `vercel.json` config automatically.

---

## Environment Variables

Add at least **one** API key. In Vercel dashboard:

1. Go to **Settings → Environment Variables**
2. Add:
   - `ANTHROPIC_API_KEY=sk-ant-...`
   - `OPENAI_API_KEY=sk-...` (optional)
   - `GEMINI_API_KEY=...` (optional)
   - `DEEPSEEK_API_KEY=sk-...` (optional)
   - `XAI_API_KEY=...` (optional)

Without keys: app works in fallback mode (hash-based instruments/kits, no LLM).

---

## Post-Deploy

After deployment completes:

1. ✅ Open production URL (e.g., `https://playable-instrument.vercel.app`)
2. ✅ Test `/` (landing page loads)
3. ✅ Test `/capture` (photo upload works)
4. ✅ Test `/play` (text prompt works)
5. ✅ Test API routes:
   ```bash
   curl https://your-url.vercel.app/api/parse-prompt \
     -X POST -H "Content-Type: application/json" \
     -d '{"text":"test"}'
   ```

---

## Custom Domain

In **Settings → Domains**:

1. Add domain (e.g., `playable.app`)
2. Follow DNS setup (Vercel provides CNAME)
3. Wait 5–10 min for DNS to propagate

---

## GitHub Integration

Once deployed:

1. **Preview Deployments:** Every PR gets automatic preview URL
   - Commit to any branch → Vercel builds & deploys to preview
   - PR shows preview link automatically
2. **Production Deployments:** Merges to `main` auto-deploy to prod
3. **Rollback:** Click "Promote" on any previous deployment in Vercel dashboard

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Deployment fails, "Root directory app/ not found" | Check repo has `app/` folder with `package.json`, `next.config.ts`. |
| Landing page 404 | Check build output. Verify `src/app/page.tsx` exists. |
| API returns `provider: "none"` | No env vars set. Add at least one API key in Vercel dashboard. |
| CORS error on vision requests | Vision requests run on Vercel Edge, should work. Check browser console. |
| "Module not found: tone" | Check `npm install` ran. Verify `node_modules/tone` exists locally before deploy. |

---

## Performance

- **First Contentful Paint:** ~2s
- **API latency (text):** ~800ms (Anthropic) / ~1.2s (OpenAI)
- **API latency (vision):** ~2s (Sonnet is slower than Haiku)
- **Edge Function coldstart:** ~100ms

Optimize with:
- Image optimization (Vercel auto-optimizes)
- Code splitting (Next.js 15 does automatically)
- Caching: add `Cache-Control: public, max-age=3600` to routes as needed

---

## Analytics

View in **Vercel Dashboard → Analytics**:
- Page views, unique visitors
- Request count
- Edge Function invocations
- Build duration

---

## Scaling

Free tier limits:
- Bandwidth: ~50GB/month
- Concurrent Functions: 12 (auto-scales up)
- Deployments: Unlimited

If exceeding free tier: upgrade to **Pro ($20/month)** or **Enterprise**.

---

## Next Steps

1. Deploy to Vercel
2. Share prod URL: https://...vercel.app
3. Test with real API keys (add one env var, restart)
4. Monitor analytics in Vercel dashboard
5. Set up GitHub branch protection rules (require deployments to pass)
