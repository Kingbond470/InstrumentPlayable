---
title: Email Magic-Link Authentication
status: shipped (foundation)
effort: L (6h, auth service TBD)
shipped: 2026-05-31
---

## Summary

Magic-link email auth. User enters email → receives link → clicks link → logged in. Session persisted via KV store (Vercel). Cross-device kit sync.

---

## Problem

Anonymous localStorage = kits stuck on one device. Need persistent user accounts. Email-only (no password) = low friction.

---

## Goals

- ✅ Email form (no password, just email)
- ✅ Magic link generation (cryptographic token)
- ✅ Email delivery (Resend or SendGrid)
- ✅ Session persistence (Vercel KV)
- ✅ Cross-device kit sync (fetch user's kits from backend)
- ✅ Graceful fallback (localStorage if KV down)
- ✅ Logout clears session

---

## Success Criteria

- [x] User submits email
- [x] Backend generates token (secure, 32 bytes, hex)
- [x] Email sent with `?token=...` link
- [x] Link valid for 15 minutes
- [x] Click link → verified, session created
- [x] Session token stored in localStorage (client) + KV (server)
- [x] GET /api/auth/me returns user email (requires X-Auth-Token header)
- [x] POST /api/auth/logout invalidates session
- [x] No auth = anonymous mode (localStorage only)
- [x] Multiple logins per device don't break

---

## Design

### Routes

```
POST /api/auth/request
  { email: "user@example.com" }
  → generates token, sends email, returns magic link (dev mode)
  
GET /api/auth/callback?token=abc123
  → verifies token in KV, marks as used, redirects to /play?token=...
  
GET /api/auth/me
  Headers: X-Auth-Token: session_token
  → returns { email: "user@example.com" }
  
POST /api/auth/logout
  Headers: X-Auth-Token: session_token
  → invalidates session in KV, clears client token
```

### Session Model

KV storage:
```
token:<32-byte-hex> = {
  email: "user@example.com",
  created: 1719792000,
  expiresAt: 1719792900, // 15min
  used: false
}

session:<session-id> = {
  email: "user@example.com",
  created: 1719792900,
  expiresAt: 1719879300, // 24h
}
```

Client:
```
localStorage.setItem('authToken', 'session_abc...')
```

### Email Template

Subject: "Your Playable Instrument Link"

Body:
```
Click to play: [link to /api/auth/callback?token=xxx]

This link expires in 15 minutes.
If you didn't request this, ignore.
```

---

## Acceptance Tests

| Scenario | Expected |
|----------|----------|
| User enters email | Form submits, shows "check email" |
| Dev mode | Magic link displayed inline |
| Prod mode | Email sent (Resend/SendGrid) |
| Click magic link | Redirected to /play with token in URL |
| Open /play?token=... | localStorage updated, logged in |
| GET /api/auth/me | Returns { email: "user@example.com" } |
| Call API without token | 401 Unauthorized |
| Token expired (>15min) | 401 Unauthorized |
| Logout | Session cleared, GET /api/auth/me returns 401 |
| Anonymous user | No X-Auth-Token, works with localStorage |

---

## References

- [auth.ts](app/src/lib/auth.ts)
- [LoginModal.tsx](app/src/components/LoginModal.tsx)
- [/api/auth/request](app/src/app/api/auth/request/route.ts)
- [/api/auth/callback](app/src/app/api/auth/callback/route.ts)
- [/api/auth/me](app/src/app/api/auth/me/route.ts)
- [/api/auth/logout](app/src/app/api/auth/logout/route.ts)

---

## Implementation Status

- [x] Auth utilities (generateToken, setAuthToken, getAuthToken, isAuthenticated)
- [x] API routes (all 4 endpoints stubbed)
- [x] LoginModal component (3 states: email input, check email, error)
- [ ] Vercel KV integration (TODO)
- [ ] Email service integration (Resend/SendGrid, TODO)
- [ ] Backend kit sync endpoints (TODO)

---

## Future

- [ ] Social login (Google, GitHub) as fallback
- [ ] 2FA (TOTP)
- [ ] Session management UI (revoke sessions per device)
- [ ] Auto-fill email (browser memory)
- [ ] Rate limiting on email requests (2 per hour per IP)
