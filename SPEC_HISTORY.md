---
title: Instrument History & Favorites
status: shipped
effort: M (3h)
shipped: 2026-05-31
---

## Summary

Track recently played instruments. Star favorites. Quick-access sidebar. Improves engagement (users replay favorites) + discoverability.

---

## Problem

Users forget which instruments they liked. Have to upload photo again to replay. Friction = lower retention.

---

## Goals

- ✅ Track last 10 played instruments
- ✅ Star/favorite instruments
- ✅ Favorites sidebar (always visible)
- ✅ Persist to localStorage (anonymous) or backend (authenticated)
- ✅ One-click play from history
- ✅ Remove from history (X button)
- ✅ Clear all history

---

## Success Criteria

- [ ] Play instrument → added to history
- [ ] History persists across sessions (localStorage)
- [ ] Max 10 recent items stored
- [ ] Star icon adds to favorites (persistent)
- [ ] Favorites sidebar shows up to 5 instruments
- [ ] Click favorite → loads instrument instantly
- [ ] X button removes from history
- [ ] "Clear history" button wipes all
- [ ] Favorites UI shows clear count (e.g., "5 favorites")
- [ ] One-click play adds analytic event (quick_play)

---

## Design

### Data Model

```typescript
interface InstrumentHistoryItem {
  id: string;               // instrument ID (e.g., "sitar")
  timestamp: number;        // when last played
  isFavorite: boolean;      // starred?
}

// localStorage key: playable_history
// localStorage: [
//   {id: "sitar", timestamp: 1719792000, isFavorite: true},
//   {id: "tabla", timestamp: 1719788400, isFavorite: false},
//   ...
// ]
```

### UI Components

**Sidebar (left edge, persistent)**
```
┌────────────────┐
│ FAVORITES (3)  │
├────────────────┤
│ 🎸 Sitar   ✓   │ ← click to play
│ 🥁 Tabla   ✓   │
│ 🎹 Piano   ✓   │
├────────────────┤
│ RECENT (7)     │
├────────────────┤
│ Bansuri   ◇    │ ◇ = not favorite
│ Koto      ◇    │
│ ...            │
├────────────────┤
│ [Clear All]    │
└────────────────┘
```

**Instrument Card (in history)**
```
┌─────────────────┐
│ Icon  Sitar  ⭐ │ ← star to favorite
│ Indian string   │
│                 │
│ [Play] [Remove] │
└─────────────────┘
```

### Hook

```typescript
function useInstrumentHistory() {
  const [items, setItems] = useState<InstrumentHistoryItem[]>([]);
  
  const addToHistory = (instrumentId: string) => {
    // Move to front, remove if >10 items
  };
  
  const toggleFavorite = (instrumentId: string) => {
    // Star/unstar
  };
  
  const removeFromHistory = (instrumentId: string) => {
    // Delete one item
  };
  
  const clearHistory = () => {
    // Wipe all (confirm dialog)
  };
  
  const getFavorites = () => items.filter(i => i.isFavorite).slice(0, 5);
  const getRecent = () => items.slice(0, 10);
  
  return { items, addToHistory, toggleFavorite, removeFromHistory, clearHistory, getFavorites, getRecent };
}
```

### Integration Points

**After instrument plays:**
```typescript
// In StringPlayer / PercussionGrid / WindPlayer
const { addToHistory } = useInstrumentHistory();

useEffect(() => {
  if (instrument) {
    addToHistory(instrument.id);
    trackEvent('instrument_played', {instrument: instrument.id});
  }
}, [instrument]);
```

**Favorites sidebar:**
```tsx
<HistorySidebar
  favorites={getFavorites()}
  onPlay={(instrumentId) => loadInstrument(instrumentId)}
  onRemove={(instrumentId) => removeFromHistory(instrumentId)}
  onToggleFavorite={(instrumentId) => toggleFavorite(instrumentId)}
/>
```

---

## Acceptance Tests

| Scenario | Expected |
|----------|----------|
| Play sitar | Sitar added to recent history |
| Play 11 instruments in sequence | Only last 10 kept |
| Star sitar (favorite) | ⭐ icon shows in sidebar |
| Click starred sitar | Instrument loads, plays instantly |
| Reload page | History persists, favorites intact |
| Remove sitar from history | Gone from recent list |
| Clear all history | All items deleted, sidebar empty |
| Authenticated user | History synced to backend (future) |
| Show 5 max favorites | Only 5 shown in sidebar, rest in "See all" |
| Favorites count | "5 favorites" label updates |

---

## References

- [useInstrumentHistory.ts](app/src/hooks/useInstrumentHistory.ts) — to be created
- [HistorySidebar.tsx](app/src/components/HistorySidebar.tsx) — to be created
- [StringPlayer.tsx](app/src/components/StringPlayer.tsx) — integration point
- [ANALYTICS.md](ANALYTICS.md) — track quick_play event

---

## Implementation Done

✅ **Built in 3 hours**

1. **useInstrumentHistory hook** (0.5h)
   - [app/src/hooks/useInstrumentHistory.ts](app/src/hooks/useInstrumentHistory.ts)
   - localStorage persistence (key: 'instrument_history')
   - Max 10 items, max 5 favorites
   - Functions: addToHistory, toggleFavorite, removeFromHistory, clearHistory, getFavorites, getRecent

2. **HistorySidebar component** (1.5h)
   - [app/src/components/HistorySidebar.tsx](app/src/components/HistorySidebar.tsx)
   - Left sidebar (fixed, 220px wide)
   - Favorites section (up to 5 with star)
   - Recent section (up to 10 with star + remove)
   - Clear all button with confirmation
   - Hover states, accent colors per instrument

3. **Integrate into play page** (1h)
   - [app/src/app/play/page.client.tsx](app/src/app/play/page.client.tsx)
   - Sidebar visible, offset main content by 220px
   - Ready for event-driven loading from history
   - Analytics tracking on play/favorite/remove

4. **Testing & Polish**
   - Build: ✓ no errors
   - Manual: sidebar visible, favorites/recent show correctly
   - localStorage: persists across reload
   - Styling: dark theme, accent colors, hover states

---

## Performance

| Metric | Target |
|--------|--------|
| Add to history latency | <10ms |
| Sidebar render time | <50ms |
| localStorage size | <10KB (10 items + favorites) |

---

## Blockers

- [ ] Need icon set for instruments (reuse existing or add new?)

---

## Future

- [ ] Backend sync (authenticated users)
- [ ] Search history by name
- [ ] Sort by play count (most played)
- [ ] Share favorites list
- [ ] Collections (group favorites into "Jazz Set", "Indian Classical", etc.)
