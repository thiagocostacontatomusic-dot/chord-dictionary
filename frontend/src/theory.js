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
  major: ['major', 'six', 'dom7', 'maj7', 'add9', 'sus2', 'sus4', 'power5', 'aug', 'dom9', 'maj9', 'dom13', 'sus7', 'dom7b9', 'dom7s9', 'aug7', 'six9'],
  minor: ['minor', 'minor6', 'min7', 'min9', 'min11', 'mmaj7'],
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

// ---- Scales -------------------------------------------------------------------------------
// Each scale lists its degrees (used to spell the notes) and its semitone steps from the root.
const S = (key, group, degs, semis) => ({ key, group, degs, semis });
export const SCALES = [
  S('ionian', 'modes', ['1', '2', '3', '4', '5', '6', '7'], [0, 2, 4, 5, 7, 9, 11]),
  S('dorian', 'modes', ['1', '2', '♭3', '4', '5', '6', '♭7'], [0, 2, 3, 5, 7, 9, 10]),
  S('phrygian', 'modes', ['1', '♭2', '♭3', '4', '5', '♭6', '♭7'], [0, 1, 3, 5, 7, 8, 10]),
  S('lydian', 'modes', ['1', '2', '3', '♯4', '5', '6', '7'], [0, 2, 4, 6, 7, 9, 11]),
  S('mixolydian', 'modes', ['1', '2', '3', '4', '5', '6', '♭7'], [0, 2, 4, 5, 7, 9, 10]),
  S('aeolian', 'modes', ['1', '2', '♭3', '4', '5', '♭6', '♭7'], [0, 2, 3, 5, 7, 8, 10]),
  S('locrian', 'modes', ['1', '♭2', '♭3', '4', '♭5', '♭6', '♭7'], [0, 1, 3, 5, 6, 8, 10]),
  S('majorPent', 'pentatonic', ['1', '2', '3', '5', '6'], [0, 2, 4, 7, 9]),
  S('minorPent', 'pentatonic', ['1', '♭3', '4', '5', '♭7'], [0, 3, 5, 7, 10]),
  S('blues', 'pentatonic', ['1', '♭3', '4', '♭5', '5', '♭7'], [0, 3, 5, 6, 7, 10]),
  S('majorBlues', 'pentatonic', ['1', '2', '♭3', '3', '5', '6'], [0, 2, 3, 4, 7, 9]),
  S('harmonicMinor', 'minorVariants', ['1', '2', '♭3', '4', '5', '♭6', '7'], [0, 2, 3, 5, 7, 8, 11]),
  S('melodicMinor', 'minorVariants', ['1', '2', '♭3', '4', '5', '6', '7'], [0, 2, 3, 5, 7, 9, 11]),
  S('phrygianDominant', 'minorVariants', ['1', '♭2', '3', '4', '5', '♭6', '♭7'], [0, 1, 4, 5, 7, 8, 10]),
  S('lydianDominant', 'minorVariants', ['1', '2', '3', '♯4', '5', '6', '♭7'], [0, 2, 4, 6, 7, 9, 10]),
  S('altered', 'minorVariants', ['1', '♭2', '♭3', '♭4', '♭5', '♭6', '♭7'], [0, 1, 3, 4, 6, 8, 10]),
  S('doubleHarmonic', 'minorVariants', ['1', '♭2', '3', '4', '5', '♭6', '7'], [0, 1, 4, 5, 7, 8, 11]),
  S('wholeTone', 'symmetric', ['1', '2', '3', '♯4', '♯5', '♭7'], [0, 2, 4, 6, 8, 10]),
  S('dimWH', 'symmetric', ['1', '2', '♭3', '4', '♭5', '♭6', '6', '7'], [0, 2, 3, 5, 6, 8, 9, 11]),
  S('dimHW', 'symmetric', ['1', '♭2', '♭3', '3', '♯4', '5', '6', '♭7'], [0, 1, 3, 4, 6, 7, 9, 10]),
];
export const SCALE_GROUPS = ['modes', 'pentatonic', 'minorVariants', 'symmetric'];
export const scaleByKey = (key) => SCALES.find((s) => s.key === key) || SCALES[0];

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NATURAL = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC = { '-2': '♭♭', '-1': '♭', 0: '', 1: '♯', 2: '♯♯' };

// Spell every note of a scale with its own letter (no repeated letters), e.g. F♯ major has E♯.
export function spellScale(rootName, rootPc, scale) {
  const ri = LETTERS.indexOf(rootName[0]);
  return scale.semis.map((semi, i) => {
    const step = parseInt(scale.degs[i].replace(/\D/g, ''), 10);
    const letter = LETTERS[(ri + step - 1) % 7];
    let acc = mod12(rootPc + semi) - NATURAL[letter];
    if (acc > 6) acc -= 12;
    if (acc < -6) acc += 12;
    return `${letter}${ACC[acc] === undefined ? '' : ACC[acc]}`;
  });
}

// Standard tuning, string 6 (low E) to string 1.
export const TUNING = { 6: 4, 5: 9, 4: 2, 3: 7, 2: 11, 1: 4 };
export const MAX_FRET = 17;

// Fret windows ("positions") for a scale: position p starts on the p-th scale note of the low E
// string and spans five frets, one fret before and three after that note. Windows repeat an octave up.
export function positionWindows(rootPc, scale) {
  return scale.semis.map((semi) => {
    const start = mod12(rootPc + semi - TUNING[6]);
    const lo = Math.max(0, start - 1);
    const hi = start + 3;
    const wins = [[lo, hi]];
    if (hi + 12 <= MAX_FRET + 2) wins.push([lo + 12, Math.min(hi + 12, MAX_FRET)]);
    return wins;
  });
}

// Names of the seven notes of a major key spelled the way its key signature does (F♯ major has
// E♯, D♭ major has C), so the chords of a key read correctly instead of mixing sharps and flats.
const PARENT_LETTER = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'D', 'A', 'E', 'B', 'F'];
export const keyNames = (parentPc) => spellScale(PARENT_LETTER[fifthsIndex(parentPc)], parentPc, SCALES[0]);
export const QUAL_SUFFIX = { major: '', minor: 'm', dim: 'dim' };
