import React from 'react';
import '../styles/ChordList.css';

function ChordList({ chords, selectedChord, onSelectChord }) {
  if (chords.length === 0) {
    return <div className="no-results">No chords found</div>;
  }

  return (
    <div className="chord-list">
      <div className="chord-count">
        {chords.length} chord{chords.length !== 1 ? 's' : ''} found
      </div>
      <ul>
        {chords.map((chord) => (
          <li
            key={chord.id}
            className={`chord-item ${selectedChord?.id === chord.id ? 'active' : ''}`}
            onClick={() => onSelectChord(chord)}
          >
            <div className="chord-item-name">{chord.name}</div>
            <div className="chord-item-type">{chord.type}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChordList;
