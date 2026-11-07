import React, { useMemo, useState } from 'react';
import { useI18n, pretty } from '../i18n';
import { SCALES, SCALE_GROUPS, scaleByKey, spellScale, positionWindows, TUNING, MAX_FRET, mod12 } from '../theory';
import { playNotes, audioSupported } from '../audio';
import { chordFor } from '../chordData';
import { Metronome } from './PracticeTools';

import '../styles/ScaleNeck.css';
// Which chord quality each scale sits on, so its CAGED shapes can be matched to the positions.
const SCALE_CHORD = { ionian: 'major', majorPent: 'major', majorBlues: 'major', aeolian: 'minor', minorPent: 'minor', blues: 'minor' };

// A full-length neck, low E at the bottom, with the notes of any scale. A position keeps one
// five-fret window lit; the chord on screen has its tones ringed.
const X0 = 58;
const FRET_W = 38;
const Y0 = 22;
const STRING_GAP = 30;
const W = X0 + MAX_FRET * FRET_W + 14;
const H = Y0 + STRING_GAP * 5 + 44;
const MARKS = [3, 5, 7, 9, 15, 17, 19, 21];
const STRINGS = [1, 2, 3, 4, 5, 6]; // top to bottom: high e ... low E

const fretX = (f) => (f === 0 ? X0 - 24 : X0 + (f - 0.5) * FRET_W);
const stringY = (s) => Y0 + (s - 1) * STRING_GAP;

