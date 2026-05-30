import Link from 'next/link';
import { T } from '@/tokens/design';

const PROMPTS = [
  { p: 'sunday morning coffee, slow brushes',  tag: 'JAZZ · 78 BPM' },
  { p: 'haunted bowling alley, organ in distance', tag: 'CINEMA · 94 BPM' },
  { p: 'four kids stomping on a couch',        tag: 'GARAGE · 168 BPM' },
  { p: 'late train, headphones, low battery',  tag: 'AMBIENT · 64 BPM' },
  { p: 'first day of summer break, no plans',  tag: 'POP · 120 BPM' },
  { p: "mechanic's shop at closing time",      tag: 'INDUSTRIAL · 108 BPM' },
  { p: 'cat investigating a paper bag',        tag: 'GLITCH · 142 BPM' },
  { p: 'thunderstorm two blocks over',         tag: 'DUB · 92 BPM' },
];

const OpenBtn = ({ style }: { style?: React.CSSProperties }) => (
  <Link href="/play" style={{
    display: 'inline-block', textDecoration: 'none',
    padding: '16px 26px',
    background: T.red, color: T.cream,
    border: `2px solid ${T.ink}`, fontWeight: 900, fontSize: 16,
    letterSpacing: -0.3, boxShadow: `6px 6px 0 0 ${T.ink}`,
    ...style,
  }}>
    START PLAYING — FREE
  </Link>
);

