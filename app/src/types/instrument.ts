export type InstrumentFamily = 'strings' | 'percussion' | 'keys' | 'wind' | 'brass';
export type UIType = 'pads' | 'strings' | 'keys';

export interface InstrumentVoice {
  label: string;
  note: string;
}

export interface InstrumentDef {
  id: string;
  name: string;
  aliases: string[];         // alternate names Claude might return
  family: InstrumentFamily;
  culture: string;
  uiType: UIType;
  accent: string;            // per-instrument accent color (replaces T.red)
  description: string;
  voices: InstrumentVoice[]; // for pads: each pad; for strings: each string
}

export interface IdentifiedInstrument {
  id: string;
  name: string;
  family: InstrumentFamily;
  culture: string;
  confidence: number;
  description: string;
}
