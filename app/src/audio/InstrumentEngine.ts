import {
  start, now, getContext,
  Gain, Reverb, FeedbackDelay,
  MembraneSynth, MetalSynth, PluckSynth, FMSynth, AMSynth, PolySynth, Synth,
  type ToneAudioNode,
} from 'tone';
import type { InstrumentDef } from '@/types/instrument';

type SynthInstance = ToneAudioNode & { triggerAttack?: (note: string, time?: number) => void };

export class InstrumentEngine {
  private started   = false;
  private voices: SynthInstance[] = [];
  private reverb!: Reverb;
  private delay!:  FeedbackDelay;
  private master!: Gain;
  private instrument: InstrumentDef | null = null;
  private visibilityHandler: (() => void) | null = null;

  // ── Recording (same as AudioEngine) ──────────────────────────────────
  private mediaDestination: MediaStreamAudioDestinationNode | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  private createEffects() {
    this.master = new Gain(0.8).toDestination();
    this.reverb = new Reverb({ decay: 2.0, wet: 0.25 }).connect(this.master);
    this.delay  = new FeedbackDelay({ delayTime: '8n', feedback: 0.2, wet: 0 }).connect(this.master);
  }

  // Build one synth voice per instrument voice, type-matched to the instrument family.
  private buildVoice(instrument: InstrumentDef, index: number): SynthInstance {
    const { family } = instrument;

    if (family === 'percussion') {
      // Mbira / trumpet / unknown pads → metallic pluck feel
      if (['mbira', 'trumpet'].includes(instrument.id)) {
        const s = new MetalSynth({ modulationIndex: 5, resonance: 3000, octaves: 0.5 });
        s.envelope.decay = 0.4; s.envelope.sustain = 0.1;
        return s.connect(this.reverb) as SynthInstance;
      }
      // Tabla / djembe / generic percussion → membrane
      const s = new MembraneSynth({
        pitchDecay: 0.04 + index * 0.005,
        octaves: 3 + (index % 4),
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
      });
      return s.connect(this.master) as SynthInstance;
    }

    if (family === 'strings') {
      // All string instruments use PluckSynth — most natural approximation.
      const s = new PluckSynth({
        attackNoise: instrument.id === 'sitar' ? 3 : 1,
        dampening: instrument.id === 'erhu'   ? 2000 :
                   instrument.id === 'koto'   ? 6000 :
                   instrument.id === 'harp'   ? 8000 : 4000,
        resonance: instrument.id === 'sitar'  ? 0.99 :
                   instrument.id === 'guitar' ? 0.97 : 0.96,
      });
      return s.connect(this.reverb) as SynthInstance;
    }

    if (family === 'wind') {
      // Flute / bansuri → breathy sine FM
      const s = new FMSynth({
        harmonicity: 1,
        modulationIndex: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.3 },
      });
      return s.connect(this.reverb) as SynthInstance;
    }

    if (family === 'keys') {
      const s = new PolySynth(Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.5, sustain: 0.3, release: 1.0 },
      });
      return s.connect(this.reverb) as SynthInstance;
    }

    if (family === 'brass') {
      const s = new FMSynth({
        harmonicity: 3, modulationIndex: 8,
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.03, decay: 0.1, sustain: 0.7, release: 0.2 },
      });
      return s.connect(this.master) as SynthInstance;
    }

    // Fallback
    const s = new Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.4 },
    });
    return s.connect(this.master) as SynthInstance;
  }

  async init() {
    if (this.started) return;
    await start();
    this.createEffects();
    this.started = true;

    this.visibilityHandler = () => {
      if (document.visibilityState === 'visible') getContext().resume();
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  loadInstrument(instrument: InstrumentDef) {
    // Dispose previous voices.
    this.voices.forEach((v) => v.dispose());
    this.voices = [];
    this.instrument = instrument;

    // Reverb wetness by culture — classical Indian / African → more room
    this.reverb.wet.value = ['Indian Classical', 'Chinese Classical', 'Japanese Classical'].includes(instrument.culture)
      ? 0.45 : 0.25;

    // Create one synth per voice.
    instrument.voices.forEach((_, i) => {
      this.voices.push(this.buildVoice(instrument, i));
    });
  }

  hit(voiceIndex: number) {
    if (!this.started || !this.instrument) return;
    const voice = this.voices[voiceIndex];
    const voiceDef = this.instrument.voices[voiceIndex];
    if (!voice || !voiceDef) return;

    const t = now();
    const { family } = this.instrument;

    if (family === 'strings' || (family === 'wind')) {
      // PluckSynth / FMSynth wind — triggerAttack only (natural decay)
      (voice as PluckSynth | FMSynth).triggerAttack(voiceDef.note, t);
    } else if (family === 'percussion') {
      if (['mbira', 'trumpet'].includes(this.instrument.id)) {
        (voice as MetalSynth).triggerAttackRelease('8n', t);
      } else {
        (voice as MembraneSynth).triggerAttackRelease(voiceDef.note, '8n', t);
      }
    } else if (family === 'keys') {
      (voice as PolySynth).triggerAttackRelease(voiceDef.note, '4n', t);
    } else if (family === 'brass') {
      (voice as FMSynth).triggerAttackRelease(voiceDef.note, '4n', t);
    }
  }

  // ── Recording ────────────────────────────────────────────────────────
  startRecording(): boolean {
    if (!this.started) return false;
    if (!this.mediaDestination) {
      const rawCtx = getContext().rawContext as AudioContext;
      this.mediaDestination = rawCtx.createMediaStreamDestination();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.master as any).connect(this.mediaDestination);
    }
    const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg']
      .find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
    this.chunks = [];
    this.recorder = new MediaRecorder(this.mediaDestination.stream, mime ? { mimeType: mime } : {});
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

  get isRecording() { return this.recorder !== null && this.recorder.state === 'recording'; }

  dispose() {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    this.voices.forEach((v) => v.dispose());
    this.voices = [];
    this.reverb?.dispose(); this.delay?.dispose(); this.master?.dispose();
    this.started = false;
  }
}

let _engine: InstrumentEngine | null = null;
export function getInstrumentEngine(): InstrumentEngine {
  if (!_engine) _engine = new InstrumentEngine();
  return _engine;
}
