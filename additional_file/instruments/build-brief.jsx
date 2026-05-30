// Build Brief — a one-page pitch for SPM + TL to scope the platform.
// PAD aesthetic. Designed to be readable at a glance, scoped at a glance.

function PadBuildBrief() {
  const cream = '#efece4';
  const ink = '#0a0a0a';
  const red = '#ff3b1f';

  return (
    <div data-screen-label="Build Brief" style={{
      width: '100%', height: '100%', background: cream, color: ink,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      padding: 36,
      display: 'grid',
      gridTemplateRows: 'auto auto 1fr auto',
      gap: 22,
    }}>
      {/* Header band */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        borderBottom: `2px solid ${ink}`, paddingBottom: 18,
      }}>
        <div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 10px', background: ink, color: cream,
            fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, fontWeight: 700,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: red }} />
            BUILD BRIEF · FOR SPM + TL · v0.1
          </span>
          <h1 style={{
            margin: '14px 0 0', fontWeight: 900, fontSize: 64, letterSpacing: -2.4, lineHeight: 0.9,
            textWrap: 'balance', maxWidth: 980,
          }}>
            Should we build <span style={{ color: red }}>Playable Instrument</span>?
          </h1>
          <p style={{
            margin: '12px 0 0', fontSize: 16, lineHeight: 1.45, maxWidth: 820, opacity: 0.78,
          }}>
            A one‑prompt, in‑browser instrument that retunes itself to a sentence. Five design
            directions already explored. This page is the case for picking one and shipping it.
          </p>
        </div>
        <div style={{
          flex: '0 0 auto', textAlign: 'right',
          fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.6,
        }}>
          OWNERS<br/>
          <span style={{ color: ink, opacity: 1, fontWeight: 700 }}>DESIGN · YOU</span><br/>
          SPM · TBD<br/>
          TL · TBD<br/>
          ENG · 2 FTE · 8 WK
        </div>
      </div>

      {/* TL;DR cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
      }}>
        {[
          { k: 'PROBLEM', v: 'Creative tools demand vocabulary users don\'t have. "Pick a synth" is the wrong first question.' },
          { k: 'INSIGHT', v: 'People can describe a feeling long before they can name a sound. The prompt is the instrument.' },
          { k: 'BET', v: 'A vibe-first instrument beats a feature-first one for the 95% who don\'t already make music.' },
          { k: 'WIN CONDITION', v: '30% of trial sessions produce a saved kit. 10% return within 7 days.' },
        ].map((c, i) => (
          <div key={c.k} style={{
            border: `2px solid ${ink}`, padding: 16,
            background: i === 3 ? ink : cream, color: i === 3 ? cream : ink,
            boxShadow: i === 3 ? `4px 4px 0 0 ${red}` : `4px 4px 0 0 ${ink}`,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <span style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6,
              color: i === 3 ? red : red, fontWeight: 700,
            }}>{c.k}</span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.4, fontWeight: 500, textWrap: 'balance' }}>{c.v}</p>
          </div>
        ))}
      </div>

      {/* Main 3-column body */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.15fr 1fr 1fr', gap: 22, minHeight: 0,
      }}>
        {/* Col 1 — Scope (MVP cut) */}
        <Card title="SCOPE · MVP CUT" tag="WEEK 0–8" ink={ink} cream={cream} red={red}>
          <ScopeRow label="DIRECTION" v="PAD/01 — brutalist 4×4 grid" hot />
          <ScopeRow label="CORE FLOW" v="Prompt → Tune (3s) → 16 pads → Save kit" />
          <ScopeRow label="PROMPT ENGINE" v="LLM tag extraction → sample bank lookup → kit assembly" />
          <ScopeRow label="AUDIO" v="WebAudio · 16 voices · 1‑shot samples · no DSP graph yet" />
          <ScopeRow label="PERSISTENCE" v="Anon localStorage kits; account = email magic-link" />
          <ScopeRow label="EXPORT" v="WAV stem · MIDI loop · share URL" />
          <ScopeRow label="PLATFORMS" v="Desktop web first. Mobile web view-only at launch" />
          <ScopeRow label="OUT OF SCOPE" v="Multi-track sequencing · effects rack · collab · DAW plugin" muted />
        </Card>

        {/* Col 2 — Architecture sketch */}
        <Card title="SYSTEM · STACK" tag="FOR TL" ink={ink} cream={cream} red={red}>
          <div style={{
            border: `1.5px solid ${ink}`, padding: 12,
            display: 'flex', flexDirection: 'column', gap: 8,
            fontFamily: 'ui-monospace, monospace', fontSize: 11, lineHeight: 1.4,
          }}>
            <ArchBox label="CLIENT" v="React + WebAudio + Tone.js" />
            <Arrow />
            <ArchBox label="EDGE" v="Cloudflare Workers · prompt parser · cache" hot red={red} cream={cream} />
            <Arrow />
            <ArchBox label="LLM" v="Haiku-tier · tag extraction only · ≤200 tok" />
            <Arrow />
            <ArchBox label="SAMPLE BANK" v="R2 bucket · 8k curated one-shots · CDN" />
            <Arrow />
            <ArchBox label="STORE" v="Postgres (kits, users) · KV (anon sessions)" />
          </div>
          <div style={{
            marginTop: 12,
            fontFamily: 'ui-monospace, monospace', fontSize: 10, lineHeight: 1.6,
            letterSpacing: 0.3,
          }}>
            <Risk k="LATENCY" v="prompt → kit ≤ 2.5s p95. Cache hot tags." />
            <Risk k="COST" v="LLM ≤ $0.0008 / kit. Pre-warm 200 common prompts." />
            <Risk k="LICENSING" v="All samples original or CC0 — no model gen." />
            <Risk k="A11Y" v="Keyboard-playable pads (QWERTY). ARIA labels." />
          </div>
        </Card>

        {/* Col 3 — Timeline + risks */}
        <Card title="TIMELINE · 8 WEEKS" tag="FOR SPM" ink={ink} cream={cream} red={red}>
          <Timeline cream={cream} ink={ink} red={red} />

          <div style={{
            marginTop: 10, fontFamily: 'ui-monospace, monospace', fontSize: 10,
            letterSpacing: 1.4, color: red, fontWeight: 700,
          }}>OPEN QUESTIONS</div>
          <ul style={{
            margin: '6px 0 0', padding: '0 0 0 16px',
            fontSize: 12.5, lineHeight: 1.5,
          }}>
            <li>Do we own the sample library, or license a partner's?</li>
            <li>Free tier limits — kits / day, or kits / lifetime?</li>
            <li>Mobile parity at launch, or fast-follow?</li>
            <li>Who owns the prompt taxonomy as it grows?</li>
          </ul>
        </Card>
      </div>

      {/* Decision footer */}
      <div style={{
        borderTop: `2px solid ${ink}`, paddingTop: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.2, opacity: 0.65,
        }}>
          NEEDED BY EOW · DESIGN COMMITTED · ENG SCOPED · GO/NO‑GO TUESDAY
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            padding: '12px 18px', background: 'transparent', color: ink, border: `2px solid ${ink}`,
            fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
            cursor: 'pointer', borderRadius: 0,
          }}>REQUEST CHANGES</button>
          <button style={{
            padding: '12px 18px', background: ink, color: cream, border: `2px solid ${ink}`,
            fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
            cursor: 'pointer', borderRadius: 0,
          }}>NEEDS MORE INFO</button>
          <button style={{
            padding: '12px 22px', background: red, color: cream, border: `2px solid ${ink}`,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 14, letterSpacing: -0.2, fontWeight: 900,
            cursor: 'pointer', boxShadow: `4px 4px 0 0 ${ink}`, borderRadius: 0,
          }}>APPROVE TO BUILD →</button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, tag, ink, cream, red, children }) {
  return (
    <div style={{
      border: `2px solid ${ink}`,
      background: cream,
      padding: 18,
      display: 'flex', flexDirection: 'column', gap: 12,
      boxShadow: `4px 4px 0 0 ${ink}`,
      minHeight: 0, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{
          margin: 0, fontWeight: 900, fontSize: 18, letterSpacing: -0.4,
        }}>{title}</h3>
        <span style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 1.6,
          color: red, fontWeight: 700,
        }}>{tag}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

function ScopeRow({ label, v, hot, muted }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '110px 1fr', gap: 10,
      padding: '8px 0', borderBottom: '1px dashed rgba(10,10,10,0.15)',
      opacity: muted ? 0.55 : 1,
    }}>
      <span style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.2,
        opacity: 0.65, fontWeight: 700, paddingTop: 2,
      }}>{label}</span>
      <span style={{
        fontSize: 13, lineHeight: 1.4, fontWeight: hot ? 700 : 500,
        color: hot ? '#ff3b1f' : 'inherit',
      }}>{v}</span>
    </div>
  );
}

