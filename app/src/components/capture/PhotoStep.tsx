'use client';

import React from 'react';
import { T } from '@/tokens/design';
import { useViewport } from '@/hooks/useViewport';

interface Props {
  onPhoto: (dataUrl: string) => void;
}

const EXAMPLES = [
  { label: 'Sitar', emoji: '🪕' },
  { label: 'Tabla', emoji: '🥁' },
  { label: 'Erhu',  emoji: '🎻' },
  { label: 'Koto',  emoji: '🎵' },
  { label: 'Harp',  emoji: '🎼' },
  { label: 'Kora',  emoji: '🪗' },
];

export default function PhotoStep({ onPhoto }: Props) {
  const viewport = useViewport();
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isMobile = viewport?.isMobile ?? true;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => { if (e.target?.result) onPhoto(e.target.result as string); };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: T.cream, color: T.ink,
      fontFamily: T.font,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      alignItems: 'center',
      gridTemplateRows: isMobile ? 'auto 1fr' : 'auto',
    }}>
      {/* Left — instructions */}
      <div style={{ padding: isMobile ? '32px 20px' : '0 64px', display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 28 }}>
        <span style={{ fontFamily: T.mono, fontSize: isMobile ? 9 : 11, letterSpacing: 1.6, color: T.red, fontWeight: 700 }}>
          01 · PHOTOGRAPH AN INSTRUMENT
        </span>
        <h1 style={{
          margin: 0, fontWeight: 900, fontSize: isMobile ? 32 : 72, lineHeight: 0.88, letterSpacing: -3,
        }}>
          Point your camera at any instrument.
        </h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, opacity: 0.75, maxWidth: 420 }}>
          Real or painted. Modern or ancient. In a museum, a painting, or your living room.
          AI identifies it — you play it instantly.
        </p>

        {/* Example instruments */}
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, opacity: 0.5, marginBottom: 10 }}>
            WORKS WITH ANY OF THESE →
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EXAMPLES.map((ex) => (
              <span key={ex.label} style={{
                padding: '6px 12px', border: `1.5px solid ${T.ink}33`,
                fontFamily: T.mono, fontSize: 11, letterSpacing: 0.8,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {ex.emoji} {ex.label}
              </span>
            ))}
            <span style={{ padding: '6px 12px', border: `1.5px solid ${T.ink}22`, fontFamily: T.mono, fontSize: 11, letterSpacing: 0.8, opacity: 0.5 }}>
              + 100 more
            </span>
          </div>
        </div>
      </div>

      {/* Right — drop zone (full width on mobile) */}
      <div style={{
        height: isMobile ? 'auto' : '100%',
        borderLeft: isMobile ? 'none' : `2px solid ${T.ink}`,
        borderTop: isMobile ? `2px solid ${T.ink}` : 'none',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? 24 : 48, gap: isMobile ? 12 : 20,
        background: dragging ? `${T.ink}08` : T.cream,
        transition: 'background 150ms',
      }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <div style={{
          width: '100%', maxWidth: isMobile ? 280 : 360, aspectRatio: '4/3',
          border: `2.5px dashed ${dragging ? T.red : T.ink}55`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: isMobile ? 12 : 16,
          transition: 'border-color 150ms',
        }}>
          <span style={{ fontSize: isMobile ? 32 : 48, lineHeight: 1 }}>📷</span>
          <span style={{
            fontFamily: T.mono, fontSize: isMobile ? 9 : 11, letterSpacing: 1.4,
            opacity: 0.55, textAlign: 'center', lineHeight: 1.6,
          }}>
            {isMobile ? 'TAP TO SELECT' : 'DRAG A PHOTO HERE'}<br />{!isMobile && 'OR'}
          </span>
        </div>

        {/* Upload button */}
        <input
          ref={inputRef} type="file" accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            padding: isMobile ? '12px 20px' : '14px 28px', background: T.ink, color: T.cream,
            border: `2px solid ${T.ink}`, fontWeight: 900, fontSize: isMobile ? 12 : 16,
            letterSpacing: -0.3, cursor: 'pointer', borderRadius: 0,
            boxShadow: `${isMobile ? 3 : 6}px ${isMobile ? 3 : 6}px 0 0 ${T.red}`,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          {isMobile ? 'CHOOSE PHOTO' : 'CHOOSE PHOTO →'}
        </button>

        {/* Camera on mobile */}
        <button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.setAttribute('capture', 'environment');
              inputRef.current.click();
            }
          }}
          style={{
            padding: isMobile ? '12px 16px' : '10px 20px', background: 'transparent',
            border: `1.5px solid ${T.ink}`, color: T.ink,
            fontFamily: T.mono, fontSize: isMobile ? 9 : 10, letterSpacing: 1.4,
            fontWeight: 700, cursor: 'pointer', borderRadius: 0,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          📷 USE CAMERA
        </button>

        <span style={{ fontFamily: T.mono, fontSize: isMobile ? 8 : 10, letterSpacing: 1.4, opacity: 0.4, textAlign: 'center' }}>
          JPG · PNG · WEBP · MAX 10MB
        </span>
      </div>
    </div>
  );
}
