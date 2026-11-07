// Generates backend/chords.json: 12 roots x 15 chord types, each with real, validated
// guitar voicings (open shapes where they exist + movable E-shape / A-shape barres),
// plus the five CAGED forms for the chord types that have them.
// Usage: npm run generate
const fs = require('fs');
const path = require('path');
const {
  SHARP, TYPES, TUNING, mod12, validateVoicing, spellChord,
  CAGED_FORMS, CAGED_ROOT_PC, CAGED_SHAPES, shapeSpan,
} = require('./chord-theory');

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

// A barre is one finger flattened across several strings at the lowest fretted fret.
// It counts when 2+ strings share that fret, every string between its ends is sounded at
// or above it, and it reaches an outer string (1 or 6). Partial three-string shapes
// (like open A) are fingered one note at a time, so they get no bar.
function barreOf(frets) {
  const entries = frets.map((f, i) => ({ f, s: STRING_OF_INDEX(i) }));
  const fretted = entries.filter((x) => x.f !== null && x.f > 0);
  if (fretted.length < 2) return null;
  const min = Math.min(...fretted.map((x) => x.f));
  const at = fretted.filter((x) => x.f === min).map((x) => x.s);
  if (at.length < 2) return null;
  const hi = Math.max(...at);
  const lo = Math.min(...at);
  for (const x of entries) {
    if (x.s >= lo && x.s <= hi && (x.f === null || x.f < min)) return null;
  }
  if (lo !== 1 && hi !== 6) return null;
  return { fret: min, fromString: hi, toString: lo };
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
  for (const t of TYPES) {
    const voicings = [];
    const seen = new Set();
    const add = (label, frets, kind, shape = null, fret = 0) => {
      const err = validateVoicing(rootPc, t.intervals, frets);
      if (err) { errors.push(`${root} ${t.key} [${label}] ${JSON.stringify(frets)}: ${err}`); return; }
      const sig = JSON.stringify(frets);
      if (seen.has(sig)) return;
      seen.add(sig);
      const v = { label, kind, shape, fret, positions: toPositions(frets), baseFret: baseFretOf(frets) };
      const b = barreOf(frets);
      if (b) v.barre = b;
      voicings.push(v);
    };

    const open = OPEN[`${root}:${t.key}`];
    if (open) add('Open position', open, 'open', null, 0);

    const barres = [];
    if (t.E) barres.push({ name: 'E-shape', root: mod12(rootPc - 4), shape: t.E });
    if (t.A) barres.push({ name: 'A-shape', root: mod12(rootPc - 9), shape: t.A });
    const placed = barres
      .map((b) => ({ ...b, frets: placeShape(b.shape, b.root) }))
      .filter((b) => Math.max(...b.frets.filter((f) => f !== null)) <= 15)
      .sort((a, b) => Math.min(...a.frets.filter((f) => f > 0)) - Math.min(...b.frets.filter((f) => f > 0)));
    for (const b of placed) {
      const f = Math.min(...b.frets.filter((x) => x !== null && x > 0));
      add(`${b.name} (${b.root === 0 ? 'open' : 'fret ' + f})`, b.frets, b.root === 0 ? 'open' : 'barre', b.name[0], b.root === 0 ? 0 : f);
    }

    if (!voicings.length) { errors.push(`${root} ${t.key}: no valid voicing`); continue; }


    // CAGED: the same chord as five shapes (C, A, G, E, D forms) ordered up the neck.
    let caged = [];
    const cagedShapes = CAGED_SHAPES[t.key];
    if (cagedShapes) {
      caged = CAGED_FORMS.filter((form) => cagedShapes[form]).map((form) => {
        const shift = mod12(rootPc - CAGED_ROOT_PC[form]);
        const frets = cagedShapes[form].map((f) => (f === null ? null : f + shift));
        const span = shapeSpan(cagedShapes[form]);
        const err = validateVoicing(rootPc, t.intervals, frets, Math.max(4, span));
        if (err) errors.push(`${root} ${t.key} CAGED ${form}-form ${JSON.stringify(frets)}: ${err}`);
        const sounded = frets.filter((f) => f !== null);
        const lowest = Math.min(...sounded);
        const entry = {
          form,
          label: `${form} form`,
          lowestFret: lowest,
          positions: toPositions(frets),
          baseFret: baseFretOf(frets),
        };
        if (span > 4) entry.stretch = span;
        const b = barreOf(frets);
        if (b) entry.barre = b;
        return entry;
      })
        .sort((a, b) => a.lowestFret - b.lowestFret || CAGED_FORMS.indexOf(a.form) - CAGED_FORMS.indexOf(b.form))
        .map((entry, i) => ({ ...entry, order: i + 1 }));
    }

    // Inversions on four adjacent strings (the "drop" family of jazz voicings): one voicing per
    // string set and per bass note, at the lowest comfortable position. Chords of five notes
    // leave out the fifth; triads and two-note chords have none.
    const quartet = t.tones.length === 5 ? t.tones.filter((x) => x[1] !== '5') : t.tones;
    const inversions = [];
    if (quartet.length === 4) {
      const qPcs = quartet.map((x) => mod12(rootPc + x[0]));
      const { primary: sp } = spellChord(rootPc, t.tones);
      const noteOfPc = (pc) => { const i = t.tones.findIndex((x) => mod12(rootPc + x[0]) === pc); return sp.notes[i]; };
      for (const first of [0, 1, 2]) {
        const set = [first, first + 1, first + 2, first + 3];
        for (let inv = 0; inv < 4; inv += 1) {
          let best = null;
          // each string takes the fret that sounds one of the four tones; try all assignments
          const tryFrets = (k, cur) => {
            if (k === 4) {
              const pcs = cur.map((f, i) => mod12(TUNING[set[i]] + f));
              if (new Set(pcs).size !== 4 || !pcs.every((pc) => qPcs.includes(pc))) return;
              if (pcs[0] !== qPcs[inv]) return;
              const fr = cur.filter((f) => f > 0);
              const span = fr.length ? Math.max(...fr) - Math.min(...fr) : 0;
              if (span > 3) return;
              if (cur.includes(0) && Math.max(...cur) > 5) return; // open strings only near the nut
              const score = Math.max(...cur) * 10 + span;
              if (!best || score < best.score) best = { score, cur: cur.slice() };
              return;
            }
            for (let f = 0; f <= 14; f += 1) { cur[k] = f; tryFrets(k + 1, cur); }
          };
          tryFrets(0, []);
          if (!best) continue;
          const frets = [null, null, null, null, null, null];
          set.forEach((si, i) => { frets[si] = best.cur[i]; });
          inversions.push({
            inversion: inv,
            bass: noteOfPc(qPcs[inv]),
            strings: [6 - set[0], 6 - set[3]],
            frets,
            baseFret: baseFretOf(frets),
          });
        }
      }
      inversions.sort((a, b) => a.inversion - b.inversion || b.strings[0] - a.strings[0]);
    }

    const { primary, alt } = spellChord(rootPc, t.tones);
    const symbol = primary.root + t.suffix;
    const aliases = [];
    for (const r of [primary.root, alt && alt.root].filter(Boolean)) {
      aliases.push(`${r} ${t.type}`, `${r} ${t.namePt}`, r + t.suffix);
    }
    chords.push({
      id: `${root.replace('#', 'sharp')}_${t.key}`,
      typeKey: t.key,
      name: `${primary.root} ${t.type}`,
      altName: alt ? `${alt.root} ${t.type}` : null,
      symbol,
      altSymbol: alt ? alt.root + t.suffix : null,
      aliases,
      note: root,
      rootName: primary.root,
      type: t.type,
      notes: primary.notes,
      degrees: t.tones.map((x) => x[1]),
      pcs: t.tones.map((x) => mod12(rootPc + x[0])),
      positions: voicings[0].positions,
      baseFret: voicings[0].baseFret,
      voicings,
      caged,
      inversions,
    });
  }
}

if (errors.length) {
  console.error('Invalid voicings found:\n' + errors.join('\n'));
  process.exit(1);
}

fs.writeFileSync(path.join(__dirname, '..', 'chords.json'), JSON.stringify(chords, null, 1) + '\n');
const total = chords.reduce((n, c) => n + c.voicings.length, 0);
const invTotal = chords.reduce((n, c) => n + c.inversions.length, 0);
const cagedChords = chords.filter((c) => c.caged.length).length;
console.log(`Generated ${chords.length} chords (${total} voicings, ${cagedChords} with CAGED forms, ${invTotal} inversions)`);
