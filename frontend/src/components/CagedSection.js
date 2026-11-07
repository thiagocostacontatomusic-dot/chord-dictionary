import React from 'react';
import GuitarFretboard from './GuitarFretboard';
import '../styles/CagedSection.css';

// The CAGED system: the same chord played with the C, A, G, E and D open-chord
// shapes, moved up the neck. Forms arrive already ordered from the nut upward.
function CagedSection({ chord }) {
  if (!chord.caged || chord.caged.length === 0) return null;

  return (
    <section className="caged-section">
      <h3>CAGED system</h3>
      <p className="caged-intro">
        Five shapes for {chord.name}, from the nut up the neck. Each one is the open
        C, A, G, E or D chord moved to this key, so they all play the same notes.
      </p>
      <div className="caged-grid">
        {chord.caged.map((form) => (
          <div className="caged-card" key={form.form}>
            <div className="caged-card-head">
              <span className="caged-badge">{form.form}</span>
              <span className="caged-meta">
                {form.lowestFret === 0 ? 'open' : `fret ${form.lowestFret}`}
              </span>
            </div>
            <GuitarFretboard
              compact
              positions={form.positions}
              baseFret={form.baseFret}
              barre={form.barre}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default CagedSection;
