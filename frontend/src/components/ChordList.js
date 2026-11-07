import React, { useEffect, useRef } from 'react';
import { useI18n, pretty } from '../i18n';
import '../styles/ChordList.css';

function ChordList({ chords, selectedChord, onSelectChord }) {
  const { t, typeLabel } = useI18n();
  const activeRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    // Keep the active row visible by scrolling the list itself. scrollIntoView would also scroll
    // the whole page, which made the page jump while turning the wheel.
    const list = listRef.current;
    const row = activeRef.current;
    if (!list || !row) return;
    const l = list.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    if (r.top < l.top) list.scrollTop -= l.top - r.top;
    else if (r.bottom > l.bottom) list.scrollTop += r.bottom - l.bottom;
  }, [selectedChord]);

  if (chords.length === 0) {
    return <p className="list-empty">{t('noResults')}</p>;
  }

  return (
    <ul className="list" ref={listRef} aria-label={t('skip')}>
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