function ScaleNeck({ scaleKey, onScaleChange, rootPc: keyPc, rootName: keyName, chord }) {
  const { t, scaleName } = useI18n();
  const [arp, setArp] = useState(false);
  const [labelMode, setLabelMode] = useState('names');
  const [position, setPosition] = useState(null);

  // Arpeggio mode: the notes of the chord on screen, in order of pitch from its root.
  const arpeggio = useMemo(() => {
    if (!chord) return null;
    const order = chord.pcs
      .map((pc, i) => ({ semi: (pc - chord.pcs[0] + 12) % 12, name: chord.notes[i], deg: chord.degrees[i] }))
      .sort((a, b) => a.semi - b.semi);
    return {
      scale: { key: 'arpeggio', group: 'arpeggio', degs: order.map((o) => o.deg), semis: order.map((o) => o.semi) },
      names: order.map((o) => o.name),
    };
  }, [chord]);
  const useArp = arp && !!arpeggio;
  const rootPc = useArp ? chord.pcs[0] : keyPc;
  const rootName = useArp ? chord.notes[0] : keyName;
  const scale = useArp ? arpeggio.scale : scaleByKey(scaleKey);
  const spelled = useMemo(
    () => (useArp ? arpeggio.names : spellScale(rootName, rootPc, scale)),
    [useArp, arpeggio, rootName, rootPc, scale]
  );
  const windows = useMemo(() => positionWindows(rootPc, scale), [rootPc, scale]);
  const idxOfPc = useMemo(() => {
    const m = {};
    scale.semis.forEach((semi, i) => {
      m[mod12(rootPc + semi)] = i;
    });
    return m;
  }, [rootPc, scale]);
  const chordPcs = useMemo(() => new Set(chord ? chord.pcs : []), [chord]);

  // CAGED shapes of the tonic chord, matched to the position window they overlap most.
  const tonicChord = useArp ? chord : SCALE_CHORD[scaleKey] ? chordFor(rootPc, SCALE_CHORD[scaleKey]) : null;
  const cagedByPosition = useMemo(() => {
    const out = scale.semis.map(() => []);
    if (!tonicChord || !tonicChord.caged) return out;
    tonicChord.caged.forEach((form) => {
      const frets = form.positions.map((p) => p.fret).filter((f) => f !== null);
      const lo = Math.min(...frets);
      const hi = Math.max(...frets);
      let best = -1;
      let bestOverlap = 0;
      windows.forEach((wins, i) => {
        let ov = 0;
        wins.forEach(([a, b]) => {
          [0, 12].forEach((add) => {
            ov += Math.max(0, Math.min(b, hi + add) - Math.max(a, lo + add) + 1);
          });
        });
        if (ov > bestOverlap) { bestOverlap = ov; best = i; }
      });
      if (best !== -1) out[best].push(form.form);
    });
    return out;
  }, [tonicChord, windows, scale]);

  const lit = (fret) => position === null || windows[position].some(([lo, hi]) => fret >= lo && fret <= hi);
  const title = useArp ? t('arpeggioOf', pretty(chord.symbol)) : t('scaleIn', pretty(rootName), scaleName(scaleKey));

  // reset the position if the new scale has fewer notes
  const pos = position !== null && position >= scale.semis.length ? null : position;
  if (pos !== position) setPosition(pos);

  const dots = [];
  STRINGS.forEach((s) => {
    for (let f = 0; f <= MAX_FRET; f += 1) {
      const pc = mod12(TUNING[s] + f);
      const i = idxOfPc[pc];
      if (i === undefined) continue;
      dots.push({ s, f, i, root: i === 0, chord: chordPcs.has(pc), on: lit(f) });
    }
  });

  return (
    <section className="scales" aria-labelledby="scales-title">
      <div className="scales-head">
        <div>
          <h3 id="scales-title">{t('scaleTitle')}</h3>
          <p className="scales-help">{useArp ? t('arpHelp') : t('scaleHelp')}</p>
        </div>
        <div className="seg" role="group" aria-label={t('scaleTitle')}>
          <button type="button" className={!useArp ? 'is-active' : ''} aria-pressed={!useArp} onClick={() => { setArp(false); setPosition(null); }}>
            {t('modeScale')}
          </button>
          <button type="button" className={useArp ? 'is-active' : ''} aria-pressed={useArp} onClick={() => { setArp(true); setPosition(null); }}>
            {t('modeArpeggio')}
          </button>
        </div>
        {!useArp && (
          <label className="scales-select">
          <span>{t('scaleSelect')}</span>
          <select value={scaleKey} onChange={(e) => onScaleChange(e.target.value)}>
            {SCALE_GROUPS.map((g) => (
              <optgroup key={g} label={scaleName(g)}>
                {SCALES.filter((sc) => sc.group === g).map((sc) => (
                  <option key={sc.key} value={sc.key}>
                    {scaleName(sc.key)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        )}
      </div>

      <p className="scales-name">{title}</p>
      <ol className="scales-notes" aria-label={t('scaleNotes')}>
        {spelled.map((n, i) => (
          <li key={i} className={i === 0 ? 'is-root' : ''}>
            <b>{pretty(n)}</b>
            <span>{scale.degs[i]}</span>
          </li>
        ))}
      </ol>

      <div className="scales-controls">
        <div className="seg" role="group" aria-label={t('scaleSelect')}>
          <button type="button" className={labelMode === 'names' ? 'is-active' : ''} aria-pressed={labelMode === 'names'} onClick={() => setLabelMode('names')}>
            {t('showNames')}
          </button>
          <button type="button" className={labelMode === 'degrees' ? 'is-active' : ''} aria-pressed={labelMode === 'degrees'} onClick={() => setLabelMode('degrees')}>
            {t('showDegrees')}
          </button>
        </div>
        {audioSupported() && (
          <button
            type="button"
            className="act"
            onClick={() => {
              const base = 48 + mod12(rootPc);
              const up = [...scale.semis, 12].map((x) => base + x);
              playNotes([...up, ...up.slice(0, -1).reverse()]);
            }}
          >
            ▶ {t('playScale')}
          </button>
        )}
        <div className="positions" role="group" aria-label={t('allPositions')}>
          <button type="button" className={pos === null ? 'is-active' : ''} aria-pressed={pos === null} onClick={() => setPosition(null)}>
            {t('allPositions')}
          </button>
          {scale.semis.map((_, i) => (
            <button key={i} type="button" className={pos === i ? 'is-active' : ''} aria-pressed={pos === i} title={t('positionN', i + 1) + (cagedByPosition[i].length ? ' · ' + cagedByPosition[i].join(', ') : '')} onClick={() => setPosition(i)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {tonicChord && cagedByPosition.some((a) => a.length) && (
        <details className="scales-caged">
          <summary>{t('pentCagedTitle')}</summary>
          <ul>
            {cagedByPosition.map((forms, i) => forms.length ? (
              <li key={i}>
                <button type="button" onClick={() => setPosition(i)}>
                  {t('pentCaged', i + 1, forms.join(', '), pretty(tonicChord.symbol))}
                </button>
              </li>
            ) : null)}
          </ul>
        </details>
      )}

      <div className="neck-scroll" tabIndex={0} role="region" aria-label={t("neckLabel", title)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="neck-h" role="img" aria-label={t('neckLabel', title)}>
          <rect x={X0} y={Y0 - 14} width={MAX_FRET * FRET_W} height={STRING_GAP * 5 + 28} rx="4" className="nh-board" />
          {MARKS.map((f) => (
            <circle key={f} cx={fretX(f)} cy={Y0 + STRING_GAP * 2.5} r="6" className="nh-inlay" />
          ))}
          <circle cx={fretX(12)} cy={Y0 + STRING_GAP * 1.2} r="6" className="nh-inlay" />
          <circle cx={fretX(12)} cy={Y0 + STRING_GAP * 3.8} r="6" className="nh-inlay" />
          {Array.from({ length: MAX_FRET + 1 }, (_, f) => (
            <line key={f} x1={X0 + f * FRET_W} x2={X0 + f * FRET_W} y1={Y0 - 14} y2={Y0 + STRING_GAP * 5 + 14} className={f === 0 ? 'nh-nut' : 'nh-fret'} />
          ))}
          {STRINGS.map((s) => (
            <line key={s} x1={X0} x2={X0 + MAX_FRET * FRET_W} y1={stringY(s)} y2={stringY(s)} className={s >= 4 ? 'nh-string-wound' : 'nh-string'} strokeWidth={0.9 + (s - 1) * 0.35} />
          ))}
          {[...Array(MAX_FRET + 1).keys()]
            .filter((f) => f > 0 && (MARKS.includes(f) || f === 12))
            .map((f) => (
              <text key={f} x={fretX(f)} y={H - 8} textAnchor="middle" className="nh-fretnum">
                {f}
              </text>
            ))}
          {dots.map((d) => (
            <g key={`${d.s}-${d.f}`} className={`nh-dot ${d.root ? 'is-root' : ''} ${d.chord ? 'is-chord' : ''} ${d.on ? '' : 'is-off'}`}>
              <circle cx={fretX(d.f)} cy={stringY(d.s)} r={d.f === 0 ? 11 : 12.5} />
              <text x={fretX(d.f)} y={stringY(d.s) + 4} textAnchor="middle">
                {labelMode === 'names' ? pretty(spelled[d.i]) : scale.degs[d.i]}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <p className="scales-legend">
        <span><i className="lg-dot is-root" />{t('legendRoot')}</span>
        <span><i className="lg-dot" />{t('legendScale')}</span>
        <span><i className="lg-dot is-chord" />{t('legendChord')}</span>
      </p>

      {audioSupported() && (
        <div className="pt pt-inline">
          <Metronome />
        </div>
      )}
    </section>
  );
}

export default ScaleNeck;
