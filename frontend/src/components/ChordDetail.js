import React, { useState } from 'react';
import GuitarFretboard from './GuitarFretboard';
import CagedSection from './CagedSection';
import { useI18n, pretty } from '../i18n';
import { strum, audioSupported } from '../audio';
import '../styles/ChordDetail.css';

const TUNING = { 6: 4, 5: 9, 4: 2, 3: 7, 2: 11, 1: 4 };

function ChordDetail({ chord }) {
  const { t, typeLabel, stringName } = useI18n();
  const [index, setIndex] = useState(0);
  const voicing = chord.voicings[index] || chord.voicings[0];

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

  const voicingLabel = (v) =>
    v.shape ? t('shapeTab', v.shape, v.fret) : t('openPosition');

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

      {chord.voicings.length > 1 && (
        <div className="tabs" role="tablist" aria-label={t('voicings')}>
          {chord.voicings.map((v, i) => (
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

      <CagedSection chord={chord} />
    </article>
  );
}

export default ChordDetail;
