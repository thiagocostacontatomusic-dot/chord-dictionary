// Independent check of the shipped data: every voicing must really spell its chord.
// Run with: npm test
const test = require('node:test');
const assert = require('node:assert');
const chords = require('../chords-db');
const { TYPES, SHARP, TONES, validateVoicing, mod12 } = require('../scripts/chord-theory');

test('database covers 12 roots x every chord type', () => {
  assert.strictEqual(chords.length, 12 * TYPES.length);
  const ids = new Set(chords.map((c) => c.id));
  assert.strictEqual(ids.size, chords.length, 'ids must be unique');
});

test('every voicing spells its chord on a standard-tuned guitar', () => {
  for (const c of chords) {
    const t = TYPES.find((x) => c.id.endsWith('_' + x.key));
    const rootPc = SHARP.indexOf(c.note);
    assert.ok(c.voicings.length > 0, `${c.id} has no voicings`);
    for (const v of c.voicings) {
      const frets = [6, 5, 4, 3, 2, 1].map((s) => v.positions.find((p) => p.string === s).fret);
      const err = validateVoicing(rootPc, t.intervals, frets);
      assert.strictEqual(err, null, `${c.id} (${v.label}) ${JSON.stringify(frets)}: ${err}`);
    }
  }
});

test('well-known chords match their textbook shapes', () => {
  const frets = (id, i = 0) => [6, 5, 4, 3, 2, 1].map((s) => chords.find((c) => c.id === id).voicings[i].positions.find((p) => p.string === s).fret);
  assert.deepStrictEqual(frets('C_major'), [null, 3, 2, 0, 1, 0]);
  assert.deepStrictEqual(frets('G_major'), [3, 2, 0, 0, 0, 3]);
  assert.deepStrictEqual(frets('A_minor'), [null, 0, 2, 2, 1, 0]);
  assert.deepStrictEqual(frets('E_major'), [0, 2, 2, 1, 0, 0]);
});

// ---------------------------------------------------------------------------
// CAGED system
// ---------------------------------------------------------------------------
const cagedFrets = (id) => {
  const c = chords.find((x) => x.id === id);
  return Object.fromEntries(
    c.caged.map((f) => [f.form, [6, 5, 4, 3, 2, 1].map((s) => f.positions.find((p) => p.string === s).fret)])
  );
};

test('CAGED chords: the 9 core types have five forms, extended types three to five, ordered up the neck', () => {
  const withCaged = chords.filter((c) => c.caged.length);
  const full = withCaged.filter((c) => c.caged.length === 5);
  assert.ok(full.length >= 12 * 9, 'at least the 9 core types x 12 keys have all five forms');
  for (const c of withCaged) {
    assert.ok(c.caged.length >= 3, `${c.id} has too few CAGED forms`);
    const forms = c.caged.map((f) => f.form);
    assert.strictEqual(new Set(forms).size, forms.length, `${c.id} repeats a form`);
    const lows = c.caged.map((f) => f.lowestFret);
    assert.deepStrictEqual(lows, [...lows].sort((a, b) => a - b), `${c.id} not ordered up the neck`);
    assert.deepStrictEqual(c.caged.map((f) => f.order), c.caged.map((_, i) => i + 1));
  }
  for (const key of ['major', 'minor', 'dom7', 'maj7', 'min7', 'sus2', 'sus4', 'six', 'minor6']) {
    for (const c of chords.filter((x) => x.typeKey === key)) {
      assert.deepStrictEqual(c.caged.map((f) => f.form).sort(), ['A', 'C', 'D', 'E', 'G'], c.id);
    }
  }
});

test('every CAGED form spells its chord', () => {
  for (const c of chords.filter((x) => x.caged.length)) {
    const t = TYPES.find((x) => c.id.endsWith('_' + x.key));
    const rootPc = SHARP.indexOf(c.note);
    for (const f of c.caged) {
      const frets = [6, 5, 4, 3, 2, 1].map((s) => f.positions.find((p) => p.string === s).fret);
      assert.strictEqual(validateVoicing(rootPc, t.intervals, frets), null, `${c.id} ${f.label} ${JSON.stringify(frets)}`);
    }
  }
});

