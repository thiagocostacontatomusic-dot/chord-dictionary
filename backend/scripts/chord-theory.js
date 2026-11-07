// Shared music-theory helpers: standard tuning, chord formulas and a voicing validator.
// Strings are numbered 6 (low E) -> 1 (high E) in guitar convention.

const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_ALIAS = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };

// Open-string pitch classes, index 0 = string 6 (low E) ... index 5 = string 1 (high E)
const TUNING = [4, 9, 2, 7, 11, 4];

const mod12 = (n) => ((n % 12) + 12) % 12;

// Chord formulas. `shapes` are movable barre shapes: fret offsets from the root fret,
// listed from string 6 to string 1 (null = muted).
const TYPES = [
  { key: 'major', type: 'Major', suffix: '', intervals: [0, 4, 7],
    E: [0, 2, 2, 1, 0, 0], A: [null, 0, 2, 2, 2, 0] },
  { key: 'minor', type: 'Minor', suffix: 'm', intervals: [0, 3, 7],
    E: [0, 2, 2, 0, 0, 0], A: [null, 0, 2, 2, 1, 0] },
  { key: 'power5', type: 'Power (5)', suffix: '5', intervals: [0, 7],
    E: [0, 2, 2, null, null, null], A: [null, 0, 2, 2, null, null] },
  { key: 'dim', type: 'Diminished', suffix: 'dim', intervals: [0, 3, 6],
    A: [null, 0, 1, 2, 1, null] },
  { key: 'aug', type: 'Augmented', suffix: 'aug', intervals: [0, 4, 8],
    E: [0, 3, 2, 1, 1, 0], A: [null, 0, 3, 2, 2, 1] },
  { key: 'sus2', type: 'Suspended 2', suffix: 'sus2', intervals: [0, 2, 7],
    E: [0, 2, 4, 4, 0, 0], A: [null, 0, 2, 2, 0, 0] },
  { key: 'sus4', type: 'Suspended 4', suffix: 'sus4', intervals: [0, 5, 7],
    E: [0, 2, 2, 2, 0, 0], A: [null, 0, 2, 2, 3, 0] },
  { key: 'six', type: 'Major 6', suffix: '6', intervals: [0, 4, 7, 9],
    E: [0, 2, 2, 1, 2, 0], A: [null, 0, 2, 2, 2, 2] },
  { key: 'minor6', type: 'Minor 6', suffix: 'm6', intervals: [0, 3, 7, 9],
    E: [0, 2, 2, 0, 2, 0], A: [null, 0, 2, 2, 1, 2] },
  { key: 'dom7', type: 'Dominant 7', suffix: '7', intervals: [0, 4, 7, 10],
    E: [0, 2, 0, 1, 0, 0], A: [null, 0, 2, 0, 2, 0] },
  { key: 'maj7', type: 'Major 7', suffix: 'maj7', intervals: [0, 4, 7, 11],
    E: [0, 2, 1, 1, 0, 0], A: [null, 0, 2, 1, 2, 0] },
  { key: 'min7', type: 'Minor 7', suffix: 'm7', intervals: [0, 3, 7, 10],
    E: [0, 2, 0, 0, 0, 0], A: [null, 0, 2, 0, 1, 0] },
  { key: 'dim7', type: 'Diminished 7', suffix: 'dim7', intervals: [0, 3, 6, 9],
    A: [null, 0, 1, 2, 1, 2] },
  { key: 'halfdim', type: 'Half-diminished (m7b5)', suffix: 'm7b5', intervals: [0, 3, 6, 10],
    A: [null, 0, 1, 0, 1, null] },
  { key: 'add9', type: 'Add9', suffix: 'add9', intervals: [0, 2, 4, 7],
    A: [null, 0, 2, 4, 2, 0] },
  { key: 'dom9', type: 'Dominant 9', suffix: '9', intervals: [0],
    E: [0, 2, 0, 1, 0, 2], A: [null, 0, 2, 4, 2, 3] },
  { key: 'maj9', type: 'Major 9', suffix: 'maj9', intervals: [0],
    E: [0, 2, 1, 1, 0, 2], A: [null, 0, 2, 4, 2, 4] },
  { key: 'min9', type: 'Minor 9', suffix: 'm9', intervals: [0],
    E: [0, 2, 0, 0, 0, 2], A: [null, 0, 2, 4, 1, 3] },
  { key: 'min11', type: 'Minor 11', suffix: 'm11', intervals: [0],
    E: [0, 0, 0, 0, 0, 0], A: [null, 0, 0, 0, 1, 0] },
  { key: 'dom13', type: 'Dominant 13', suffix: '13', intervals: [0],
    A: [null, 0, 2, 0, 2, 2] },
  { key: 'sus7', type: '7sus4', suffix: '7sus4', intervals: [0],
    E: [0, 0, 0, 2, 0, 0], A: [null, 0, 0, 0, 3, 0] },
  { key: 'dom7b9', type: 'Dominant 7♭9', suffix: '7b9', intervals: [0],
    E: [0, 2, 0, 1, 0, 1], A: [null, 0, 2, 3, 2, 3] },
  { key: 'dom7s9', type: 'Dominant 7♯9', suffix: '7#9', intervals: [0],
    E: [0, 2, 0, 0, 0, 4] },
  { key: 'mmaj7', type: 'Minor-major 7', suffix: 'mMaj7', intervals: [0],
    E: [0, 2, 1, 0, 0, 0], A: [null, 0, 2, 1, 1, 0] },
  { key: 'aug7', type: 'Augmented 7', suffix: 'aug7', intervals: [0],
    E: [0, 3, 0, 1, 1, 0], A: [null, 0, 3, 0, 2, 3] },
  { key: 'six9', type: '6/9', suffix: '6/9', intervals: [0],
    A: [null, 0, 2, 4, 2, 2] },
];

