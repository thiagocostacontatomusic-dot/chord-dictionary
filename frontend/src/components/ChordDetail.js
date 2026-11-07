import React, { useState } from 'react';
import GuitarFretboard from './GuitarFretboard';
import CagedSection from './CagedSection';
import { useI18n, pretty } from '../i18n';
import { strum, audioSupported } from '../audio';
import { chordFor } from '../chordData';
import '../styles/ChordDetail.css';

const TUNING = { 6: 4, 5: 9, 4: 2, 3: 7, 2: 11, 1: 4 };

function ChordDetail({ chord, onSelect }) {
  const { t, typeLabel, stringName } = useI18n();
  const [index, setIndex] = useState(0);
  const [group, setGroup] = useState('shapes');

  // Inversions come as plain fret arrays (string 6 to 1); turn them into the same shape as voicings.
  const inversions = (chord.inversions || []).map((inv) => ({
    label: `inv-${inv.inversion}-${inv.strings.join('')}`,
    inv,
    positions: inv.frets.map((fret, i) => ({ string: 6 - i, fret })),
    baseFret: inv.baseFret,
  }));
  const list = group === 'inversions' && inversions.length ? inversions : chord.voicings;
  const voicing = list[index] || list[0];
  const switchGroup = (g) => {
    setGroup(g);
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
    if (v.inv) {
      const name = v.inv.inversion === 0 ? t('rootPosition') : t('inversionN', v.inv.inversion);
      return `${name} · ${v.inv.strings[0]}–${v.inv.strings[1]}`;
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

      {inversions.length > 0 && (
        <div className="seg group-switch" role="group" aria-label={t('voicings')}>
          <button type="button" className={group === 'shapes' ? 'is-active' : ''} aria-pressed={group === 'shapes'} onClick={() => switchGroup('shapes')}>
            {t('groupShapes')}
          </button>
          <button type="button" className={group === 'inversions' ? 'is-active' : ''} aria-pressed={group === 'inversions'} onClick={() => switchGroup('inversions')}>
            {t('groupInversions', inversions.length)}
          </button>
        </div>
      )}

      {group === 'inversions' && voicing.inv && (
        <p className="inv-note">
          {voicing.inv.inversion === 0
            ? t('invRootNote', pretty(chord.symbol))
            : t('invNote', pretty(`${chord.symbol}/${voicing.inv.bass}`), pretty(voicing.inv.bass))}
        </p>
      )}

      {list.length > 1 && (
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
