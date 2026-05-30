// Shared utilities for instrument prototypes
// Naming: keep all exports global on window so other Babel scripts can use them

const NOTES_MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2', 'D2', 'E2', 'F2', 'G2'];
const NOTES_PENT  = ['C', 'D', 'E', 'G', 'A', 'C2', 'D2', 'E2', 'G2', 'A2', 'C3', 'D3'];

// Map a click into a "ripple" — a transient particle entry that other
// components can render however they like.
function useRipples() {
  const [items, setItems] = React.useState([]);
  const idRef = React.useRef(0);
  const add = React.useCallback((x, y, opts = {}) => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, x, y, t: Date.now(), ...opts }]);
    setTimeout(() => setItems((prev) => prev.filter((r) => r.id !== id)), opts.ttl || 1200);
  }, []);
  return [items, add];
}

// Looping animation frame hook. cb receives ms since start.
function useFrame(cb, deps = []) {
  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (now) => {
      cb(now - start);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Prompt pill — sits at the top of every direction. Same component, different
// skin via the `theme` prop. Editable.
function PromptPill({ value, onChange, theme = 'light', accent = '#111' }) {
  const dark = theme === 'dark';
  const wrap = {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '10px 14px 10px 12px',
    borderRadius: 999,
    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
    color: dark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.82)',
    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
    fontSize: 12,
    letterSpacing: 0.2,
    maxWidth: 540,
  };
  const dot = {
    width: 7, height: 7, borderRadius: 999, background: accent,
    boxShadow: `0 0 0 3px ${accent}22`,
    flex: '0 0 auto',
  };
  const ico = { flex: '0 0 auto', opacity: 0.5, fontSize: 10, letterSpacing: 1 };
  const input = {
    flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
    color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit',
  };
  return (
    <div style={wrap}>
      <span style={dot}></span>
      <span style={ico}>PROMPT</span>
      <input
        style={input}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}

// Numeric ticker — used as a "playcount" or "BPM" widget.
function Ticker({ value, label, mono = true, color = 'inherit' }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 2, color }}>
      <span style={{
        fontFamily: mono ? 'ui-monospace, "SF Mono", Menlo, monospace' : 'inherit',
        fontSize: 28, fontWeight: 500, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
      }}>{value}</span>
      <span style={{
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 9, letterSpacing: 1.4, opacity: 0.5, textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  );
}

Object.assign(window, {
  NOTES_MAJOR, NOTES_PENT,
  useRipples, useFrame,
  PromptPill, Ticker,
});
