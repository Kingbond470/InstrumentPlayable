// Direction 4 — FIELD (unified PAD design system)
// Hardware-inspired: cream chassis, ink + red. LED display, knobs, mini keyboard.

function HardwareField({ prompt: initialPrompt }) {
  const cream = '#efece4';
  const ink = '#0a0a0a';
  const red = '#ff3b1f';

  const [prompt, setPrompt] = React.useState(initialPrompt || 'cozy bedroom synth, mellow Rhodes pad');
  const [lastNote, setLastNote] = React.useState('—');
  const [active, setActive] = React.useState({});
  const [knobs, setKnobs] = React.useState({ shape: 30, cutoff: 75, mix: 50 });
  const [voiceIdx, setVoiceIdx] = React.useState(2);
  const voices = ['SAW.01', 'SQR.02', 'RHODES', 'BELL.A', 'PAD.AM'];
  const [pulses, setPulses] = React.useState([]);
  const pulseId = React.useRef(0);

  const whites = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackPattern = [true, true, false, true, true, true, false];

  const playKey = (idx, label) => {
    setActive((m) => ({ ...m, [idx]: Date.now() }));
    setLastNote(label);
    setTimeout(() => setActive((m) => { const n = { ...m }; delete n[idx]; return n; }), 220);
    const id = ++pulseId.current;
    setPulses((p) => [...p, { id, h: 8 + Math.random() * 60 }]);
    setTimeout(() => setPulses((p) => p.filter((x) => x.id !== id)), 700);
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: cream, color: ink,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      display: 'grid',
      gridTemplateRows: '60px 1fr auto 44px',
    }}>
      {/* Top */}
      <div style={{
        borderBottom: `2px solid ${ink}`, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>FIELD/04</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            POCKET INSTRUMENT · 5 VOICES · C MAJOR
          </span>
        </div>
        <PromptPill value={prompt} onChange={setPrompt} accent={red} />
      </div>

      {/* Modules row */}
      <div style={{
        padding: 20,
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 16,
        minHeight: 0,
      }}>
        {/* LED display + visualizer */}
        <div style={{
          border: `2px solid ${ink}`, padding: 16,
          boxShadow: `4px 4px 0 0 ${ink}`, background: cream,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, fontWeight: 700, opacity: 0.55 }}>MAIN OUT</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, fontWeight: 700, opacity: 0.55 }}>
              VOICE {String(voiceIdx + 1).padStart(2, '0')}/05
            </span>
          </div>

          {/* LED display (inverted: ink bg, red text) */}
          <div style={{
            background: ink, color: red,
            padding: '14px 18px',
            fontFamily: 'ui-monospace, monospace',
            position: 'relative', overflow: 'hidden',
            border: `2px solid ${ink}`,
          }}>
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 3px)',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.7, letterSpacing: 2, marginBottom: 6 }}>
              <span>NOTE</span><span>VEL</span><span>OCT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 52, lineHeight: 1, fontWeight: 700, letterSpacing: 1 }}>{lastNote}</span>
              <span style={{ fontSize: 32, lineHeight: 1 }}>127</span>
              <span style={{ fontSize: 32, lineHeight: 1 }}>+0</span>
            </div>
            <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: 2, marginTop: 6 }}>
              {voices[voiceIdx]} · CUT {knobs.cutoff.toString().padStart(2, '0')} · SHP {knobs.shape.toString().padStart(2, '0')}
            </div>
          </div>

          {/* Visualizer bars */}
          <div style={{
            border: `1.5px solid ${ink}`,
            padding: 10,
            height: 56,
            display: 'flex', alignItems: 'flex-end', gap: 3,
          }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const live = pulses.length > 0 ? Math.abs(Math.sin(Date.now() * 0.01 + i * 0.4)) * 22 : 0;
              const base = 3 + Math.abs(Math.sin(i * 0.6)) * 6;
              const h = Math.max(2, base + live);
              return (
                <div key={i} style={{
                  flex: 1, height: `${Math.min(h, 32)}px`,
                  background: pulses.length > 0 ? red : ink,
                  opacity: pulses.length > 0 ? 1 : 0.35,
                  transition: 'height 80ms, opacity 100ms',
                }} />
              );
            })}
          </div>

          {/* Voice selector */}
          <div style={{ display: 'flex', gap: 4 }}>
            {voices.map((v, i) => (
              <button key={v} onClick={() => setVoiceIdx(i)} style={{
                flex: 1, padding: '8px 0',
                background: voiceIdx === i ? ink : cream,
                color: voiceIdx === i ? cream : ink,
                border: `1.5px solid ${ink}`, borderRadius: 0,
                fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.2, fontWeight: 700,
                cursor: 'pointer',
              }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Knobs */}
        <div style={{
          border: `2px solid ${ink}`, padding: 16,
          boxShadow: `4px 4px 0 0 ${ink}`, background: cream,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, fontWeight: 700, opacity: 0.55 }}>SHAPE</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, fontWeight: 700, opacity: 0.55 }}>MOTION</span>
          </div>

          <div style={{
            flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            alignContent: 'center',
          }}>
            <Knob label="SHAPE" value={knobs.shape} accent={red} ink={ink} cream={cream}
              onChange={(v) => setKnobs((k) => ({ ...k, shape: v }))} />
            <Knob label="CUTOFF" value={knobs.cutoff} accent={red} ink={ink} cream={cream}
              onChange={(v) => setKnobs((k) => ({ ...k, cutoff: v }))} />
            <Knob label="MIX" value={knobs.mix} accent={red} ink={ink} cream={cream}
              onChange={(v) => setKnobs((k) => ({ ...k, mix: v }))} />
          </div>

          {/* Function row */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['ARP', 'HOLD', 'OCT-', 'OCT+', 'REC'].map((f) => (
              <button key={f} style={{
                flex: 1, padding: '8px 0',
                background: f === 'REC' ? red : cream,
                color: f === 'REC' ? cream : ink,
                border: `1.5px solid ${ink}`,
                fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.2, fontWeight: 700,
                cursor: 'pointer', borderRadius: 0,
              }}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div style={{
        margin: '0 20px 16px', padding: 14,
        border: `2px solid ${ink}`,
        boxShadow: `4px 4px 0 0 ${ink}`,
        height: 150,
        position: 'relative', background: cream,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, fontWeight: 700, opacity: 0.55 }}>KEYS · C3 — C5</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, fontWeight: 700, opacity: 0.55 }}>TAP TO PLAY</span>
        </div>

        <div style={{ position: 'relative', height: 'calc(100% - 22px)' }}>
          <div style={{ display: 'flex', height: '100%', gap: 3 }}>
            {whites.map((n, i) => {
              const on = !!active[i];
              const label = `${n}${i < 7 ? 3 : 4}`;
              return (
                <button key={i} onPointerDown={() => playKey(i, label)} style={{
                  flex: 1,
                  background: on ? red : cream,
                  color: on ? cream : ink,
                  border: `1.5px solid ${ink}`, borderRadius: 0,
                  cursor: 'pointer', position: 'relative',
                  boxShadow: on ? 'none' : `2px 2px 0 0 ${ink}`,
                  transform: on ? 'translate(1px, 1px)' : 'none',
                  transition: 'all 60ms',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  paddingBottom: 6,
                  fontFamily: 'ui-monospace, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 1,
                }}>{label}</button>
              );
            })}
          </div>

          {/* Black keys */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%', pointerEvents: 'none' }}>
            <div style={{ display: 'flex', height: '100%', gap: 3 }}>
              {whites.map((_, i) => {
                const has = blackPattern[i % 7];
                return (
                  <div key={i} style={{ flex: 1, position: 'relative' }}>
                    {has && (() => {
                      const bIdx = 100 + i;
                      const on = !!active[bIdx];
                      const sharps = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
                      const label = `${sharps[i % 7]}${i < 7 ? 3 : 4}`;
                      return (
                        <button onPointerDown={(e) => { e.stopPropagation(); playKey(bIdx, label); }} style={{
                          position: 'absolute', right: -11, top: 0, width: 22, height: '100%',
                          background: on ? red : ink, color: cream,
                          border: `1.5px solid ${ink}`, borderRadius: 0,
                          cursor: 'pointer', pointerEvents: 'auto',
                          boxShadow: on ? 'none' : `2px 2px 0 0 ${ink}`,
                          transform: on ? 'translate(1px, 1px)' : 'none',
                          transition: 'all 60ms',
                          zIndex: 2,
                        }} />
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer status */}
      <div style={{
        borderTop: `2px solid ${ink}`, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
      }}>
        <span>● POLYPHONY 8</span>
        <span>LAST · {lastNote}</span>
        <span>TAP A KEY</span>
      </div>
    </div>
  );
}

function Knob({ label, value, accent, ink, cream, onChange }) {
  const startRef = React.useRef(null);
  const angle = -135 + (value / 100) * 270;
  const onDown = (e) => {
    startRef.current = { y: e.clientY, v: value };
    const move = (ev) => {
      if (!startRef.current) return;
      const dy = startRef.current.y - ev.clientY;
      onChange(Math.max(0, Math.min(100, startRef.current.v + dy * 0.6)));
    };
    const up = () => {
      startRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div onPointerDown={onDown} style={{
        width: 78, height: 78, borderRadius: '50%',
        background: cream, border: `2px solid ${ink}`,
        position: 'relative', cursor: 'grab',
        boxShadow: `3px 3px 0 0 ${ink}`,
        userSelect: 'none',
      }}>
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 1, height: 5,
            background: ink, opacity: 0.4,
            transform: `translate(-50%, -50%) rotate(${-135 + (i / 10) * 270}deg) translateY(-42px)`,
          }} />
        ))}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 3, height: 30, marginLeft: -1.5, marginTop: -28,
          background: accent, borderRadius: 0,
          transformOrigin: '50% 100%',
          transform: `rotate(${angle}deg)`,
          transition: 'transform 60ms',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 14, height: 14, marginLeft: -7, marginTop: -7,
          background: ink, borderRadius: '50%',
        }} />
      </div>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.2,
        color: ink, fontWeight: 700,
      }}>
        {label} · {value.toString().padStart(2, '0')}
      </div>
    </div>
  );
}

window.HardwareField = HardwareField;
