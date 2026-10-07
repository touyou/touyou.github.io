import type { Voice } from "./pads";

/**
 * デモの音を Web Audio API で合成する。音声ファイルは読み込まない。
 * AudioContext は、最初にパッドが押されたとき（ユーザーの操作の中）で作る。ブラウザは操作の前に音を出させないため。
 */
export class PadSynth {
  private context: AudioContext | null = null;
  private output: AudioNode | null = null;
  private noise: AudioBuffer | null = null;

  /** 操作のたびに呼ぶ。初回だけ AudioContext を作り、止まっていれば再開する */
  ensure(): AudioContext {
    if (!this.context) {
      const context = new AudioContext();
      // 何個も重ねて鳴らしても割れないよう、最後にコンプレッサーを通す
      const master = context.createGain();
      master.gain.value = 0.55;
      const compressor = context.createDynamicsCompressor();
      master.connect(compressor).connect(context.destination);
      this.context = context;
      this.output = master;
    }
    if (this.context.state === "suspended") void this.context.resume();
    return this.context;
  }

  get currentTime(): number {
    return this.context?.currentTime ?? 0;
  }

  close() {
    void this.context?.close();
    this.context = null;
    this.output = null;
    this.noise = null;
  }

  /** when を省くとすぐに鳴らす */
  play(voice: Voice, when?: number) {
    const ctx = this.ensure();
    const out = this.output!;
    const t = Math.max(when ?? ctx.currentTime, ctx.currentTime);
    switch (voice.kind) {
      case "kick":
        return this.kick(ctx, out, t);
      case "snare":
        return this.snare(ctx, out, t);
      case "hat":
        return this.noiseHit(ctx, out, t, { type: "highpass", frequency: 7000, gain: 0.35, decay: 0.05 });
      case "clap":
        // 少しずつずらした 3 回の短いノイズで、手をたたいた感じを出す
        for (const offset of [0, 0.012, 0.024]) {
          this.noiseHit(ctx, out, t + offset, { type: "bandpass", frequency: 1500, gain: 0.6, decay: offset === 0.024 ? 0.18 : 0.02 });
        }
        return;
      case "bass":
        return this.tone(ctx, out, t, [voice.frequency], { type: "triangle", gain: 0.7, attack: 0.005, decay: 0.45, cutoff: 600 });
      case "chord":
        return this.tone(ctx, out, t, voice.frequencies, { type: "sawtooth", gain: 0.12, attack: 0.02, decay: 0.9, cutoff: 1800 });
      case "bleep":
        return this.tone(ctx, out, t, [voice.frequency], { type: "square", gain: 0.16, attack: 0.003, decay: 0.28, cutoff: 3200 });
    }
  }

  private kick(ctx: AudioContext, out: AudioNode, t: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    gain.gain.setValueAtTime(1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    osc.connect(gain).connect(out);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  private snare(ctx: AudioContext, out: AudioNode, t: number) {
    this.noiseHit(ctx, out, t, { type: "highpass", frequency: 1200, gain: 0.55, decay: 0.18 });
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(190, t);
    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain).connect(out);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  private noiseHit(
    ctx: AudioContext,
    out: AudioNode,
    t: number,
    { type, frequency, gain: level, decay }: { type: BiquadFilterType; frequency: number; gain: number; decay: number },
  ) {
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(level, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);
    source.connect(filter).connect(gain).connect(out);
    source.start(t);
    source.stop(t + decay + 0.02);
  }

  private tone(
    ctx: AudioContext,
    out: AudioNode,
    t: number,
    frequencies: number[],
    { type, gain: level, attack, decay, cutoff }: { type: OscillatorType; gain: number; attack: number; decay: number; cutoff: number },
  ) {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(level, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, t + attack + decay);
    filter.connect(gain).connect(out);
    for (const frequency of frequencies) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = frequency;
      osc.connect(filter);
      osc.start(t);
      osc.stop(t + attack + decay + 0.05);
    }
  }

  /** 白色雑音を 1 秒ぶん作って使い回す */
  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noise) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.noise = buffer;
    }
    return this.noise;
  }
}
