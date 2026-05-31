'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { T } from '@/tokens/design';
import { useViewport } from '@/hooks/useViewport';
import type { KitConfig } from '@/types/kit';
import { loadKits } from '@/lib/kitStore';
import { encodeKit } from '@/lib/shareUrl';
import KitCard from '@/components/library/KitCard';

const FEATURED: KitConfig[] = [
  { prompt: 'rainy detroit warehouse at 4am', name: 'Rainy Detroit Warehouse', bpm: 124, key: 'Am', mood: 'dark·wet', character: 'lofi·gritty', tags: ['DETROIT','WAREHOUSE','4AM','RAIN'], padNotes: { SUB: 'A1', BUZ: 'E2', VOX: 'C3', FX1: 'G2', ARP: 'A3', STB: ['E3','G3'], CHD: ['A3','C4','E4'], END: 'A2' }, effects: { reverb: 0.7, delay: 0.3, distortion: 0.1 } },
  { prompt: "kid's birthday party, plastic instruments", name: 'Birthday Plastic', bpm: 140, key: 'C', mood: 'bright·bouncy', character: 'toy·thin', tags: ['BIRTHDAY','KIDS','PARTY','PLASTIC'], padNotes: { SUB: 'C2', BUZ: 'G3', VOX: 'E4', FX1: 'C4', ARP: 'G4', STB: ['C4','E4'], CHD: ['C4','E4','G4'], END: 'C3' }, effects: { reverb: 0.2, delay: 0.4, distortion: 0.05 } },
  { prompt: 'sunday morning coffee, slow brushes', name: 'Sunday Brushes', bpm: 78, key: 'G', mood: 'warm·gentle', character: 'soft·round', tags: ['SUNDAY','MORNING','COFFEE','SLOW'], padNotes: { SUB: 'G1', BUZ: 'D3', VOX: 'B3', FX1: 'A3', ARP: 'G4', STB: ['G3','B3'], CHD: ['G3','B3','D4'], END: 'G2' }, effects: { reverb: 0.5, delay: 0.2, distortion: 0 } },
  { prompt: 'cat investigating a paper bag', name: 'Cat & Bag', bpm: 142, key: 'F', mood: 'glitch·curious', character: 'crinkle·dry', tags: ['CAT','BAG','GLITCH','SCATTER'], padNotes: { SUB: 'F1', BUZ: 'C3', VOX: 'A3', FX1: 'F3', ARP: 'F4', STB: ['F3','A3'], CHD: ['F3','A3','C4'], END: 'F2' }, effects: { reverb: 0.15, delay: 0.5, distortion: 0.3 } },
];

