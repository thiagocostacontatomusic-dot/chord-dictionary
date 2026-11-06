// Independent check of the shipped data: every voicing must really spell its chord.
// Run with: npm test
const test = require('node:test');
const assert = require('node:assert');
const chords = require('../chords-db');
const { TYPES, SHARP, validateVoicing } = require('../scripts/chord-theory');

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
