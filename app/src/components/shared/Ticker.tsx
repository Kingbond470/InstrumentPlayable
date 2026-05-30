import { T } from '@/tokens/design';

interface Props {
  value: string;
  label: string;
  color?: string;
}

export default function Ticker({ value, label, color = T.ink }: Props) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 2, color }}>
      <span style={{
        fontFamily: T.mono,
        fontSize: 28, fontWeight: 500, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
      }}>{value}</span>
      <span style={{
        fontFamily: T.mono,
        fontSize: 9, letterSpacing: 1.4, opacity: 0.5, textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  );
}
