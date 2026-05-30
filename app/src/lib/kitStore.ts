import type { KitConfig } from '@/types/kit';

const KEY = 'pad01:kits';
const MAX = 24;

export function saveKit(kit: KitConfig): void {
  if (typeof window === 'undefined') return;
  const kits = loadKits();
  const idx  = kits.findIndex((k) => k.prompt === kit.prompt);
  if (idx >= 0) kits[idx] = kit;
  else kits.unshift(kit);
  localStorage.setItem(KEY, JSON.stringify(kits.slice(0, MAX)));
}

export function loadKits(): KitConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as KitConfig[]) : [];
  } catch {
    return [];
  }
}

export function deleteKit(prompt: string): void {
  if (typeof window === 'undefined') return;
  const kits = loadKits().filter((k) => k.prompt !== prompt);
  localStorage.setItem(KEY, JSON.stringify(kits));
}
