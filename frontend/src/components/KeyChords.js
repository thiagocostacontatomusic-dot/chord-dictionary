import React from 'react';
import { useI18n, pretty } from '../i18n';
import { chordFor } from '../chordData';
import { DEGREES, MODES, romanFor, mod12, keyNames, QUAL_SUFFIX } from '../theory';
import '../styles/KeyChords.css';

// Harmonic function of a scale degree counted from the tonic of the mode: tonic family I iii vi,
// subdominant ii IV, dominant V vii.
const FUNC = { 1: 'T', 2: 'S', 3: 'T', 4: 'S', 5: 'D', 6: 'T', 7: 'D' };

// The seven chords of the key as a plain row of buttons, with their Roman numerals.
function KeyChords({ parentPc, modeIdx, selectedId, onPickDegree, onPickMode }) {
  const { t } = useI18n();
  const names = keyNames(parentPc);
  const title = `${pretty(names[modeIdx])} ${t('modeNames')[modeIdx]}`;

  return (
    <section className="keychords" aria-label={t('chordsInKey', title)}>
      <div className="modes" role="group" aria-label={t('modeLabel')}>
        {MODES.map((m, i) => (
          <button
            key={m.key}
            type="button"
            className={`mode ${i === modeIdx ? 'is-active' : ''}`}
            aria-pressed={i === modeIdx}
            onClick={() => onPickMode(i)}
          >
            {t('modeNames')[i]}
          </button>
        ))}
      </div>
      <h3 className="keychords-title">{t('chordsInKey', title)}</h3>
      <p className="keychords-sub">
        {t('modeMoods')[modeIdx]}
        {modeIdx !== 0 ? ` · ${t('sameNotes', pretty(names[0]))}` : ''}
      </p>
      <ol className="degrees">
        {DEGREES.map((deg, d) => {
          const chord = chordFor(mod12(parentPc + deg.off), deg.q);
          if (!chord) return null;
          return (
            <li key={d}>
              <button
                type="button"
                className={`degree ${chord.id === selectedId ? 'is-selected' : ''} ${d === modeIdx ? 'is-tonic' : ''}`}
                onClick={() => onPickDegree(d)}
              >
                <span className="degree-roman">{romanFor(d, modeIdx)}</span>
                <span className="degree-name">{pretty(names[d] + QUAL_SUFFIX[deg.q])}</span>
                <span className="degree-func" title={t('funcName', FUNC[((d - modeIdx + 7) % 7) + 1])}>{t('funcShort', FUNC[((d - modeIdx + 7) % 7) + 1])}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="keychords-note">{t('funcNote')}</p>
    </section>
  );
}

export default KeyChords;
