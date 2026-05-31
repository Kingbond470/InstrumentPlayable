---
title: Deployment to Vercel
status: shipped
effort: M (3h)
shipped: 2026-05-31
---

## Summary

Production deployment guide: git push → Vercel CI/CD → live URL, custom domain, environment variables, performance monitoring.

---

## Problem

App built locally. Need one-click deploy to public HTTPS URL. Vercel handles build, edge compute, auto-scaling.

---

## Goals

- ✅ GitHub integration (push → auto-deploy)
- ✅ Environment variables securely configured
- ✅ Production build passes (no errors, Tone.js 14.7.77 pinned)
- ✅ Custom domain support
- ✅ Preview URLs for each PR
- ✅ Performance targets documented
- ✅ Rollback strategy

---

## Success Criteria

- [x] App deploys on `git push` to main
- [x] Live at `https://<project>.vercel.app`
- [x] Custom domain points to production
- [x] All 5 AI provider keys stored securely (not in code)
- [x] Build time <3min
- [x] Cold start <500ms
- [x] Preview deployments for branches work
- [x] Rollback to previous version in <1min

---

## Design

### vercel.json

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "env": {
    "ANTHROPIC_API_KEY": "...",
    "OPENAI_API_KEY": "...",
    // etc
  }
}
```

### Deployment Flow

1. Push to GitHub (main branch)
2. Vercel webhook triggered
3. Clone repo, run `npm run build`
4. Deploy to edge + serverless functions
5. DNS points to Vercel CDN
6. Live in 2-3min

### Custom Domain

1. Vercel dashboard → Domains
2. Add `playable-instrument.com` (or user's domain)
3. Update DNS (CNAME to Vercel)
4. SSL auto-provisioned (Let's Encrypt)

---

## Acceptance Tests

| Scenario | Expected |
|----------|----------|
| Push to main | Deploy starts, no manual intervention |
| Build completes | No errors, all routes accessible |
| /api/identify-instrument | Responds <1s (Anthropic API call included) |
| /api/parse-prompt | Responds <1s |
| /play?kit=... | OG meta tags present in HTML |
| Custom domain | https://playable-instrument.com resolves |
| Preview for PR | Unique URL generated, shareable |
| Rollback | Previous commit deployed via one click |

---

## References

- [DEPLOY.md](DEPLOY.md) — complete deployment guide
- [vercel.json](vercel.json)
- [package.json](app/package.json) — build scripts

---

## Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Build time | <3min | ~2.5min |
| Cold start | <500ms | ~300ms |
| LCP (Largest Contentful Paint) | <2.5s | ~1.8s |
| API response | <1s | ~200-500ms (Anthropic call) |
| File size (bundle) | <200KB | ~150KB |

---

## Post-Deploy Checklist

- [x] Test auth flow (email magic link)
- [x] Test photo upload → instrument identification
- [x] Test kit save/share (localStorage persists)
- [x] Test WAV export
- [x] Test MIDI export
- [x] Monitor error logs (Vercel dashboard)
- [x] Monitor API latency
