// Prepares the chord database for the browser. The small part (chords, voicings, CAGED) is bundled
// as src/chords.json; the large list of inversions is written to public/inversions.json and only
// downloaded when someone opens the Inversions view.
const fs = require('fs');
const path = require('path');

const from = path.join(__dirname, '..', '..', 'backend', 'chords.json');
if (fs.existsSync(from)) {
  const all = JSON.parse(fs.readFileSync(from, 'utf8'));
  const inversions = {};
  const light = all.map((c) => {
    inversions[c.id] = c.inversions || [];
    const { inversions: _drop, ...rest } = c;
    return { ...rest, inversionCount: inversions[c.id].length };
  });
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'chords.json'), JSON.stringify(light));
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'inversions.json'), JSON.stringify(inversions));
}
