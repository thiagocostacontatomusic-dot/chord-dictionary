import React, { useEffect, useMemo, useState } from 'react';
import { useI18n, pretty } from '../i18n';
import { chordFor, getChord } from '../chordData';
import { DEGREES, mod12, keyNames, familyOf } from '../theory';
import { strumSequence, audioSupported } from '../audio';
import '../styles/ProgressionBuilder.css';

const STORE = 'chord-dictionary-progression';
const NUMERALS = ['I', '♭II', 'II', '♭III', 'III', 'IV', '♯IV', 'V', '♭VI', 'VI', '♭VII', 'VII'];

// Roman numeral of a chord inside a major key: lower case for minor and diminished chords.
function roman(chord, keyPc) {
  const base = NUMERALS[mod12(chord.pcs[0] - keyPc)];
  const fam = familyOf(chord.typeKey);
  const suffix = chord.symbol.slice(chord.rootName.length);
  if (fam === 'minor') return base.toLowerCase() + suffix.replace(/^m(?!aj|Maj)/, '').replace(/^Maj/, 'Maj');
  if (fam === 'dim') return base.toLowerCase() + (suffix === 'dim' ? '°' : suffix);
  return base + suffix;
}

function readStored() {
  try {
    const ids = JSON.parse(window.localStorage.getItem(STORE) || '[]');
    return ids.filter((id) => getChord(id));
  } catch (e) {
    return [];
  }
}

// Build a progression: add chords, hear it, move it to any key, see the Roman numerals.
function ProgressionBuilder({ parentPc, selectedChord, onSelect }) {
  const { t } = useI18n();
  const [ids, setIds] = useState(readStored);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORE, JSON.stringify(ids));
    } catch (e) {
      /* storage can be blocked */
    }
  }, [ids]);

  const chords = useMemo(() => ids.map((id) => getChord(id)).filter(Boolean), [ids]);
  const names = keyNames(parentPc);
  const keyLabel = pretty(names[0]);

  const add = (chord) => chord && setIds((l) => [...l, chord.id]);
  const remove = (i) => setIds((l) => l.filter((_, k) => k !== i));
  const transpose = (n) =>
    setIds((l) =>
      l.map((id) => {
        const c = getChord(id);
        return (c && chordFor(mod12(c.pcs[0] + n), c.typeKey)?.id) || id;
      })
    );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(chords.map((c) => c.symbol).join(' | '));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      /* clipboard may be blocked */
    }
  };

  return (
    <section className="prog" aria-labelledby="prog-title">
      <h3 id="prog-title">{t('progTitle')}</h3>
      <p className="prog-help">{t('progHelp', keyLabel)}</p>

      <div className="prog-add">
        <button type="button" className="prog-btn" onClick={() => add(selectedChord)}>
          + {pretty(selectedChord.symbol)}
        </button>
        <span className="prog-sep">{t('progKeyChords', keyLabel)}</span>
        {DEGREES.map((deg, d) => {
          const c = chordFor(mod12(parentPc + deg.off), deg.q === 'major' ? 'major' : deg.q);
          if (!c) return null;
          return (
            <button key={d} type="button" className="prog-btn prog-btn-soft" onClick={() => add(c)}>
              {pretty(c.symbol)}
            </button>
          );
        })}
      </div>

      {chords.length === 0 ? (
        <p className="prog-empty">{t('progEmpty')}</p>
      ) : (
        <ol className="prog-list">
          {chords.map((c, i) => (
            <li key={i + c.id}>
              <button type="button" className={`prog-chord ${c.id === selectedChord.id ? 'is-selected' : ''}`} onClick={() => onSelect(c)}>
                <b>{pretty(c.symbol)}</b>
                <span>{pretty(roman(c, parentPc))}</span>
              </button>
              <button type="button" className="prog-x" onClick={() => remove(i)} aria-label={t('progRemove', pretty(c.symbol))}>
                ×
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="prog-tools">
        {audioSupported() && (
          <button type="button" className="prog-btn prog-primary" disabled={!chords.length} onClick={() => strumSequence(chords.map((c) => c.voicings[0].positions))}>
            ▶ {t('play')}
          </button>
        )}
        <button type="button" className="prog-btn" disabled={!chords.length} onClick={() => transpose(-1)}>
          − {t('progSemitone')}
        </button>
        <button type="button" className="prog-btn" disabled={!chords.length} onClick={() => transpose(1)}>
          + {t('progSemitone')}
        </button>
        <button type="button" className="prog-btn" disabled={!chords.length} onClick={copy}>
          {copied ? t('copied') : t('progCopy')}
        </button>
        <button type="button" className="prog-btn" disabled={!chords.length} onClick={() => setIds([])}>
          {t('progClear')}
        </button>
      </div>
    </section>
  );
}

export default ProgressionBuilder;