export default function LandingPage() {
  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: T.cream, color: T.ink,
      fontFamily: T.font,
    }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10, background: T.cream,
        borderBottom: `2px solid ${T.ink}`,
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>PAD/01</span>
          <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            A PLAYABLE INSTRUMENT
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/library" style={{
            padding: '10px 14px', background: 'transparent', color: T.ink,
            textDecoration: 'none', fontFamily: T.mono,
            fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
            border: `1.5px solid ${T.ink}`,
          }}>LIBRARY</Link>
          <Link href="/play" style={{
            padding: '10px 18px', background: T.ink, color: T.cream,
            textDecoration: 'none', fontFamily: T.mono,
            fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
            boxShadow: `4px 4px 0 0 ${T.red}`,
          }}>OPEN INSTRUMENT →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '64px 32px 80px',
        borderBottom: `2px solid ${T.ink}`,
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, alignItems: 'end',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', background: T.ink, color: T.cream,
            fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, fontWeight: 700,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: T.red }} />
            NOW IN PUBLIC BETA · v0.1
          </div>
          <h1 style={{
            margin: '20px 0 0', fontWeight: 900, fontSize: 112,
            lineHeight: 0.86, letterSpacing: -5,
          }}>
            Make an instrument out of a&nbsp;<span style={{ color: T.red }}>sentence</span>.
          </h1>
          <p style={{
            marginTop: 28, maxWidth: 580, fontSize: 19, lineHeight: 1.45, opacity: 0.78,
          }}>
            Type a vibe — &quot;rainy detroit warehouse at 4am&quot;, &quot;kid&apos;s room ukelele&quot;,
            &quot;tape‑warped shoegaze&quot; — and 16 pads tune themselves to it. Hit them.
          </p>
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 14 }}>
            <OpenBtn />
          </div>
          <div style={{
            marginTop: 28, display: 'flex', gap: 26, fontFamily: T.mono,
            fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
          }}>
            <span>NO ACCOUNT TO TRY</span>
            <span>WORKS IN BROWSER</span>
            <span>16 SYNTH VOICES</span>
          </div>
        </div>

        {/* Mini pad preview */}
        <div style={{
          background: T.cream, border: `2px solid ${T.ink}`,
          padding: 16, boxShadow: `8px 8px 0 0 ${T.ink}`, transform: 'rotate(-1.5deg)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, marginBottom: 10,
          }}>
            <span>PROMPT · &quot;RAINY DETROIT&quot;</span>
            <span>● LIVE</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['KIK','SNR','HAT','CLP','SUB','TOM','RIM','OPN',
              'BUZ','STB','PAD','FX1','VOX','ARP','CHD','END'].map((l, i) => {
              const hot = [0, 3, 6, 11].includes(i);
              return (
                <div key={i} style={{
                  aspectRatio: '1', border: `1.5px solid ${T.ink}`,
                  background: hot ? T.ink : T.cream, color: hot ? T.cream : T.ink,
                  display: 'flex', alignItems: 'flex-end', padding: 8,
                  fontWeight: 900, fontSize: 16, letterSpacing: -0.5,
                  boxShadow: hot ? 'none' : `3px 3px 0 0 ${T.ink}`,
                  transform: hot ? 'translate(2px,2px)' : 'none',
                }}>{l}</div>
              );
            })}
          </div>
          <div style={{
            marginTop: 12, fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4,
            display: 'flex', justifyContent: 'space-between', opacity: 0.65,
          }}>
            <span>124 BPM · 4/4</span><span>4 PADS RINGING</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '80px 32px', borderBottom: `2px solid ${T.ink}`,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
      }}>
        {[
          { n: '01', t: 'Type a vibe', d: 'No menus. No genre picker. Describe it in plain words and the engine retunes every pad to match.' },
          { n: '02', t: 'Sixteen ways to hit it', d: 'Same grid, infinite kits. Kick, snare, hat, sub, pad, stab, arp, FX — all tuned to your prompt.' },
          { n: '03', t: 'Change anytime', d: "Type a new prompt, hit Enter. Every voice retunes instantly. Same pads, different world." },
        ].map((f, i) => (
          <div key={f.n} style={{ padding: '0 28px', borderLeft: i > 0 ? `2px solid ${T.ink}` : 'none' }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, fontWeight: 700, color: T.red }}>{f.n}</span>
            <h3 style={{ margin: '12px 0 14px', fontWeight: 900, fontSize: 34, letterSpacing: -1, lineHeight: 1 }}>{f.t}</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, opacity: 0.75 }}>{f.d}</p>
          </div>
        ))}
      </section>

      {/* Prompt gallery */}
      <section style={{ padding: '72px 32px 88px', borderBottom: `2px solid ${T.ink}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 52, letterSpacing: -2 }}>What people are typing</h2>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.4, opacity: 0.55 }}>SOME EXAMPLES ↓</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {PROMPTS.map((g, i) => (
            <div key={i} style={{
              border: `2px solid ${T.ink}`, padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
              boxShadow: i % 3 === 0 ? `4px 4px 0 0 ${T.ink}` : 'none',
              background: T.cream, minHeight: 140,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: i % 2 === 0 ? T.red : T.ink }} />
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, lineHeight: 1.25, letterSpacing: -0.2 }}>
                &quot;{g.p}&quot;
              </p>
              <span style={{ marginTop: 'auto', fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55 }}>
                → {g.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Big CTA */}
      <section style={{
        background: T.ink, color: T.cream, padding: '100px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -80, bottom: -80, width: 320, height: 320,
          borderRadius: '50%', background: T.red, opacity: 0.9,
        }} />
        <div style={{ position: 'relative', maxWidth: 760 }}>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 110, lineHeight: 0.88, letterSpacing: -4 }}>
            Stop reading.<br />Start hitting&nbsp;things.
          </h2>
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/play" style={{
              display: 'inline-block', textDecoration: 'none',
              padding: '18px 28px', background: T.cream, color: T.ink,
              border: `2px solid ${T.cream}`, fontWeight: 900, fontSize: 16,
              letterSpacing: -0.3,
            }}>
              OPEN INSTRUMENT →
            </Link>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.4, opacity: 0.7 }}>
              ~6 SECONDS · NO SIGN‑UP
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
        borderTop: `2px solid ${T.ink}`,
      }}>
        <span>© PAD/01 — A PLAYABLE INSTRUMENT</span>
        <span>MADE IN 2026</span>
      </footer>
    </div>
  );
}
