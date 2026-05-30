import { T } from '@/tokens/design';
import StudioChrome from './StudioChrome';

const PAD_LABELS = ['KIK', 'SNR', 'HAT', 'OPN', 'CLP', 'TOM', 'RIM', 'CYM',
                    'SUB', 'BUZ', 'VOX', 'FX1', 'ARP', 'STB', 'CHD', 'END'];

interface Props {
  prompt: string;
  tags: string[];
  total: number;
}

export default function TuneStep({ prompt, tags, total }: Props) {
  const progress = total > 0 ? tags.length / total : 0;

  return (
    <StudioChrome step={1}>
      <div style={{
        width: '100%', height: '100%',
        display: 'grid', gridTemplateColumns: '380px 1fr',
      }}>
        {/* Left — tag feed */}
        <div style={{
          borderRight: `2px solid ${T.ink}`, padding: '40px 32px',
          display: 'flex', flexDirection: 'column', gap: 22,
        }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.red, fontWeight: 700 }}>
            02 · TUNING IN PROGRESS
          </span>

          <div style={{
            background: '#fff', border: `2px solid ${T.ink}`,
            padding: 16, boxShadow: `4px 4px 0 0 ${T.ink}`,
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, opacity: 0.55 }}>YOUR PROMPT</div>
            <p style={{ margin: '6px 0 0', fontSize: 16, fontWeight: 600, lineHeight: 1.35 }}>
              "{prompt}"
            </p>
          </div>

          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55, marginBottom: 10 }}>
              ─── HEARD ───
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.map((t) => (
                <span key={t} style={{
                  padding: '6px 10px',
                  background: T.ink, color: T.cream,
                  border: `1.5px solid ${T.ink}`,
                  fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.55, marginBottom: 6 }}>
              TUNING {Math.round(progress * 100).toString().padStart(2, '0')}%
            </div>
            <div style={{ height: 8, background: '#fff', border: `1.5px solid ${T.ink}` }}>
              <div style={{
                width: `${progress * 100}%`, height: '100%',
                background: T.red, transition: 'width 500ms',
              }} />
            </div>
          </div>
        </div>

        {/* Right — pad grid sweep animation */}
        <div style={{
          padding: 32,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {PAD_LABELS.map((l, i) => {
            const row   = Math.floor(i / 4);
            const lit   = row < Math.floor(tags.length / 3);
            return (
              <div key={i} style={{
                position: 'relative', overflow: 'hidden',
                border: `2px solid ${T.ink}`,
                background: lit ? '#fff' : T.cream, color: T.ink,
                padding: 14,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: `4px 4px 0 0 ${T.ink}`,
                transition: 'background 300ms',
              }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, opacity: lit ? 0.6 : 0.3 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, lineHeight: 1, opacity: lit ? 1 : 0.25 }}>
                  {l}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </StudioChrome>
  );
}
