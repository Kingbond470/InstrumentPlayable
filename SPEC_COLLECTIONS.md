---
title: Collection Sharing (Instrument Bundles)
status: planning
effort: M (3h)
---

## Summary

Save user's favorite 5 instruments as shareable bundle. Share URL → friend loads same 5 instruments. Viral feature (K-factor).

---

## Problem

Users find cool instrument combo, want to share with friends. Currently share individual instruments. Need way to bundle + share as unit.

---

## Goals

- ✅ Create collection (pick 3-5 instruments)
- ✅ Name collection (e.g., "Jazz Jam", "Indian Fusion")
- ✅ Generate shareable URL
- ✅ Recipient clicks link → loads all instruments
- ✅ Preview card on share (OG image shows collection name)
- ✅ Analytics: track shares + clicks
- ✅ One-click play all (or cycle through)

---

## Success Criteria

- [ ] Create collection dialog (select up to 5 instruments)
- [ ] Collection name input (required)
- [ ] Generate URL (base64 encoded, short)
- [ ] OG meta tags include collection name
- [ ] Share button (copy link, social share icons)
- [ ] Recipient clicks → all instruments load
- [ ] Cycle through collection (arrow buttons)
- [ ] Save collection as kit (optional, for authenticated users)
- [ ] Track collection_created + collection_shared events
- [ ] Track collection_opened event (when recipient clicks)

---

## Design

### Data Model

```typescript
interface InstrumentCollection {
  id: string;               // unique ID (generated)
  name: string;             // "Jazz Jam"
  instruments: string[];    // ["sitar", "tabla", "flute"] (up to 5)
  created: number;          // timestamp
  creatorId?: string;       // user ID (if authenticated)
}

// URL encoding: /share/collection?data=base64(json)
// Example: /share/collection?data=eyJuYW1lIjoiSmF6eiBKYW0iLCJpbnN0cnVtZW50cyI6WyJzaXRhciIsInRhYmxhIl19
```

### UI Flow

**Create Collection (Modal)**
```
┌──────────────────────────────┐
│ Create Collection            │
├──────────────────────────────┤
│ Name: [Jazz Jam_________]    │
│                              │
│ Pick up to 5 instruments:    │
│ ☑ Sitar   ☐ Guitar          │
│ ☑ Tabla   ☐ Flute           │
│ ☑ Koto    ☐ Piano           │
│                              │
│ Selected: 3/5 instruments    │
│                              │
│ [Create] [Cancel]           │
└──────────────────────────────┘
```

**Share Modal**
```
┌──────────────────────────────┐
│ Share Collection             │
├──────────────────────────────┤
│ Collection: "Jazz Jam"       │
│ Instruments: Sitar, Tabla... │
│                              │
│ Link: [Copy ✓]              │
│ https://playable.app/share...│
│                              │
│ Share on:                    │
│ [Discord] [Twitter] [Email]  │
│                              │
│ [Done]                       │
└──────────────────────────────┘
```

**Collection Player (Recipient View)**
```
┌─────────────────────────────┐
│ Jazz Jam (shared)           │
├─────────────────────────────┤
│           🎸 Sitar          │
│                             │
│ [◀ Tabla] [Sitar ▶]        │
│                             │
│     Instruments: 3/5        │
│                             │
│      [Play All Cycle]       │
│      [Save as Kit]          │
│                             │
└─────────────────────────────┘
```

### Components

**CreateCollectionModal.tsx**
```typescript
export function CreateCollectionModal({
  instruments,
  onCreate,
  onCancel
}: {
  instruments: InstrumentDef[];
  onCreate: (collection: InstrumentCollection) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  
  const handleCreate = () => {
    const collection = {
      id: generateId(),
      name,
      instruments: Array.from(selected),
      created: Date.now()
    };
    onCreate(collection);
  };
  
  return (...);
}
```

**ShareCollectionModal.tsx**
```typescript
export function ShareCollectionModal({
  collection,
  onClose
}: {
  collection: InstrumentCollection;
  onClose: () => void;
}) {
  const shareUrl = generateCollectionUrl(collection);
  
  return (
    <div>
      <p>Share: {shareUrl}</p>
      <button onClick={() => copyToClipboard(shareUrl)}>Copy</button>
      <button onClick={() => shareOn('twitter', shareUrl)}>Twitter</button>
      <button onClick={() => shareOn('discord', shareUrl)}>Discord</button>
    </div>
  );
}
```

