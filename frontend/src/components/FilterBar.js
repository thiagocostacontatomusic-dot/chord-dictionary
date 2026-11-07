import React from 'react';
import { useI18n, pretty } from '../i18n';
import '../styles/FilterBar.css';

function FilterBar({ notes, types, selectedNote, selectedType, onNoteChange, onTypeChange }) {
  const { t, typeLabel } = useI18n();

  return (
    <div className="filters">
      <fieldset className="keys">
        <legend>{t('key')}</legend>
        <div className="keys-grid">
          {notes.map((n) => {
            const [sharp, flat] = n.label.split('/');
            const active = selectedNote === n.value;
            return (
              <button
                key={n.value}
                type="button"
                className={`key ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => onNoteChange(active ? '' : n.value)}
              >
                <span>{pretty(sharp)}</span>
                {flat && <small>{pretty(flat)}</small>}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="type-select">
        <span>{t('type')}</span>
        <select value={selectedType} onChange={(e) => onTypeChange(e.target.value)}>
          <option value="">{t('allTypes')}</option>
          {types.map((ty) => (
            <option key={ty.key} value={ty.key}>
              {typeLabel(ty.key, ty.name)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FilterBar;
