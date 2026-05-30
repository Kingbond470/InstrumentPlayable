// Onboarding flow — 3 states, each rendered as a separate artboard.
// State 1: Empty prompt (cursor blinking, examples below)
// State 2: Generating (analyzing the prompt, pad tuning animation)
// State 3: Ready (your kit, with a "play it" callout)

const PAD_CREAM = '#efece4';
const PAD_INK = '#0a0a0a';
const PAD_RED = '#ff3b1f';

// ─── Shared chrome wrapper (mimics the in-app workspace) ───
function PadStudioChrome({ children, step }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: PAD_CREAM, color: PAD_INK,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      display: 'grid',
      gridTemplateRows: '60px 1fr 44px',
    }}>
      {/* Top bar */}
      <div style={{
        borderBottom: `2px solid ${PAD_INK}`,
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>PAD/01</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            UNTITLED KIT · NEW
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4 }}>
            {['PROMPT', 'TUNE', 'PLAY'].map((s, i) => (
              <React.Fragment key={s}>
                <span style={{
                  padding: '5px 9px',
                  background: i === step ? PAD_INK : 'transparent',
                  color: i === step ? PAD_CREAM : (i < step ? PAD_INK : `${PAD_INK}66`),
                  border: `1.5px solid ${i <= step ? PAD_INK : `${PAD_INK}33`}`,
                  fontWeight: 700,
                }}>{i + 1} · {s}</span>
                {i < 2 && <span style={{ opacity: 0.4 }}>—</span>}
              </React.Fragment>
            ))}
          </div>
          <button style={btnGhost}>EXIT</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>{children}</div>

      {/* Status footer */}
      <div style={{
        borderTop: `2px solid ${PAD_INK}`,
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
      }}>
        <span>● CONNECTED · NO AUDIO YET</span>
        <span>STEP {step + 1} / 3</span>
        <span>{['TYPE TO BEGIN', 'TUNING…', 'READY'][step]}</span>
      </div>
    </div>
  );
}

const btnGhost = {
  padding: '7px 12px', background: 'transparent', color: PAD_INK, border: `1.5px solid ${PAD_INK}`,
  fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
  cursor: 'pointer', borderRadius: 0,
};

