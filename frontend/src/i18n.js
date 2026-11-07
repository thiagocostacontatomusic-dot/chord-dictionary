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
  dom9: { en: 'Dominant 9', pt: 'Dominante 9' },
  maj9: { en: 'Major 9', pt: 'Maior 9' },
  min9: { en: 'Minor 9', pt: 'Menor 9' },
  min11: { en: 'Minor 11', pt: 'Menor 11' },
  dom13: { en: 'Dominant 13', pt: 'Dominante 13' },
  sus7: { en: '7sus4', pt: '7 suspenso 4' },
  dom7b9: { en: 'Dominant 7♭9', pt: 'Dominante 7♭9' },
  dom7s9: { en: 'Dominant 7♯9', pt: 'Dominante 7♯9' },
  mmaj7: { en: 'Minor-major 7', pt: 'Menor com 7M' },
  aug7: { en: 'Augmented 7', pt: 'Aumentado 7' },
  six9: { en: '6/9', pt: '6/9' },
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

export const DICT = {
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
    cagedIntro: (name, n = 5) =>
      `${name} in ${['', '', '', 'three', 'four', 'five'][n]} places on the neck. Each shape is the open C, A, G, E or D chord moved up to this key, with the extra notes added to the triad, so all of them play the same notes. Every form keeps the root in the bass.`,
    cagedWide: (n) => `Wide reach: ${n} frets between the lowest and highest note`,
    cagedWideShort: 'wide reach',
    cagedWideNote: 'Forms marked wide reach stretch across more frets because the extra notes sit far from the triad. Roll the hand, or leave out the highest note if it is too much.',
    cagedPartial: 'The missing forms do not fit this chord in a five-fret box with the root in the bass, so they are left out instead of forced.',
    cagedShape: (l) => `${l} shape`,
    cagedWhere: (f) => (f === 0 ? 'open' : `fret ${f}`),
    legendFinger: 'Finger',
    toneRole: (n) => ['', 'Root', 'Third', 'Fifth', 'Seventh', 'Extension'][n],
    toneKey: 'Shades: root, third, fifth, seventh, extension',
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
    themeStage: 'Stage',
    install: 'Install app',
    play: 'Play', share: 'Copy link', copied: 'Link copied',
    footer: 'Free and open source (MIT).', source: 'Source code on GitHub', madeBy: 'Made by Thiago Costa',
    playScale: 'Play scale',
    practiceTitle: 'Practice tools',
    metroTitle: 'Metronome',
    metroHelp: 'Practise any scale or chord change in quarter notes, eighths, triplets or sixteenths. The first click of each bar is higher.',
    start: 'Start', stop: 'Stop', bpm: 'Tempo (BPM)', subdivision: 'Subdivision',
    subName: (n) => ({ 1: 'Quarters', 2: 'Eighths', 3: 'Triplets', 4: 'Sixteenths' })[n],
    quizTitle: 'Chord quiz',
    quizHelp: 'Name the chord from its diagram, or by ear.',
    quizExtended: 'Include extended chords',
    quizHear: 'By ear',
    quizListen: 'Press play and listen.',
    quizScore: (r, n) => `Score: ${r} of ${n}`,
    quizNext: 'Next chord',
    quizRight: 'Right.',
    quizWrong: (c) => `Not quite. It was ${c}.`,
    leftyLabel: 'Left-handed',
    leftyHelp: 'Mirror the chord diagrams for left-handed players',
    progTitle: 'Progression builder',
    progHelp: (k) => `Build a chord sequence, hear it, and move it to another key. Roman numerals are counted from ${k} major, the key of the wheel.`,
    progKeyChords: (k) => `Chords of ${k}:`,
    progEmpty: 'Add the chord you are viewing or a chord of the key to start.',
    progRemove: (c) => `Remove ${c}`,
    progSemitone: 'semitone',
    progCopy: 'Copy chords',
    progClear: 'Clear',
    modeScale: 'Scale',
    modeArpeggio: 'Arpeggio',
    arpeggioOf: (c) => `Arpeggio of ${c}`,
    arpHelp: 'The notes of the chord you are viewing, one at a time, in five positions. Each position holds one CAGED shape. Play it slowly with strict alternate picking, then as a sweep.',
    groupShapes: 'Shapes',
    openShort: 'open',
    fretShort: (n) => `fret ${n}`,
    invKind: 'Kind of voicing',
    invLoading: 'Loading every inversion…',
    invError: 'Could not load the inversions. Check your connection and try again.',
    invStrings: 'Strings',
    invPrev: 'Previous voicing',
    invNext: 'Next voicing',
    invCount: (i, n) => `${i} of ${n}`,
    invNone: 'No voicing of this kind with that bass and those strings.',
    invBass: 'Note in the bass',
    invAll: 'All',
    invRoot: 'Root',
    invBassDeg: (d) => `Bass ${d}`,
    invGroup: (g) => ({ dyad: 'Dyads', triad: 'Closed triads', open: 'Open triads', closed: 'Closed', drop2: 'Drop 2', drop3: 'Drop 3', shell: 'Shells', rootless: 'Rootless' })[g],
    invGroupHelp: (g) => ({
      dyad: 'Just the root and the fifth, in either order and on any pair of strings. The power chord and its inversion (the fifth below the root).',
      triad: 'The three notes of the chord stacked as tight as possible, on any three strings that allow it, one for every note in the bass.',
      open: 'The same triad spread over more than an octave, skipping a string. Warmer and bigger, a favourite on clean guitar.',
      closed: 'All the chord tones inside one octave on any four strings that allow it. Tight, and only fits where the neck allows it.',
      drop2: 'The second note from the top of a closed chord is dropped an octave. The most used jazz voicing on guitar; pick the string group below.',
      drop3: 'The third note from the top is dropped an octave, which leaves a gap after the bass. Wide and full, with a bass on string 6 or 5.',
      shell: 'Only the root, the third and the seventh (or the sixth). The skeleton of the chord, leaving room for the melody or a bass player.',
      rootless: 'The chord without its root, so the bass or another instrument supplies it. Standard in jazz comping: you hear the colour notes only.',
    })[g],
    invRootless: 'The root is left out on purpose.',
    invRootNote: (sym) => `${sym} with the root in the bass.`,
    invNote: (slash, bass) => `${slash}: the same chord with ${bass} in the bass. Moving the bass note by step makes smooth lines when chords change.`,
    groupInversions: (n) => `Inversions and voicings (${n})`,
    funcShort: (f) => ({ T: 'tonic', S: 'sub', D: 'dom' })[f],
    funcName: (f) => ({ T: 'Tonic: rest', S: 'Subdominant: a step away from home', D: 'Dominant: tension that asks for the tonic' })[f],
    funcNote: 'Tonic is rest, subdominant leaves home, dominant pulls back. In the other modes the labels are a rough guide.',
    tritoneTitle: 'Tritone and resolution',
    tritoneText: (third, sev, rootNext, thirdNext) => `The tension is the tritone between ${third} (the third) and ${sev} (the seventh). ${third} wants to rise to ${rootNext} and ${sev} wants to fall to ${thirdNext}.`,
    resolvesTo: 'Resolves to',
    tritoneSub: 'Tritone substitute (sub V)',
    tritoneSubText: 'It shares the same tritone, so it can resolve to the same chord.',
    pentCaged: (pos, form, chord) => `Position ${pos} holds the ${form} form of ${chord}.`,
    pentCagedTitle: 'CAGED shapes inside the positions',
    studyTitle: 'Study guide',
    studyHelp: (a, b) => `The ideas behind the chords, with examples in ${a} major and ${b}. Tap a chord to see it, or play the whole progression.`,
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
    cagedIntro: (name, n = 5) =>
      `${name} em ${['', '', '', 'três', 'quatro', 'cinco'][n]} lugares do braço. Cada forma é o acorde aberto de C, A, G, E ou D levado até este tom, com as notas extras acrescentadas à tríade, então todas tocam as mesmas notas. Todas as formas mantêm a fundamental no baixo.`,
    cagedWide: (n) => `Pegada aberta: ${n} casas entre a nota mais grave e a mais aguda`,
    cagedWideShort: 'pegada aberta',
    cagedWideNote: 'As formas marcadas com pegada aberta se esticam por mais casas porque as notas extras ficam longe da tríade. Gire a mão, ou deixe de fora a nota mais aguda se ficar pesado.',
    cagedPartial: 'As formas que faltam não cabem neste acorde numa caixa de cinco casas com a fundamental no baixo, então foram deixadas de fora em vez de forçadas.',
    cagedShape: (l) => `Forma de ${l}`,
    cagedWhere: (f) => (f === 0 ? 'solta' : `casa ${f}`),
    legendFinger: 'Dedo',
    toneRole: (n) => ['', 'Fundamental', 'Terça', 'Quinta', 'Sétima', 'Extensão'][n],
    toneKey: 'Tons: fundamental, terça, quinta, sétima, extensão',
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
    themeStage: 'Palco',
    install: 'Instalar app',
    play: 'Ouvir', share: 'Copiar link', copied: 'Link copiado',
    footer: 'Gratuito e de código aberto (MIT).', source: 'Código no GitHub', madeBy: 'Feito por Thiago Costa',
    playScale: 'Ouvir escala',
    practiceTitle: 'Ferramentas de estudo',
    metroTitle: 'Metrônomo',
    metroHelp: 'Estude qualquer escala ou troca de acordes em semínimas, colcheias, tercinas ou semicolcheias. O primeiro clique de cada compasso é mais agudo.',
    start: 'Iniciar', stop: 'Parar', bpm: 'Andamento (BPM)', subdivision: 'Subdivisão',
    subName: (n) => ({ 1: 'Semínimas', 2: 'Colcheias', 3: 'Tercinas', 4: 'Semicolcheias' })[n],
    quizTitle: 'Quiz de acordes',
    quizHelp: 'Diga qual é o acorde pelo diagrama, ou de ouvido.',
    quizExtended: 'Incluir acordes estendidos',
    quizHear: 'De ouvido',
    quizListen: 'Toque em ouvir e escute.',
    quizScore: (r, n) => `Pontos: ${r} de ${n}`,
    quizNext: 'Próximo acorde',
    quizRight: 'Certo.',
    quizWrong: (c) => `Quase. Era ${c}.`,
    leftyLabel: 'Canhoto',
    leftyHelp: 'Espelha os diagramas de acordes para quem toca com a mão esquerda',
    progTitle: 'Montador de progressões',
    progHelp: (k) => `Monte uma sequência de acordes, ouça e leve para outro tom. Os graus em algarismos romanos contam a partir de ${k} maior, o tom da roda.`,
    progKeyChords: (k) => `Acordes de ${k}:`,
    progEmpty: 'Adicione o acorde que você está vendo ou um acorde do tom para começar.',
    progRemove: (c) => `Remover ${c}`,
    progSemitone: 'semitom',
    progCopy: 'Copiar acordes',
    progClear: 'Limpar',
    modeScale: 'Escala',
    modeArpeggio: 'Arpejo',
    arpeggioOf: (c) => `Arpejo de ${c}`,
    arpHelp: 'As notas do acorde que você está vendo, uma de cada vez, em cinco posições. Cada posição guarda uma forma do CAGED. Toque devagar com palhetada alternada e depois como sweep.',
    groupShapes: 'Formas',
    openShort: 'solta',
    fretShort: (n) => `casa ${n}`,
    invKind: 'Tipo de voz',
    invLoading: 'Carregando todas as inversões…',
    invError: 'Não foi possível carregar as inversões. Verifique a conexão e tente de novo.',
    invStrings: 'Cordas',
    invPrev: 'Voicing anterior',
    invNext: 'Próximo voicing',
    invCount: (i, n) => `${i} de ${n}`,
    invNone: 'Nenhum voicing deste tipo com esse baixo e essas cordas.',
    invBass: 'Nota no baixo',
    invAll: 'Todas',
    invRoot: 'Fundamental',
    invBassDeg: (d) => `Baixo ${d}`,
    invGroup: (g) => ({ dyad: 'Dois sons', triad: 'Tríades fechadas', open: 'Tríades abertas', closed: 'Fechadas', drop2: 'Drop 2', drop3: 'Drop 3', shell: 'Shells', rootless: 'Sem fundamental' })[g],
    invGroupHelp: (g) => ({
      dyad: 'Só a fundamental e a quinta, em qualquer ordem e em qualquer par de cordas. O power chord e a sua inversão (a quinta abaixo da fundamental).',
      triad: 'As três notas do acorde empilhadas o mais juntas possível em quaisquer três cordas que permitam, uma para cada nota no baixo.',
      open: 'A mesma tríade espalhada por mais de uma oitava, pulando uma corda. Mais cheia e quente, ótima na guitarra limpa.',
      closed: 'Todas as notas do acorde dentro de uma oitava em quatro cordas vizinhas. Compacta, e só cabe onde o braço permite.',
      drop2: 'A segunda nota de cima de um acorde fechado desce uma oitava. Quatro cordas vizinhas, a voz de jazz mais usada na guitarra.',
      drop3: 'A terceira nota de cima desce uma oitava, o que deixa um espaço depois do baixo. Larga e cheia, com baixo na corda 6 ou 5.',
      shell: 'Só a fundamental, a terça e a sétima (ou a sexta). O esqueleto do acorde, deixando espaço para a melodia ou para o baixista.',
      rootless: 'O acorde sem a fundamental, que o baixo ou outro instrumento fornece. Padrão no acompanhamento de jazz: você ouve só as notas de cor.',
    })[g],
    invRootless: 'A fundamental foi deixada de fora de propósito.',
    invRootNote: (sym) => `${sym} com a fundamental no baixo.`,
    invNote: (slash, bass) => `${slash}: o mesmo acorde com ${bass} no baixo. Mover o baixo por graus conjuntos faz linhas suaves quando os acordes mudam.`,
    groupInversions: (n) => `Inversões e vozes (${n})`,
    funcShort: (f) => ({ T: 'tônica', S: 'sub', D: 'dom' })[f],
    funcName: (f) => ({ T: 'Tônica: repouso', S: 'Subdominante: um passo para longe de casa', D: 'Dominante: tensão que pede a tônica' })[f],
    funcNote: 'Tônica é repouso, subdominante sai de casa, dominante puxa de volta. Nos outros modos os rótulos são só um guia.',
    tritoneTitle: 'Trítono e resolução',
    tritoneText: (third, sev, rootNext, thirdNext) => `A tensão é o trítono entre ${third} (a terça) e ${sev} (a sétima). ${third} quer subir para ${rootNext} e ${sev} quer descer para ${thirdNext}.`,
    resolvesTo: 'Resolve em',
    tritoneSub: 'Substituto de trítono (sub V)',
    tritoneSubText: 'Tem o mesmo trítono, então pode resolver no mesmo acorde.',
    pentCaged: (pos, form, chord) => `A posição ${pos} guarda a forma de ${form} de ${chord}.`,
    pentCagedTitle: 'Formas do CAGED dentro das posições',
    studyTitle: 'Guia de estudo',
    studyHelp: (a, b) => `As ideias por trás dos acordes, com exemplos em ${a} maior e ${b}. Toque num acorde para vê-lo, ou ouça a progressão inteira.`,
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

export const LeftyContext = createContext(false);
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

export function readLefty() {
  try {
    return window.localStorage.getItem('chord-dictionary-lefty') === '1';
  } catch (e) {
    return false;
  }
}

export function saveLefty(on) {
  try {
    window.localStorage.setItem('chord-dictionary-lefty', on ? '1' : '0');
  } catch (e) {
    /* ignore */
  }
}

export function readTheme() {
  try {
    const saved = window.localStorage.getItem('chord-dictionary-theme');
    if (saved === 'light' || saved === 'dark' || saved === 'stage') return saved;
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
