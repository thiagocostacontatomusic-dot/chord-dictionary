import React, { useEffect, useRef } from 'react';
import { useI18n, pretty } from '../i18n';
import '../styles/ChordList.css';

function ChordList({ chords, selectedChord, onSelectChord }) {
  const { t, typeLabel } = useI18n();
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current && activeRef.current.scrollIntoView) {
      activeRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedChord]);

  if (chords.length === 0) {
    return <p className="list-empty">{t('noResults')}</p>;
  }

  return (
    <ul className="list" aria-label={t('skip')}>
      {chords.map((chord) => {
        const active = selectedChord && selectedChord.id === chord.id;
        return (
          <li key={chord.id}>
            <button
              type="button"
              ref={active ? activeRef : null}
              className={`row ${active ? 'is-active' : ''}`}
              aria-current={active ? 'true' : undefined}
              onClick={() => onSelectChord(chord)}
            >
              <span className="row-symbol">{pretty(chord.symbol)}</span>
              <span className="row-type">{typeLabel(chord.typeKey, chord.type)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default ChordList;
