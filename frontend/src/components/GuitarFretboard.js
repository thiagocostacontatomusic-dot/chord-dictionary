import React from 'react';
import '../styles/GuitarFretboard.css';

// SVG chord diagram. Strings run left (6, low E) -> right (1, high E).
const STRINGS = 6;
const FRETS = 5;
const X0 = 44;
const Y0 = 46;
const GAP_X = 28;
const GAP_Y = 36;
const WIDTH = X0 + GAP_X * (STRINGS - 1) + 30;
const HEIGHT = Y0 + GAP_Y * FRETS + 20;

const xOf = (stringNum) => X0 + (6 - stringNum) * GAP_X;
const yOfFret = (fret, baseFret) => Y0 + (fret - baseFret + 0.5) * GAP_Y;

function GuitarFretboard({ positions, baseFret = 1, barre, compact = false }) {
  const nut = baseFret === 1;
  return (
    <div className={`guitar-fretboard ${compact ? 'compact' : ''}`}>
      <svg
        className="chord-diagram"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Guitar chord diagram"
      >
        {/* nut or fret position label */}
        {nut ? (
          <rect x={X0 - 2} y={Y0 - 5} width={GAP_X * 5 + 4} height="6" className="nut" />
        ) : (
          <text x={X0 - 14} y={Y0 + GAP_Y / 2 + 5} className="base-fret-label" textAnchor="end">
            {baseFret}fr
          </text>
        )}

        {/* frets */}
        {Array.from({ length: FRETS + 1 }).map((_, i) => (
          <line key={`f${i}`} x1={X0} x2={X0 + GAP_X * 5} y1={Y0 + i * GAP_Y} y2={Y0 + i * GAP_Y} className="fret-line" />
        ))}

        {/* strings */}
        {Array.from({ length: STRINGS }).map((_, i) => (
          <line key={`s${i}`} x1={X0 + i * GAP_X} x2={X0 + i * GAP_X} y1={Y0} y2={Y0 + FRETS * GAP_Y} className="string-line" />
        ))}

        {/* barre */}
        {barre && (
          <rect
            x={xOf(barre.fromString) - 9}
            y={yOfFret(barre.fret, baseFret) - 9}
            width={xOf(barre.toString) - xOf(barre.fromString) + 18}
            height="18"
            rx="9"
            className="barre"
          />
        )}

        {/* markers */}
        {positions.map((p) => {
          const x = xOf(p.string);
          if (p.fret === null) {
            return (
              <text key={p.string} x={x} y={Y0 - 14} textAnchor="middle" className="muted-mark">
                ×
              </text>
            );
          }
          if (p.fret === 0) {
            return <circle key={p.string} cx={x} cy={Y0 - 18} r="6" className="open-mark" />;
          }
          const row = p.fret - baseFret;
          if (row < 0 || row >= FRETS) return null;
          return <circle key={p.string} cx={x} cy={yOfFret(p.fret, baseFret)} r="9" className="dot" />;
        })}
      </svg>

      {!compact && (
        <div className="fretboard-legend">
          <span><i className="legend-dot" /> Fretted</span>
          <span><i className="legend-open" /> Open</span>
          <span><b className="legend-x">×</b> Muted</span>
        </div>
      )}
    </div>
  );
}

export default GuitarFretboard;
