import React from 'react';
import { useI18n, pretty } from '../i18n';
import '../styles/FamilyChips.css';

// Every chord type for the current root, one tap away.
function FamilyChips({ chords, selectedId, onSelect }) {
  const { t, typeLabel } = useI18n();
  return (
    <div className="family" role="group" aria-label={t('sameChord')}>
      {chords.map((c) => (
        <button
          key={c.id}
          type="button"
          title={typeLabel(c.typeKey, c.type)}
          className={`chip ${c.id === selectedId ? 'is-active' : ''}`}
          aria-pressed={c.id === selectedId}
          onClick={() => onSelect(c)}
        >
          {pretty(c.symbol)}
        </button>
      ))}
    </div>
  );
}

export default FamilyChips;
