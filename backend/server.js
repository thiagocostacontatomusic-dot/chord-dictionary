const express = require('express');
const cors = require('cors');
const chords = require('./chords-db');
const { SHARP } = require('./scripts/chord-theory');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const FLAT_NAME = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };
const typeList = [];
chords.forEach((c) => {
  if (!typeList.some((t) => t.key === c.typeKey)) typeList.push({ key: c.typeKey, name: c.type });
});
const noteList = SHARP.filter((n) => chords.some((c) => c.note === n)).map((n) => ({
  value: n,
  label: FLAT_NAME[n] ? `${n}/${FLAT_NAME[n]}` : n,
}));

// GET /api/chords?search=Am&note=A&type=Minor
app.get('/api/chords', (req, res) => {
  const { note, type } = req.query;
  const q = (req.query.search || '').trim().toLowerCase();
  let result = chords;

  if (note) result = result.filter((c) => c.note === note);
  if (type) result = result.filter((c) => c.typeKey === type || c.type === type);
  if (q) {
    // match at the start of a field or of a word inside it ("b minor" must not hit "Db Minor")
    const fields = (c) => [c.name, c.symbol, ...c.aliases].map((s) => s.toLowerCase());
    const hit = (f) => f.startsWith(q) || f.includes(' ' + q) || f.includes('/' + q);
    result = result.filter((c) => fields(c).some(hit));
    // exact symbol matches (e.g. "am") first, then symbol prefix matches
    const rank = (c) => {
      const syms = [c.symbol, ...c.aliases].map((s) => s.toLowerCase());
      if (syms.includes(q)) return 0;
      if (syms.some((s) => s.startsWith(q))) return 1;
      return 2;
    };
    result = [...result].sort((a, b) => rank(a) - rank(b));
  }
  res.json(result);
});

app.get('/api/chords/:id', (req, res) => {
  const chord = chords.find((c) => c.id === req.params.id);
  if (!chord) return res.status(404).json({ error: 'Chord not found' });
  res.json(chord);
});

app.get('/api/notes', (req, res) => res.json(noteList));
app.get('/api/types', (req, res) => res.json(typeList));

app.get('/api/stats', (req, res) => {
  res.json({
    totalChords: chords.length,
    totalVoicings: chords.reduce((n, c) => n + c.voicings.length, 0),
    cagedChords: chords.filter((c) => c.caged.length).length,
    notes: noteList.length,
    types: typeList.length,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Chord Dictionary API running on http://localhost:${PORT}`);
    console.log(`Total chords available: ${chords.length}`);
  });
}

module.exports = app;
