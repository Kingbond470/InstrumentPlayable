export type PadType =
  | 'KIK' | 'SNR' | 'HAT' | 'OPN'
  | 'CLP' | 'TOM' | 'RIM' | 'CYM'
  | 'SUB' | 'BUZ' | 'VOX' | 'FX1'
  | 'ARP' | 'STB' | 'CHD' | 'END';

export const PAD_SEQUENCE: PadType[] = [
  'KIK', 'SNR', 'HAT', 'OPN',
  'CLP', 'TOM', 'RIM', 'CYM',
  'SUB', 'BUZ', 'VOX', 'FX1',
  'ARP', 'STB', 'CHD', 'END',
];

export interface KitConfig {
  prompt: string;
  name: string;
  bpm: number;
  key: string;
  mood: string;
  character: string;
  tags: string[];
  padNotes: Partial<Record<PadType, string | string[]>>;
  effects: {
    reverb: number;      // 0–1
    delay: number;       // 0–1
    distortion: number;  // 0–1
  };
}
