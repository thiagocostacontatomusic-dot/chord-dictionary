import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n, pretty } from '../i18n';
import { chordFor } from '../chordData';
import { DEGREES, MODES, keySignature, pcAtIndex, mod12 } from '../theory';
import '../styles/CircleOfFifths.css';

// A rotating circle of fifths. The wheel turns underneath a fixed window: the window always
// frames the seven chords of one key (I IV V on the outer ring, ii iii vi in the middle,
// vii° on the inner ring), like the physical chord wheels.
const CX = 200;
const CY = 200;
const R = [62, 100, 146, 192]; // hole, dim ring, minor ring, major ring
const rad = (d) => (d * Math.PI) / 180;
const pt = (r, a) => [CX + r * Math.sin(rad(a)), CY - r * Math.cos(rad(a))];

function sector(r0, r1, a0, a1) {
  const [x1, y1] = pt(r1, a0);
  const [x2, y2] = pt(r1, a1);
  const [x3, y3] = pt(r0, a1);
  const [x4, y4] = pt(r0, a0);
  return `M${x1} ${y1}A${r1} ${r1} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${r0} ${r0} 0 0 0 ${x4} ${y4}Z`;
}
const circle = (r) => `M${CX - r} ${CY}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

// Where each scale degree sits inside the fixed window: ring (0 dim, 1 minor, 2 major) and angle.
const WINDOW = [
  { d: 0, ring: 2, a: 0 },
  { d: 1, ring: 1, a: -30 },
  { d: 2, ring: 1, a: 30 },
  { d: 3, ring: 2, a: -30 },
  { d: 4, ring: 2, a: 30 },
  { d: 5, ring: 1, a: 0 },
  { d: 6, ring: 0, a: 0 },
];

const norm = (a) => ((((a + 180) % 360) + 360) % 360) - 180;

function CircleOfFifths({ parentIdx, modeIdx, parentPc, selectedId, onPickKey, onRotate, onPickDegree }) {
  const { t, lang } = useI18n();
  const svgRef = useRef(null);
  const angleRef = useRef(-parentIdx * 30);
  const [angle, setAngle] = useState(angleRef.current);
  const rafRef = useRef(0);
  const drag = useRef({ active: false, moved: false });

  const put = (v) => {
    angleRef.current = v;
    setAngle(v);
  };

  const animateTo = useCallback((idx) => {
    cancelAnimationFrame(rafRef.current);
    const from = angleRef.current;
    const delta = norm(-idx * 30 - from);
    if (Math.abs(delta) < 0.01) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      put(from + delta);
      return;
    }
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 460);
      put(from + delta * (1 - Math.pow(1 - k, 3)));
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (!drag.current.active) animateTo(parentIdx);
    return () => cancelAnimationFrame(rafRef.current);
  }, [parentIdx, animateTo]);

  // Labels come from the chord database so the spelling matches the rest of the app.
  const labels = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const maj = chordFor(pcAtIndex(i), 'major');
        const min = chordFor(mod12(pcAtIndex(i) + 9), 'minor');
        const dim = chordFor(mod12(pcAtIndex(i) + 11), 'dim');
        if (i === 6) {
          return {
            2: [pretty(maj.rootName), pretty(maj.altSymbol || '')],
            1: [pretty(min.symbol), pretty(min.altSymbol || '')],
            0: [`${pretty(dim.rootName)}°`],
          };
        }
        return { 2: [pretty(maj.rootName)], 1: [pretty(min.symbol)], 0: [`${pretty(dim.rootName)}°`] };
      }),
    []
  );

  const pointerAngle = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    return (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
  };

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    cancelAnimationFrame(rafRef.current);
    const start = { x: e.clientX, y: e.clientY, phi: pointerAngle(e), angle: angleRef.current };
    drag.current = { active: false, moved: false };
    const move = (ev) => {
      if (!drag.current.active && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 6) return;
      drag.current = { active: true, moved: true };
      put(start.angle + norm(pointerAngle(ev) - start.phi));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (drag.current.moved) {
        const idx = mod12(Math.round(-angleRef.current / 30));
        drag.current.active = false;
        if (idx === parentIdx) animateTo(idx);
        else onRotate(idx);
        setTimeout(() => {
          drag.current = { active: false, moved: false };
        }, 0);
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const clickSegment = (ring, i) => {
    if (drag.current.moved) return;
    if (ring === 2) onPickKey(pcAtIndex(i), modeIdx === 5 ? 0 : modeIdx);
    else if (ring === 1) onPickKey(mod12(pcAtIndex(i) + 9), 5);
    else onPickKey(mod12(pcAtIndex(i) + 11), 6);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onRotate(mod12(parentIdx + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onRotate(mod12(parentIdx - 1));
    }
  };

  const mode = MODES[modeIdx];
  const tonicPc = mod12(parentPc + mode.off);
  const tonicChord = chordFor(tonicPc, mode.qual);
  const hi = WINDOW.find((w) => w.d === modeIdx);
  const sig = keySignature(parentIdx);
  const veil = [circle(R[3]), circle(R[0]), ...WINDOW.map((w) => sector(R[w.ring], R[w.ring + 1], w.a - 15, w.a + 15))].join('');

  const fill = (ring, i) => {
    const h = i * 30;
    return ring === 2 ? `hsl(${h} 70% 90%)` : ring === 1 ? `hsl(${h} 55% 94%)` : `hsl(${h} 35% 96%)`;
  };

  return (
    <div className="wheel">
      <div className="wheel-stage">
        <button type="button" className="wheel-step wheel-step-l" onClick={() => onRotate(mod12(parentIdx - 1))} aria-label={t('rotateLeft')}>
          ‹
        </button>
        <svg
          ref={svgRef}
          viewBox="0 -12 400 412"
          className="wheel-svg"
          role="group"
          aria-label={t('wheelLabel')}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
        >
          {/* segments */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = i * 30 + angle;
            return [2, 1, 0].map((ring) => (
              <path
                key={`s${ring}${i}`}
                d={sector(R[ring], R[ring + 1], a - 14.7, a + 14.7)}
                fill={fill(ring, i)}
                className="wheel-seg"
                onClick={() => clickSegment(ring, i)}
              />
            ));
          })}

          {/* the tonic cell of the window */}
          {hi && <path d={sector(R[hi.ring], R[hi.ring + 1], hi.a - 14.7, hi.a + 14.7)} className="wheel-tonic" />}

          {/* chord names */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = i * 30 + angle;
            return [2, 1, 0].map((ring) => {
              const lines = labels[i][ring];
              const rMid = (R[ring] + R[ring + 1]) / 2;
              const [x, y] = pt(rMid, a);
              const onTonic = hi && hi.ring === ring && Math.abs(norm(a - hi.a)) < 2;
              const size = ring === 2 ? 19 : ring === 1 ? 14 : 12;
              const small = lines.length > 1;
              return (
                <text
                  key={`t${ring}${i}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  className={`wheel-label wheel-label-${ring} ${onTonic ? 'is-tonic' : ''}`}
                  fontSize={small ? size * 0.66 : size}
                >
                  {lines.map((line, k) => (
                    <tspan key={k} x={x} dy={small ? (k === 0 ? '-0.2em' : '1.05em') : '0.35em'}>
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            });
          })}

          {/* veil over everything outside the window */}
          <path d={veil} fillRule="evenodd" className="wheel-veil" />

          {/* window cells: fixed, clickable */}
          {WINDOW.map((w) => {
            const chord = chordFor(mod12(parentPc + DEGREES[w.d].off), DEGREES[w.d].q);
            const selected = chord && chord.id === selectedId;
            return (
              <path
                key={w.d}
                d={sector(R[w.ring], R[w.ring + 1], w.a - 15, w.a + 15)}
                className={`wheel-cell ${selected ? 'is-selected' : ''}`}
                onClick={() => !drag.current.moved && onPickDegree(w.d)}
              />
            );
          })}

          {/* centre: fixed twelve-point ring of keys, turning with the wheel */}
          <circle cx={CX} cy={CY} r={R[0] - 8} className="wheel-core" />
          <polygon
            points={Array.from({ length: 12 }, (_, i) => pt(R[0] - 18, i * 30 + angle).join(',')).join(' ')}
            className="wheel-poly"
          />
          {Array.from({ length: 12 }, (_, i) => {
            const [x, y] = pt(R[0] - 18, i * 30 + angle);
            return <circle key={i} cx={x} cy={y} r={i === parentIdx ? 3.2 : 1.8} className={i === parentIdx ? 'wheel-dot is-parent' : 'wheel-dot'} />;
          })}
          <text x={CX} y={CY - 2} textAnchor="middle" className="wheel-center-key">
            {tonicChord ? pretty(tonicChord.symbol) : ''}
          </text>
          <text x={CX} y={CY + 15} textAnchor="middle" className="wheel-center-mode">
            {t('modeShort')[modeIdx]}
          </text>

          {/* fixed pointer */}
          <polygon points="188,-11 212,-11 200,6" className="wheel-pointer" />
        </svg>
        <button type="button" className="wheel-step wheel-step-r" onClick={() => onRotate(mod12(parentIdx + 1))} aria-label={t('rotateRight')}>
          ›
        </button>
      </div>
      <p className="wheel-sig" lang={lang}>
        {sig ? (parentIdx <= 6 ? t('sharps', parentIdx) : t('flats', 12 - parentIdx)) : t('noAccidentals')}
      </p>
    </div>
  );
}

export default CircleOfFifths;
