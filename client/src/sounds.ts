// Web Audio API sound effects - no external files needed
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function ensureAudioContext() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  if (!audioCtx) return;
  ensureAudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playNotes(notes: [number, number][], type: OscillatorType = 'sine', volume = 0.12) {
  if (!audioCtx) return;
  ensureAudioContext();
  let offset = 0;
  for (const [freq, dur] of notes) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + offset);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + offset + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + offset);
    osc.stop(audioCtx.currentTime + offset + dur);
    offset += dur * 0.7;
  }
}

export const SFX = {
  countdown: () => playTone(440, 0.2, 'square', 0.1),
  countdownGo: () => playNotes([[523, 0.15], [659, 0.15], [784, 0.3]], 'square', 0.12),

  click: () => playTone(600, 0.08, 'sine', 0.08),
  select: () => playTone(800, 0.12, 'sine', 0.1),

  correct: () => playNotes([[523, 0.12], [659, 0.12], [784, 0.25]], 'sine', 0.15),
  wrong: () => playNotes([[300, 0.15], [250, 0.3]], 'sawtooth', 0.08),

  powerUpHit: () => playNotes([[200, 0.1], [150, 0.1], [100, 0.2]], 'sawtooth', 0.1),
  powerUpSelf: () => playNotes([[400, 0.1], [600, 0.1], [800, 0.15]], 'sine', 0.1),

  tick: () => playTone(1000, 0.03, 'sine', 0.04),
  tickUrgent: () => playTone(1200, 0.06, 'square', 0.08),

  victory: () => playNotes([[523, 0.15], [587, 0.15], [659, 0.15], [784, 0.15], [1047, 0.4]], 'sine', 0.15),
  defeat: () => playNotes([[400, 0.2], [350, 0.2], [300, 0.4]], 'triangle', 0.1),

  pyramidClimb: () => playNotes([[300, 0.1], [400, 0.1], [500, 0.15]], 'triangle', 0.1),
  pyramidFall: () => playTone(200, 0.3, 'sawtooth', 0.08),

  gameStart: () => playNotes([[392, 0.12], [440, 0.12], [523, 0.12], [659, 0.12], [784, 0.3]], 'square', 0.1),

  miniGameCorrect: () => playTone(700, 0.08, 'sine', 0.1),
  miniGameWrong: () => playTone(250, 0.15, 'sawtooth', 0.06),

  slimeWipe: () => playTone(300 + Math.random() * 200, 0.05, 'sine', 0.05),
  freeze: () => playNotes([[1200, 0.05], [1000, 0.05], [800, 0.05], [600, 0.1]], 'sine', 0.08),
  bomb: () => playNotes([[100, 0.1], [80, 0.15], [60, 0.2]], 'sawtooth', 0.12),
};