export default function LibraryPage() {
  const viewport = useViewport();
  const router   = useRouter();
  const [tab, setTab]   = React.useState<'mine' | 'featured'>('mine');
  const [mine, setMine] = React.useState<KitConfig[]>([]);
  const [search, setSearch] = React.useState('');

  const isMobile = viewport?.isMobile ?? true;
  const isTablet = viewport?.isTablet ?? false;

  // Responsive grid: 1-col mobile, 2-col tablet, 3-col desktop
  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';

  React.useEffect(() => { setMine(loadKits()); }, []);

  const openKit = (kit: KitConfig) => {
    router.push(`/play?kit=${encodeKit(kit)}`);
  };

  const kits = tab === 'mine' ? mine : FEATURED;
  const visible = search
    ? kits.filter((k) => k.prompt.toLowerCase().includes(search.toLowerCase()) || k.name.toLowerCase().includes(search.toLowerCase()))
    : kits;

  return (
    <div style={{
      width: '100%', minHeight: '100vh', background: T.cream, color: T.ink,
      fontFamily: T.font,
      display: 'grid', gridTemplateRows: '64px 1fr',
    }}>
      {/* Top bar */}
      <div style={{
        borderBottom: `2px solid ${T.ink}`,
        padding: isMobile ? '0 12px' : isTablet ? '0 16px' : '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: T.cream,
        zIndex: 10,
        minHeight: 50,
        flexWrap: 'wrap',
        gap: isMobile ? 8 : 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 24 }}>
          <Link href="/" style={{
            fontWeight: 900,
            fontSize: isMobile ? 16 : 20,
            letterSpacing: -0.5,
            textDecoration: 'none',
            color: T.ink,
          }}>PAD/01</Link>
          {!isMobile && (
            <span style={{
              fontFamily: T.mono,
              fontSize: 10,
              letterSpacing: 1.6,
              opacity: 0.55,
            }}>
              {tab === 'mine' ? `${mine.length} SAVED KITS` : `${FEATURED.length} FEATURED`}
            </span>
          )}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 6 : 10,
          flex: isMobile ? '1 1 100%' : 'auto',
          justifyContent: isMobile ? 'flex-start' : 'auto',
          flexWrap: 'wrap',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', border: `1.5px solid ${T.ink}` }}>
            {(['mine', 'featured'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: isMobile ? '6px 8px' : '7px 14px',
                background: tab === t ? T.ink : 'transparent',
                color: tab === t ? T.cream : T.ink,
                border: 'none',
                borderRight: t === 'mine' ? `1.5px solid ${T.ink}` : 'none',
                fontFamily: T.mono,
                fontSize: isMobile ? 8 : 11,
                letterSpacing: 1.4,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                {isMobile ? (t === 'mine' ? 'MINE' : 'FEATURED') : (t === 'mine' ? `MINE · ${mine.length.toString().padStart(2,'0')}` : `FEATURED · ${String(FEATURED.length).padStart(2,'0')}`)}
              </button>
            ))}
          </div>

          {!isMobile && (
            <input
              placeholder="search prompts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                border: `1.5px solid ${T.ink}`,
                background: T.cream,
                fontFamily: T.mono,
                fontSize: 11,
                color: T.ink,
                width: 220,
                outline: 'none',
                borderRadius: 0,
              }}
            />
          )}

          <Link href="/play" style={{
            padding: isMobile ? '6px 8px' : '8px 14px',
            background: T.ink,
            color: T.cream,
            textDecoration: 'none',
            fontFamily: T.mono,
            fontSize: isMobile ? 8 : 11,
            letterSpacing: 1.4,
            fontWeight: 700,
            boxShadow: isMobile ? `2px 2px 0 0 ${T.red}` : `4px 4px 0 0 ${T.red}`,
            whiteSpace: 'nowrap',
          }}>+ NEW</Link>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        padding: isMobile ? 12 : isTablet ? 16 : 28,
        overflowY: 'auto',
      }}>
        {visible.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            gap: 16,
            opacity: 0.55,
          }}>
            <p style={{
              fontFamily: T.mono,
              fontSize: isMobile ? 10 : 12,
              letterSpacing: 1.4,
              margin: 0,
            }}>
              {tab === 'mine' ? 'NO SAVED KITS YET.' : 'NO RESULTS.'}
            </p>
            {isMobile && (
              <input
                placeholder="search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: `1.5px solid ${T.ink}`,
                  background: T.cream,
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: T.ink,
                  width: '100%',
                  maxWidth: 300,
                  outline: 'none',
                  borderRadius: 0,
                }}
              />
            )}
            {tab === 'mine' && (
              <Link href="/play" style={{
                padding: isMobile ? '8px 14px' : '10px 18px',
                background: T.ink,
                color: T.cream,
                textDecoration: 'none',
                fontFamily: T.mono,
                fontSize: isMobile ? 10 : 11,
                letterSpacing: 1.4,
                fontWeight: 700,
              }}>MAKE YOUR FIRST KIT →</Link>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: isMobile ? 12 : isTablet ? 14 : 18,
            alignContent: 'start',
          }}>
            {visible.map((k, i) => (
              <KitCard
                key={k.prompt}
                kit={k}
                featured={i === 0 && tab === 'mine' && !search}
                onOpen={openKit}
                onDelete={tab === 'mine' ? (p) => setMine((m) => m.filter((k) => k.prompt !== p)) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