// Pitch class sounded by each string of a voicing (array of 6 frets, null = muted).
function soundedPitchClasses(frets) {
  return frets
    .map((f, i) => (f === null ? null : mod12(TUNING[i] + f)))
    .filter((pc) => pc !== null);
}

// A voicing is valid when: the lowest sounded note is the root (or the chord has
// no inversion requirement for power/sus shapes we ship - we require root in bass),
// it contains every chord tone, and the fifth may be omitted only in 4-note chords.
function validateVoicing(rootPc, intervals, frets) {
  if (frets.length !== 6) return 'voicing must have 6 entries';
  const sounded = frets
    .map((f, i) => (f === null ? null : { s: i, pc: mod12(TUNING[i] + f) }))
    .filter(Boolean);
  if (sounded.length < 2) return 'needs at least 2 sounded strings';
  if (sounded[0].pc !== rootPc) return 'lowest note is not the root';
  const have = new Set(sounded.map((x) => mod12(x.pc - rootPc)));
  const need = new Set(intervals);
  for (const iv of have) if (!need.has(iv)) return `contains foreign interval ${iv}`;
  for (const iv of need) {
    if (have.has(iv)) continue;
    const omittableFifth = iv === 7 && intervals.length >= 4;
    if (!omittableFifth) return `missing interval ${iv}`;
  }
  const fretted = frets.filter((f) => f !== null && f > 0);
  if (fretted.length && Math.max(...fretted) - Math.min(...fretted) > 4) return 'stretch too wide';
  return null;
}


