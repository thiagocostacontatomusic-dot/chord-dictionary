// Inversions and compact voicings arrive as strings: "category|bass tone index|f.f.f.f.f.f"
// (frets from string 6 to string 1, x = muted). This turns them into drawable voicings.
export const GROUPS = ['triad', 'open', 'closed', 'drop2', 'drop3', 'shell', 'rootless'];

const groupOf = (cat) => (cat.startsWith('rl-') ? 'rootless' : cat);

function baseFretOf(frets) {
  const fretted = frets.filter((f) => f !== null && f > 0);
  if (!fretted.length) return 1;
  return Math.max(...fretted) <= 5 ? 1 : Math.min(...fretted);
}

export function parseInversions(chord) {
  return (chord.inversions || []).map((entry, order) => {
    const [cat, bi, f] = entry.split('|');
    const frets = f.split('.').map((x) => (x === 'x' ? null : Number(x)));
    const sounded = frets.map((fr, i) => (fr === null ? null : 6 - i)).filter((s) => s !== null);
    const fretted = frets.filter((x) => x !== null && x > 0);
    return {
      id: `${cat}-${f}`,
      order,
      cat,
      group: groupOf(cat),
      form: cat.startsWith('rl-') ? cat.slice(3) : cat,
      bassIndex: Number(bi),
      strings: [Math.max(...sounded), Math.min(...sounded)],
      lowest: fretted.length ? Math.min(...fretted) : 0,
      positions: frets.map((fret, i) => ({ string: 6 - i, fret })),
      baseFret: baseFretOf(frets),
    };
  });
}
