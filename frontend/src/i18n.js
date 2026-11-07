import { createContext, useContext } from 'react';

// Musical terms are translated here on purpose: browser auto-translate turns
// "Note" into "Observação" and "Major" into something else entirely.
const TYPE_LABELS = {
  major: { en: 'Major', pt: 'Maior' },
  minor: { en: 'Minor', pt: 'Menor' },
  power5: { en: 'Power chord', pt: 'Power chord' },
  dim: { en: 'Diminished', pt: 'Diminuto' },
  aug: { en: 'Augmented', pt: 'Aumentado' },
  sus2: { en: 'Suspended 2', pt: 'Suspenso 2' },
  sus4: { en: 'Suspended 4', pt: 'Suspenso 4' },
  six: { en: 'Major 6', pt: 'Maior com 6' },
  minor6: { en: 'Minor 6', pt: 'Menor com 6' },
  dom7: { en: 'Dominant 7', pt: 'Dominante 7' },
  maj7: { en: 'Major 7', pt: 'Maior 7M' },
  min7: { en: 'Minor 7', pt: 'Menor 7' },
  dim7: { en: 'Diminished 7', pt: 'Diminuto 7' },
  halfdim: { en: 'Half-diminished', pt: 'Meio-diminuto' },
  add9: { en: 'Add9', pt: 'Com nona (add9)' },
};

export const STRING_NAMES = {
  en: { 6: 'Low E', 5: 'A', 4: 'D', 3: 'G', 2: 'B', 1: 'High E' },
  pt: { 6: 'E grave', 5: 'A', 4: 'D', 3: 'G', 2: 'B', 1: 'E agudo' },
};

const where = (fret, open, word) => (fret === 0 ? open : `${word} ${fret}`);

const DICT = {
  en: {
    tagline: 'Every guitar chord, drawn on the neck',
    stats: (c, v) => `${c} chords, ${v} voicings`,
    search: 'Search a chord: Am, F#m7, Bb, sus4',
    clearSearch: 'Clear search',
    key: 'Key',
    type: 'Type',
    allTypes: 'All types',
    found: (n) => (n === 1 ? '1 chord' : `${n} chords`),
    clearFilters: 'Clear filters',
    noResults: 'No chord matches. Try another name or clear the filters.',
    loading: 'Loading chords',
    loadError: 'Could not reach the chord API. Start the backend (npm start inside backend) and reload.',
    also: 'also written',
    notes: 'Notes',
    voicings: 'Voicings',
    openPosition: 'Open position',
    shapeTab: (shape, fret) => `${shape} shape, ${where(fret, 'open', 'fret')}`,
    howToPlay: 'How to play',
    string: 'String',
    muted: 'muted',
    open: 'open',
    fretWord: (f) => `fret ${f}`,
    barre: (f, a, b) => `Barre across fret ${f}, strings ${a} to ${b}`,
    noBarre: 'No barre: one finger per note',
    caged: 'CAGED system',
    cagedIntro: (name) =>
      `${name} in five places on the neck. Each shape is the open C, A, G, E or D chord moved up to this key, so all five play the same notes.`,
    cagedWhere: (f) => (f === 0 ? 'open' : `fret ${f}`),
    legendFinger: 'Finger',
    legendOpen: 'Open',
    legendMuted: 'Muted',
    legendBarre: 'Barre',
    diagram: (frets) => `Chord diagram, strings 6 to 1: ${frets}`,
    language: 'Language',
    skip: 'Chord list',
  },
  pt: {
    tagline: 'Todo acorde de violão e guitarra, desenhado no braço',
    stats: (c, v) => `${c} acordes, ${v} posições`,
    search: 'Busque um acorde: Am, F#m7, Bb, sus4',
    clearSearch: 'Limpar busca',
    key: 'Tom',
    type: 'Tipo',
    allTypes: 'Todos os tipos',
    found: (n) => (n === 1 ? '1 acorde' : `${n} acordes`),
    clearFilters: 'Limpar filtros',
    noResults: 'Nenhum acorde encontrado. Tente outro nome ou limpe os filtros.',
    loading: 'Carregando acordes',
    loadError: 'Não foi possível acessar a API de acordes. Inicie o backend (npm start dentro de backend) e recarregue.',
    also: 'também escrito',
    notes: 'Notas',
    voicings: 'Posições',
    openPosition: 'Posição aberta',
    shapeTab: (shape, fret) => `Forma de ${shape}, ${where(fret, 'solta', 'casa')}`,
    howToPlay: 'Como tocar',
    string: 'Corda',
    muted: 'abafada',
    open: 'solta',
    fretWord: (f) => `casa ${f}`,
    barre: (f, a, b) => `Pestana na casa ${f}, cordas ${a} a ${b}`,
    noBarre: 'Sem pestana: um dedo por nota',
    caged: 'Sistema CAGED',
    cagedIntro: (name) =>
      `${name} em cinco lugares do braço. Cada forma é o acorde aberto de C, A, G, E ou D levado até este tom, então as cinco tocam as mesmas notas.`,
    cagedWhere: (f) => (f === 0 ? 'solta' : `casa ${f}`),
    legendFinger: 'Dedo',
    legendOpen: 'Solta',
    legendMuted: 'Abafada',
    legendBarre: 'Pestana',
    diagram: (frets) => `Diagrama do acorde, cordas 6 a 1: ${frets}`,
    language: 'Idioma',
    skip: 'Lista de acordes',
  },
};

export function makeI18n(lang) {
  const d = DICT[lang] || DICT.en;
  const l = DICT[lang] ? lang : 'en';
  return {
    lang: l,
    t: (key, ...args) => {
      const v = d[key];
      return typeof v === 'function' ? v(...args) : v;
    },
    typeLabel: (typeKey, fallback) => (TYPE_LABELS[typeKey] || {})[l] || fallback,
    stringName: (n) => STRING_NAMES[l][n],
  };
}

export const I18nContext = createContext(makeI18n('en'));
export const useI18n = () => useContext(I18nContext);

export function readLang() {
  try {
    const saved = window.localStorage.getItem('chord-dictionary-lang');
    if (saved === 'en' || saved === 'pt') return saved;
  } catch (e) {
    /* storage can be blocked */
  }
  return (navigator.language || 'en').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export function saveLang(lang) {
  try {
    window.localStorage.setItem('chord-dictionary-lang', lang);
  } catch (e) {
    /* ignore */
  }
}

// D♭ instead of Db, F♯m7♭5 instead of F#m7b5
export function pretty(text) {
  return String(text)
    .replace(/([A-G])(bb|b)/g, (m, letter, flats) => letter + (flats === 'bb' ? '♭♭' : '♭'))
    .replace(/(\d)b(\d)/g, '$1♭$2')
    .replace(/#/g, '♯');
}
