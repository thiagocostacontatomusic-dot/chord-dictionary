import React from 'react';
import '../styles/GuitarFretboard.css';

function GuitarFretboard({ positions }) {
  const strings = 6; // Guitar has 6 strings
  const frets = 5; // Show first 5 frets
  const stringNames = ['E', 'B', 'G', 'D', 'A', 'E'];

  // Helper function to get the position for a string
  const getPositionForString = (stringNum) => {
    return positions.find((pos) => pos.string === stringNum);
  };

  return (
    <div className="guitar-fretboard">
      <div className="fretboard-diagram">
        {/* Fret numbers */}
        <div className="fret-numbers">
          <div className="string-label"></div>
          {Array.from({ length: frets }).map((_, i) => (
            <div key={`fret-${i}`} className="fret-number">
              {i === 0 ? '0' : i}
            </div>
          ))}
        </div>

        {/* Strings */}
        {Array.from({ length: strings }).map((_, stringIdx) => {
          const stringNum = stringIdx + 1;
          const position = getPositionForString(stringNum);

          return (
            <div key={`string-${stringNum}`} className="string-row">
              <div className="string-label">{stringNames[stringIdx]}</div>

              {/* Frets for this string */}
              {Array.from({ length: frets }).map((_, fretIdx) => {
                const isOpen = position?.fret === 0 && fretIdx === 0;
                const isFretted =
                  position?.fret !== null &&
                  position?.fret !== undefined &&
                  position.fret === fretIdx;
                const isMuted = position?.fret === null && fretIdx === 0;

                return (
                  <div
                    key={`${stringNum}-${fretIdx}`}
                    className={`fret-cell ${
                      isOpen ? 'open' : ''
                    } ${isFretted ? 'fretted' : ''} ${isMuted ? 'muted' : ''}`}
                  >
                    {isOpen && <span className="marker open-marker">O</span>}
                    {isFretted && <span className="marker fret-marker">●</span>}
                    {isMuted && <span className="marker muted-marker">✕</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="fretboard-legend">
        <div className="legend-item">
          <span className="legend-marker open">O</span> Open String
        </div>
        <div className="legend-item">
          <span className="legend-marker fretted">●</span> Fretted
        </div>
        <div className="legend-item">
          <span className="legend-marker muted">✕</span> Muted
        </div>
      </div>
    </div>
  );
}

export default GuitarFretboard;
