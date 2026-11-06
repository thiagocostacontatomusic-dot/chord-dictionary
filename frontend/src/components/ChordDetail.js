import React from 'react';
import GuitarFretboard from './GuitarFretboard';
import '../styles/ChordDetail.css';

function ChordDetail({ chord }) {
  return (
    <div className="chord-detail">
      <div className="chord-header">
        <h2>{chord.name}</h2>
        <span className="chord-type-badge">{chord.type}</span>
      </div>

      <div className="chord-info">
        <div className="info-item">
          <label>Notes:</label>
          <div className="notes-display">
            {chord.notes.map((note) => (
              <span key={note} className="note-tag">
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="fretboard-container">
        <h3>Guitar Positions</h3>
        <GuitarFretboard positions={chord.positions} />
      </div>

      <div className="finger-guide">
        <h4>How to play:</h4>
        <ul>
          {chord.positions.map((pos, idx) => {
            const stringNames = ['High E', 'B', 'G', 'D', 'A', 'Low E'];
            if (pos.fret === null) {
              return (
                <li key={idx}>
                  String {pos.string} ({stringNames[pos.string - 1]}): Muted (X)
                </li>
              );
            }
            if (pos.fret === 0) {
              return (
                <li key={idx}>
                  String {pos.string} ({stringNames[pos.string - 1]}): Open (O)
                </li>
              );
            }
            return (
              <li key={idx}>
                String {pos.string} ({stringNames[pos.string - 1]}): Fret {pos.fret}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ChordDetail;
