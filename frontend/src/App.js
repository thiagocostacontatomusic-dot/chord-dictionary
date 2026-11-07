import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import ChordList from './components/ChordList';
import ChordDetail from './components/ChordDetail';
import SearchBar from './components/SearchBar';
import CircleOfFifths from './components/CircleOfFifths';
import KeyChords from './components/KeyChords';
import FamilyChips from './components/FamilyChips';
import StudyGuide from './components/StudyGuide';
import ScaleNeck from './components/ScaleNeck';
import { searchChords, stats, getChord, chordFor, chordsOfRoot } from './chordData';
import { DEGREES, MODES, FAMILY, familyOf, mod12, fifthsIndex, keyNames } from './theory';
import { I18nContext, makeI18n, readLang, saveLang, readTheme, saveTheme } from './i18n';

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

  const [theme, setTheme] = useState(readTheme);
  const [searchTerm, setSearchTerm] = useState('');
  // The wheel: a tonic and a mode. The wheel itself always shows the parent major key.
  const initial = getChord(window.location.hash.slice(1));
  const initialMode = initial ? { major: 0, minor: 5, dim: 6 }[familyOf(initial.typeKey)] || 0 : 0;
  const [tonicPc, setTonicPc] = useState(initial ? initial.pcs[0] : 0);
  const [modeIdx, setModeIdx] = useState(initialMode);
  const [selectedId, setSelectedId] = useState(initial ? initial.id : 'C_major');
  const [scaleKey, setScaleKey] = useState(MODES[initialMode].key);

  const [installEvent, setInstallEvent] = useState(null);
  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    const onInstalled = () => setInstallEvent(null);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);
  const install = async () => {
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  const search = useDebounced(searchTerm.trim(), 150);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#131020' : '#1b1633');
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    saveLang(lang);
  }, [lang]);

  const chords = useMemo(() => searchChords({ search }), [search]);

  const parentPc = mod12(tonicPc - MODES[modeIdx].off);
  const parentIdx = fifthsIndex(parentPc);
  const selectedChord = getChord(selectedId) || chords[0] || null;
  const family = useMemo(() => (selectedChord ? chordsOfRoot(selectedChord.pcs[0]) : []), [selectedChord]);

  const choose = useCallback((chord) => {
    setSelectedId(chord.id);
    window.history.replaceState(null, '', `#${chord.id}`);
  }, []);

  const pickKey = useCallback(
    (pc, m) => {
      setTonicPc(pc);
      setModeIdx(m);
      if (m !== modeIdx) setScaleKey(MODES[m].key);
      const chord = chordFor(pc, MODES[m].qual);
      if (chord) choose(chord);
    },
    [choose, modeIdx]
  );

  const rotate = (idx) => pickKey(mod12(7 * idx + MODES[modeIdx].off), modeIdx);

  const pickDegree = (d) => {
    const chord = chordFor(mod12(parentPc + DEGREES[d].off), DEGREES[d].q);
    if (chord) choose(chord);
  };

  // Choosing a chord from the list or the chips: the wheel only turns if the chord is not in the current key.
  const selectChord = useCallback(
    (chord) => {
      const fam = familyOf(chord.typeKey);
      const inKey = DEGREES.some(
        (deg) => mod12(parentPc + deg.off) === chord.pcs[0] && FAMILY[deg.q].includes(chord.typeKey)
      );
      if (!inKey) {
        const m = { major: 0, minor: 5, dim: 6 }[fam] || 0;
        setTonicPc(chord.pcs[0]);
        setModeIdx(m);
        if (m !== modeIdx) setScaleKey(MODES[m].key);
      }
      choose(chord);
    },
    [parentPc, modeIdx, choose]
  );

  const onKeyDown = (e) => {
    // Up/Down move through the chord list only while the list or its search box has focus,
    // so the arrow keys still scroll the page everywhere else.
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    if (!e.target.closest || !e.target.closest('.zone-list')) return;
    if (!chords.length) return;
    e.preventDefault();
    const i = chords.findIndex((c) => selectedChord && c.id === selectedChord.id);
    const next = chords[Math.min(chords.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))];
    selectChord(next);
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
            <p className="stats">{t('stats', stats.totalChords, stats.totalVoicings)}</p>
            {installEvent && (
              <button type="button" className="install" onClick={install}>{t('install')}</button>
            )}
            <div className="lang" role="group" aria-label={t('themeLabel')}>
              {['light', 'dark'].map((th) => (
                <button key={th} type="button" className={theme === th ? 'is-active' : ''} aria-pressed={theme === th} onClick={() => setTheme(th)}>
                  {th === 'light' ? '☀' : '☾'}
                  <span className="sr-only">{t(th === 'light' ? 'themeLight' : 'themeDark')}</span>
                </button>
              ))}
            </div>
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
          <section className="zone-wheel">
            <h2 className="zone-title">{t('wheelTitle')}</h2>
            <p className="zone-help">{t('wheelHelp')}</p>
            <CircleOfFifths
              parentIdx={parentIdx}
              modeIdx={modeIdx}
              parentPc={parentPc}
              selectedId={selectedChord ? selectedChord.id : ''}
              onPickKey={pickKey}
              onRotate={rotate}
              onPickDegree={pickDegree}
            />
            <KeyChords
              parentPc={parentPc}
              modeIdx={modeIdx}
              selectedId={selectedChord ? selectedChord.id : ''}
              onPickDegree={pickDegree}
              onPickMode={(m) => pickKey(tonicPc, m)}
            />
          </section>

          <section className="zone-detail">
            {selectedChord && (
              <>
                <FamilyChips chords={family} selectedId={selectedChord.id} onSelect={selectChord} />
                <ChordDetail key={selectedChord.id} chord={selectedChord} onSelect={choose} />
                <ScaleNeck
                  scaleKey={scaleKey}
                  onScaleChange={setScaleKey}
                  rootPc={tonicPc}
                  rootName={keyNames(parentPc)[modeIdx]}
                  chord={selectedChord}
                />
                <StudyGuide parentPc={parentPc} selectedId={selectedChord.id} onSelect={choose} />
              </>
            )}
          </section>

          <aside className="zone-list">
            <h2 className="zone-title">{t('allChords')}</h2>
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <div className="count" aria-live="polite">
              <span>{t('found', chords.length)}</span>
            </div>
            <ChordList chords={chords} selectedChord={selectedChord} onSelectChord={selectChord} />
          </aside>
        </main>

        <footer className="foot">
          <p>{t('footer')}</p>
          <p>
            <a href="https://github.com/thiagocostacontatomusic-dot/chord-dictionary" target="_blank" rel="noreferrer">{t('source')}</a>
            {' · '}{t('madeBy')}
          </p>
        </footer>
      </div>
    </I18nContext.Provider>
  );
}

export default App;
