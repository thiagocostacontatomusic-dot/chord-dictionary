import React, { useEffect, useMemo, useState } from 'react';
import GuitarFretboard from './GuitarFretboard';
import CagedSection from './CagedSection';
import { useI18n, pretty } from '../i18n';
import { strum, audioSupported } from '../audio';
import { chordFor } from '../chordData';
import { GROUPS, parseInversions, loadInversions, loadedInversions } from '../inversions';
import '../styles/ChordDetail.css';

const TUNING = { 6: 4, 5: 9, 4: 2, 3: 7, 2: 11, 1: 4 };

function ChordDetail({ chord, onSelect }) {
  const { t, typeLabel, stringName } = useI18n();
  const [index, setIndex] = useState(0);
  const [group, setGroup] = useState('shapes');

  // Inversions and compact voicings, grouped by kind and filtered by bass note and strings.
  // They live in their own file, downloaded the first time the view is opened.
  const [invRaw, setInvRaw] = useState(loadedInversions);
  const [invState, setInvState] = useState('idle');
  useEffect(() => {
    if (group !== 'inversions' || invRaw) return undefined;
    let alive = true;
    setInvState('loading');
    loadInversions()
      .then((all) => { if (alive) { setInvRaw(all); setInvState('ready'); } })
      .catch(() => { if (alive) setInvState('error'); });
    return () => { alive = false; };
  }, [group, invRaw]);
  const inversions = useMemo(() => parseInversions(invRaw ? invRaw[chord.id] : []), [invRaw, chord.id]);
  const groups = GROUPS.filter((g) => inversions.some((v) => v.group === g));
  const defaultGroup = groups.includes('drop2') ? 'drop2' : groups[0];
  const [catPick, setCat] = useState(null);
  const cat = catPick && groups.includes(catPick) ? catPick : defaultGroup;
  const [bass, setBass] = useState('all');
  const [strSet, setStrSet] = useState('all');
  const inCat = useMemo(() => inversions.filter((v) => v.group === cat), [inversions, cat]);
  const shown = useMemo(
    () => (group === 'inversions'
      ? inCat
        .filter((v) => (bass === 'all' || v.bassIndex === bass) && (strSet === 'all' || v.set === strSet))
        .sort((a, b) => a.lowest - b.lowest || b.strings[0] - a.strings[0] || a.bassIndex - b.bassIndex)
      : []),
    [group, inCat, bass, strSet]
  );
  const bassOptions = useMemo(() => [...new Set(inCat.map((v) => v.bassIndex))].sort((a, b) => a - b), [inCat]);
  const setOptions = useMemo(
    () => [...new Set(inCat.filter((v) => bass === 'all' || v.bassIndex === bass).map((v) => v.set))].sort((a, b) => b.localeCompare(a)),
    [inCat, bass]
  );
  const list = group === 'inversions' && shown.length ? shown : chord.voicings;
  const voicing = list[index] || list[0];
  const switchGroup = (g) => {
    setGroup(g);
    setIndex(0);
  };
  const pickCat = (g) => {
    setCat(g);
    setBass('all');
    setStrSet('all');
    setIndex(0);
  };
  const pickBass = (b) => {
    setBass(b);
    setStrSet('all');
    setIndex(0);
  };

  const noteOf = (pc) => {
    const i = chord.pcs.indexOf(pc);
    return i === -1 ? null : { name: chord.notes[i], degree: chord.degrees[i] };
  };

  const rows = [6, 5, 4, 3, 2, 1].map((s) => {
    const fret = voicing.positions.find((p) => p.string === s).fret;
    return {
      s,
      fret,
      note: fret === null ? null : noteOf((TUNING[s] + fret) % 12),
    };
  });

  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `${chord.symbol} · Chord Dictionary`, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch (e) { /* user cancelled */ }
  };

  // Dominant-type chords carry a tritone (third and flat seventh) that resolves a fourth up.
  const iThird = chord.degrees.indexOf('3');
  const iSev = chord.degrees.indexOf('♭7');
  let tritone = null;
  if (iThird !== -1 && iSev !== -1) {
    const target = chordFor((chord.pcs[0] + 5) % 12, 'major');
    const sub = chordFor((chord.pcs[0] + 6) % 12, 'dom7');
    if (target && sub) tritone = { third: chord.notes[iThird], sev: chord.notes[iSev], target, sub };
  }

  const voicingLabel = (v) => {
    if (v.cat) {
      const where = v.lowest === 0 ? t('openShort') : t('fretShort', v.lowest);
      return `${v.strings[0]}–${v.strings[1]} · ${where}`;
    }
    return v.shape ? t('shapeTab', v.shape, v.fret) : t('openPosition');
  };

  return (
    <article className="detail">
      <header className="detail-head">
        <p className="detail-symbol">{pretty(chord.symbol)}</p>
        <div className="detail-titles">
          <h2>{pretty(chord.rootName)} {typeLabel(chord.typeKey, chord.type)}</h2>
          {chord.altName && (
            <p className="detail-alt">{t('also')}: {pretty(chord.altSymbol)}</p>
          )}
        </div>
        <div className="detail-actions">
          {audioSupported() && (
            <button type="button" className="act act-primary" onClick={() => strum(voicing.positions)}>
              ▶ {t('play')}
            </button>
          )}
          <button type="button" className="act" onClick={share}>
            {copied ? t('copied') : t('share')}
          </button>
        </div>
      </header>

      <ul className="tones" aria-label={t('notes')}>
        {chord.notes.map((n, i) => (
          <li className="tone" key={n + i}>
            <b>{pretty(n)}</b>
            <span>{chord.degrees[i]}</span>
          </li>
        ))}
      </ul>

      {chord.inversionCount > 0 && (
        <div className="seg group-switch" role="group" aria-label={t('voicings')}>
          <button type="button" className={group === 'shapes' ? 'is-active' : ''} aria-pressed={group === 'shapes'} onClick={() => switchGroup('shapes')}>
            {t('groupShapes')}
          </button>
          <button type="button" className={group === 'inversions' ? 'is-active' : ''} aria-pressed={group === 'inversions'} onClick={() => switchGroup('inversions')}>
            {t('groupInversions', chord.inversionCount)}
          </button>
        </div>
      )}

      {group === 'inversions' && invState === 'loading' && !invRaw && <p className="inv-note" role="status">{t('invLoading')}</p>}
      {group === 'inversions' && invState === 'error' && <p className="inv-note" role="alert">{t('invError')}</p>}
      {group === 'inversions' && groups.length > 0 && (
        <div className="inv-panel">
          <div className="seg" role="group" aria-label={t('invKind')}>
            {groups.map((g) => (
              <button key={g} type="button" className={cat === g ? 'is-active' : ''} aria-pressed={cat === g} onClick={() => pickCat(g)}>
                {t('invGroup', g)}
              </button>
            ))}
          </div>
          <p className="inv-note">{t('invGroupHelp', cat)}</p>
          <div className="seg" role="group" aria-label={t('invBass')}>
            <button type="button" className={bass === 'all' ? 'is-active' : ''} aria-pressed={bass === 'all'} onClick={() => pickBass('all')}>
              {t('invAll')}
            </button>
            {bassOptions.map((b) => (
              <button key={b} type="button" className={bass === b ? 'is-active' : ''} aria-pressed={bass === b} onClick={() => pickBass(b)}>
                {b === 0 ? t('invRoot') : t('invBassDeg', chord.degrees[b])}
              </button>
            ))}
          </div>
          <label className="inv-set">
            <span>{t('invStrings')}</span>
            <select value={strSet} onChange={(e) => { setStrSet(e.target.value); setIndex(0); }}>
              <option value="all">{t('invAll')}</option>
              {setOptions.map((o) => (
                <option key={o} value={o}>{o.split('-').join(' · ')}</option>
              ))}
            </select>
          </label>
          {voicing.cat && (
            <p className="inv-note inv-now">
              {voicing.bassIndex === 0
                ? t('invRootNote', pretty(chord.symbol))
                : t('invNote', pretty(`${chord.symbol}/${chord.notes[voicing.bassIndex]}`), pretty(chord.notes[voicing.bassIndex]))}
              {voicing.group === 'rootless' ? ` ${t('invRootless')}` : ''}
            </p>
          )}
        </div>
      )}

      {group === 'inversions' && shown.length > 0 && (
        <div className="stepper">
          <button type="button" className="step" aria-label={t('invPrev')} disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>‹</button>
          <span className="step-count" aria-live="polite">{t('invCount', Math.min(index, shown.length - 1) + 1, shown.length)} · {voicingLabel(voicing)}</span>
          <button type="button" className="step" aria-label={t('invNext')} disabled={index >= shown.length - 1} onClick={() => setIndex(Math.min(shown.length - 1, index + 1))}>›</button>
        </div>
      )}
      {group === 'inversions' && invRaw && shown.length === 0 && <p className="inv-note">{t('invNone')}</p>}

      {list.length > 1 && !(group === 'inversions' && shown.length) && (
        <div className="tabs" role="tablist" aria-label={t('voicings')}>
          {list.map((v, i) => (
            <button
              key={v.label}
              role="tab"
              type="button"
              aria-selected={i === index}
              className={`tab ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
            >
              {voicingLabel(v)}
            </button>
          ))}
        </div>
      )}

      <div className="stage">
        <GuitarFretboard
          positions={voicing.positions}
          baseFret={voicing.baseFret}
          barre={voicing.barre}
        />

        <div className="how">
          <h3>{t('howToPlay')}</h3>
          <table>
            <tbody>
              {rows.map((r) => (
                <tr key={r.s} className={r.fret === null ? 'is-muted' : ''}>
                  <th scope="row">
                    <span className="how-num">{r.s}</span>
                    {stringName(r.s)}
                  </th>
                  <td className="how-fret">
                    {r.fret === null ? t('muted') : r.fret === 0 ? t('open') : t('fretWord', r.fret)}
                  </td>
                  <td className="how-note">
                    {r.note && (
                      <>
                        <b>{pretty(r.note.name)}</b>
                        <span>{r.note.degree}</span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="how-barre">
            {voicing.barre
              ? t('barre', voicing.barre.fret, voicing.barre.fromString, voicing.barre.toString)
              : t('noBarre')}
          </p>
        </div>
      </div>

      {tritone && (
        <section className="tritone" aria-labelledby="tritone-title">
          <h3 id="tritone-title">{t('tritoneTitle')}</h3>
          <p>{t('tritoneText', pretty(tritone.third), pretty(tritone.sev), pretty(tritone.target.notes[0]), pretty(tritone.target.notes[1]))}</p>
          {onSelect && (
            <div className="tritone-links">
              <span>{t('resolvesTo')}</span>
              <button type="button" onClick={() => onSelect(tritone.target)}>{pretty(tritone.target.symbol)}</button>
              <span>{t('tritoneSub')}</span>
              <button type="button" onClick={() => onSelect(tritone.sub)}>{pretty(tritone.sub.symbol)}</button>
            </div>
          )}
          <p className="tritone-note">{t('tritoneSubText')}</p>
        </section>
      )}

      <CagedSection chord={chord} />
    </article>
  );
}

export default ChordDetail;
