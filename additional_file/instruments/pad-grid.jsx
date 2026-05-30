// Direction 1 — PAD
// Brutalist 4x4 drum pad grid. Mono, bold, high contrast on cream.
// Click pads → flash + ripple. Big numeric BPM. Manifesto rail to the side.

function PadGrid({ prompt: initialPrompt }) {
  const [prompt, setPrompt] = React.useState(initialPrompt || 'tense warehouse, 124bpm, midnight');
  const [active, setActive] = React.useState({}); // pad index -> timestamp
  const [bpm, setBpm] = React.useState(124);
  const [count, setCount] = React.useState(0);
  const [bar, setBar] = React.useState(0);

  // Beat clock — drives the under-bar metronome marker.
  React.useEffect(() => {
    const ms = 60000 / bpm;
    const id = setInterval(() => setBar((b) => (b + 1) % 16), ms / 4);
    return () => clearInterval(id);
  }, [bpm]);

  const labels = [
    ['KIK', '01'], ['SNR', '02'], ['HAT', '03'], ['OPN', '04'],
    ['CLP', '05'], ['TOM', '06'], ['RIM', '07'], ['CYM', '08'],
    ['SUB', '09'], ['BUZ', '10'], ['VOX', '11'], ['FX1', '12'],
    ['ARP', '13'], ['STB', '14'], ['CHD', '15'], ['END', '16'],
  ];

  const hit = (i) => {
    setActive((m) => ({ ...m, [i]: Date.now() }));
    setCount((c) => c + 1);
    setTimeout(() => setActive((m) => { const n = { ...m }; delete n[i]; return n; }), 380);
  };

  const cream = '#efece4';
  const ink = '#0a0a0a';

  return (
    <div style={{
      width: '100%', height: '100%', background: cream, color: ink,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gridTemplateRows: '64px 1fr 56px',
      gap: 0,
    }}>
      {/* Top bar spans both cols */}
      <div style={{
        gridColumn: '1 / -1',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: `2px solid ${ink}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>PAD/01</span>
          <span style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            PERCUSSIVE · 16 VOICE · MONO
          </span>
        </div>
        <PromptPill value={prompt} onChange={setPrompt} accent="#ff3b1f" />
      </div>

      {/* Left rail */}
      <div style={{
        borderRight: `2px solid ${ink}`,
        padding: '28px 24px',
        display: 'flex', flexDirection: 'column', gap: 28,
      }}>
        <div>
          <div style={{ fontSize: 92, fontWeight: 900, letterSpacing: -3, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>
            {bpm}
          </div>
          <div style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 10, letterSpacing: 1.6, marginTop: 4 }}>
            BPM · 4/4
          </div>
        </div>

        {/* BPM nudge */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[-4, -1, +1, +4].map((d) => (
            <button key={d} onClick={() => setBpm((b) => Math.max(40, Math.min(240, b + d)))}
              style={{
                flex: 1, padding: '8px 0', background: 'transparent',
                border: `1.5px solid ${ink}`, color: ink, fontWeight: 700,
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 12,
                cursor: 'pointer', borderRadius: 0,
              }}>
              {d > 0 ? `+${d}` : d}
            </button>
          ))}
        </div>

        {/* Manifesto */}
        <div style={{ marginTop: 'auto', borderTop: `2px solid ${ink}`, paddingTop: 20 }}>
          <p style={{
            margin: 0, fontWeight: 900, fontSize: 30, lineHeight: 0.95, letterSpacing: -0.8,
            textTransform: 'uppercase', textWrap: 'balance',
          }}>
            Type a vibe.<br />Hit a pad.<br />That's it.
          </p>
          <p style={{
            margin: '14px 0 0', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 10, lineHeight: 1.6, letterSpacing: 0.6, opacity: 0.65,
          }}>
            The prompt re-tunes every voice. Same pads, infinite kits.
          </p>
        </div>

        <Ticker value={String(count).padStart(4, '0')} label="HITS" color={ink} />
      </div>

      {/* Pad grid */}
      <div style={{
        position: 'relative',
        padding: 28,
        background: cream,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: 14,
      }}>
        {labels.map(([lab, num], i) => {
          const on = !!active[i];
          return (
            <button key={i} onPointerDown={() => hit(i)}
              style={{
                position: 'relative', overflow: 'hidden',
                border: `2px solid ${ink}`,
                background: on ? ink : cream,
                color: on ? cream : ink,
                cursor: 'pointer', padding: 18,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                alignItems: 'flex-start', textAlign: 'left',
                transform: on ? 'translate(2px, 2px)' : 'translate(0,0)',
                transition: 'transform 80ms, background 80ms, color 80ms',
                fontFamily: 'inherit',
                boxShadow: on ? 'none' : `4px 4px 0 0 ${ink}`,
                borderRadius: 0,
              }}>
              <span style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 10, letterSpacing: 1.4, opacity: 0.6,
              }}>{num}</span>
              <span style={{
                fontSize: 38, fontWeight: 900, letterSpacing: -1, lineHeight: 1,
              }}>{lab}</span>
              {on && <PadRipple color={cream} />}
            </button>
          );
        })}
      </div>

      {/* Bottom transport */}
      <div style={{
        gridColumn: '1 / -1',
        borderTop: `2px solid ${ink}`,
        display: 'flex', alignItems: 'center', gap: 0,
      }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '100%',
            borderRight: i < 15 ? `1px solid ${ink}22` : 'none',
            background: bar === i ? ink : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 10, letterSpacing: 1,
            color: bar === i ? cream : `${ink}66`,
            transition: 'background 60ms',
          }}>{String(i + 1).padStart(2, '0')}</div>
        ))}
      </div>
    </div>
  );
}

function PadRipple({ color }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `radial-gradient(circle at 50% 50%, ${color}33 0%, transparent 60%)`,
      animation: 'padRipple 380ms ease-out forwards',
    }}>
      <style>{`@keyframes padRipple { 0%{opacity:1;transform:scale(0.4)} 100%{opacity:0;transform:scale(1.4)} }`}</style>
    </div>
  );
}

window.PadGrid = PadGrid;
