// Generates backend/chords.json: 12 roots x 15 chord types, each with real, validated
// guitar voicings (open shapes where they exist + movable E-shape / A-shape barres).
// Usage: npm run generate
const fs = require('fs');
const path = require('path');
const { SHARP, FLAT_ALIAS, TYPES, mod12, validateVoicing } = require('./chord-theory');

// Hand-written open-position shapes (string 6 -> string 1, null = muted).
const OPEN = {
  'C:major':  [null, 3, 2, 0, 1, 0],
  'D:major':  [null, null, 0, 2, 3, 2],
  'E:major':  [0, 2, 2, 1, 0, 0],
  'G:major':  [3, 2, 0, 0, 0, 3],
  'A:major':  [null, 0, 2, 2, 2, 0],
  'F:major':  [null, null, 3, 2, 1, 1],
  'D:minor':  [null, null, 0, 2, 3, 1],
  'E:minor':  [0, 2, 2, 0, 0, 0],
  'A:minor':  [null, 0, 2, 2, 1, 0],
  'C:dom7':   [null, 3, 2, 3, 1, 0],
  'D:dom7':   [null, null, 0, 2, 1, 2],
  'E:dom7':   [0, 2, 0, 1, 0, 0],
  'G:dom7':   [3, 2, 0, 0, 0, 1],
  'A:dom7':   [null, 0, 2, 0, 2, 0],
  'B:dom7':   [null, 2, 1, 2, 0, 2],
  'C:maj7':   [null, 3, 2, 0, 0, 0],
  'D:maj7':   [null, null, 0, 2, 2, 2],
  'E:maj7':   [0, 2, 1, 1, 0, 0],
  'F:maj7':   [null, null, 3, 2, 1, 0],
  'G:maj7':   [3, 2, 0, 0, 0, 2],
  'A:maj7':   [null, 0, 2, 1, 2, 0],
  'D:min7':   [null, null, 0, 2, 1, 1],
  'E:min7':   [0, 2, 0, 0, 0, 0],
  'A:min7':   [null, 0, 2, 0, 1, 0],
  'A:sus2':   [null, 0, 2, 2, 0, 0],
  'D:sus2':   [null, null, 0, 2, 3, 0],
  'A:sus4':   [null, 0, 2, 2, 3, 0],
  'D:sus4':   [null, null, 0, 2, 3, 3],
  'E:sus4':   [0, 2, 2, 2, 0, 0],
  'C:six':    [null, 3, 2, 2, 1, 0],
  'C:add9':   [null, 3, 2, 0, 3, 0],
  'E:power5': [0, 2, 2, null, null, null],
  'A:power5': [null, 0, 2, 2, null, null],
  'D:power5': [null, null, 0, 2, 3, null],
};

const STRING_OF_INDEX = (i) => 6 - i; // array index 0 -> string 6

function toPositions(frets) {
  return frets.map((fret, i) => ({ string: STRING_OF_INDEX(i), fret }));
}

function barreOf(frets) {
  const fretted = frets.map((f, i) => ({ f, s: STRING_OF_INDEX(i) })).filter((x) => x.f !== null && x.f > 0);
  if (!fretted.length) return null;
  const min = Math.min(...fretted.map((x) => x.f));
  const at = fretted.filter((x) => x.f === min);
  if (at.length < 2) return null;
  return { fret: min, fromString: Math.max(...at.map((x) => x.s)), toString: Math.min(...at.map((x) => x.s)) };
}

function baseFretOf(frets) {
  const fretted = frets.filter((f) => f !== null && f > 0);
  if (!fretted.length) return 1;
  return Math.max(...fretted) <= 5 ? 1 : Math.min(...fretted);
}

function placeShape(offsets, rootFret) {
  let frets = offsets.map((o) => (o === null ? null : rootFret + o));
  if (frets.some((f) => f !== null && f < 0)) frets = frets.map((f) => (f === null ? null : f + 12));
  return frets;
}

const chords = [];
const errors = [];

for (const rootPc of SHARP.map((_, i) => i)) {
  const root = SHARP[rootPc];
  const flat = FLAT_ALIAS[root];
  for (const t of TYPES) {
    const voicings = [];
    const seen = new Set();
    const add = (label, frets, kind) => {
      const err = validateVoicing(rootPc, t.intervals, frets);
      if (err) { errors.push(`${root} ${t.key} [${label}] ${JSON.stringify(frets)}: ${err}`); return; }
      const sig = JSON.stringify(frets);
      if (seen.has(sig)) return;
      seen.add(sig);
      const v = { label, kind, positions: toPositions(frets), baseFret: baseFretOf(frets) };
      if (kind === 'barre') { const b = barreOf(frets); if (b) v.barre = b; }
      voicings.push(v);
    };

    const open = OPEN[`${root}:${t.key}`];
    if (open) add('Open position', open, 'open');

    const barres = [];
    if (t.E) barres.push({ name: 'E-shape', root: mod12(rootPc - 4), shape: t.E });
    if (t.A) barres.push({ name: 'A-shape', root: mod12(rootPc - 9), shape: t.A });
    const placed = barres
      .map((b) => ({ ...b, frets: placeShape(b.shape, b.root) }))
      .filter((b) => Math.max(...b.frets.filter((f) => f !== null)) <= 15)
      .sort((a, b) => Math.min(...a.frets.filter((f) => f > 0)) - Math.min(...b.frets.filter((f) => f > 0)));
    for (const b of placed) {
      const f = Math.min(...b.frets.filter((x) => x !== null && x > 0));
      add(`${b.name} (${b.root === 0 ? 'open' : 'fret ' + f})`, b.frets, b.root === 0 ? 'open' : 'barre');
    }

    if (!voicings.length) { errors.push(`${root} ${t.key}: no valid voicing`); continue; }

    const symbol = root + t.suffix;
    const aliases = flat ? [`${flat} ${t.type}`, flat + t.suffix] : [];
    chords.push({
      id: `${root.replace('#', 'sharp')}_${t.key}`,
      name: `${root}${flat ? '/' + flat : ''} ${t.type}`,
      symbol,
      aliases,
      note: root,
      type: t.type,
      notes: t.intervals.map((iv) => SHARP[mod12(rootPc + iv)]),
      positions: voicings[0].positions,
      baseFret: voicings[0].baseFret,
      voicings,
    });
  }
}

if (errors.length) {
  console.error('Invalid voicings found:\n' + errors.join('\n'));
  process.exit(1);
}

fs.writeFileSync(path.join(__dirname, '..', 'chords.json'), JSON.stringify(chords, null, 1) + '\n');
const total = chords.reduce((n, c) => n + c.voicings.length, 0);
console.log(`Generated ${chords.length} chords (${total} voicings)`);
