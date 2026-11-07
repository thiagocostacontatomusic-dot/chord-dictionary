import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import ChordList from './components/ChordList';
import ChordDetail from './components/ChordDetail';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import { I18nContext, makeI18n, readLang, saveLang } from './i18n';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function useDebounced(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

function App() {
  const [lang, setLang] = useState(readLang);
  const i18n = useMemo(() => makeI18n(lang), [lang]);
  const { t } = i18n;

  const [chords, setChords] = useState([]);
  const [selectedId, setSelectedId] = useState(() => window.location.hash.slice(1) || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState([]);
  const [types, setTypes] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const search = useDebounced(searchTerm.trim(), 150);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    saveLang(lang);
  }, [lang]);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/notes`),
      axios.get(`${API_URL}/types`),
      axios.get(`${API_URL}/stats`),
    ])
      .then(([n, ty, s]) => {
        setNotes(n.data);
        setTypes(ty.data);
        setStats(s.data);
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios
      .get(`${API_URL}/chords`, { params: { search, note: selectedNote, type: selectedType } })
      .then((res) => {
        if (cancelled) return;
        setChords(res.data);
        setError(false);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [search, selectedNote, selectedType]);

  const selectedChord = useMemo(
    () => chords.find((c) => c.id === selectedId) || chords[0] || null,
    [chords, selectedId]
  );

  const select = useCallback((chord) => {
    setSelectedId(chord.id);
    window.history.replaceState(null, '', `#${chord.id}`);
  }, []);

  const onKeyDown = (e) => {
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') {
      if (!(e.target.tagName === 'INPUT' && (e.key === 'ArrowDown' || e.key === 'ArrowUp'))) return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    if (!chords.length) return;
    e.preventDefault();
    const i = chords.findIndex((c) => selectedChord && c.id === selectedChord.id);
    const next = chords[Math.min(chords.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))];
    select(next);
  };

  const filtered = Boolean(searchTerm || selectedNote || selectedType);
  const clearAll = () => {
    setSearchTerm('');
    setSelectedNote('');
    setSelectedType('');
  };

  return (
    <I18nContext.Provider value={i18n}>
      <div className="app" onKeyDown={onKeyDown}>
        <header className="top">
          <div className="brand">
            <h1>Chord Dictionary</h1>
            <p>{t('tagline')}</p>
          </div>
          <div className="top-side">
            {stats && <p className="stats">{t('stats', stats.totalChords, stats.totalVoicings)}</p>}
            <div className="lang" role="group" aria-label={t('language')}>
              {['en', 'pt'].map((l) => (
                <button
                  key={l}
                  type="button"
                  className={lang === l ? 'is-active' : ''}
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                >
                  {l === 'en' ? 'EN' : 'PT'}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="layout">
          <aside className="browser">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <FilterBar
              notes={notes}
              types={types}
              selectedNote={selectedNote}
              selectedType={selectedType}
              onNoteChange={setSelectedNote}
              onTypeChange={setSelectedType}
            />
            <div className="count" aria-live="polite">
              <span>{loading ? t('loading') : t('found', chords.length)}</span>
              {filtered && (
                <button type="button" onClick={clearAll}>{t('clearFilters')}</button>
              )}
            </div>
            {error ? (
              <p className="error" role="alert">{t('loadError')}</p>
            ) : (
              <ChordList chords={chords} selectedChord={selectedChord} onSelectChord={select} />
            )}
          </aside>

          <section className="panel">
            {selectedChord && !error && <ChordDetail key={selectedChord.id} chord={selectedChord} />}
          </section>
        </main>
      </div>
    </I18nContext.Provider>
  );
}

export default App;
