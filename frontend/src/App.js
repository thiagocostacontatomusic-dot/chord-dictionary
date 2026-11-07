import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import ChordList from './components/ChordList';
import ChordDetail from './components/ChordDetail';
import SearchBar from './components/SearchBar';
import CircleOfFifths from './components/CircleOfFifths';
import KeyChords from './components/KeyChords';
import FamilyChips from './components/FamilyChips';
import { searchChords, stats, getChord, chordFor, chordsOfRoot } from './chordData';
import { DEGREES, MODES, FAMILY, familyOf, mod12, fifthsIndex } from './theory';
import { I18nContext, makeI18n, readLang, saveLang } from './i18n';

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

  const [searchTerm, setSearchTerm] = useState('');
  // The wheel: a tonic and a mode. The wheel itself always shows the parent major key.
  const initial = getChord(window.location.hash.slice(1));
  const initialMode = initial ? { major: 0, minor: 5, dim: 6 }[familyOf(initial.typeKey)] || 0 : 0;
  const [tonicPc, setTonicPc] = useState(initial ? initial.pcs[0] : 0);
  const [modeIdx, setModeIdx] = useState(initialMode);
  const [selectedId, setSelectedId] = useState(initial ? initial.id : 'C_major');

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
      const chord = chordFor(pc, MODES[m].qual);
      if (chord) choose(chord);
    },
    [choose]
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
        setTonicPc(chord.pcs[0]);
        setModeIdx({ major: 0, minor: 5, dim: 6 }[fam] || 0);
      }
      choose(chord);
    },
    [parentPc, choose]
  );

  const onKeyDown = (e) => {
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') {
      if (!(e.target.tagName === 'INPUT' && (e.key === 'ArrowDown' || e.key === 'ArrowUp'))) return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
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
                <ChordDetail key={selectedChord.id} chord={selectedChord} />
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
      </div>
    </I18nContext.Provider>
  );
}

export default App;
