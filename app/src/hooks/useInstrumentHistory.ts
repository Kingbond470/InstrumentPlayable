import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  timestamp: number;
  isFavorite: boolean;
}

const STORAGE_KEY = 'instrument_history';
const MAX_HISTORY = 10;
const MAX_FAVORITES = 5;

/**
 * Hook to manage instrument history + favorites
 * Persists to localStorage
 */
export function useInstrumentHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        // Corrupt data, start fresh
        setItems([]);
      }
    }
    setMounted(true);
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToHistory = (instrumentId: string) => {
    setItems((prev) => {
      // Remove if already exists (will add to front)
      const filtered = prev.filter((item) => item.id !== instrumentId);

      // Create new item
      const newItem: HistoryItem = {
        id: instrumentId,
        timestamp: Date.now(),
        isFavorite: false,
      };

      // Add to front, keep max 10
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
      return updated;
    });
  };

  const toggleFavorite = (instrumentId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === instrumentId
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  };

  const removeFromHistory = (instrumentId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== instrumentId));
  };

  const clearHistory = () => {
    setItems([]);
  };

  const getFavorites = (): HistoryItem[] => {
    return items.filter((i) => i.isFavorite).slice(0, MAX_FAVORITES);
  };

  const getRecent = (): HistoryItem[] => {
    return items.slice(0, 10);
  };

  return {
    items,
    addToHistory,
    toggleFavorite,
    removeFromHistory,
    clearHistory,
    getFavorites,
    getRecent,
    mounted,
  };
}
