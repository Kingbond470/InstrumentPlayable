import type { InstrumentDef } from '@/types/instrument';

export const INSTRUMENTS: Record<string, InstrumentDef> = {

  // ── Indian Classical ──────────────────────────────────────────────────
  tabla: {
    id: 'tabla', name: 'Tabla', family: 'percussion', culture: 'Indian Classical',
    aliases: ['tabla', 'tablas', 'dhol'],
    uiType: 'pads', accent: '#C2703A',
    description: 'Paired hand drums at the heart of Hindustani music.',
    voices: [
      { label: 'NA',   note: 'D3'  },
      { label: 'TIN',  note: 'A3'  },
      { label: 'TA',   note: 'F#3' },
      { label: 'DHA',  note: 'C3'  },
      { label: 'GE',   note: 'G2'  },
      { label: 'TUN',  note: 'E3'  },
      { label: 'KE',   note: 'B2'  },
      { label: 'DHIN', note: 'D2'  },
    ],
  },

  sitar: {
    id: 'sitar', name: 'Sitar', family: 'strings', culture: 'Indian Classical',
    aliases: ['sitar', 'sarod', 'veena', 'vina', 'sarangi'],
    uiType: 'strings', accent: '#8B5E3C',
    description: 'Long-necked lute with sympathetic strings and rich overtones.',
    voices: [
      { label: 'Sa',  note: 'C4' },
      { label: 'Re',  note: 'D4' },
      { label: 'Ga',  note: 'Eb4' },
      { label: 'Ma',  note: 'F4' },
      { label: 'Pa',  note: 'G4' },
      { label: 'Dha', note: 'Ab4' },
      { label: 'Ni',  note: 'Bb4' },
      { label: 'SA',  note: 'C5' },
    ],
  },

  bansuri: {
    id: 'bansuri', name: 'Bansuri', family: 'wind', culture: 'Indian Classical',
    aliases: ['bansuri', 'flute', 'murali', 'venu', 'bamboo flute'],
    uiType: 'strings', accent: '#4A7C59',
    description: 'Transverse bamboo flute associated with Lord Krishna.',
    voices: [
      { label: 'Sa',  note: 'C5'  },
      { label: 'Re',  note: 'D5'  },
      { label: 'Ga',  note: 'E5'  },
      { label: 'Ma',  note: 'F5'  },
      { label: 'Pa',  note: 'G5'  },
      { label: 'Dha', note: 'A5'  },
      { label: 'Ni',  note: 'B5'  },
    ],
  },

  // ── East Asian ────────────────────────────────────────────────────────
  erhu: {
    id: 'erhu', name: 'Erhu', family: 'strings', culture: 'Chinese Classical',
    aliases: ['erhu', 'er hu', 'chinese violin', 'huqin', 'urheen'],
    uiType: 'strings', accent: '#A0522D',
    description: 'Two-stringed bowed instrument — the "Chinese violin."',
    voices: [
      { label: 'D4',  note: 'D4'  },
      { label: 'E4',  note: 'E4'  },
      { label: 'F#4', note: 'F#4' },
      { label: 'G4',  note: 'G4'  },
      { label: 'A4',  note: 'A4'  },
      { label: 'B4',  note: 'B4'  },
      { label: 'C5',  note: 'C5'  },
      { label: 'D5',  note: 'D5'  },
    ],
  },

  koto: {
    id: 'koto', name: 'Koto', family: 'strings', culture: 'Japanese Classical',
    aliases: ['koto', 'koto harp', 'japanese harp', 'zither', 'guqin', 'guzheng'],
    uiType: 'strings', accent: '#6B4C3B',
    description: '13-stringed Japanese zither played with finger picks.',
    voices: [
      { label: 'D4',  note: 'D4'  },
      { label: 'E4',  note: 'E4'  },
      { label: 'G4',  note: 'G4'  },
      { label: 'A4',  note: 'A4'  },
      { label: 'B4',  note: 'B4'  },
      { label: 'D5',  note: 'D5'  },
      { label: 'E5',  note: 'E5'  },
      { label: 'G5',  note: 'G5'  },
    ],
  },

  // ── African ───────────────────────────────────────────────────────────
  mbira: {
    id: 'mbira', name: 'Mbira', family: 'percussion', culture: 'Shona / Zimbabwean',
    aliases: ['mbira', 'thumb piano', 'kalimba', 'sanza', 'likembe', 'lamellaphone'],
    uiType: 'pads', accent: '#7B6B3D',
    description: 'Thumb piano with metal tines — the "voice of the ancestors."',
    voices: [
      { label: 'G3',  note: 'G3'  },
      { label: 'A3',  note: 'A3'  },
      { label: 'B3',  note: 'B3'  },
      { label: 'C4',  note: 'C4'  },
      { label: 'D4',  note: 'D4'  },
      { label: 'E4',  note: 'E4'  },
      { label: 'G4',  note: 'G4'  },
      { label: 'A4',  note: 'A4'  },
    ],
  },

  kora: {
    id: 'kora', name: 'Kora', family: 'strings', culture: 'West African (Mandinka)',
    aliases: ['kora', 'west african harp', 'ngoni', 'griot harp'],
    uiType: 'strings', accent: '#8B7355',
    description: '21-string bridge harp of the griot tradition.',
    voices: [
      { label: 'C3',  note: 'C3'  },
      { label: 'D3',  note: 'D3'  },
      { label: 'F3',  note: 'F3'  },
      { label: 'G3',  note: 'G3'  },
      { label: 'A3',  note: 'A3'  },
      { label: 'C4',  note: 'C4'  },
      { label: 'D4',  note: 'D4'  },
      { label: 'F4',  note: 'F4'  },
    ],
  },

  djembe: {
    id: 'djembe', name: 'Djembe', family: 'percussion', culture: 'West African',
    aliases: ['djembe', 'jembe', 'dunun', 'talking drum', 'african drum'],
    uiType: 'pads', accent: '#8B4513',
    description: 'Goblet-shaped rope-tuned drum from West Africa.',
    voices: [
      { label: 'BASS',  note: 'C2'  },
      { label: 'TONE',  note: 'G3'  },
      { label: 'SLAP',  note: 'D4'  },
      { label: 'MUTE',  note: 'F3'  },
      { label: 'BASS2', note: 'D2'  },
      { label: 'TONE2', note: 'A3'  },
      { label: 'SLAP2', note: 'F4'  },
      { label: 'OPEN',  note: 'E3'  },
    ],
  },

  // ── Western Classical ─────────────────────────────────────────────────
  guitar: {
    id: 'guitar', name: 'Guitar', family: 'strings', culture: 'Western',
    aliases: ['guitar', 'acoustic guitar', 'electric guitar', 'classical guitar', 'lute', 'oud'],
    uiType: 'strings', accent: '#6B3A2A',
    description: 'Six-stringed plucked instrument, standard tuning.',
    voices: [
      { label: 'E2', note: 'E2' },
      { label: 'A2', note: 'A2' },
      { label: 'D3', note: 'D3' },
      { label: 'G3', note: 'G3' },
      { label: 'B3', note: 'B3' },
      { label: 'E4', note: 'E4' },
    ],
  },

  piano: {
    id: 'piano', name: 'Piano', family: 'keys', culture: 'Western',
    aliases: ['piano', 'keyboard', 'harpsichord', 'clavichord', 'fortepiano', 'grand piano', 'upright piano'],
    uiType: 'keys', accent: '#1A1A2E',
    description: 'The keyboard instrument that shaped Western music.',
    voices: [
      { label: 'C4',  note: 'C4'  },
      { label: 'D4',  note: 'D4'  },
      { label: 'E4',  note: 'E4'  },
      { label: 'F4',  note: 'F4'  },
      { label: 'G4',  note: 'G4'  },
      { label: 'A4',  note: 'A4'  },
      { label: 'B4',  note: 'B4'  },
      { label: 'C5',  note: 'C5'  },
    ],
  },

  violin: {
    id: 'violin', name: 'Violin', family: 'strings', culture: 'Western',
    aliases: ['violin', 'viola', 'fiddle', 'cello', 'double bass', 'string instrument'],
    uiType: 'strings', accent: '#7B3F00',
    description: 'Four-stringed bowed instrument, backbone of the orchestra.',
    voices: [
      { label: 'G3', note: 'G3' },
      { label: 'D4', note: 'D4' },
      { label: 'A4', note: 'A4' },
      { label: 'E5', note: 'E5' },
      { label: 'B4', note: 'B4' },
      { label: 'F#4', note: 'F#4' },
      { label: 'C5', note: 'C5' },
      { label: 'G4', note: 'G4' },
    ],
  },

  harp: {
    id: 'harp', name: 'Harp', family: 'strings', culture: 'Western / Ancient',
    aliases: ['harp', 'concert harp', 'pedal harp', 'celtic harp', 'lyre'],
    uiType: 'strings', accent: '#4A4A8A',
    description: 'Ancient plucked instrument — played in every culture on earth.',
    voices: [
      { label: 'C4', note: 'C4' },
      { label: 'D4', note: 'D4' },
      { label: 'E4', note: 'E4' },
      { label: 'F4', note: 'F4' },
      { label: 'G4', note: 'G4' },
      { label: 'A4', note: 'A4' },
      { label: 'B4', note: 'B4' },
      { label: 'C5', note: 'C5' },
    ],
  },

  flute: {
    id: 'flute', name: 'Flute', family: 'wind', culture: 'Western',
    aliases: ['flute', 'piccolo', 'recorder', 'pan flute', 'ocarina', 'shakuhachi'],
    uiType: 'strings', accent: '#2E6B4F',
    description: 'Woodwind instrument — the oldest known musical instrument.',
    voices: [
      { label: 'C5',  note: 'C5'  },
      { label: 'D5',  note: 'D5'  },
      { label: 'E5',  note: 'E5'  },
      { label: 'F5',  note: 'F5'  },
      { label: 'G5',  note: 'G5'  },
      { label: 'A5',  note: 'A5'  },
      { label: 'B5',  note: 'B5'  },
    ],
  },

  trumpet: {
    id: 'trumpet', name: 'Trumpet', family: 'brass', culture: 'Western',
    aliases: ['trumpet', 'horn', 'bugle', 'cornet', 'trombone', 'tuba', 'brass', 'french horn'],
    uiType: 'pads', accent: '#B8860B',
    description: 'The oldest brass instrument — from ancient Egypt to jazz.',
    voices: [
      { label: 'C3',  note: 'C3'  },
      { label: 'G3',  note: 'G3'  },
      { label: 'C4',  note: 'C4'  },
      { label: 'E4',  note: 'E4'  },
      { label: 'G4',  note: 'G4'  },
      { label: 'Bb4', note: 'Bb4' },
      { label: 'C5',  note: 'C5'  },
      { label: 'D5',  note: 'D5'  },
    ],
  },

  // ── Fallback ──────────────────────────────────────────────────────────
  unknown: {
    id: 'unknown', name: 'Mystery Instrument', family: 'percussion', culture: 'Unknown',
    aliases: [],
    uiType: 'pads', accent: '#555555',
    description: 'Something unique — play it and find out.',
    voices: [
      { label: 'I',    note: 'C3'  },
      { label: 'II',   note: 'E3'  },
      { label: 'III',  note: 'G3'  },
      { label: 'IV',   note: 'Bb3' },
      { label: 'V',    note: 'C4'  },
      { label: 'VI',   note: 'E4'  },
      { label: 'VII',  note: 'G4'  },
      { label: 'VIII', note: 'C5'  },
    ],
  },
};

// All IDs Claude can return
export const INSTRUMENT_IDS = Object.keys(INSTRUMENTS).join(', ');

export function resolveInstrument(id: string): InstrumentDef {
  const exact = INSTRUMENTS[id.toLowerCase()];
  if (exact) return exact;

  // Fuzzy: check aliases
  const lower = id.toLowerCase();
  for (const inst of Object.values(INSTRUMENTS)) {
    if (inst.aliases.some((a) => lower.includes(a) || a.includes(lower))) return inst;
  }

  return INSTRUMENTS.unknown;
}
