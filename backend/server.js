const express = require('express');
const cors = require('cors');
const chords = require('./chords-db');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/chords', (req, res) => {
  const { note, type, search } = req.query;

  let filtered = chords;

  if (search) {
    filtered = filtered.filter(chord =>
      chord.name.toLowerCase().includes(search.toLowerCase()) ||
      chord.note.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (note) {
    filtered = filtered.filter(chord => chord.note === note);
  }

  if (type) {
    filtered = filtered.filter(chord => chord.type === type);
  }

  res.json(filtered);
});

app.get('/api/chords/:id', (req, res) => {
  const chord = chords.find(c => c.id === req.params.id);

  if (!chord) {
    return res.status(404).json({ error: 'Chord not found' });
  }

  res.json(chord);
});

app.get('/api/notes', (req, res) => {
  const notes = [...new Set(chords.map(c => c.note))].sort();
  res.json(notes);
});

app.get('/api/types', (req, res) => {
  const types = [...new Set(chords.map(c => c.type))].sort();
  res.json(types);
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalChords: chords.length,
    notes: [...new Set(chords.map(c => c.note))].length,
    types: [...new Set(chords.map(c => c.type))].length,
  });
});

app.listen(PORT, () => {
  console.log(`🎸 Chord Dictionary API running on http://localhost:${PORT}`);
  console.log(`📚 Total chords available: ${chords.length}`);
});
