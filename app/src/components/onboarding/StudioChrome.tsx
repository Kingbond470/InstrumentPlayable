import { T } from '@/tokens/design';

const STEPS = ['PROMPT', 'TUNE', 'PLAY'] as const;

interface Props {
  step: 0 | 1 | 2;
  children: React.ReactNode;
}

export default function StudioChrome({ step, children }: Props) {
  return (
    <div style={{
      width: '100%', height: '100%', background: T.cream, color: T.ink,
      fontFamily: T.font,
      display: 'grid',
      gridTemplateRows: '60px 1fr 44px',
    }}>
      {/* Top bar */}
      <div style={{
        borderBottom: `2px solid ${T.ink}`,
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>PAD/01</span>
          <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, opacity: 0.55 }}>
            UNTITLED KIT · NEW
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4 }}>
          {STEPS.map((s, i) => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                padding: '5px 9px',
                background: i === step ? T.ink : 'transparent',
                color: i === step ? T.cream : i < step ? T.ink : `${T.ink}55`,
                border: `1.5px solid ${i <= step ? T.ink : `${T.ink}33`}`,
                fontWeight: 700,
              }}>{i + 1} · {s}</span>
              {i < 2 && <span style={{ opacity: 0.4 }}>—</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>{children}</div>

      {/* Status footer */}
      <div style={{
        borderTop: `2px solid ${T.ink}`,
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55,
      }}>
        <span>● CONNECTED{step > 0 ? ' · AUDIO READY' : ' · NO AUDIO YET'}</span>
        <span>STEP {step + 1} / 3</span>
        <span>{['TYPE TO BEGIN', 'TUNING…', 'READY'][step]}</span>
      </div>
    </div>
  );
}
