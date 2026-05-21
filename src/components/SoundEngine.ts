// SoundEngine.ts
// Standard browser Web Audio API audio-synthesizer for hardware emulation beeps

class SoundEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public playGoodRep() {
    this.init();
    if (!this.ctx) return;

    const dest = this.ctx.destination;
    const now = this.ctx.currentTime;

    // A pleasant double high-beep
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(680, now);
    osc1.frequency.setValueAtTime(960, now + 0.08);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.01);
    gainNode.gain.setValueAtTime(this.volume * 0.4, now + 0.16);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc1.connect(gainNode);
    gainNode.connect(dest);

    osc1.start(now);
    osc1.stop(now + 0.25);
  }

  public playOffFormRep() {
    this.init();
    if (!this.ctx) return;

    const dest = this.ctx.destination;
    const now = this.ctx.currentTime;

    // A flat, alert sawtooth double beep or low flat vibrato buzz
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    // Vibrato effect
    osc.frequency.linearRampToValueAtTime(140, now + 0.15);
    osc.frequency.linearRampToValueAtTime(180, now + 0.3);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, now + 0.02);
    gainNode.gain.setValueAtTime(this.volume * 0.5, now + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gainNode);
    gainNode.connect(dest);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playBluetoothConnect() {
    this.init();
    if (!this.ctx) return;

    const dest = this.ctx.destination;
    const now = this.ctx.currentTime;

    // Ascending power scale
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554, now + 0.1);
    osc.frequency.setValueAtTime(659, now + 0.2);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + 0.02);
    gainNode.gain.setValueAtTime(this.volume * 0.3, now + 0.28);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gainNode);
    gainNode.connect(dest);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playBluetoothDisconnect() {
    this.init();
    if (!this.ctx) return;

    const dest = this.ctx.destination;
    const now = this.ctx.currentTime;

    // Descending power scale
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659, now);
    osc.frequency.setValueAtTime(554, now + 0.1);
    osc.frequency.setValueAtTime(330, now + 0.2);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + 0.02);
    gainNode.gain.setValueAtTime(this.volume * 0.3, now + 0.28);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gainNode);
    gainNode.connect(dest);

    osc.start(now);
    osc.stop(now + 0.35);
  }
}

export const soundEngine = new SoundEngine();