**CollectionPlayer.tsx**
```typescript
export function CollectionPlayer({
  collection
}: {
  collection: InstrumentCollection;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentInstrument = collection.instruments[currentIndex];
  
  return (
    <div>
      <h2>{collection.name}</h2>
      <InstrumentUI instrument={currentInstrument} />
      <button onClick={() => setCurrentIndex((i) => (i - 1 + collection.instruments.length) % collection.instruments.length)}>
        ◀ Prev
      </button>
      <button onClick={() => setCurrentIndex((i) => (i + 1) % collection.instruments.length)}>
        Next ▶
      </button>
      <p>{currentIndex + 1}/{collection.instruments.length}</p>
    </div>
  );
}
```

### URL Generation

```typescript
function generateCollectionUrl(collection: InstrumentCollection): string {
  const json = JSON.stringify({
    name: collection.name,
    instruments: collection.instruments
  });
  const encoded = btoa(json); // Base64 encode
  return `${BASE_URL}/share/collection?data=${encoded}`;
}

function decodeCollectionUrl(encoded: string): InstrumentCollection | null {
  try {
    const json = atob(encoded); // Base64 decode
    const data = JSON.parse(json);
    return {
      id: generateId(),
      created: Date.now(),
      ...data
    };
  } catch {
    return null;
  }
}
```

### Route: /share/collection?data=...

```typescript
// app/share/collection/page.tsx
export async function generateMetadata({
  searchParams
}: {
  searchParams: { data: string };
}) {
  const collection = decodeCollectionUrl(searchParams.data);
  if (!collection) return { title: 'Invalid Collection' };
  
  return {
    title: collection.name,
    openGraph: {
      title: collection.name,
      description: `Play: ${collection.instruments.join(', ')}`,
      images: [{
        url: `/api/og?collection=${encodeURIComponent(collection.name)}&instruments=${collection.instruments.join(',')}`
      }]
    }
  };
}
```

---

## Acceptance Tests

| Scenario | Expected |
|----------|----------|
| Create collection with 3 instruments | Dialog accepts, generates URL |
| Share collection link | Recipient can click and load all 3 instruments |
| Browse collection | Prev/next buttons cycle through instruments |
| Share on Discord | Rich preview shows collection name |
| Share on Twitter | OG image shows collection name + instruments |
| Copy link | Link copied to clipboard (toast confirmation) |
| Invalid URL | Error message "Collection not found" |
| Collection with 5 instruments | Max boundary works |
| Collection with 0 instruments | Validation prevents empty collection |
| Recipient saves as kit | Collection → Kit conversion works |

---

## References

- [CollectionPlayer.tsx](app/src/components/CollectionPlayer.tsx) — to be created
- [CreateCollectionModal.tsx](app/src/components/CreateCollectionModal.tsx) — to be created
- [ShareCollectionModal.tsx](app/src/components/ShareCollectionModal.tsx) — to be created
- [/share/collection/page.tsx](app/src/app/share/collection/page.tsx) — to be created
- [ANALYTICS.md](ANALYTICS.md) — collection_created, collection_shared, collection_opened events

---

## Implementation Plan

1. **Create utilities** (0.5h)
   - generateCollectionUrl (base64 encode)
   - decodeCollectionUrl (base64 decode)
   - generateId (short unique ID)

2. **Create modals** (1h)
   - CreateCollectionModal (pick instruments, name)
   - ShareCollectionModal (copy link, social buttons)

3. **Create player** (0.5h)
   - CollectionPlayer (cycle through instruments)
   - Prev/next buttons

4. **Create share route** (0.5h)
   - /share/collection?data=... endpoint
   - OG metadata integration

5. **Integration + polish** (0.5h)
   - Hook into StringPlayer/PercussionGrid
   - Add "Create Collection" button
   - Analytics tracking

---

## Performance

| Metric | Target |
|--------|--------|
| URL length | <200 chars (base64 of 5 instrument IDs) |
| Collection load time | <100ms (decode + render) |
| OG image generation | <100ms |

---

## Blockers

- [ ] Social share buttons (need meta tags for Twitter, Discord, Facebook)

---

## Future

- [ ] Save collection to user library (backend)
- [ ] Edit collection (if owner)
- [ ] Like/star collections (social discovery)
- [ ] Collection tags (genre, difficulty, culture)
- [ ] Community collections (featured, trending)
