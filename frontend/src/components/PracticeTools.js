import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n, pretty } from '../i18n';
import { searchChords } from '../chordData';
import GuitarFretboard from './GuitarFretboard';
import { strum, audioSupported, createMetronome } from '../audio';
import '../styles/PracticeTools.css';

const SUBS = [1, 2, 3, 4];
const BASIC = ['major', 'minor', 'dom7', 'maj7', 'min7', 'sus2', 'sus4', 'dim', 'six', 'minor6'];

export function Metronome() {
  const { t } = useI18n();
  const metro = useRef(null);
  const [bpm, setBpm] = useState(80);
  const [sub, setSub] = useState(1);
  const [on, setOn] = useState(false);

  useEffect(() => {
    metro.current = createMetronome();
    return () => metro.current.stop();
  }, []);
  useEffect(() => {
    metro.current.set({ bpm, sub });
  }, [bpm, sub]);

  const toggle = () => {
    if (on) metro.current.stop();
    else metro.current.start();
    setOn(!on);
  };

  return (
    <div className="pt-card">
      <h4>{t('metroTitle')}</h4>
      <p className="pt-help">{t('metroHelp')}</p>
      <div className="pt-row">
        <button type="button" className="pt-btn pt-primary" onClick={toggle} aria-pressed={on}>
          {on ? `■ ${t('stop')}` : `▶ ${t('start')}`}
        </button>
        <label className="pt-field">
          <span>{t('bpm')}: {bpm}</span>
          <input type="range" min="40" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
        </label>
      </div>
      <div className="pt-row" role="group" aria-label={t('subdivision')}>
        {SUBS.map((n) => (
          <button key={n} type="button" className={`pt-btn ${sub === n ? 'is-active' : ''}`} aria-pressed={sub === n} onClick={() => setSub(n)}>
            {t('subName', n)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Quiz() {
  const { t } = useI18n();
  const [extended, setExtended] = useState(false);
  const [hear, setHear] = useState(false);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const pool = useMemo(() => searchChords({}).filter((c) => extended || BASIC.includes(c.typeKey)), [extended]);
  const question = useMemo(() => {
    const pick = () => pool[Math.floor(Math.random() * pool.length)];
    const answer = pick();
    const options = [answer];
    while (options.length < 4) {
      const c = pick();
      if (!options.some((o) => o.id === c.id)) options.push(c);
    }
    return { answer, options: options.sort(() => Math.random() - 0.5) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, round]);

  const { answer, options } = question;
  const voicing = answer.voicings[0];
  const choose = (c) => {
    if (picked) return;
    setPicked(c.id);
    setScore((s) => ({ right: s.right + (c.id === answer.id ? 1 : 0), total: s.total + 1 }));
  };
  const next = () => {
    setPicked(null);
    setRound((r) => r + 1);
  };

  return (
    <div className="pt-card">
      <h4>{t('quizTitle')}</h4>
      <p className="pt-help">{t('quizHelp')}</p>
      <div className="pt-row">
        <label className="pt-check"><input type="checkbox" checked={extended} onChange={(e) => { setExtended(e.target.checked); setPicked(null); }} /> {t('quizExtended')}</label>
        {audioSupported() && (
          <label className="pt-check"><input type="checkbox" checked={hear} onChange={(e) => setHear(e.target.checked)} /> {t('quizHear')}</label>
        )}
        <span className="pt-score">{t('quizScore', score.right, score.total)}</span>
      </div>
      <div className="pt-quiz">
        <div className="pt-diagram">
          {!hear || picked ? (
            <GuitarFretboard compact positions={voicing.positions} baseFret={voicing.baseFret} barre={voicing.barre} />
          ) : (
            <p className="pt-hear">{t('quizListen')}</p>
          )}
          {audioSupported() && (
            <button type="button" className="pt-btn" onClick={() => strum(voicing.positions)}>▶ {t('play')}</button>
          )}
        </div>
        <div className="pt-options" role="group" aria-label={t('quizTitle')}>
          {options.map((c) => {
            const state = picked ? (c.id === answer.id ? 'is-right' : c.id === picked ? 'is-wrong' : '') : '';
            return (
              <button key={c.id} type="button" className={`pt-opt ${state}`} onClick={() => choose(c)}>
                {pretty(c.symbol)}
              </button>
            );
          })}
          {picked && (
            <button type="button" className="pt-btn pt-primary" onClick={next}>{t('quizNext')}</button>
          )}
          {picked && (
            <p className="pt-result" aria-live="polite">
              {picked === answer.id ? t('quizRight') : t('quizWrong', pretty(answer.symbol))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Practice helpers: a metronome with the subdivisions used in the Toolbox sheets, and a chord quiz.
function PracticeTools() {
  const { t } = useI18n();
  return (
    <section className="pt" aria-labelledby="pt-title">
      <h3 id="pt-title">{t('practiceTitle')}</h3>
      <div className="pt-grid">
        <Quiz />
      </div>
    </section>
  );
}

export default PracticeTools;
