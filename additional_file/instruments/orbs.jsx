// Direction 5 — BLOOM (unified PAD design system)
// Orbs become ink discs with red halos on cream. Same interaction, brutalist clothing.

function BloomOrbs({ prompt: initialPrompt }) {
  const cream = '#efece4';
  const ink = '#0a0a0a';
  const red = '#ff3b1f';

  const [prompt, setPrompt] = React.useState(initialPrompt || 'morning fog, deep breath, two notes a perfect fifth apart');
  const [touched, setTouched] = React.useState({});
  const [chords, setChords] = React.useState([]);
  const chordId = React.useRef(0);

  const orbs = React.useMemo(() => [
    { id: 1, x: 18, y: 32, r: 64,  note: 'C' },
    { id: 2, x: 34, y: 64, r: 44,  note: 'E' },
    { id: 3, x: 48, y: 30, r: 84,  note: 'G' },
    { id: 4, x: 62, y: 58, r: 52,  note: 'B' },
    { id: 5, x: 76, y: 34, r: 72,  note: 'D' },
    { id: 6, x: 88, y: 66, r: 40,  note: 'F#' },
    { id: 7, x: 22, y: 80, r: 36,  note: 'A' },
    { id: 8, x: 58, y: 82, r: 50,  note: 'C+' },
  ], []);

  const tap = (orb) => {
    setTouched((m) => ({ ...m, [orb.id]: Date.now() }));
    setTimeout(() => setTouched((m) => { const n = { ...m }; delete n[orb.id]; return n; }), 1600);
    const id = ++chordId.current;
    setChords((c) => [...c, { id, x: orb.x, y: orb.y, note: orb.note }]);
    setTimeout(() => setChords((c) => c.filter((x) => x.id !== id)), 1800);
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: cream, color: ink,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      display: 'grid',
      gridTemplateRows: '60px 1fr 60px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top */}
      <div style={{
        borderBottom: `2px solid ${ink}`, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 3, background: cream,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>BLOOM/05</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            AMBIENT · 8 VOICES · BREATHING
          </span>
        </div>
        <PromptPill value={prompt} onChange={setPrompt} accent={red} />
      </div>

      {/* Field */}
      <div style={{ position: 'relative' }}>
        {/* Dotted backdrop */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${ink}22 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, #000 50%, transparent 90%)',
          pointerEvents: 'none',
        }} />

        {/* Connecting threads */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {Object.keys(touched).map((aId, ai, arr) => arr.slice(ai + 1).map((bId) => {
            const a = orbs.find((o) => o.id === +aId);
            const b = orbs.find((o) => o.id === +bId);
            if (!a || !b) return null;
            return <line key={`${aId}-${bId}`}
              x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
              stroke={red} strokeWidth="2" strokeDasharray="4 5" />;
          }))}
        </svg>

        {/* Orbs */}
        {orbs.map((orb) => {
          const isTouched = !!touched[orb.id];
          const delay = (orb.id * 0.7) % 3;
          return (
            <div key={orb.id}
              onPointerDown={() => tap(orb)}
              style={{
                position: 'absolute',
                left: `${orb.x}%`, top: `${orb.y}%`,
                width: orb.r * 2, height: orb.r * 2,
                marginLeft: -orb.r, marginTop: -orb.r,
                cursor: 'pointer',
                animation: `bloomFloat 6s ease-in-out ${delay}s infinite alternate`,
              }}>
              {/* Disc */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                background: isTouched ? red : ink,
                border: `2.5px solid ${ink}`,
                boxShadow: isTouched ? `4px 4px 0 0 ${ink}` : `4px 4px 0 0 ${red}`,
                transform: isTouched ? 'translate(2px, 2px)' : 'none',
                transition: 'all 220ms cubic-bezier(.5,1.6,.4,1)',
              }} />
              {/* Ripples */}
              {isTouched && (
                <>
                  <div style={{
                    position: 'absolute', inset: -6, borderRadius: '50%',
                    border: `2px solid ${ink}`,
                    animation: 'bloomRipple 1.4s ease-out forwards',
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    position: 'absolute', inset: -6, borderRadius: '50%',
                    border: `2px solid ${red}`,
                    animation: 'bloomRipple 1.4s ease-out 0.25s forwards',
                    pointerEvents: 'none',
                  }} />
                </>
              )}
              {/* Note label */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontSize: orb.r > 60 ? 28 : 20,
                fontWeight: 900, letterSpacing: -0.5,
                color: cream,
                pointerEvents: 'none',
              }}>{orb.note}</div>
            </div>
          );
        })}

        {/* Floating chord labels */}
        {chords.map((c) => (
          <div key={c.id} style={{
            position: 'absolute', left: `${c.x}%`, top: `${c.y}%`,
            transform: 'translate(-50%, -50%)',
            padding: '5px 10px',
            background: red, color: cream,
            border: `2px solid ${ink}`,
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11, fontWeight: 700, letterSpacing: 1,
            boxShadow: `3px 3px 0 0 ${ink}`,
            animation: 'bloomNote 1.8s ease-out forwards',
            pointerEvents: 'none',
            borderRadius: 0,
          }}>♪ {c.note}</div>
        ))}

        {/* Currently-ringing card */}
        <div style={{
          position: 'absolute', bottom: 16, right: 20,
          padding: '10px 14px',
          background: cream, color: ink, border: `2px solid ${ink}`,
          boxShadow: `4px 4px 0 0 ${ink}`,
          maxWidth: 260, textAlign: 'right',
        }}>
          <div style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 1.6,
            opacity: 0.55, fontWeight: 700,
          }}>CURRENTLY</div>
          <div style={{ fontSize: 14, fontWeight: 900, marginTop: 2, letterSpacing: -0.3, textWrap: 'balance' }}>
            {Object.keys(touched).length === 0
              ? 'Quiet. Tap a bloom.'
              : `${Object.keys(touched).length} bloom${Object.keys(touched).length > 1 ? 's' : ''} ringing.`}
          </div>
        </div>

        {/* Controls */}
        <div style={{
          position: 'absolute', bottom: 16, left: 20,
          display: 'flex', gap: 6,
        }}>
          {['BREATHE', 'HOLD', 'CLEAR'].map((l) => (
            <button key={l} style={{
              padding: '8px 12px',
              background: cream, color: ink, border: `1.5px solid ${ink}`,
              fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, fontWeight: 700,
              cursor: 'pointer', borderRadius: 0,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `2px solid ${ink}`, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
        background: cream,
      }}>
        <span>◐ MOON MODE</span>
        <span>{Object.keys(touched).length} VOICES · {chords.length} BLOOMING</span>
        <span>TAP A BLOOM</span>
      </div>

      <style>{`
        @keyframes bloomFloat {
          0%   { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }
        @keyframes bloomRipple {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes bloomNote {
          0%   { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
          15%  { transform: translate(-50%, -130%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -260%) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

window.BloomOrbs = BloomOrbs;
