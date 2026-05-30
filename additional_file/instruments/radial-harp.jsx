// Direction 2 — HARP (unified PAD design system)
// Radial harp on cream chassis. Ink strings on cream. Red plucks.

function RadialHarp({ prompt: initialPrompt }) {
  const cream = '#efece4';
  const ink = '#0a0a0a';
  const red = '#ff3b1f';

  const [prompt, setPrompt] = React.useState(initialPrompt || 'sunset on a quiet lake, slow, in A minor');
  const [pings, setPings] = React.useState([]);
  const pingIdRef = React.useRef(0);
  const [resonance, setResonance] = React.useState(0);

  const RINGS = 5;
  const SEGS = 24;
  const cx = 320, cy = 320, rOuter = 270, rInner = 70;

  const ping = (ring, seg) => {
    const id = ++pingIdRef.current;
    setPings((p) => [...p, { id, ring, seg, t: Date.now() }]);
    setTimeout(() => setPings((p) => p.filter((x) => x.id !== id)), 1400);
    setResonance((r) => Math.min(1, r + 0.15));
  };

  useFrame(() => { setResonance((r) => Math.max(0, r - 0.004)); }, []);

  const note = (ring, seg) => {
    const scale = ['A', 'C', 'D', 'E', 'G'];
    return `${scale[seg % scale.length]}${3 + ring}`;
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: cream, color: ink,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
      gridTemplateRows: '60px 1fr 44px',
      position: 'relative',
    }}>
      {/* Top bar (spans both cols) */}
      <div style={{
        gridColumn: '1 / -1',
        borderBottom: `2px solid ${ink}`,
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>HARP/02</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            RADIAL · 120 STRINGS · PENTATONIC
          </span>
        </div>
        <PromptPill value={prompt} onChange={setPrompt} accent={red} />
      </div>

      {/* SVG harp */}
      <div style={{ position: 'relative', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Concentric guide circles */}
        <svg viewBox="0 0 640 640" style={{ width: '100%', maxWidth: 620, height: 'auto' }}>
          {/* Outer ring frame */}
          <circle cx={cx} cy={cy} r={rOuter + 12} fill="none" stroke={ink} strokeWidth="2.5" strokeDasharray="6 6" />

          {Array.from({ length: RINGS }).map((_, ri) => {
            const r = rInner + (rOuter - rInner) * ((ri + 1) / RINGS);
            return <circle key={ri} cx={cx} cy={cy} r={r}
              fill="none" stroke={ink} strokeWidth="0.8" opacity="0.18" />;
          })}

          {/* Strings */}
          {Array.from({ length: SEGS }).map((_, si) => {
            const ang = (si / SEGS) * Math.PI * 2 - Math.PI / 2;
            const dx = Math.cos(ang), dy = Math.sin(ang);
            return Array.from({ length: RINGS }).map((__, ri) => {
              const r1 = rInner + (rOuter - rInner) * (ri / RINGS);
              const r2 = rInner + (rOuter - rInner) * ((ri + 1) / RINGS);
              const x1 = cx + dx * r1, y1 = cy + dy * r1;
              const x2 = cx + dx * r2, y2 = cy + dy * r2;
              const isActive = pings.some((p) => p.ring === ri && p.seg === si);
              return (
                <g key={`${si}-${ri}`}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="transparent" strokeWidth="14"
                    style={{ cursor: 'pointer' }}
                    onPointerDown={() => ping(ri, si)} />
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isActive ? red : ink}
                    strokeWidth={isActive ? 2.5 : 0.8}
                    opacity={isActive ? 1 : 0.35}
                    style={{ pointerEvents: 'none', transition: 'all 80ms' }} />
                </g>
              );
            });
          })}

          {/* Note labels */}
          {['A', 'C', 'D', 'E', 'G'].map((n, i) => {
            const si = i * 5;
            const ang = (si / SEGS) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(ang) * (rOuter + 30);
            const y = cy + Math.sin(ang) * (rOuter + 30);
            return <text key={n} x={x} y={y} fill={ink}
              fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="700" letterSpacing="1.4"
              textAnchor="middle" dominantBaseline="middle">{n}</text>;
          })}

          {/* Hub */}
          <circle cx={cx} cy={cy} r={rInner} fill={cream} stroke={ink} strokeWidth="2" />
          <circle cx={cx} cy={cy} r={20 + resonance * 30} fill={red} opacity={0.7}
            style={{ transition: 'r 120ms' }} />
          <circle cx={cx} cy={cy} r="6" fill={ink} />

          {/* Outgoing ripples */}
          {pings.map((p) => {
            const ang = (p.seg / SEGS) * Math.PI * 2 - Math.PI / 2;
            const r = rInner + (rOuter - rInner) * ((p.ring + 0.5) / RINGS);
            const x = cx + Math.cos(ang) * r;
            const y = cy + Math.sin(ang) * r;
            return (
              <circle key={p.id} cx={x} cy={y} r="0" fill="none"
                stroke={red} strokeWidth="2.5" opacity="0.7"
                style={{ animation: 'harpRipple 1.4s ease-out forwards' }} />
            );
          })}
        </svg>

        {/* Floating note labels */}
        {pings.map((p) => (
          <FloatNote key={p.id} ring={p.ring} seg={p.seg} note={note(p.ring, p.seg)}
            segs={SEGS} rInner={rInner} rOuter={rOuter} rings={RINGS} ink={ink} cream={cream} red={red} />
        ))}
      </div>

      {/* Right rail */}
      <div style={{
        borderLeft: `2px solid ${ink}`, padding: 24,
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        <div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55, marginBottom: 8 }}>
            RESONANCE
          </div>
          <div style={{
            height: 12, background: cream, border: `1.5px solid ${ink}`, overflow: 'hidden',
          }}>
            <div style={{
              width: `${resonance * 100}%`, height: '100%',
              background: red, transition: 'width 120ms',
            }} />
          </div>
          <div style={{
            marginTop: 8, fontFamily: 'ui-monospace, monospace',
            fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: -1,
          }}>{(resonance * 100).toFixed(0).padStart(2, '0')}<span style={{ fontSize: 14, opacity: 0.5 }}>%</span></div>
        </div>

        <div style={{
          border: `2px solid ${ink}`, padding: 14, background: cream,
          boxShadow: `4px 4px 0 0 ${ink}`,
        }}>
          <p style={{
            margin: 0, fontWeight: 900, fontSize: 18, lineHeight: 1.15, letterSpacing: -0.4,
            textWrap: 'balance',
          }}>
            Pluck inward for higher notes.
          </p>
          <p style={{
            margin: '8px 0 0', fontFamily: 'ui-monospace, monospace',
            fontSize: 10, lineHeight: 1.6, letterSpacing: 0.4, opacity: 0.6,
          }}>
            5 RINGS × 24 SEGS<br />
            120 STRINGS · 120 VOICES
          </p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['HOLD', 'SUSTAIN', 'CLEAR'].map((l) => (
            <button key={l} style={{
              padding: '9px 12px', textAlign: 'left',
              background: 'transparent', border: `1.5px solid ${ink}`, color: ink,
              fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
              cursor: 'pointer', borderRadius: 0,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        gridColumn: '1 / -1',
        borderTop: `2px solid ${ink}`,
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
      }}>
        <span>● {pings.length} VOICES RINGING</span>
        <span>OCT 1—5 · A MIN PENTATONIC</span>
        <span>TAP A STRING</span>
      </div>

      <style>{`
        @keyframes harpRipple {
          0%   { r: 4;  opacity: 0.9; stroke-width: 3; }
          100% { r: 90; opacity: 0;   stroke-width: 0.4; }
        }
        @keyframes harpFloat {
          0%   { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(-50%, -160%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function FloatNote({ ring, seg, note, segs, rInner, rOuter, rings, ink, cream, red }) {
  const ang = (seg / segs) * Math.PI * 2 - Math.PI / 2;
  // Need to position relative to the SVG. SVG is centered in its container.
  const r = rInner + (rOuter - rInner) * ((ring + 0.5) / rings);
  const px = Math.cos(ang) * r;
  const py = Math.sin(ang) * r;
  return (
    <div style={{
      position: 'absolute', left: `calc(50% + ${px * 0.65}px)`, top: `calc(50% + ${py * 0.65}px)`,
      transform: 'translate(-50%, -50%)',
      padding: '3px 7px',
      background: red, color: cream,
      fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1, fontWeight: 700,
      border: `1.5px solid ${ink}`,
      pointerEvents: 'none',
      animation: 'harpFloat 1.4s ease-out forwards',
    }}>{note}</div>
  );
}

window.RadialHarp = RadialHarp;
