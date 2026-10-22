/**
 * SlothFlow Procedural Ambient Audio Engine
 * Uses Web Audio API to synthesize relaxing soundscapes 100% offline with 0KB downloaded audio.
 */

class SlothAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;

  // Rain nodes
  private rainGain: GainNode | null = null;
  private rainNoiseNode: AudioNode | null = null;

  // Wind nodes
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windLfo: OscillatorNode | null = null;

  // Fire nodes
  private fireGain: GainNode | null = null;
  private fireInterval: number | null = null;

  // Binaural nodes
  private binauralGain: GainNode | null = null;
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;

  private timerId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate a buffer filled with brown/pink noise
  private createBrownNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext not ready');
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  public startSoundscape(channels: { rain: number; wind: number; fire: number; binaural: number }) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopSoundscape();
    this.isPlaying = true;

    const now = this.ctx.currentTime;

    // 1. Setup Rain (Filtered Brown Noise)
    const rainBuffer = this.createBrownNoiseBuffer();
    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(800, now);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(channels.rain, now);

    rainSource.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);
    rainSource.start();
    this.rainNoiseNode = rainSource;

    // 2. Setup Canopy Wind (Bandpass modulated noise)
    const windBuffer = this.createBrownNoiseBuffer();
    const windSource = this.ctx.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.setValueAtTime(400, now);
    this.windFilter.Q.setValueAtTime(3.0, now);

    // LFO for gentle wind gusts
    this.windLfo = this.ctx.createOscillator();
    this.windLfo.frequency.setValueAtTime(0.15, now);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, now);
    this.windLfo.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);
    this.windLfo.start();

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(channels.wind, now);

    windSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    windSource.start();

    // 3. Setup Campfire Crackle
    this.fireGain = this.ctx.createGain();
    this.fireGain.gain.setValueAtTime(channels.fire, now);
    this.fireGain.connect(this.masterGain);

    const scheduleCrackle = () => {
      if (!this.isPlaying || !this.ctx || !this.fireGain) return;
      const nextDelay = 80 + Math.random() * 320;
      this.fireInterval = window.setTimeout(() => {
        if (!this.isPlaying || !this.ctx || !this.fireGain) return;
        const crackle = this.ctx.createBufferSource();
        const cBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.04), this.ctx.sampleRate);
        const cData = cBuffer.getChannelData(0);
        for (let i = 0; i < cData.length; i++) {
          cData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.008));
        }
        crackle.buffer = cBuffer;

        const cFilter = this.ctx.createBiquadFilter();
        cFilter.type = 'bandpass';
        cFilter.frequency.value = 1800 + Math.random() * 2200;

        crackle.connect(cFilter);
        cFilter.connect(this.fireGain);
        crackle.start();
        scheduleCrackle();
      }, nextDelay);
    };
    scheduleCrackle();

    // 4. Setup Binaural Theta Beat (200Hz Left, 204.5Hz Right -> 4.5Hz Brainwave)
    this.binauralGain = this.ctx.createGain();
    this.binauralGain.gain.setValueAtTime(channels.binaural * 0.25, now);
    this.binauralGain.connect(this.masterGain);

    const merger = this.ctx.createChannelMerger(2);

    this.oscLeft = this.ctx.createOscillator();
    this.oscLeft.type = 'sine';
    this.oscLeft.frequency.setValueAtTime(196, now);
    this.oscLeft.connect(merger, 0, 0); // Left channel

    this.oscRight = this.ctx.createOscillator();
    this.oscRight.type = 'sine';
    this.oscRight.frequency.setValueAtTime(200.5, now); // 4.5 Hz difference
    this.oscRight.connect(merger, 0, 1); // Right channel

    merger.connect(this.binauralGain);
    this.oscLeft.start();
    this.oscRight.start();
  }

  public updateVolumes(channels: { rain: number; wind: number; fire: number; binaural: number }) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.rainGain) this.rainGain.gain.setTargetAtTime(channels.rain, now, 0.1);
    if (this.windGain) this.windGain.gain.setTargetAtTime(channels.wind, now, 0.1);
    if (this.fireGain) this.fireGain.gain.setTargetAtTime(channels.fire, now, 0.1);
    if (this.binauralGain) this.binauralGain.gain.setTargetAtTime(channels.binaural * 0.25, now, 0.1);
  }

  public setMasterVolume(val: number) {
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.1);
  }

  public stopSoundscape() {
    this.isPlaying = false;
    if (this.fireInterval) {
      clearTimeout(this.fireInterval);
      this.fireInterval = null;
    }
    if (this.windLfo) {
      try { this.windLfo.stop(); } catch {}
      this.windLfo = null;
    }
    if (this.oscLeft) {
      try { this.oscLeft.stop(); } catch {}
      this.oscLeft = null;
    }
    if (this.oscRight) {
      try { this.oscRight.stop(); } catch {}
      this.oscRight = null;
    }
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setSleepTimer(minutes: number, onComplete?: () => void) {
    if (this.timerId) clearTimeout(this.timerId);
    if (minutes <= 0) return;

    this.timerId = window.setTimeout(() => {
      // Fade out master volume smoothly over 10 seconds
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 3.0);
        setTimeout(() => {
          this.stopSoundscape();
          if (onComplete) onComplete();
        }, 5000);
      } else {
        this.stopSoundscape();
        if (onComplete) onComplete();
      }
    }, minutes * 60 * 1000);
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioEngine = new SlothAudioEngine();
