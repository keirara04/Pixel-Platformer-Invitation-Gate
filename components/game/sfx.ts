// Simple 8-bit-style sound effects synthesized with the Web Audio API — no
// audio files needed. Safe to call from anywhere client-side; each function
// lazily creates/resumes a shared AudioContext.

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    ctx = new AudioContextClass();
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  {
    type = "square",
    startTime = 0,
    gain = 0.15,
  }: { type?: OscillatorType; startTime?: number; gain?: number } = {}
) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = audioCtx.currentTime + startTime;
  gainNode.gain.setValueAtTime(0, t0);
  gainNode.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playJump() {
  tone(420, 0.12, { type: "square" });
  tone(620, 0.08, { type: "square", startTime: 0.04, gain: 0.1 });
}

export function playCollect() {
  tone(660, 0.09, { type: "sine", gain: 0.18 });
  tone(880, 0.12, { type: "sine", startTime: 0.08, gain: 0.18 });
}

export function playWrongAnswer() {
  tone(300, 0.1, { type: "sawtooth", gain: 0.12 });
  tone(180, 0.18, { type: "sawtooth", startTime: 0.1, gain: 0.12 });
}

export function playCorrectAnswer() {
  tone(523, 0.1, { type: "sine", gain: 0.16 });
  tone(659, 0.14, { type: "sine", startTime: 0.09, gain: 0.16 });
}

export function playLevelComplete() {
  tone(523, 0.1, { type: "square", gain: 0.15 });
  tone(659, 0.1, { type: "square", startTime: 0.1, gain: 0.15 });
  tone(784, 0.18, { type: "square", startTime: 0.2, gain: 0.15 });
}

export function playWin() {
  tone(523, 0.12, { type: "sine", gain: 0.16 });
  tone(659, 0.12, { type: "sine", startTime: 0.11, gain: 0.16 });
  tone(784, 0.12, { type: "sine", startTime: 0.22, gain: 0.16 });
  tone(1046, 0.28, { type: "sine", startTime: 0.33, gain: 0.18 });
}
