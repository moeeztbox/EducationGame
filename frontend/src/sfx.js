// Tiny synthesized sound effects (no audio files needed).
let ctx;
let muted = false;

export const isMuted = () => muted;
export const setMuted = (m) => { muted = m; };

function tone(freq, start, dur, type = 'sine', vol = 0.15) {
  if (muted) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  } catch {
    // audio is optional
  }
}

export const sfx = {
  pick: () => tone(440, 0, 0.05, 'sine', 0.06),
  ok: () => { tone(660, 0, 0.12); tone(880, 0.1, 0.18); },
  bad: () => tone(200, 0, 0.22, 'square', 0.07),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.28)),
};
