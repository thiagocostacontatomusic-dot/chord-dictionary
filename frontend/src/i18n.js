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

const SCALE_NAMES = {
  en: {
    ionian: 'Major (Ionian)', dorian: 'Dorian', phrygian: 'Phrygian', lydian: 'Lydian', mixolydian: 'Mixolydian',
    aeolian: 'Natural minor (Aeolian)', locrian: 'Locrian', majorPent: 'Major pentatonic', minorPent: 'Minor pentatonic',
    blues: 'Blues', majorBlues: 'Major blues', harmonicMinor: 'Harmonic minor', melodicMinor: 'Melodic minor',
    phrygianDominant: 'Phrygian dominant', lydianDominant: 'Lydian dominant', altered: 'Altered', doubleHarmonic: 'Double harmonic',
    wholeTone: 'Whole tone', dimWH: 'Diminished (whole-half)', dimHW: 'Diminished (half-whole)',
    modes: 'Modes of the major scale', pentatonic: 'Pentatonic and blues', minorVariants: 'Minor variants and colours', symmetric: 'Symmetric scales',
  },
  pt: {
    ionian: 'Maior (Jônio)', dorian: 'Dórico', phrygian: 'Frígio', lydian: 'Lídio', mixolydian: 'Mixolídio',
    aeolian: 'Menor natural (Eólio)', locrian: 'Lócrio', majorPent: 'Pentatônica maior', minorPent: 'Pentatônica menor',
    blues: 'Blues', majorBlues: 'Blues maior', harmonicMinor: 'Menor harmônica', melodicMinor: 'Menor melódica',
    phrygianDominant: 'Frígio dominante', lydianDominant: 'Lídio dominante', altered: 'Alterada', doubleHarmonic: 'Dupla harmônica',
    wholeTone: 'Tons inteiros', dimWH: 'Diminuta (tom-semitom)', dimHW: 'Diminuta (semitom-tom)',
    modes: 'Modos da escala maior', pentatonic: 'Pentatônicas e blues', minorVariants: 'Variações menores e cores', symmetric: 'Escalas simétricas',
  },
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
    cagedShape: (l) => `${l} shape`,
    cagedWhere: (f) => (f === 0 ? 'open' : `fret ${f}`),
    legendFinger: 'Finger',
    legendOpen: 'Open',
    legendMuted: 'Muted',
    legendBarre: 'Barre',
    diagram: (frets) => `Chord diagram, strings 6 to 1: ${frets}`,
    wheelTitle: 'Circle of fifths',
    wheelHelp: 'Turn the wheel or tap a key. The window on top always shows the chords that belong together.',
    rotateLeft: 'Previous key (a fourth down)',
    rotateRight: 'Next key (a fifth up)',
    wheelLabel: 'Circle of fifths. Use the left and right arrow keys to change key.',
    chordsInKey: (k) => `Chords in ${k}`,
    sameNotes: (p) => `same notes as ${p} major`,
    sameChord: 'Same root',
    modeLabel: 'Mode',
    noAccidentals: 'no ♯ or ♭',
    sharps: (n) => (n === 1 ? '1 sharp' : `${n} sharps`),
    flats: (n) => (n === 1 ? '1 flat' : `${n} flats`),
    allChords: 'All chords',
    modeNames: ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'],
    modeMoods: ['friendly, stable, happy', 'curious, whimsical', 'intimidating, exotic', 'ethereal, magical', 'open, relaxed, cool', 'solemn, serious, sad', 'unsettled, disconcerting'],
    modeShort: ['Major', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Minor', 'Locrian'],
    scaleTitle: 'Scales on the neck',
    scaleHelp: 'Pick a scale and a position. Notes of the chord you are viewing are ringed.',
    scaleSelect: 'Scale',
    scaleIn: (root, scale) => `${root} ${scale}`,
    showNames: 'Notes',
    showDegrees: 'Degrees',
    allPositions: 'Whole neck',
    positionN: (n) => `Position ${n}`,
    scaleNotes: 'Notes of the scale',
    legendRoot: 'Root',
    legendScale: 'Scale note',
    legendChord: 'Chord tone',
    neckLabel: (s) => `Guitar neck showing ${s}`,
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    install: 'Install app',
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
    cagedShape: (l) => `Forma de ${l}`,
    cagedWhere: (f) => (f === 0 ? 'solta' : `casa ${f}`),
    legendFinger: 'Dedo',
    legendOpen: 'Solta',
    legendMuted: 'Abafada',
    legendBarre: 'Pestana',
    diagram: (frets) => `Diagrama do acorde, cordas 6 a 1: ${frets}`,
    wheelTitle: 'Círculo das quintas',
    wheelHelp: 'Gire a roda ou toque num tom. A janela do topo mostra sempre os acordes que combinam entre si.',
    rotateLeft: 'Tom anterior (uma quarta abaixo)',
    rotateRight: 'Próximo tom (uma quinta acima)',
    wheelLabel: 'Círculo das quintas. Use as setas esquerda e direita para mudar de tom.',
    chordsInKey: (k) => `Acordes de ${k}`,
    sameNotes: (p) => `mesmas notas de ${p} maior`,
    sameChord: 'Mesma fundamental',
    modeLabel: 'Modo',
    noAccidentals: 'sem ♯ nem ♭',
    sharps: (n) => (n === 1 ? '1 sustenido' : `${n} sustenidos`),
    flats: (n) => (n === 1 ? '1 bemol' : `${n} bemóis`),
    allChords: 'Todos os acordes',
    modeNames: ['Jônio', 'Dórico', 'Frígio', 'Lídio', 'Mixolídio', 'Eólio', 'Lócrio'],
    modeMoods: ['amigável, estável, alegre', 'curioso, divertido', 'intimidador, exótico', 'etéreo, mágico', 'aberto, relaxado, descolado', 'solene, sério, triste', 'instável, perturbador'],
    modeShort: ['Maior', 'Dórico', 'Frígio', 'Lídio', 'Mixolídio', 'Menor', 'Lócrio'],
    scaleTitle: 'Escalas no braço',
    scaleHelp: 'Escolha uma escala e uma posição. As notas do acorde que você está vendo ficam circuladas.',
    scaleSelect: 'Escala',
    scaleIn: (root, scale) => `${root} ${scale}`,
    showNames: 'Notas',
    showDegrees: 'Graus',
    allPositions: 'Braço todo',
    positionN: (n) => `Posição ${n}`,
    scaleNotes: 'Notas da escala',
    legendRoot: 'Fundamental',
    legendScale: 'Nota da escala',
    legendChord: 'Nota do acorde',
    neckLabel: (s) => `Braço do violão mostrando ${s}`,
    themeLabel: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    install: 'Instalar app',
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
    scaleName: (key) => SCALE_NAMES[l][key] || key,
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

export function readTheme() {
  try {
    const saved = window.localStorage.getItem('chord-dictionary-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {
    /* storage can be blocked */
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveTheme(theme) {
  try {
    window.localStorage.setItem('chord-dictionary-theme', theme);
  } catch (e) {
    /* storage can be blocked */
  }
}
