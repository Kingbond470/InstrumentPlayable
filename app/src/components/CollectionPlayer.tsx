'use client';

import { useState } from 'react';
import { resolveInstrument } from '@/lib/instrumentLibrary';
import type { InstrumentCollection } from '@/lib/collection';
import { trackEvent, Events } from '@/lib/analytics';

interface CollectionPlayerProps {
  collection: InstrumentCollection;
}

/**
 * Collection player view
 * - Display current instrument in collection
 * - Prev/next buttons to cycle through
 * - Show progress (current / total)
 * - CTA buttons: play, save as kit
 */
export default function CollectionPlayer({ collection }: CollectionPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentInstrumentId = collection.instruments[currentIndex];
  const currentInstrument = resolveInstrument(currentInstrumentId);

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + collection.instruments.length) % collection.instruments.length;
    setCurrentIndex(newIndex);
    trackEvent(Events.INSTRUMENT_PLAYED, {
      instrument: collection.instruments[newIndex],
      via: 'collection_prev',
    });
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % collection.instruments.length;
    setCurrentIndex(newIndex);
    trackEvent(Events.INSTRUMENT_PLAYED, {
      instrument: collection.instruments[newIndex],
      via: 'collection_next',
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0a0a0a',
        color: '#efece4',
        gap: '24px',
        padding: '24px',
        fontFamily: 'ui-monospace, monospace',
      }}
    >
      {/* Collection Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>{collection.name}</h1>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Shared Collection</p>
      </div>

      {/* Instrument Display */}
      <div
        style={{
          background: '#1a1a1a',
          border: `2px solid ${currentInstrument.accent}`,
          borderRadius: '8px',
          padding: '32px 24px',
          textAlign: 'center',
          minWidth: '280px',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>
          {currentInstrument.id.includes('sitar') ? '🎸' :
           currentInstrument.id.includes('tabla') ? '🥁' :
           currentInstrument.id.includes('flute') ? '🪈' :
           currentInstrument.id.includes('piano') ? '🎹' :
           currentInstrument.id.includes('violin') ? '🎻' :
           '🎵'}
        </div>
        <h2 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>{currentInstrument.name}</h2>
        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 12px 0' }}>
          {currentInstrument.culture}
        </p>
        <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>
          {currentInstrument.description}
        </p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={handlePrev}
          style={{
            padding: '10px 16px',
            background: '#222',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#efece4',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          ◀ Prev
        </button>
        <div
          style={{
            fontSize: '12px',
            color: '#999',
            minWidth: '80px',
            textAlign: 'center',
          }}
        >
          {currentIndex + 1} / {collection.instruments.length}
        </div>
        <button
          onClick={handleNext}
          style={{
            padding: '10px 16px',
            background: '#222',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#efece4',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Next ▶
        </button>
      </div>

      {/* Info */}
      <div
        style={{
          fontSize: '11px',
          color: '#666',
          textAlign: 'center',
          maxWidth: '300px',
        }}
      >
        This is a shared collection from Playable Instrument. Click prev/next to explore other instruments.
      </div>
    </div>
  );
}
