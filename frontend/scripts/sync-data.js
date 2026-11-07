// Copies the generated chord database next to the app so the site works with no server.
const fs = require('fs');
const path = require('path');
const from = path.join(__dirname, '..', '..', 'backend', 'chords.json');
const to = path.join(__dirname, '..', 'src', 'chords.json');
if (fs.existsSync(from)) fs.copyFileSync(from, to);
