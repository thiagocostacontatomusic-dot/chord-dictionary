import React, { useMemo, useState } from 'react';
import { useI18n, pretty } from '../i18n';
import { chordFor } from '../chordData';
import { TOPICS, TOPIC_TITLES, TEXT, examplesFor } from '../study';
import { keyNames } from '../theory';
import { strumSequence, audioSupported } from '../audio';
import '../styles/StudyGuide.css';

// A guide that explains the ideas behind the chords and scales and shows each one in the key you are in.
function StudyGuide({ parentPc, selectedId, onSelect }) {
  const { t, lang } = useI18n();
  const [topic, setTopic] = useState('tension');
  const names = keyNames(parentPc);
  const majorKey = pretty(names[0]);
  const minorKey = pretty(names[5]) + 'm';

  const examples = useMemo(() => examplesFor(topic, parentPc, lang), [topic, parentPc, lang]);
  const resolved = (ex) => ex.chords.map((x) => chordFor(x.pc, x.type)).filter(Boolean);

  return (
    <section className="study" aria-labelledby="study-title">
      <h3 id="study-title">{t('studyTitle')}</h3>
      <p className="study-help">{t('studyHelp', majorKey, minorKey)}</p>

      <div className="study-tabs" role="group" aria-label={t('studyTitle')}>
        {TOPICS.map((k) => (
          <button key={k} type="button" className={topic === k ? 'is-active' : ''} aria-pressed={topic === k} onClick={() => setTopic(k)}>
            {TOPIC_TITLES[lang][k]}
          </button>
        ))}
      </div>

      <div className="study-body">
        <h4>{TOPIC_TITLES[lang][topic]}</h4>
        {TEXT[lang][topic].map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {examples.length > 0 && (
          <ul className="study-examples">
            {examples.map((ex, i) => {
              const list = resolved(ex);
              return (
                <li key={i}>
                  <div className="ex-head">
                    <span className="ex-name">
                      {ex.std && <b className="ex-std">{ex.std}</b>}
                      {ex.name}
                    </span>
                    <span className="ex-key">{ex.minor ? minorKey : majorKey}</span>
                    {audioSupported() && (
                      <button type="button" className="ex-play" onClick={() => strumSequence(list.map((ch) => ch.voicings[0].positions))}>
                        ▶ {t('play')}
                      </button>
                    )}
                  </div>
                  <ol className="ex-chords">
                    {list.map((ch, k) => (
                      <li key={k}>
                        <button type="button" className={ch.id === selectedId ? 'is-selected' : ''} onClick={() => onSelect(ch)}>
                          {pretty(ch.symbol)}
                        </button>
                      </li>
                    ))}
                  </ol>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default StudyGuide;