// ---------------------------------------------------------------------------
// Chord tones: [semitones, degree label, letter-name step]. The letter step lets us
// spell every note correctly (Db major is Db F Ab, never Db E# Ab).
// ---------------------------------------------------------------------------
const TONES = {
  major:   [[0, '1', 0], [4, '3', 2], [7, '5', 4]],
  minor:   [[0, '1', 0], [3, '♭3', 2], [7, '5', 4]],
  power5:  [[0, '1', 0], [7, '5', 4]],
  dim:     [[0, '1', 0], [3, '♭3', 2], [6, '♭5', 4]],
  aug:     [[0, '1', 0], [4, '3', 2], [8, '♯5', 4]],
  sus2:    [[0, '1', 0], [2, '2', 1], [7, '5', 4]],
  sus4:    [[0, '1', 0], [5, '4', 3], [7, '5', 4]],
  six:     [[0, '1', 0], [4, '3', 2], [7, '5', 4], [9, '6', 5]],
  minor6:  [[0, '1', 0], [3, '♭3', 2], [7, '5', 4], [9, '6', 5]],
  dom7:    [[0, '1', 0], [4, '3', 2], [7, '5', 4], [10, '♭7', 6]],
  maj7:    [[0, '1', 0], [4, '3', 2], [7, '5', 4], [11, '7', 6]],
  min7:    [[0, '1', 0], [3, '♭3', 2], [7, '5', 4], [10, '♭7', 6]],
  dim7:    [[0, '1', 0], [3, '♭3', 2], [6, '♭5', 4], [9, '♭♭7', 6]],
  halfdim: [[0, '1', 0], [3, '♭3', 2], [6, '♭5', 4], [10, '♭7', 6]],
  add9:    [[0, '1', 0], [4, '3', 2], [7, '5', 4], [2, '9', 1]],
  dom9:    [[0, '1', 0], [4, '3', 2], [7, '5', 4], [10, '♭7', 6], [2, '9', 1]],
  maj9:    [[0, '1', 0], [4, '3', 2], [7, '5', 4], [11, '7', 6], [2, '9', 1]],
  min9:    [[0, '1', 0], [3, '♭3', 2], [7, '5', 4], [10, '♭7', 6], [2, '9', 1]],
  min11:   [[0, '1', 0], [3, '♭3', 2], [7, '5', 4], [10, '♭7', 6], [5, '11', 3]],
  dom13:   [[0, '1', 0], [4, '3', 2], [7, '5', 4], [10, '♭7', 6], [9, '13', 5]],
  sus7:    [[0, '1', 0], [5, '4', 3], [7, '5', 4], [10, '♭7', 6]],
  dom7b9:  [[0, '1', 0], [4, '3', 2], [7, '5', 4], [10, '♭7', 6], [1, '♭9', 1]],
  dom7s9:  [[0, '1', 0], [4, '3', 2], [7, '5', 4], [10, '♭7', 6], [3, '♯9', 1]],
  mmaj7:   [[0, '1', 0], [3, '♭3', 2], [7, '5', 4], [11, '7', 6]],
  aug7:    [[0, '1', 0], [4, '3', 2], [8, '♯5', 4], [10, '♭7', 6]],
  six9:    [[0, '1', 0], [4, '3', 2], [7, '5', 4], [9, '6', 5], [2, '9', 1]],
};
const NAMES_PT = {
  major: 'Maior', minor: 'Menor', power5: 'Power chord', dim: 'Diminuto', aug: 'Aumentado',
  sus2: 'Suspenso 2', sus4: 'Suspenso 4', six: 'Maior com 6', minor6: 'Menor com 6',
  dom7: 'Dominante 7', maj7: 'Maior 7M', min7: 'Menor 7', dim7: 'Diminuto 7',
  halfdim: 'Meio-diminuto', add9: 'Add9',
  dom9: 'Dominante 9', maj9: 'Maior 9', min9: 'Menor 9', min11: 'Menor 11', dom13: 'Dominante 13',
  sus7: '7 suspenso 4', dom7b9: 'Dominante 7♭9', dom7s9: 'Dominante 7♯9', mmaj7: 'Menor com 7M',
  aug7: 'Aumentado 7', six9: '6/9',
};
TYPES.forEach((t) => {
  t.tones = TONES[t.key];
  t.intervals = t.tones.map((x) => x[0]);
  t.namePt = NAMES_PT[t.key];
});

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];
const ACC = { '-2': 'bb', '-1': 'b', '0': '', '1': '#', '2': '##' };

function spellFrom(letterIdx, rootPc, tones) {
  let cost = 0;
  const notes = tones.map(([iv, , step]) => {
    const li = (letterIdx + step) % 7;
    let d = mod12(mod12(rootPc + iv) - LETTER_PC[li]);
    if (d > 6) d -= 12;
    if (ACC[d] === undefined) throw new Error(`cannot spell ${LETTERS[li]} ${d}`);
    cost += Math.abs(d);
    return LETTERS[li] + ACC[d];
  });
  return { notes, cost };
}