test('CAGED forms match the textbook fret numbers', () => {
  const N = null;
  assert.deepStrictEqual(cagedFrets('C_major'), {
    C: [N, 3, 2, 0, 1, 0], A: [N, 3, 5, 5, 5, 3], G: [8, 7, 5, 5, 5, 8], E: [8, 10, 10, 9, 8, 8], D: [N, N, 10, 12, 13, 12],
  });
  assert.deepStrictEqual(cagedFrets('D_major'), {
    D: [N, N, 0, 2, 3, 2], C: [N, 5, 4, 2, 3, 2], A: [N, 5, 7, 7, 7, 5], G: [10, 9, 7, 7, 7, 10], E: [10, 12, 12, 11, 10, 10],
  });
  assert.deepStrictEqual(cagedFrets('F_major'), {
    E: [1, 3, 3, 2, 1, 1], D: [N, N, 3, 5, 6, 5], C: [N, 8, 7, 5, 6, 5], A: [N, 8, 10, 10, 10, 8], G: [13, 12, 10, 10, 10, 13],
  });
  assert.deepStrictEqual(cagedFrets('C_minor'), {
    C: [N, 3, 1, 0, 1, N], A: [N, 3, 5, 5, 4, 3], G: [8, 6, 5, 5, 8, 8], E: [8, 10, 10, 8, 8, 8], D: [N, N, 10, 12, 13, 11],
  });
});

// ---------------------------------------------------------------------------
// Note spelling and barres
// ---------------------------------------------------------------------------
test('notes are spelled with the right letters (Db major is Db F Ab, not Db E# Ab)', () => {
  const notes = (id) => chords.find((c) => c.id === id).notes;
  assert.deepStrictEqual(notes('Csharp_major'), ['Db', 'F', 'Ab']);
  assert.deepStrictEqual(notes('Csharp_minor'), ['C#', 'E', 'G#']);
  assert.deepStrictEqual(notes('Dsharp_major'), ['Eb', 'G', 'Bb']);
  assert.deepStrictEqual(notes('Fsharp_major'), ['F#', 'A#', 'C#']);
  assert.deepStrictEqual(notes('Asharp_min7'), ['Bb', 'Db', 'F', 'Ab']);
  assert.deepStrictEqual(notes('Asharp_dom7'), ['Bb', 'D', 'F', 'Ab']);
  assert.deepStrictEqual(notes('C_dim7'), ['C', 'Eb', 'Gb', 'Bbb']);
  assert.deepStrictEqual(notes('G_add9'), ['G', 'B', 'D', 'A']);
});

test('every chord uses each letter once and its pitch classes match the formula', () => {
  for (const c of chords) {
    const tones = TONES[c.typeKey];
    const rootPc = SHARP.indexOf(c.note);
    assert.deepStrictEqual(c.pcs, tones.map((t) => mod12(rootPc + t[0])), c.id);
    assert.strictEqual(new Set(c.notes.map((n) => n[0])).size, c.notes.length, `${c.id} repeats a letter`);
  }
});

test('barres are marked where one finger covers several strings', () => {
  const v = (id, i = 0) => chords.find((c) => c.id === id).voicings[i];
  assert.deepStrictEqual(v('F_major', 1).barre, { fret: 1, fromString: 6, toString: 1 }, 'E-shape F');
  assert.deepStrictEqual(v('D_min7').barre, { fret: 1, fromString: 2, toString: 1 }, 'open Dm7');
  assert.strictEqual(v('A_major').barre, undefined, 'open A has no barre');
  assert.strictEqual(v('C_major').barre, undefined, 'open C has no barre');
  for (const c of chords) {
    for (const x of [...c.voicings, ...c.caged]) {
      if (!x.barre) continue;
      const at = x.positions.filter((p) => p.fret === x.barre.fret).map((p) => p.string);
      assert.ok(at.length >= 2, `${c.id} barre needs 2+ strings`);
    }
  }
});
