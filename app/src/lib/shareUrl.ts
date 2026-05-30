import type { KitConfig } from '@/types/kit';

// Minimal projection keeps the URL short (~500 chars encoded).
interface Packed {
  p: string; n: string; b: number; k: string;
  m: string; c: string; t: string[];
  pn: KitConfig['padNotes'];
  e: KitConfig['effects'];
}

export function encodeKit(kit: KitConfig): string {
  const packed: Packed = {
    p: kit.prompt, n: kit.name, b: kit.bpm, k: kit.key,
    m: kit.mood, c: kit.character, t: kit.tags,
    pn: kit.padNotes, e: kit.effects,
  };
  return btoa(encodeURIComponent(JSON.stringify(packed)));
}

export function decodeKit(encoded: string): KitConfig | null {
  try {
    const packed = JSON.parse(decodeURIComponent(atob(encoded))) as Packed;
    return {
      prompt: packed.p, name: packed.n, bpm: packed.b, key: packed.k,
      mood: packed.m, character: packed.c, tags: packed.t,
      padNotes: packed.pn, effects: packed.e,
    };
  } catch {
    return null;
  }
}

export function kitShareUrl(kit: KitConfig): string {
  return `${window.location.origin}/play?kit=${encodeKit(kit)}`;
}
