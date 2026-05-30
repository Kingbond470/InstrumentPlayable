import {
  start, Transport, now, getContext,
  Gain, Reverb, FeedbackDelay, Distortion,
  MembraneSynth, NoiseSynth, MetalSynth, Synth, FMSynth, AMSynth, PolySynth,
  type ToneAudioNode,
} from 'tone';
import type { KitConfig, PadType } from '@/types/kit';

class AudioEngine {
  private started = false;
  private synths: Partial<Record<PadType, ToneAudioNode>> = {};
  private reverb!: Reverb;
  private delay!: FeedbackDelay;
  private dist!: Distortion;
  private master!: Gain;
  private kit: KitConfig | null = null;

  // ── Recording ────────────────────────────────────────────────────────────
  private mediaDestination: MediaStreamAudioDestinationNode | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  // B3 fix: store handler ref so it can be removed in dispose().
  private visibilityHandler: (() => void) | null = null;

  private createEffects() {
    this.master = new Gain(0.75).toDestination();
    this.reverb = new Reverb({ decay: 2.5, wet: 0.3 }).connect(this.master);
    this.delay  = new FeedbackDelay({ delayTime: '8n', feedback: 0.25, wet: 0 }).connect(this.master);
    this.dist   = new Distortion({ distortion: 0.35, wet: 0 }).connect(this.master);
  }

  private makeHat(decay: number): MetalSynth {
    const s = new MetalSynth({ modulationIndex: 10, resonance: 3000, octaves: 1.5 });
    s.envelope.decay   = decay;
    s.envelope.sustain = decay > 0.2 ? 0.04 : 0;
    return s;
  }