// Spell a chord from its root pitch class. Black keys have two roots (C#/Db): pick the one
// that needs fewer accidentals (Db major, C# minor); on a tie prefer the sharp name, except
// for Eb. Returns { primary, alt } where alt is the enharmonic spelling (or null).
function spellChord(rootPc, tones) {
  const natural = LETTER_PC.indexOf(rootPc);
  if (natural !== -1) {
    const one = spellFrom(natural, rootPc, tones);
    return { primary: { root: one.notes[0], notes: one.notes }, alt: null };
  }
  const sharp = spellFrom(LETTER_PC.indexOf(rootPc - 1), rootPc, tones);
  const flat = spellFrom(LETTER_PC.indexOf(rootPc + 1), rootPc, tones);
  const flatWins = flat.cost < sharp.cost || (flat.cost === sharp.cost && rootPc === 3);
  const [first, second] = flatWins ? [flat, sharp] : [sharp, flat];
  return {
    primary: { root: first.notes[0], notes: first.notes },
    alt: { root: second.notes[0], notes: second.notes },
  };
}

// ---------------------------------------------------------------------------
// CAGED system: every chord type below has five open "parent" shapes (the open
// C, A, G, E and D chord families). Shifting a shape up the neck by the distance
// from its parent root to the target root gives the same chord in five places.
// Frets are listed string 6 -> string 1 (null = muted).
// ---------------------------------------------------------------------------
const CAGED_FORMS = ['C', 'A', 'G', 'E', 'D'];
const CAGED_ROOT_PC = { C: 0, A: 9, G: 7, E: 4, D: 2 }; // pitch class of each parent root

const CAGED_SHAPES = {
  major:  { C: [null, 3, 2, 0, 1, 0], A: [null, 0, 2, 2, 2, 0], G: [3, 2, 0, 0, 0, 3], E: [0, 2, 2, 1, 0, 0], D: [null, null, 0, 2, 3, 2] },
  minor:  { C: [null, 3, 1, 0, 1, null], A: [null, 0, 2, 2, 1, 0], G: [3, 1, 0, 0, 3, 3], E: [0, 2, 2, 0, 0, 0], D: [null, null, 0, 2, 3, 1] },
  dom7:   { C: [null, 3, 2, 3, 1, 0], A: [null, 0, 2, 0, 2, 0], G: [3, 2, 0, 0, 0, 1], E: [0, 2, 0, 1, 0, 0], D: [null, null, 0, 2, 1, 2] },
  maj7:   { C: [null, 3, 2, 0, 0, 0], A: [null, 0, 2, 1, 2, 0], G: [3, 2, 0, 0, 0, 2], E: [0, 2, 1, 1, 0, 0], D: [null, null, 0, 2, 2, 2] },
  min7:   { C: [null, 3, 1, 3, 1, null], A: [null, 0, 2, 0, 1, 0], G: [3, 1, 3, 3, 3, 3], E: [0, 2, 0, 0, 0, 0], D: [null, null, 0, 2, 1, 1] },
  sus2:   { C: [null, 3, 0, 0, 3, 3], A: [null, 0, 2, 2, 0, 0], G: [3, 0, 0, 0, 3, 3], E: [0, 2, 4, 4, 0, 0], D: [null, null, 0, 2, 3, 0] },
  sus4:   { C: [null, 3, 3, 0, 1, 1], A: [null, 0, 2, 2, 3, 0], G: [3, 3, 0, 0, 1, 3], E: [0, 2, 2, 2, 0, 0], D: [null, null, 0, 2, 3, 3] },
  six:    { C: [null, 3, 2, 2, 1, 0], A: [null, 0, 2, 2, 2, 2], G: [3, 2, 0, 0, 0, 0], E: [0, 2, 2, 1, 2, 0], D: [null, null, 0, 2, 0, 2] },
  minor6: { C: [null, 3, 1, 2, 1, null], A: [null, 0, 2, 2, 1, 2], G: [3, 1, 2, 0, 3, 0], E: [0, 2, 2, 0, 2, 0], D: [null, null, 0, 2, 0, 1] },
};

module.exports = {
  TONES, spellChord, LETTERS,
  CAGED_FORMS, CAGED_ROOT_PC, CAGED_SHAPES, SHARP, FLAT_ALIAS, TUNING, TYPES, mod12, soundedPitchClasses, validateVoicing };
