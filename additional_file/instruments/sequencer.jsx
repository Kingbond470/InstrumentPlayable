// Direction 3 — PULSE (unified PAD design system)
// 16-step × 8-track sequencer. Cream chassis, ink + red.

function StepSequencer({ prompt: initialPrompt }) {
  const cream = '#efece4';
  const ink = '#0a0a0a';
  const red = '#ff3b1f';

  const [prompt, setPrompt] = React.useState(initialPrompt || 'detroit techno, 128, hypnotic and dubby');
  const STEPS = 16;
  const TRACKS = ['KICK', 'SNARE', 'CLAP', 'HAT', 'PERC', 'BASS', 'STAB', 'PAD'];

  const initial = React.useMemo(() => [
    '1...1...1...1...',
    '....1.......1...',
    '....1.......1..1',
    '1.1.1.1.1.1.1.1.',
    '..1..1.1..1.1...',
    '1.....1.1.....1.',
    '....1.....11....',
    '1.......1.......',
  ].map((row) => row.split('').map((c) => c === '1')), []);

  const [grid, setGrid] = React.useState(initial);
  const [bpm, setBpm] = React.useState(128);
  const [playing, setPlaying] = React.useState(true);
  const [step, setStep] = React.useState(0);
  const [flashes, setFlashes] = React.useState({});

  React.useEffect(() => {
    if (!playing) return;
    const ms = 60000 / bpm / 4;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS), ms);
    return () => clearInterval(id);
  }, [bpm, playing]);

  React.useEffect(() => {
    const newFlashes = { ...flashes };
    grid.forEach((row, ti) => { if (row[step]) newFlashes[ti] = Date.now(); });
    setFlashes(newFlashes);
    const t = setTimeout(() => {
      setFlashes((f) => {
        const out = {};
        for (const [k, v] of Object.entries(f)) if (Date.now() - v < 200) out[k] = v;
        return out;
      });
    }, 200);
    return () => clearTimeout(t);
  // eslint-disable-next-line
  }, [step]);

  const toggle = (ti, si) => {
    setGrid((g) => g.map((row, i) => i === ti ? row.map((v, j) => j === si ? !v : v) : row));
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: cream, color: ink,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      display: 'grid',
      gridTemplateRows: '60px 1fr 60px',
    }}>
      {/* Top */}
      <div style={{
        borderBottom: `2px solid ${ink}`, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>PULSE/03</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            8 TRACK · 16 STEP · 4 BAR
          </span>
        </div>
        <PromptPill value={prompt} onChange={setPrompt} accent={red} />
      </div>

      {/* Sequencer grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '170px 1fr 60px',
      }}>
        {/* Track names */}
        <div style={{
          borderRight: `2px solid ${ink}`,
          display: 'flex', flexDirection: 'column',
          padding: '14px 0',
        }}>
          {TRACKS.map((t, ti) => {
            const flashing = !!flashes[ti];
            return (
              <div key={t} style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                padding: '0 18px',
                background: flashing ? `${red}22` : 'transparent',
                transition: 'background 80ms',
              }}>
                <div style={{
                  width: 8, height: 8,
                  background: flashing ? red : ink,
                  opacity: flashing ? 1 : 0.25,
                }} />
                <span style={{ fontWeight: 900, fontSize: 15, letterSpacing: -0.3 }}>{t}</span>
              </div>
            );
          })}
        </div>

        {/* Steps */}
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column' }}>
          {grid.map((row, ti) => (
            <div key={ti} style={{
              flex: 1, display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)',
              gap: 4, padding: '3px 0',
            }}>
              {row.map((on, si) => {
                const isPlayhead = step === si;
                const flashing = isPlayhead && on;
                const groupAccent = Math.floor(si / 4) % 2 === 0;
                return (
                  <button key={si} onClick={() => toggle(ti, si)}
                    style={{
                      cursor: 'pointer', border: `1.5px solid ${ink}`,
                      padding: 0, borderRadius: 0,
                      background: on ? (flashing ? red : ink) : (groupAccent ? cream : 'rgba(10,10,10,0.05)'),
                      boxShadow: flashing ? `0 0 0 2.5px ${red}, 3px 3px 0 0 ${ink}` : (on ? `2px 2px 0 0 ${ink}` : 'none'),
                      transition: 'background 60ms, box-shadow 60ms',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Density meters */}
        <div style={{
          borderLeft: `2px solid ${ink}`,
          padding: '14px 0',
          display: 'flex', flexDirection: 'column',
        }}>
          {TRACKS.map((t, ti) => {
            const flashing = !!flashes[ti];
            const density = grid[ti].filter(Boolean).length / 16;
            return (
              <div key={ti} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'ui-monospace, monospace', fontSize: 12, fontWeight: 700,
                color: flashing ? red : ink,
                opacity: flashing ? 1 : 0.5,
                transition: 'all 80ms',
              }}>
                {String(Math.round(density * 99)).padStart(2, '0')}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transport */}
      <div style={{
        borderTop: `2px solid ${ink}`,
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: 18,
      }}>
        <button onClick={() => setPlaying((p) => !p)} style={{
          width: 36, height: 36, padding: 0,
          background: playing ? red : cream, color: playing ? cream : ink,
          border: `2px solid ${ink}`,
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontSize: 14, fontWeight: 900, cursor: 'pointer',
          boxShadow: `3px 3px 0 0 ${ink}`,
          borderRadius: 0,
        }}>{playing ? '■' : '▶'}</button>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 24, fontWeight: 700,
            fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5,
          }}>{bpm}</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55 }}>BPM</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginLeft: 4 }}>
            <button onClick={() => setBpm((b) => Math.min(240, b + 1))} style={tinyBtn(ink, cream)}>+</button>
            <button onClick={() => setBpm((b) => Math.max(40, b - 1))} style={tinyBtn(ink, cream)}>−</button>
          </div>
        </div>

        {/* Step ruler */}
        <div style={{
          flex: 1, height: 28, border: `1.5px solid ${ink}`, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${(step / STEPS) * 100}%`, width: `${100 / STEPS}%`,
            background: red, transition: 'left 60ms linear',
          }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)',
          }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                borderRight: i < 15 ? `1px solid ${ink}33` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'ui-monospace, monospace', fontSize: 10, fontWeight: 700,
                color: i === step ? cream : ink, opacity: i === step ? 1 : 0.4,
              }}>{i + 1}</div>
            ))}
          </div>
        </div>

        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55 }}>
          BAR <span style={{ color: ink, opacity: 1, fontWeight: 700 }}>01</span> / 04
        </span>
      </div>
    </div>
  );
}

const tinyBtn = (ink, cream) => ({
  width: 18, height: 13, padding: 0,
  background: cream, color: ink, border: `1px solid ${ink}`,
  fontFamily: 'ui-monospace, monospace', fontSize: 10, fontWeight: 700,
  cursor: 'pointer', borderRadius: 0,
});

window.StepSequencer = StepSequencer;
