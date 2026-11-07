// Harmony helpers for the circle of fifths and the modes.
export const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// The seven chords of a major scale, by scale degree (I ii iii IV V vi vii°).
export const DEGREES = [
  { off: 0, q: 'major' },
  { off: 2, q: 'minor' },
  { off: 4, q: 'minor' },
  { off: 5, q: 'major' },
  { off: 7, q: 'major' },
  { off: 9, q: 'minor' },
  { off: 11, q: 'dim' },
];

// Mode m starts on degree m of its parent major scale: D Dorian = C major starting on D.
export const MODES = [
  { key: 'ionian', off: 0 },
  { key: 'dorian', off: 2 },
  { key: 'phrygian', off: 4 },
  { key: 'lydian', off: 5 },
  { key: 'mixolydian', off: 7 },
  { key: 'aeolian', off: 9 },
  { key: 'locrian', off: 11 },
].map((m, i) => ({ ...m, qual: DEGREES[i].q }));

export const FAMILY = {
  major: ['major', 'six', 'dom7', 'maj7', 'add9', 'sus2', 'sus4', 'power5', 'aug'],
  minor: ['minor', 'minor6', 'min7'],
  dim: ['dim', 'dim7', 'halfdim'],
};

export const mod12 = (n) => ((n % 12) + 12) % 12;
// Position on the wheel (0 = C at the top, 1 = G, 2 = D ...): fifths go up by 7 semitones.
export const fifthsIndex = (pc) => mod12(7 * pc);
export const pcAtIndex = (i) => mod12(7 * i);

export function keySignature(idx) {
  if (idx === 0) return '';
  if (idx < 6) return `${idx}♯`;
  if (idx === 6) return '6♯/6♭';
  return `${12 - idx}♭`;
}

const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// Roman numeral of parent degree d seen from mode m, e.g. D Dorian: C major's F is "♭III".
export function romanFor(d, m) {
  const num = (d - m + 7) % 7;
  const semis = mod12(DEGREES[d].off - DEGREES[m].off);
  let acc = semis - MAJOR_STEPS[num];
  if (acc > 6) acc -= 12;
  if (acc < -6) acc += 12;
  const q = DEGREES[d].q;
  const base = q === 'major' ? NUMERALS[num] : NUMERALS[num].toLowerCase();
  return `${acc < 0 ? '♭' : acc > 0 ? '♯' : ''}${base}${q === 'dim' ? '°' : ''}`;
}

// Which family a chord belongs to, used to decide where the wheel should turn.
export function familyOf(typeKey) {
  return Object.keys(FAMILY).find((f) => FAMILY[f].includes(typeKey));
}
