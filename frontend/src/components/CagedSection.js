import React from 'react';
import GuitarFretboard from './GuitarFretboard';
import { useI18n, pretty } from '../i18n';
import '../styles/CagedSection.css';

// The CAGED system: the chord played with the C, A, G, E and D open shapes moved up the
// neck. Forms arrive from the API already ordered from the nut upward.
function CagedSection({ chord }) {
  const { t, typeLabel } = useI18n();
  if (!chord.caged || chord.caged.length === 0) return null;
  const name = `${pretty(chord.rootName)} ${typeLabel(chord.typeKey, chord.type)}`;

  return (
    <section className="caged" aria-labelledby="caged-title">
      <h3 id="caged-title">{t('caged')}</h3>
      <p className="caged-intro">{t('cagedIntro', name, chord.caged.length)}</p>
      <ol className="caged-row">
        {chord.caged.map((form) => (
          <li className="caged-item" key={form.form}>
            <div className="caged-head">
              <span className="caged-letter">{t('cagedShape', form.form)}</span>
              <span className="caged-where">{t('cagedWhere', form.lowestFret)}</span>
            </div>
            <GuitarFretboard
              compact
              positions={form.positions}
              baseFret={form.baseFret}
              barre={form.barre}
            />
          </li>
        ))}
      </ol>
      {chord.caged.length < 5 && <p className="caged-intro">{t('cagedPartial')}</p>}
    </section>
  );
}

export default CagedSection;