// ─── State 1: PROMPT (empty) ───
function PadOnboardingPrompt() {
  const [value, setValue] = React.useState('');
  const examples = [
    'rainy detroit warehouse at 4am',
    'kid\'s birthday party, plastic instruments',
    'tape‑warped shoegaze, slow',
    'mechanic shop closing time',
    'cat investigating a paper bag',
    'thunderstorm two blocks over',
  ];

  return (
    <PadStudioChrome step={0}>
      <div data-screen-label="Onboard · Prompt" style={{
        width: '100%', height: '100%',
        display: 'grid', gridTemplateColumns: '1fr 320px',
      }}>
        {/* Left — prompt */}
        <div style={{
          padding: '64px 56px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.6,
            color: PAD_RED, fontWeight: 700,
          }}>01 · START WITH A VIBE</span>
          <h1 style={{
            margin: '12px 0 28px', fontWeight: 900, fontSize: 76, letterSpacing: -3, lineHeight: 0.9,
            textWrap: 'balance',
          }}>
            Describe how it should feel.
          </h1>

          {/* Big input */}
          <div style={{
            border: `2.5px solid ${PAD_INK}`, padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: `6px 6px 0 0 ${PAD_INK}`,
            background: '#fff',
          }}>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: 1.4, opacity: 0.5 }}>{'>'}</span>
            <input value={value} onChange={(e) => setValue(e.target.value)}
              placeholder="type anything — a place, a mood, a memory…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 22, fontWeight: 500, color: PAD_INK,
              }} />
            <span style={{
              display: 'inline-block', width: 2, height: 26, background: PAD_RED,
              animation: 'blink 1s steps(2) infinite',
            }} />
            <button disabled={!value.trim()} style={{
              padding: '12px 22px', background: value.trim() ? PAD_RED : '#cfc9bd',
              color: PAD_CREAM, border: 'none',
              fontWeight: 900, fontSize: 14, letterSpacing: -0.2,
              cursor: value.trim() ? 'pointer' : 'not-allowed',
              boxShadow: value.trim() ? `4px 4px 0 0 ${PAD_INK}` : 'none', borderRadius: 0,
            }}>TUNE PADS →</button>
          </div>

          {/* Try one */}
          <div style={{ marginTop: 32 }}>
            <div style={{
              fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6,
              opacity: 0.55, marginBottom: 10,
            }}>OR TRY ONE OF THESE ↓</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {examples.map((ex) => (
                <button key={ex} onClick={() => setValue(ex)} style={{
                  padding: '10px 14px',
                  border: `1.5px solid ${PAD_INK}`, background: PAD_CREAM, color: PAD_INK,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  borderRadius: 0, fontFamily: 'inherit',
                }}>"{ex}"</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — empty pads (faded, awaiting tune) */}
        <div style={{
          borderLeft: `2px solid ${PAD_INK}`, padding: 20,
          background: `repeating-linear-gradient(135deg, ${PAD_CREAM} 0 8px, #e8e3d4 8px 9px)`,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55 }}>
            PADS · AWAITING PROMPT
          </div>
          <div style={{
            flex: 1, display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
            gap: 8,
          }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                border: `1.5px dashed ${PAD_INK}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'ui-monospace, monospace', fontSize: 10, opacity: 0.3,
              }}>{String(i + 1).padStart(2, '0')}</div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </PadStudioChrome>
  );
}

// ─── State 2: TUNE (generating) ───
function PadOnboardingTune() {
  const [phase, setPhase] = React.useState(0); // 0..6 — drives the "discovered tag" feed
  React.useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 7), 900);
    return () => clearInterval(id);
  }, []);

  const tags = ['DETROIT', 'WAREHOUSE', '4AM', 'RAIN', 'CONCRETE', 'MID‑TEMPO', '124 BPM'];
  const padLabels = ['KIK', 'SNR', 'HAT', 'OPN', 'CLP', 'TOM', 'RIM', 'CYM',
                     'SUB', 'BUZ', 'VOX', 'FX1', 'ARP', 'STB', 'CHD', 'END'];

  return (
    <PadStudioChrome step={1}>
      <div data-screen-label="Onboard · Tune" style={{
        width: '100%', height: '100%',
        display: 'grid', gridTemplateColumns: '380px 1fr',
      }}>
        {/* Left — what we heard */}
        <div style={{
          borderRight: `2px solid ${PAD_INK}`, padding: '40px 32px',
          display: 'flex', flexDirection: 'column', gap: 22,
        }}>
          <span style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.6,
            color: PAD_RED, fontWeight: 700,
          }}>02 · TUNING IN PROGRESS</span>

          <div style={{
            background: '#fff', border: `2px solid ${PAD_INK}`,
            padding: 16, boxShadow: `4px 4px 0 0 ${PAD_INK}`,
          }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 1.4, opacity: 0.55 }}>
              YOUR PROMPT
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 16, fontWeight: 600, lineHeight: 1.35 }}>
              "rainy detroit warehouse at 4am"
            </p>
          </div>

          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55, marginBottom: 10 }}>
              ─── HEARD ───
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.map((t, i) => {
                const heard = i <= phase;
                return (
                  <span key={t} style={{
                    padding: '6px 10px',
                    background: heard ? PAD_INK : 'transparent',
                    color: heard ? PAD_CREAM : `${PAD_INK}55`,
                    border: `1.5px solid ${heard ? PAD_INK : `${PAD_INK}33`}`,
                    fontFamily: 'ui-monospace, monospace', fontSize: 11, fontWeight: 700,
                    letterSpacing: 1, transition: 'all 200ms',
                  }}>{t}</span>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55, marginBottom: 6 }}>
              TUNING {(((phase + 1) / 7) * 100).toFixed(0).padStart(2, '0')}%
            </div>
            <div style={{ height: 8, background: '#fff', border: `1.5px solid ${PAD_INK}` }}>
              <div style={{
                width: `${((phase + 1) / 7) * 100}%`, height: '100%',
                background: PAD_RED, transition: 'width 600ms',
              }} />
            </div>
          </div>
        </div>

        {/* Right — pad grid with tuning sweep */}
        <div style={{
          padding: 32, position: 'relative',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {padLabels.map((l, i) => {
            const row = Math.floor(i / 4);
            const lit = row <= phase % 4;
            const flashing = row === phase % 4;
            return (
              <div key={i} style={{
                position: 'relative', overflow: 'hidden',
                border: `2px solid ${PAD_INK}`,
                background: flashing ? PAD_INK : (lit ? '#fff' : PAD_CREAM),
                color: flashing ? PAD_CREAM : PAD_INK,
                padding: 14,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                fontFamily: 'inherit',
                boxShadow: flashing ? 'none' : `4px 4px 0 0 ${PAD_INK}`,
                transform: flashing ? 'translate(2px, 2px)' : 'none',
                transition: 'all 180ms',
              }}>
                <span style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 1.4,
                  opacity: flashing ? 0.7 : (lit ? 0.6 : 0.3),
                }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{
                  fontSize: 28, fontWeight: 900, letterSpacing: -1, lineHeight: 1,
                  opacity: lit ? 1 : 0.25,
                }}>{l}</span>
                {flashing && (
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'repeating-linear-gradient(90deg, transparent 0 4px, rgba(255,59,31,0.6) 4px 5px)',
                    animation: 'tuneSweep 900ms linear',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes tuneSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </PadStudioChrome>
  );
}

// ─── State 3: READY (handoff) ───
function PadOnboardingReady() {
  const padLabels = ['KIK', 'SNR', 'HAT', 'OPN', 'CLP', 'TOM', 'RIM', 'CYM',
                     'SUB', 'BUZ', 'VOX', 'FX1', 'ARP', 'STB', 'CHD', 'END'];
  return (
    <PadStudioChrome step={2}>
      <div data-screen-label="Onboard · Ready" style={{
        width: '100%', height: '100%', position: 'relative',
        display: 'grid', gridTemplateColumns: '1fr 360px',
      }}>
        {/* Pad grid (live) */}
        <div style={{
          padding: 28,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {padLabels.map((l, i) => (
            <div key={i} style={{
              position: 'relative',
              border: `2px solid ${PAD_INK}`,
              background: PAD_CREAM, color: PAD_INK,
              padding: 14,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: `4px 4px 0 0 ${PAD_INK}`,
            }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 1.4, opacity: 0.6 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>{l}</span>
            </div>
          ))}

          {/* "Try this pad" arrow callout pointing at pad #1 */}
          <div style={{
            position: 'absolute', left: 84, top: 88,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            pointerEvents: 'none', animation: 'bobUpDown 1.6s ease-in-out infinite alternate',
          }}>
            <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
              <path d="M 70 50 Q 30 40 20 8" stroke={PAD_RED} strokeWidth="2.5" fill="none" />
              <path d="M 16 4 L 20 8 L 26 6" stroke={PAD_RED} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
            <span style={{
              marginLeft: 24, marginTop: -4, padding: '8px 12px',
              background: PAD_RED, color: PAD_CREAM,
              fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.2, fontWeight: 700,
              boxShadow: `3px 3px 0 0 ${PAD_INK}`, transform: 'rotate(-3deg)',
            }}>HIT IT ↑</span>
          </div>
        </div>

        {/* Right rail — your kit */}
        <div style={{
          borderLeft: `2px solid ${PAD_INK}`, padding: '32px 28px',
          display: 'flex', flexDirection: 'column', gap: 22,
        }}>
          <span style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.6,
            color: PAD_RED, fontWeight: 700,
          }}>03 · YOUR KIT IS READY</span>

          <h2 style={{
            margin: 0, fontWeight: 900, fontSize: 46, letterSpacing: -1.5, lineHeight: 0.95,
            textWrap: 'balance',
          }}>
            "Rainy Detroit Warehouse"
          </h2>

          <div style={{
            background: '#fff', border: `2px solid ${PAD_INK}`, padding: 14,
            display: 'flex', flexDirection: 'column', gap: 4,
            fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 0.8,
          }}>
            <Row k="KEY" v="A MINOR" />
            <Row k="TEMPO" v="124 BPM" />
            <Row k="MOOD" v="MID·DARK·SPACIOUS" />
            <Row k="CHARACTER" v="WET · LOFI" />
            <Row k="REFERENCE" v="UR · DRUMCODE" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{
              padding: '14px 18px', background: PAD_RED, color: PAD_CREAM, border: `2px solid ${PAD_INK}`,
              fontWeight: 900, fontSize: 15, letterSpacing: -0.2, cursor: 'pointer',
              boxShadow: `4px 4px 0 0 ${PAD_INK}`, borderRadius: 0, textAlign: 'left',
            }}>▶ START PLAYING</button>
            <button style={btnGhost}>↻ RETUNE WITH NEW PROMPT</button>
            <button style={btnGhost}>♡ SAVE TO LIBRARY</button>
          </div>

          <div style={{
            marginTop: 'auto', fontFamily: 'ui-monospace, monospace',
            fontSize: 10, letterSpacing: 1.4, opacity: 0.55, lineHeight: 1.6,
          }}>
            TIP: HOLD A PAD TO LOOP IT.<br />
            HIT SPACE TO ARM/DISARM RECORDING.
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bobUpDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
      `}</style>
    </PadStudioChrome>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ opacity: 0.55 }}>{k}</span>
      <span style={{ fontWeight: 700 }}>{v}</span>
    </div>
  );
}

Object.assign(window, { PadOnboardingPrompt, PadOnboardingTune, PadOnboardingReady });
