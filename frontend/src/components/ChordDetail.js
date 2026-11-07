import React, { useState } from 'react';
import GuitarFretboard from './GuitarFretboard';
import CagedSection from './CagedSection';
import '../styles/ChordDetail.css';

const STRING_NAMES = { 6: 'Low E', 5: 'A', 4: 'D', 3: 'G', 2: 'B', 1: 'High E' };

function describe(pos) {
  const name = `String ${pos.string} (${STRING_NAMES[pos.string]})`;
  if (pos.fret === null) return `${name}: muted (don't play)`;
  if (pos.fret === 0) return `${name}: open`;
  return `${name}: fret ${pos.fret}`;
}

function ChordDetail({ chord }) {
  const [index, setIndex] = useState(0);
  const voicing = chord.voicings[index] || chord.voicings[0];
  const ordered = [...voicing.positions].sort((a, b) => b.string - a.string);

  return (
    <div className="chord-detail">
      <div className="chord-header">
        <h2>{chord.name}</h2>
        <span className="chord-type-badge">{chord.type}</span>
        <span className="chord-symbol">{chord.symbol}</span>
      </div>

      <div className="chord-info">
        <div className="info-item">
          <label>Notes</label>
          <div className="notes-display">
            {chord.notes.map((note) => (
              <span key={note} className="note-tag">{note}</span>
            ))}
          </div>
        </div>
      </div>

      {chord.voicings.length > 1 && (
        <div className="voicing-tabs" role="tablist" aria-label="Chord voicings">
          {chord.voicings.map((v, i) => (
            <button
              key={v.label}
              role="tab"
              aria-selected={i === index}
              className={`voicing-tab ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="fretboard-container">
        <GuitarFretboard
          positions={voicing.positions}
          baseFret={voicing.baseFret}
          barre={voicing.barre}
        />
      </div>

      <div className="finger-guide">
        <h4>How to play ({voicing.label})</h4>
        <ul>
          {ordered.map((pos) => (
            <li key={pos.string}>{describe(pos)}</li>
          ))}
        </ul>
      </div>

      <CagedSection chord={chord} />
    </div>
  );
}

export default ChordDetail;
