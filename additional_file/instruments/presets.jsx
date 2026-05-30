// Preset gallery / library — kits you (and others) have saved.

function PadPresets() {
  const cream = '#efece4';
  const ink = '#0a0a0a';
  const red = '#ff3b1f';

  const [tab, setTab] = React.useState('mine');

  const myKits = [
    { name: 'Rainy Detroit Warehouse', prompt: 'rainy detroit warehouse at 4am', bpm: 124, key: 'Am', tone: 'wet · dark', hot: true, hits: 412 },
    { name: 'Kitchen Party', prompt: 'friends in the kitchen, wine, 11pm', bpm: 102, key: 'F#m', tone: 'warm · live', hits: 88 },
    { name: 'Garage Stomper', prompt: 'four kids stomping on a couch', bpm: 168, key: 'E', tone: 'raw · gated', hits: 207 },
    { name: 'Tape Lullaby', prompt: 'mom\'s old cassette, half speed', bpm: 64, key: 'C', tone: 'fuzzy · slow', hits: 23 },
    { name: 'Mechanic\'s Loop', prompt: 'mechanic shop closing time', bpm: 108, key: 'Bm', tone: 'metal · grease', hits: 156 },
    { name: 'Thunder Two Blocks', prompt: 'thunderstorm two blocks over', bpm: 92, key: 'D', tone: 'dub · wide', hits: 64 },
  ];

  const trending = [
    { name: 'Pixel Arcade', prompt: '80s arcade after hours', bpm: 140, key: 'A', author: 'lunchbreak', hits: 12400 },
    { name: 'Wet Sidewalk', prompt: 'walking home in november', bpm: 88, key: 'Em', author: 'nilfm', hits: 8902 },
    { name: 'Bonfire C', prompt: 'bonfire, one guitar', bpm: 76, key: 'C', author: 'palebro', hits: 7301 },
    { name: 'Subway Buzz', prompt: 'late train, broken headphones', bpm: 130, key: 'G', author: 'tinroof', hits: 6210 },
    { name: 'Cat & Bag', prompt: 'cat investigating a paper bag', bpm: 142, key: 'F', author: 'noons', hits: 4980 },
    { name: 'Sunday Brushes', prompt: 'sunday morning coffee, slow brushes', bpm: 78, key: 'Bb', author: 'janekv', hits: 4112 },
  ];

  const kits = tab === 'mine' ? myKits : trending;

  return (
    <div data-screen-label="Library" style={{
      width: '100%', height: '100%', background: cream, color: ink,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      display: 'grid', gridTemplateRows: '64px 1fr',
      overflow: 'hidden',
    }}>
      {/* Top */}
      <div style={{
        borderBottom: `2px solid ${ink}`,
        padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>LIBRARY</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            6 SAVED KITS · 1 SHARED
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', border: `1.5px solid ${ink}`,
          }}>
            {['mine', 'trending'].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '7px 14px',
                background: tab === t ? ink : 'transparent',
                color: tab === t ? cream : ink,
                border: 'none', borderRight: t === 'mine' ? `1.5px solid ${ink}` : 'none',
                fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
                cursor: 'pointer',
              }}>{t === 'mine' ? 'MINE · 06' : 'TRENDING · 248'}</button>
            ))}
          </div>
          <input placeholder="search prompts…"
            style={{
              padding: '8px 12px',
              border: `1.5px solid ${ink}`, background: cream,
              fontFamily: 'ui-monospace, monospace', fontSize: 11, color: ink,
              width: 220, outline: 'none', borderRadius: 0,
            }} />
          <button style={{
            padding: '8px 14px', background: ink, color: cream, border: 'none',
            fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
            cursor: 'pointer', boxShadow: `4px 4px 0 0 ${red}`, borderRadius: 0,
          }}>+ NEW KIT</button>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        padding: 28, overflow: 'auto',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18,
        alignContent: 'start',
      }}>
        {kits.map((k, i) => (
          <KitCard key={k.name} kit={k} tab={tab} featured={i === 0 && tab === 'mine'} cream={cream} ink={ink} red={red} />
        ))}
      </div>
    </div>
  );
}

function KitCard({ kit, tab, featured, cream, ink, red }) {
  // Each card shows a tiny 4x4 pad preview, the prompt, and meta.
  // Pre-seeded pad activations from the kit name (deterministic by hash).
  const hash = React.useMemo(() => {
    let h = 0;
    for (const c of kit.name) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
    return Math.abs(h);
  }, [kit.name]);
  const onPads = React.useMemo(() => {
    const out = new Set();
    let h = hash;
    while (out.size < 5) { out.add(h % 16); h = Math.imul(h, 1103515245) + 12345; }
    return out;
  }, [hash]);

  return (
    <div style={{
      background: featured ? ink : cream,
      color: featured ? cream : ink,
      border: `2px solid ${ink}`,
      boxShadow: featured ? `8px 8px 0 0 ${red}` : `4px 4px 0 0 ${ink}`,
      display: 'flex', flexDirection: 'column',
      cursor: 'pointer',
    }}>
      {/* Mini pad grid preview */}
      <div style={{
        padding: 14, borderBottom: `1.5px solid ${featured ? `${cream}33` : ink}`,
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
          aspectRatio: '4/3',
        }}>
          {Array.from({ length: 16 }).map((_, i) => {
            const on = onPads.has(i);
            return (
              <div key={i} style={{
                border: `1.5px solid ${featured ? cream : ink}`,
                background: on ? (featured ? red : ink) : 'transparent',
              }} />
            );
          })}
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{
            margin: 0, fontWeight: 900, fontSize: 22, letterSpacing: -0.5, lineHeight: 1.05,
            textWrap: 'balance', flex: 1, minWidth: 0,
          }}>{kit.name}</h3>
          {kit.hot && (
            <span style={{
              flex: '0 0 auto', marginLeft: 8,
              padding: '3px 7px', background: red, color: cream,
              fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: 1.4, fontWeight: 700,
            }}>HOT</span>
          )}
        </div>
        <p style={{
          margin: 0, fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: 0.3,
          opacity: featured ? 0.7 : 0.6, lineHeight: 1.4,
        }}>"{kit.prompt}"</p>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 4,
          fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: 1.2,
        }}>
          <span style={{ opacity: 0.6 }}>{kit.bpm} BPM · {kit.key}</span>
          <span style={{ opacity: 0.45 }}>
            {tab === 'mine' ? `${kit.hits} hits` : `@${kit.author} · ${(kit.hits / 1000).toFixed(1)}k`}
          </span>
        </div>
      </div>
    </div>
  );
}

window.PadPresets = PadPresets;
