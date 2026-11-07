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


// ---------------------------------------------------------------------------
// Inversions and compact voicings. Each one is described by a list of pitches (semitones above the
// chord root) and a set of strings; we find every place on the neck where that pitch list lands
// on those strings. Categories: triad (closed triad), open (spread triad), closed, drop2, drop3,
// shell (root, third, seventh) and the rootless forms (rl-closed, rl-drop2, rl-drop3).
// Each result is stored as the string "category|bass tone index|f.f.f.f.f.f" (x = muted).
// ---------------------------------------------------------------------------
const OPEN_MIDI = [40, 45, 50, 55, 59, 64];
// every way to pick n of the six strings (indexes 0 = low E ... 5 = high e), neighbours first
const combos = (n) => {
  const out = [];
  const go = (start, cur) => {
    if (cur.length === n) { out.push(cur.slice()); return; }
    for (let i = start; i < 6; i += 1) go(i + 1, [...cur, i]);
  };
  go(0, []);
  const gaps = (c) => c[c.length - 1] - c[0];
  return out.sort((a, b) => gaps(a) - gaps(b) || a[0] - b[0]);
};
const ALL2 = combos(2);
const ALL3 = combos(3);
const ALL4 = combos(4);
const ADJ3 = ALL3;
const SKIP3 = ALL3;
const ADJ4 = ALL4;
const SKIP4 = ALL4;
const MAX_INV_FRET = 22;

// all closed-position rotations of a tone list: [{pitches, bassTone}] with pitches ascending
function rotations(tones) {
  const sorted = tones.map((x) => ({ off: x[0], ti: x[3] })).sort((a, b) => a.off - b.off);
  return sorted.map((_, k) => {
    const list = [];
    for (let j = 0; j < sorted.length; j += 1) {
      const e = sorted[(k + j) % sorted.length];
      list.push({ pitch: e.off + (k + j >= sorted.length ? 12 : 0), ti: e.ti });
    }
    return list;
  });
}
const lowered = (list, pos) => list.map((e, i) => (i === pos ? { ...e, pitch: e.pitch - 12 } : e)).sort((a, b) => a.pitch - b.pitch);
const raised = (list, pos) => list.map((e, i) => (i === pos ? { ...e, pitch: e.pitch + 12 } : e)).sort((a, b) => a.pitch - b.pitch);

// frets for each placement of `list` on `strings` (ascending string indexes), lowest position first
function placements(rootPc, list, strings) {
  const out = [];
  for (let q = 2; q <= 7; q += 1) {
    const R = rootPc + 12 * q;
    const fr = list.map((e, i) => R + e.pitch - OPEN_MIDI[strings[i]]);
    if (fr.some((f) => f < 0 || f > MAX_INV_FRET)) continue;
    const fretted = fr.filter((f) => f > 0);
    const span = fretted.length ? Math.max(...fretted) - Math.min(...fretted) : 0;
    if (span > 4) continue;
    if (fr.includes(0) && Math.max(...fr) > 7) continue;
    const frets = [null, null, null, null, null, null];
    strings.forEach((si, i) => { frets[si] = fr[i]; });
    out.push(frets);
  }
  return out.sort((a, b) => Math.min(...a.filter((f) => f !== null)) - Math.min(...b.filter((f) => f !== null)));
}

function buildInversions(rootPc, t) {
  const tones = t.tones;
  const out = [];
  const seen = new Set();
  const push = (cat, list, sets, keep) => {
    for (const strings of sets) {
      if (strings.length !== list.length) continue;
      placements(rootPc, list, strings).forEach((frets) => {
        const key = frets.join('.');
        if (seen.has(key)) return;
        seen.add(key);
        out.push(`${cat}|${list[0].ti}|${frets.map((f) => (f === null ? 'x' : f)).join('.')}`);
      });
    }
  };
  const forms = (toneList, prefix, keep) => {
    const n = toneList.length;
    if (n === 2) {
      for (const r of rotations(toneList)) push(prefix + 'dyad', r, ALL2, keep);
    } else if (n === 3) {
      for (const r of rotations(toneList)) {
        push(prefix + 'triad', r, ADJ3, keep);
        push(prefix + 'open', raised(r, 1), SKIP3, 1);
      }
    } else if (n === 4) {
      for (const r of rotations(toneList)) {
        push(prefix + 'closed', r, ADJ4, keep);
        push(prefix + 'drop2', lowered(r, 2), ADJ4, keep);
        push(prefix + 'drop3', lowered(r, 1), SKIP4, keep);
      }
    }
  };
  // tones carry their original index so the bass note can be named later
  const indexed = tones.map((x, i) => [x[0], x[1], x[2], i]); // [semitones, degree, step, index in the chord]
  if (indexed.length === 2) forms(indexed, '', 2);
  if (indexed.length === 3) forms(indexed, '', 2);
  if (indexed.length === 4) forms(indexed, '', 2);
  if (indexed.length === 5) {
    forms(indexed.filter((x) => x[1] !== '5'), '', 2); // leave out the fifth
    forms(indexed.filter((x) => x[0] !== 0), 'rl-', 2); // rootless: third, fifth, seventh, extension
  }
  if (indexed.length === 4) {
    // rootless four-note chords (no root) are only the three upper tones, handled as triads
    const upper = indexed.filter((x) => x[0] !== 0);
    if (upper.length === 3 && !['dim', 'aug', 'sus2', 'sus4'].includes(t.key)) forms(upper, 'rl-', 1);
  }
  // shells: root, third and seventh (or sixth) only
  const third = tones.findIndex((x) => x[1] === '3' || x[1] === '♭3');
  const guide = tones.findIndex((x) => ['♭♭7', '♭7', '7', '6'].includes(x[1]));
  if (third !== -1 && guide !== -1) {
    const T3 = tones[third][0];
    const G = tones[guide][0];
    const a = [{ pitch: 0, ti: 0 }, { pitch: G, ti: guide }, { pitch: T3 + 12, ti: third }];
    const b = [{ pitch: 0, ti: 0 }, { pitch: T3, ti: third }, { pitch: G, ti: guide }];
    [a, b].forEach((list) => push('shell', list, [...ADJ3, ...SKIP3], 1));
  }
  return out;
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

    const inversions = buildInversions(rootPc, t);

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
