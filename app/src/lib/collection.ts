/**
 * Instrument collection utilities
 * URL encoding/decoding for shareable bundles
 */

export interface InstrumentCollection {
  name: string;
  instruments: string[];
  created?: number;
}

/**
 * Encode collection to base64 URL-safe format
 */
export function encodeCollection(collection: InstrumentCollection): string {
  const data = {
    name: collection.name,
    instruments: collection.instruments,
  };
  const json = JSON.stringify(data);
  return btoa(json);
}

/**
 * Decode collection from base64 format
 */
export function decodeCollection(encoded: string): InstrumentCollection | null {
  try {
    const json = atob(encoded);
    const data = JSON.parse(json);

    if (!data.name || !Array.isArray(data.instruments)) {
      return null;
    }

    // Validate: max 5 instruments, all are strings
    if (data.instruments.length > 5 || !data.instruments.every((id: any) => typeof id === 'string')) {
      return null;
    }

    return {
      name: data.name,
      instruments: data.instruments,
      created: Date.now(),
    };
  } catch {
    return null;
  }
}

/**
 * Generate shareable collection URL
 */
export function getCollectionShareUrl(collection: InstrumentCollection): string {
  const encoded = encodeCollection(collection);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/share/collection?data=${encoded}`;
}

/**
 * Validate collection
 */
export function isValidCollection(collection: any): collection is InstrumentCollection {
  return (
    collection &&
    typeof collection.name === 'string' &&
    collection.name.length > 0 &&
    Array.isArray(collection.instruments) &&
    collection.instruments.length >= 1 &&
    collection.instruments.length <= 5 &&
    collection.instruments.every((id: any) => typeof id === 'string')
  );
}
