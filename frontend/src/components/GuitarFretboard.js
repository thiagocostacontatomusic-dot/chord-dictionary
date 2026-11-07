import React, { useContext, useId } from 'react';
import { useI18n, LeftyContext } from '../i18n';
import '../styles/GuitarFretboard.css';

// Chord diagram drawn as a rosewood neck: bone nut, nickel frets, pearl inlays,
// bronze wound strings. Strings run left (6, low E) to right (1, high E).
const FRETS = 5;
const X0 = 55;
const GAP_X = 28;
const Y0 = 70;
const GAP_Y = 46;
const BOARD_L = 40;
const BOARD_W = GAP_X * 5 + 30;
const BOARD_H = GAP_Y * FRETS + 6;
const VIEW_W = 250;
const VIEW_H = Y0 + BOARD_H + 14;

const STRING_WIDTH = [2.6, 2.2, 1.8, 1.4, 1.1, 0.9];
const SINGLE_INLAY = [3, 5, 7, 9, 15, 17, 19, 21];
const DOUBLE_INLAY = [12, 24];

// Right-handed: low E on the left. Left-handed: the diagram is mirrored, low E on the right.
const xOfFor = (lefty) => (stringNum) => X0 + (lefty ? stringNum - 1 : 6 - stringNum) * GAP_X;
const rowY = (fret, base) => Y0 + (fret - base + 0.5) * GAP_Y;

