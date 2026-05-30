import { T } from '@/tokens/design';

const STEPS = [
  'Analyzing image…',
  'Detecting instrument shape…',
  'Matching cultural origin…',
  'Identifying instrument…',
  'Almost ready…',
];

interface Props {
  photo: string;
  step: number;  // 0–4, drives the label
}

export default function IdentifyStep({ photo, step }: Props) {
  const label = STEPS[Math.min(step, STEPS.length - 1)];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{
      width: '100%', height: '100%', background: T.ink, color: T.cream,
      fontFamily: T.font,
      display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center',
    }}>
      {/* Left — photo preview */}
      <div style={{
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 48, borderRight: `2px solid ${T.cream}22`,
      }}>
        <div style={{ position: 'relative', maxWidth: 360, width: '100%' }}>
          {/* Scanning overlay */}
          <img src={photo} alt="instrument" style={{
            width: '100%', aspectRatio: '4/3', objectFit: 'cover',
            display: 'block', filter: 'brightness(0.7)',
          }} />
          {/* Scan line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 3, background: T.red,
            animation: 'scanLine 2s ease-in-out infinite',
          }} />
          {/* Corner brackets */}
          {[
            { top: 0, left: 0, borderTop: `3px solid ${T.red}`, borderLeft: `3px solid ${T.red}` },
            { top: 0, right: 0, borderTop: `3px solid ${T.red}`, borderRight: `3px solid ${T.red}` },
            { bottom: 0, left: 0, borderBottom: `3px solid ${T.red}`, borderLeft: `3px solid ${T.red}` },
            { bottom: 0, right: 0, borderBottom: `3px solid ${T.red}`, borderRight: `3px solid ${T.red}` },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...s }} />
          ))}
        </div>
      </div>

      {/* Right — progress */}
      <div style={{ padding: '0 56px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.red, fontWeight: 700 }}>
          02 · AI IDENTIFICATION
        </span>

        <h2 style={{ margin: 0, fontWeight: 900, fontSize: 52, lineHeight: 0.95, letterSpacing: -2 }}>
          Reading your<br />instrument…
        </h2>

        <div>
          <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.4, opacity: 0.65, marginBottom: 10 }}>
            {label.toUpperCase()}
          </div>
          <div style={{ height: 6, background: `${T.cream}22`, border: `1px solid ${T.cream}33` }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: T.red, transition: 'width 600ms ease',
            }} />
          </div>
          <div style={{
            marginTop: 8, fontFamily: T.mono, fontSize: 11,
            fontVariantNumeric: 'tabular-nums', opacity: 0.55,
          }}>
            {Math.round(progress).toString().padStart(2, '0')}%
          </div>
        </div>

        <p style={{ margin: 0, fontFamily: T.mono, fontSize: 11, letterSpacing: 0.8, opacity: 0.45, lineHeight: 1.6 }}>
          CHECKING 15 INSTRUMENT FAMILIES<br />
          ACROSS 40+ CULTURES
        </p>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; }
          50%  { top: 95%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
