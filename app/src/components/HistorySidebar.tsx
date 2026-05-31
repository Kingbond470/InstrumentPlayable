'use client';

import { useInstrumentHistory, type HistoryItem } from '@/hooks/useInstrumentHistory';
import { resolveInstrument } from '@/lib/instrumentLibrary';
import { trackEvent, Events } from '@/lib/analytics';

interface HistorySidebarProps {
  onPlay: (instrumentId: string) => void;
}

/**
 * Left sidebar: favorites + recent instruments
 * - Favorites (max 5, with star button)
 * - Recent (max 10, with remove button)
 * - Clear all button
 */
export default function HistorySidebar({ onPlay }: HistorySidebarProps) {
  const { getFavorites, getRecent, toggleFavorite, removeFromHistory, clearHistory, mounted } =
    useInstrumentHistory();

  if (!mounted) return null;

  const favorites = getFavorites();
  const recent = getRecent();

  const handlePlay = (instrumentId: string) => {
    onPlay(instrumentId);
    trackEvent(Events.INSTRUMENT_PLAYED, {
      instrument: instrumentId,
      via: 'history',
    });
  };

  const handleToggleFavorite = (instrumentId: string) => {
    toggleFavorite(instrumentId);
    trackEvent('history_toggle_favorite', { instrument: instrumentId });
  };

  const handleRemove = (instrumentId: string) => {
    removeFromHistory(instrumentId);
  };

  const handleClearAll = () => {
    if (confirm('Clear all history?')) {
      clearHistory();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '220px',
        background: '#0a0a0a',
        borderRight: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        gap: '16px',
        overflowY: 'auto',
        zIndex: 100,
      }}
    >
      {/* Favorites Section */}
      <div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 'bold',
            color: '#efece4',
            marginBottom: '8px',
            letterSpacing: '0.8px',
          }}
        >
          ⭐ FAVORITES ({favorites.length})
        </div>

        {favorites.length === 0 ? (
          <div
            style={{
              fontSize: '11px',
              color: '#666',
              fontStyle: 'italic',
              opacity: 0.5,
            }}
          >
            No favorites yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {favorites.map((item) => {
              const def = resolveInstrument(item.id);
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#1a1a1a',
                    border: `1px solid ${def.accent}`,
                    borderRadius: '4px',
                    padding: '8px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#222';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#1a1a1a';
                  }}
                >
                  <button
                    onClick={() => handlePlay(item.id)}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      color: '#efece4',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {def.name}
                  </button>
                  <button
                    onClick={() => handleToggleFavorite(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: def.accent,
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '0 4px',
                    }}
                    title="Remove from favorites"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Section */}
      {recent.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '12px',
              fontFamily: 'ui-monospace, monospace',
              fontWeight: 'bold',
              color: '#efece4',
              marginBottom: '8px',
              letterSpacing: '0.8px',
            }}
          >
            🕐 RECENT ({recent.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {recent.map((item) => {
              const def = resolveInstrument(item.id);
              const isFav = item.isFavorite;
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    padding: '8px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: isFav ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#222';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#1a1a1a';
                  }}
                >
                  <button
                    onClick={() => handlePlay(item.id)}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      color: '#efece4',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {def.name}
                  </button>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleToggleFavorite(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isFav ? '#ffd700' : '#666',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '0 2px',
                      }}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFav ? '⭐' : '☆'}
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '0 2px',
                      }}
                      title="Remove from history"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear All Button */}
      {recent.length > 0 && (
        <button
          onClick={handleClearAll}
          style={{
            marginTop: 'auto',
            padding: '8px 12px',
            background: '#222',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#999',
            fontSize: '11px',
            cursor: 'pointer',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          Clear All
        </button>
      )}
    </div>
  );
}