function GuitarFretboard({ positions, baseFret = 1, barre, compact = false, showLegend = true }) {
  const { t } = useI18n();
  const lefty = useContext(LeftyContext);
  const xOf = xOfFor(lefty);
  const uid = useId().replace(/:/g, '');
  const nut = baseFret === 1;
  const byString = Object.fromEntries(positions.map((p) => [p.string, p.fret]));
  const summary = [6, 5, 4, 3, 2, 1]
    .map((s) => (byString[s] === null ? 'x' : byString[s]))
    .join(' ');

  const rows = Array.from({ length: FRETS }, (_, i) => baseFret + i);
  const inlays = rows.flatMap((fret) => {
    const y = rowY(fret, baseFret);
    if (SINGLE_INLAY.includes(fret)) return [{ key: fret, x: X0 + GAP_X * 2.5, y }];
    if (DOUBLE_INLAY.includes(fret)) {
      return [
        { key: `${fret}a`, x: X0 + GAP_X * 1.5, y },
        { key: `${fret}b`, x: X0 + GAP_X * 3.5, y },
      ];
    }
    return [];
  });

  const barreStrings = barre ? new Set() : null;
  if (barre) {
    positions.forEach((p) => {
      if (p.fret === barre.fret && p.string <= barre.fromString && p.string >= barre.toString) {
        barreStrings.add(p.string);
      }
    });
  }

  return (
    <figure className={`neck ${compact ? 'neck-compact' : ''}`}>
      <svg viewBox={`0 ${Y0 - 38} ${VIEW_W} ${VIEW_H - Y0 + 38}`} role="img" aria-label={t('diagram', summary)}>
        <defs>
          <linearGradient id={`wood${uid}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#2b1a12" />
            <stop offset="0.5" stopColor="#3d2519" />
            <stop offset="1" stopColor="#2b1a12" />
          </linearGradient>
          <linearGradient id={`bone${uid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f6f1e3" />
            <stop offset="1" stopColor="#d9d1bb" />
          </linearGradient>
          <linearGradient id={`finger${uid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#a08bff" />
            <stop offset="1" stopColor="#6b4eff" />
          </linearGradient>
        </defs>

        {/* board */}
        <rect x={BOARD_L} y={Y0} width={BOARD_W} height={BOARD_H} rx="3" fill={`url(#wood${uid})`} />

        {/* inlays */}
        {inlays.map((i) => (
          <circle key={i.key} cx={i.x} cy={i.y} r="6" className="inlay" />
        ))}

        {/* fret wires */}
        {Array.from({ length: FRETS + 1 }, (_, i) => i).map((i) => {
          if (i === 0 && nut) return null;
          const y = Y0 + i * GAP_Y;
          return (
            <g key={`fw${i}`}>
              <line x1={BOARD_L} x2={BOARD_L + BOARD_W} y1={y + 2} y2={y + 2} className="fret-shadow" />
              <line x1={BOARD_L} x2={BOARD_L + BOARD_W} y1={y} y2={y} className="fret-wire" />
            </g>
          );
        })}

        {/* strings */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`st${i}`}
            x1={X0 + i * GAP_X}
            x2={X0 + i * GAP_X}
            y1={Y0}
            y2={Y0 + BOARD_H}
            className={(lefty ? 5 - i : i) < 3 ? 'string-wound' : 'string-plain'}
            strokeWidth={STRING_WIDTH[lefty ? 5 - i : i]}
          />
        ))}

        {/* nut or position label */}
        {nut ? (
          <rect x={BOARD_L - 2} y={Y0 - 9} width={BOARD_W + 4} height="10" rx="2" fill={`url(#bone${uid})`} />
        ) : (
          <text x={BOARD_L - 8} y={Y0 + GAP_Y / 2 + 7} className="base-label" textAnchor="end">
            {baseFret}fr
          </text>
        )}

        {/* open and muted markers above the nut */}
        {[6, 5, 4, 3, 2, 1].map((s) => {
          const fret = byString[s];
          if (fret === null) {
            return (
              <g key={`m${s}`} className="mark-muted">
                <line x1={xOf(s) - 5} x2={xOf(s) + 5} y1={Y0 - 28} y2={Y0 - 18} />
                <line x1={xOf(s) + 5} x2={xOf(s) - 5} y1={Y0 - 28} y2={Y0 - 18} />
              </g>
            );
          }
          if (fret === 0) return <circle key={`o${s}`} cx={xOf(s)} cy={Y0 - 23} r="6" className="mark-open" />;
          return null;
        })}

        {/* barre */}
        {barre && (
          <g className="barre">
            <rect
              x={Math.min(xOf(barre.fromString), xOf(barre.toString)) - 15}
              y={rowY(barre.fret, baseFret) - 11}
              width={Math.abs(xOf(barre.toString) - xOf(barre.fromString)) + 30}
              height="26"
              rx="13"
              className="barre-shadow"
            />
            <rect
              x={Math.min(xOf(barre.fromString), xOf(barre.toString)) - 15}
              y={rowY(barre.fret, baseFret) - 13}
              width={Math.abs(xOf(barre.toString) - xOf(barre.fromString)) + 30}
              height="26"
              rx="13"
              fill={`url(#finger${uid})`}
              className="barre-bar"
            />
          </g>
        )}

        {/* fingers */}
        {positions.map((p) => {
          if (p.fret === null || p.fret === 0) return null;
          if (barreStrings && barreStrings.has(p.string)) return null;
          const row = p.fret - baseFret;
          if (row < 0 || row >= FRETS) return null;
          const cx = xOf(p.string);
          const cy = rowY(p.fret, baseFret);
          return (
            <g key={`f${p.string}`}>
              <circle cx={cx} cy={cy + 2} r="12" className="finger-shadow" />
              <circle cx={cx} cy={cy} r="12" fill={`url(#finger${uid})`} className="finger" />
            </g>
          );
        })}
      </svg>

      {showLegend && !compact && (
        <figcaption className="neck-legend">
          <span><i className="lg lg-finger" />{t('legendFinger')}</span>
          <span><i className="lg lg-barre" />{t('legendBarre')}</span>
          <span><i className="lg lg-open" />{t('legendOpen')}</span>
          <span><i className="lg lg-muted">×</i>{t('legendMuted')}</span>
        </figcaption>
      )}
    </figure>
  );
}

export default GuitarFretboard;
