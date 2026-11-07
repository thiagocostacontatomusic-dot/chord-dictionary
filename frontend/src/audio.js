// Plucked-string synthesis (Karplus-Strong) with the Web Audio API. No audio files needed.
const TUNING_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4, string 6 -> 1
let ctx = null;

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export const audioSupported = () => typeof window !== 'undefined' && !!(window.AudioContext || window.webkitAudioContext);

function pluck(ac, midi, when, dur = 2.2, gain = 0.28) {
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  const n = Math.round(ac.sampleRate / freq);
  const len = Math.round(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  const ring = new Float32Array(n);
  for (let i = 0; i < n; i++) ring[i] = Math.random() * 2 - 1;
  for (let i = 0; i < len; i++) {
    const j = i % n;
    d[i] = ring[j];
    ring[j] = 0.4985 * (ring[j] + ring[(j + 1) % n]);
  }
  const src = ac.createBufferSource();
  src.buffer = buf;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, when);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  src.connect(g).connect(ac.destination);
  src.start(when);
}

// positions: [{string: 6..1, fret: number|null}]
export function strum(positions, { gap = 0.045 } = {}) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + 0.02;
  positions
    .filter((p) => p.fret !== null)
    .sort((a, b) => b.string - a.string)
    .forEach((p, i) => pluck(ac, TUNING_MIDI[6 - p.string] + p.fret, t0 + i * gap));
}

// midis: array of MIDI numbers, played one after another
export function playNotes(midis, step = 0.28) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + 0.02;
  midis.forEach((m, i) => pluck(ac, m, t0 + i * step, 1.4, 0.3));
}

// A list of chords (each a positions array), strummed one after another.
export function strumSequence(list, spacing = 1.15) {
  const ac = getCtx();
  if (!ac) return;
  list.forEach((positions, k) => {
    const t0 = ac.currentTime + 0.02 + k * spacing;
    positions
      .filter((p) => p.fret !== null)
      .sort((a, b) => b.string - a.string)
      .forEach((p, i) => pluck(ac, TUNING_MIDI[6 - p.string] + p.fret, t0 + i * 0.045, 1.8));
  });
}
