import React from 'react';
import '../styles/FilterBar.css';

function FilterBar({
  notes,
  types,
  selectedNote,
  selectedType,
  onNoteChange,
  onTypeChange,
  onClearFilters,
}) {
  const hasFilters = selectedNote || selectedType;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="note-select">Note:</label>
        <select
          id="note-select"
          value={selectedNote}
          onChange={(e) => onNoteChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Notes</option>
          {notes.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="type-select">Type:</label>
        <select
          id="type-select"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          className="clear-filters-btn"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;
