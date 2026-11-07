import React from 'react';
import { useI18n } from '../i18n';
import '../styles/SearchBar.css';

function SearchBar({ searchTerm, onSearchChange }) {
  const { t } = useI18n();
  return (
    <div className="search">
      <svg className="search-icon" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <line x1="12.6" y1="12.6" x2="17" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t('search')}
        aria-label={t('search')}
        autoComplete="off"
        spellCheck="false"
      />
      {searchTerm && (
        <button type="button" className="search-clear" onClick={() => onSearchChange('')} aria-label={t('clearSearch')}>
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;
