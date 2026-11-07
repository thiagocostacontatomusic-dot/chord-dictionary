// Inversions and compact voicings arrive as strings: "category|bass tone index|f.f.f.f.f.f"
// (frets from string 6 to string 1, x = muted). This turns them into drawable voicings.
export const GROUPS = ['dyad', 'triad', 'open', 'closed', 'drop2', 'drop3', 'shell', 'rootless'];

const groupOf = (cat) => (cat.startsWith('rl-') ? 'rootless' : cat);

function baseFretOf(frets) {
  const fretted = frets.filter((f) => f !== null && f > 0);
  if (!fretted.length) return 1;
  return Math.max(...fretted) <= 5 ? 1 : Math.min(...fretted);
}

// The inversions are a separate download (public/inversions.json), fetched once on first use.
let pending = null;
let loaded = null;
export const loadedInversions = () => loaded;
export function loadInversions() {
  if (!pending) {
    pending = fetch(`${process.env.PUBLIC_URL || ''}/inversions.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`inversions.json: ${r.status}`);
        return r.json();
      })
      .then((all) => {
        loaded = all;
        return all;
      })
      .catch((e) => {
        pending = null;
        throw e;
      });
  }
  return pending;
}

export function parseInversions(list) {
  return (list || []).map((entry, order) => {
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
      set: sounded.join('-'),
      lowest: fretted.length ? Math.min(...fretted) : 0,
      positions: frets.map((fret, i) => ({ string: 6 - i, fret })),
      baseFret: baseFretOf(frets),
    };
  });
}