function ArchBox({ label, v, hot, red, cream }) {
  return (
    <div style={{
      border: `1.5px solid ${hot ? red : '#0a0a0a'}`,
      background: hot ? red : 'transparent',
      color: hot ? cream : '#0a0a0a',
      padding: '8px 10px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontWeight: 700, letterSpacing: 1.2, fontSize: 10 }}>{label}</span>
      <span style={{ fontSize: 10, opacity: hot ? 0.95 : 0.7, textAlign: 'right' }}>{v}</span>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.4, fontSize: 12, lineHeight: 1 }}>
      ↓
    </div>
  );
}

function Risk({ k, v }) {
  return (
    <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
      <span style={{ minWidth: 70, fontWeight: 700, color: '#ff3b1f' }}>{k}</span>
      <span style={{ opacity: 0.75 }}>{v}</span>
    </div>
  );
}

function Timeline({ cream, ink, red }) {
  const weeks = [
    { w: 'W1‑2', phase: 'PROMPT ENGINE', who: 'TL · 1 BE', color: ink },
    { w: 'W2‑4', phase: 'SAMPLE BANK + CACHE', who: 'BE', color: ink },
    { w: 'W3‑5', phase: 'PAD UI + AUDIO ENGINE', who: 'FE', color: ink },
    { w: 'W4‑6', phase: 'ONBOARDING + LIBRARY', who: 'FE · DESIGN', color: red },
    { w: 'W6‑7', phase: 'AUTH · EXPORT · TELEMETRY', who: 'FE + BE', color: ink },
    { w: 'W7‑8', phase: 'CLOSED BETA · 200 USERS', who: 'PM · DESIGN', color: red },
    { w: 'W8',   phase: 'PUBLIC BETA LAUNCH', who: 'ALL', color: red, end: true },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {weeks.map((w, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 10, alignItems: 'center',
          padding: '7px 0', borderBottom: i < weeks.length - 1 ? '1px dashed rgba(10,10,10,0.15)' : 'none',
        }}>
          <span style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 10, fontWeight: 700,
            color: w.color, letterSpacing: 0.5,
          }}>{w.w}</span>
          <span style={{
            fontSize: 13, fontWeight: w.end ? 900 : 600,
            color: w.end ? red : ink,
            letterSpacing: w.end ? -0.2 : 0,
          }}>
            {w.end && '★ '}{w.phase}
          </span>
          <span style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 1.2,
            opacity: 0.55,
          }}>{w.who}</span>
        </div>
      ))}
    </div>
  );
}

window.PadBuildBrief = PadBuildBrief;