  private createSynths() {
    this.synths.KIK = new MembraneSynth({ pitchDecay: 0.05, octaves: 6, envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 } }).connect(this.master);
    this.synths.SNR = new NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0 } }).connect(this.reverb);
    this.synths.HAT = this.makeHat(0.08).connect(this.master);
    this.synths.OPN = this.makeHat(0.55).connect(this.reverb);
    this.synths.CLP = new NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.005, decay: 0.12, sustain: 0, release: 0 } }).connect(this.reverb);
    this.synths.TOM = new MembraneSynth({ pitchDecay: 0.08, octaves: 4, envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.1 } }).connect(this.reverb);

    const rim = new MetalSynth({ modulationIndex: 8, resonance: 5000, octaves: 0.5 });
    rim.envelope.decay = 0.06; rim.envelope.sustain = 0;
    this.synths.RIM = rim.connect(this.master);

    const cym = new MetalSynth({ modulationIndex: 16, resonance: 4000, octaves: 2 });
    cym.envelope.decay = 1.4; cym.envelope.sustain = 0.05;
    this.synths.CYM = cym.connect(this.reverb);

    this.synths.SUB = new Synth({ oscillator: { type: 'sine' },     envelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 0.4 } }).connect(this.master);
    this.synths.BUZ = new FMSynth({ harmonicity: 2, modulationIndex: 5, oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 } }).connect(this.dist);
    this.synths.VOX = new AMSynth({ harmonicity: 1.5, envelope: { attack: 0.05, decay: 0.4, sustain: 0.2, release: 0.6 } }).connect(this.reverb);
    this.synths.FX1 = new FMSynth({ harmonicity: 7, modulationIndex: 12, envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.1 } }).connect(this.dist);
    this.synths.ARP = new Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.25, sustain: 0.05, release: 0.2 } }).connect(this.delay);
    this.synths.STB = new PolySynth(Synth, { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.05 } }).connect(this.dist);
    this.synths.CHD = new PolySynth(Synth, { oscillator: { type: 'sine' }, envelope: { attack: 0.06, decay: 0.8, sustain: 0.3, release: 1.2 } }).connect(this.reverb);
    this.synths.END = new Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.6, sustain: 0, release: 0.1 } }).connect(this.delay);
  }

  async init() {
    if (this.started) return;
    await start();
    this.createEffects();
    this.createSynths();
    this.started = true;

    // Resume AudioContext when user returns to the tab.
    // Browsers suspend it on visibility loss; pads go silent without this.
    this.visibilityHandler = () => {
      if (document.visibilityState === 'visible') getContext().resume();
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  loadKit(kit: KitConfig) {
    this.kit = kit;
    Transport.bpm.value = kit.bpm;
    if (this.started) {
      this.reverb.wet.value = kit.effects.reverb * 0.7;
      this.delay.wet.value  = kit.effects.delay  * 0.5;
      this.dist.wet.value   = kit.effects.distortion * 0.6;
    }
  }

  hit(padType: PadType) {
    if (!this.started || !this.kit) return;
    const t     = now();
    const notes = this.kit.padNotes;
    switch (padType) {
      case 'KIK': (this.synths.KIK as MembraneSynth).triggerAttackRelease('C1',  '8n',  t); break;
      case 'SNR': (this.synths.SNR as NoiseSynth).triggerAttackRelease(          '8n',  t); break;
      case 'HAT': (this.synths.HAT as MetalSynth).triggerAttackRelease(          '16n', t); break;
      case 'OPN': (this.synths.OPN as MetalSynth).triggerAttackRelease(          '4n',  t); break;
      case 'CLP': (this.synths.CLP as NoiseSynth).triggerAttackRelease(          '8n',  t); break;
      case 'TOM': (this.synths.TOM as MembraneSynth).triggerAttackRelease('G1',  '8n',  t); break;
      case 'RIM': (this.synths.RIM as MetalSynth).triggerAttackRelease(          '16n', t); break;
      case 'CYM': (this.synths.CYM as MetalSynth).triggerAttackRelease(          '2n',  t); break;
      case 'SUB': (this.synths.SUB as Synth).triggerAttackRelease((notes.SUB as string) ?? 'A1', '8n', t); break;
      case 'BUZ': (this.synths.BUZ as FMSynth).triggerAttackRelease((notes.BUZ as string) ?? 'E2', '8n', t); break;
      case 'VOX': (this.synths.VOX as AMSynth).triggerAttackRelease((notes.VOX as string) ?? 'C3', '4n', t); break;
      case 'FX1': (this.synths.FX1 as FMSynth).triggerAttackRelease((notes.FX1 as string) ?? 'G2', '8n', t); break;
      case 'ARP': (this.synths.ARP as Synth).triggerAttackRelease((notes.ARP as string) ?? 'A3', '16n', t); break;
      case 'STB': (this.synths.STB as PolySynth).triggerAttackRelease(Array.isArray(notes.STB) ? notes.STB : [(notes.STB as string) ?? 'E3'], '16n', t); break;
      case 'CHD': (this.synths.CHD as PolySynth).triggerAttackRelease(Array.isArray(notes.CHD) ? notes.CHD : ['A3','C4','E4'], '2n', t); break;
      case 'END': (this.synths.END as Synth).triggerAttackRelease((notes.END as string) ?? 'A2', '4n', t); break;
    }
  }

  // ── Recording API ────────────────────────────────────────────────────────

  startRecording(): boolean {
    if (!this.started) return false;

    if (!this.mediaDestination) {
      const rawCtx = getContext().rawContext as AudioContext;
      this.mediaDestination = rawCtx.createMediaStreamDestination();
      // Tone.js connect() accepts native AudioNode at runtime even if types disagree.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.master as any).connect(this.mediaDestination);
    }

    const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg']
      .find((t) => MediaRecorder.isTypeSupported(t)) ?? '';

    this.chunks = [];
    this.recorder = new MediaRecorder(
      this.mediaDestination.stream,
      mime ? { mimeType: mime } : {},
    );
    this.recorder.ondataavailable = (e) => { if (e.data.size > 0) this.chunks.push(e.data); };
    this.recorder.start(100);
    return true;
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.recorder || this.recorder.state === 'inactive') { resolve(new Blob()); return; }
      const mime = this.recorder.mimeType;
      this.recorder.onstop = () => { resolve(new Blob(this.chunks, { type: mime })); this.chunks = []; };
      this.recorder.stop();
      this.recorder = null;
    });
  }

  get isRecording(): boolean { return this.recorder !== null && this.recorder.state === 'recording'; }

  dispose() {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    Object.values(this.synths).forEach((s) => s?.dispose());
    this.reverb?.dispose(); this.delay?.dispose(); this.dist?.dispose(); this.master?.dispose();
    this.started = false; this.synths = {};
  }
}

let _engine: AudioEngine | null = null;
export function getAudioEngine(): AudioEngine {
  if (!_engine) _engine = new AudioEngine();
  return _engine;
}
