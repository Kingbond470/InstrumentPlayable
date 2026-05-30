// Landing page in the PAD aesthetic.
// Cream chassis, ink, single red accent, Helvetica Black, monospace details.
// Long-scroll style page presented inside one artboard.

function PadLanding() {
  const cream = '#efece4';
  const ink = '#0a0a0a';
  const red = '#ff3b1f';

  return (
    <div data-screen-label="Landing" style={{
      width: '100%', height: '100%', background: cream, color: ink,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'auto',
    }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10, background: cream,
        borderBottom: `2px solid ${ink}`,
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>PAD/01</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            A PLAYABLE INSTRUMENT
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['MANUAL', 'KITS', 'PRICING', 'LOG IN'].map((l) => (
            <button key={l} style={{
              padding: '8px 14px', background: 'transparent',
              border: 'none', color: ink, cursor: 'pointer',
              fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
            }}>{l}</button>
          ))}
          <button style={{
            marginLeft: 10, padding: '10px 18px',
            background: ink, color: cream, border: 'none', cursor: 'pointer',
            fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
            boxShadow: `4px 4px 0 0 ${red}`, borderRadius: 0,
          }}>OPEN INSTRUMENT →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '64px 32px 80px',
        borderBottom: `2px solid ${ink}`,
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, alignItems: 'end',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', background: ink, color: cream,
            fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, fontWeight: 700,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: red }} />
            NOW IN PUBLIC BETA · v0.4
          </div>
          <h1 style={{
            margin: '20px 0 0', fontWeight: 900, fontSize: 132, lineHeight: 0.86,
            letterSpacing: -5, textWrap: 'balance',
          }}>
            Make an instrument out of a&nbsp;<span style={{ color: red }}>sentence</span>.
          </h1>
          <p style={{
            marginTop: 28, maxWidth: 580, fontSize: 19, lineHeight: 1.45, opacity: 0.78,
          }}>
            Type a vibe — "rainy detroit warehouse at 4am", "kid's room ukelele", "tape‑warped
            shoegaze" — and 16 pads tune themselves to it. Hit them. Move on with your day.
          </p>
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={{
              padding: '16px 26px', background: red, color: cream, border: `2px solid ${ink}`,
              fontWeight: 900, fontSize: 16, letterSpacing: -0.3, cursor: 'pointer',
              boxShadow: `6px 6px 0 0 ${ink}`, borderRadius: 0,
            }}>START PLAYING — FREE</button>
            <button style={{
              padding: '16px 22px', background: 'transparent', color: ink, border: `2px solid ${ink}`,
              fontWeight: 700, fontSize: 14, letterSpacing: 0.3, cursor: 'pointer',
              fontFamily: 'ui-monospace, monospace', borderRadius: 0,
            }}>▶ WATCH 30s DEMO</button>
          </div>
          <div style={{
            marginTop: 28, display: 'flex', gap: 26, fontFamily: 'ui-monospace, monospace',
            fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
          }}>
            <span>NO ACCOUNT TO TRY</span>
            <span>WORKS IN BROWSER</span>
            <span>MIDI & AUDIO EXPORT</span>
          </div>
        </div>

        {/* Mini pad preview */}
        <div style={{
          background: cream, border: `2px solid ${ink}`,
          padding: 16, boxShadow: `8px 8px 0 0 ${ink}`, transform: 'rotate(-1.5deg)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 1.4, marginBottom: 10,
          }}>
            <span>PROMPT · "RAINY DETROIT"</span>
            <span>● LIVE</span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
          }}>
            {['KIK', 'SNR', 'HAT', 'CLP', 'SUB', 'TOM', 'RIM', 'OPN',
              'BUZ', 'STB', 'PAD', 'FX1', 'VOX', 'ARP', 'CHD', 'END'].map((l, i) => {
              const hot = [0, 3, 6, 11].includes(i);
              return (
                <div key={i} style={{
                  aspectRatio: '1', border: `1.5px solid ${ink}`,
                  background: hot ? ink : cream, color: hot ? cream : ink,
                  display: 'flex', alignItems: 'flex-end', padding: 8,
                  fontWeight: 900, fontSize: 16, letterSpacing: -0.5,
                  boxShadow: hot ? 'none' : `3px 3px 0 0 ${ink}`,
                  transform: hot ? 'translate(2px, 2px)' : 'none',
                }}>{l}</div>
              );
            })}
          </div>
          <div style={{
            marginTop: 12, fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 1.4,
            display: 'flex', justifyContent: 'space-between', opacity: 0.65,
          }}>
            <span>124 BPM · 4/4</span>
            <span>4 PADS RINGING</span>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section style={{
        borderBottom: `2px solid ${ink}`,
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: ink, color: cream,
      }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.6 }}>
          BUILT BY PEOPLE WHO MAKE NOISE FOR:
        </span>
        <div style={{ display: 'flex', gap: 40, fontWeight: 900, fontSize: 16, letterSpacing: -0.3, opacity: 0.85 }}>
          {['SOLID/SOUND', 'LATE NIGHT', 'FIELD RECORDS', 'NULL MUSIC', 'OPEN STUDIO'].map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </section>

      {/* Three-up features */}
      <section style={{
        padding: '80px 32px', borderBottom: `2px solid ${ink}`,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
      }}>
        {[
          { n: '01', t: 'Type a vibe', d: 'No menus. No genre picker. Describe it in plain words and the engine retunes every pad to match.' },
          { n: '02', t: 'Sixteen ways to hit it', d: 'Same grid, infinite kits. Kick, snare, hat, sub, pad, stab, arp, FX — all tuned to the same prompt.' },
          { n: '03', t: 'Export when ready', d: 'One‑shot WAV. MIDI loop. PNG of the kit card. Or just close the tab. We won\'t guilt‑trip you.' },
        ].map((f, i) => (
          <div key={f.n} style={{
            padding: '0 28px', borderLeft: i > 0 ? `2px solid ${ink}` : 'none',
          }}>
            <span style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 11,
              letterSpacing: 1.6, fontWeight: 700, color: red,
            }}>{f.n}</span>
            <h3 style={{
              margin: '12px 0 14px', fontWeight: 900, fontSize: 34,
              letterSpacing: -1, lineHeight: 1, textWrap: 'balance',
            }}>{f.t}</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, opacity: 0.75 }}>{f.d}</p>
          </div>
        ))}
      </section>

      {/* Prompt gallery */}
      <section style={{
        padding: '72px 32px 88px', borderBottom: `2px solid ${ink}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 52, letterSpacing: -2 }}>
            What people are typing
          </h2>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, opacity: 0.55 }}>
            UPDATED EVERY 30 MIN · CC0
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { p: 'sunday morning coffee, slow brushes', tag: 'JAZZ · 78', dot: red },
            { p: 'haunted bowling alley, organ in distance', tag: 'CINEMA · 94', dot: ink },
            { p: 'four kids stomping on a couch', tag: 'GARAGE · 168', dot: red },
            { p: 'late train, headphones, low battery', tag: 'AMBIENT · 64', dot: ink },
            { p: 'first day of summer break, no plans', tag: 'POP · 120', dot: red },
            { p: 'mechanic\'s shop at closing time', tag: 'INDUSTRIAL · 108', dot: ink },
            { p: 'cat investigating a paper bag', tag: 'GLITCH · 142', dot: red },
            { p: 'thunderstorm two blocks over', tag: 'DUB · 92', dot: ink },
          ].map((g, i) => (
            <div key={i} style={{
              border: `2px solid ${ink}`, padding: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
              boxShadow: i % 3 === 0 ? `4px 4px 0 0 ${ink}` : 'none',
              background: cream, minHeight: 140,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: g.dot }} />
              <p style={{
                margin: 0, fontWeight: 700, fontSize: 16, lineHeight: 1.25,
                letterSpacing: -0.2, textWrap: 'balance',
              }}>"{g.p}"</p>
              <span style={{
                marginTop: 'auto', fontFamily: 'ui-monospace, monospace',
                fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
              }}>→ {g.tag} BPM</span>
            </div>
          ))}
        </div>
      </section>

      {/* Big CTA */}
      <section style={{
        background: ink, color: cream, padding: '100px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -80, bottom: -80, width: 320, height: 320,
          borderRadius: '50%', background: red, opacity: 0.9,
        }} />
        <div style={{ position: 'relative', maxWidth: 760 }}>
          <h2 style={{
            margin: 0, fontWeight: 900, fontSize: 110, lineHeight: 0.88, letterSpacing: -4,
          }}>
            Stop reading.<br />Start hitting&nbsp;things.
          </h2>
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{
              padding: '18px 28px', background: cream, color: ink, border: `2px solid ${cream}`,
              fontWeight: 900, fontSize: 16, letterSpacing: -0.3, cursor: 'pointer',
              borderRadius: 0,
            }}>OPEN INSTRUMENT →</button>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, opacity: 0.7 }}>
              ~6 SECONDS · NO SIGN‑UP
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
      }}>
        <span>© PAD/01 — A PLAYABLE INSTRUMENT</span>
        <span>MADE IN A KITCHEN · 2026</span>
      </footer>
    </div>
  );
}

window.PadLanding = PadLanding;
