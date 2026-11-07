import chords from './chords.json';

// Same rules as the optional API in backend/server.js, run in the browser.
const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAME = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };

export const types = [];
chords.forEach((c) => {
  if (!types.some((t) => t.key === c.typeKey)) types.push({ key: c.typeKey, name: c.type });
});

export const notes = SHARP.filter((n) => chords.some((c) => c.note === n)).map((n) => ({
  value: n,
  label: FLAT_NAME[n] ? `${n}/${FLAT_NAME[n]}` : n,
}));

export const stats = {
  totalChords: chords.length,
  totalVoicings: chords.reduce((n, c) => n + c.voicings.length + (c.inversions ? c.inversions.length : 0), 0),
};

export function searchChords({ search = '', note = '', type = '' }) {
  const q = search.trim().toLowerCase();
  let result = chords;
  if (note) result = result.filter((c) => c.note === note);
  if (type) result = result.filter((c) => c.typeKey === type || c.type === type);
  if (q) {
    // match at the start of a field or of a word inside it ("b minor" must not hit "Db Minor")
    const fields = (c) => [c.name, c.symbol, ...c.aliases].map((s) => s.toLowerCase());
    const hit = (f) => f.startsWith(q) || f.includes(' ' + q) || f.includes('/' + q);
    result = result.filter((c) => fields(c).some(hit));
    const rank = (c) => {
      const syms = [c.symbol, ...c.aliases].map((s) => s.toLowerCase());
      if (syms.includes(q)) return 0;
      if (syms.some((s) => s.startsWith(q))) return 1;
      return 2;
    };
    result = [...result].sort((a, b) => rank(a) - rank(b));
  }
  return result;
}

const byId = Object.fromEntries(chords.map((c) => [c.id, c]));
const byRootType = {};
chords.forEach((c) => {
  byRootType[`${c.pcs[0]}|${c.typeKey}`] = c;
});
export const getChord = (id) => byId[id] || null;
export const chordFor = (pc, typeKey) => byRootType[`${pc}|${typeKey}`] || null;
export const chordsOfRoot = (pc) => chords.filter((c) => c.pcs[0] === pc);
