// Study guide content. Everything here is written in our own words as a summary of ideas taught in:
//  - "Segredos da Harmonia" (course and e-book), Kiko Loureiro
//  - "Toolbox" exercise sheets (Kiko Loureiro Guitar Academy)
//  - "Standards do Jazz", Ted Gioia
// Exercises and tablature from those materials are NOT reproduced: the sheets themselves are the source.
import { mod12 } from './theory';

// A chord of the example: root offset in semitones from the key, and a chord type key.
const c = (off, type) => ({ off, type });

export const TOPICS = ['tension', 'cadences', 'fields', 'dominants', 'color', 'standards', 'practice', 'sources'];

export const TOPIC_TITLES = {
  en: {
    tension: 'Tension and rest',
    cadences: 'Cadences',
    fields: 'Chords of a key',
    dominants: 'Dominants and substitutes',
    color: 'Borrowed colours and modes',
    standards: 'In real songs',
    practice: 'How to practise',
    sources: 'Sources',
  },
  pt: {
    tension: 'Tensão e repouso',
    cadences: 'Cadências',
    fields: 'Acordes de um tom',
    dominants: 'Dominantes e substitutos',
    color: 'Cores emprestadas e modos',
    standards: 'Em músicas de verdade',
    practice: 'Como estudar',
    sources: 'Fontes',
  },
};

// Paragraphs per topic and language.
export const TEXT = {
  en: {
    tension: [
      'Harmony is built on tension and release. It starts in physics: a note rings with a series of overtones, and the first ones are the octave, then the fifth, then the major third and the flat seventh. That is why tonic and fifth feel so related to the ear, and why a chord built on the fifth degree pulls back to the tonic.',
      'The strongest pull comes from the tritone, an interval of three whole tones that splits the octave in half. In a dominant seventh chord it sits between the third and the seventh (B and F in G7). B wants to rise to C and F wants to fall to E, and those two notes are the third and the root of the tonic chord. Resolving means landing on that sound of rest.',
      'Try it: pick any dominant chord below and play it into the chord a fourth above its root. Doing this around all twelve keys, following the circle of fifths, is the first exercise of the course.',
    ],
    cadences: [
      'A cadence is a short chord sequence that ends a phrase. The three functions are tonic (rest), subdominant (a step away from home, also called pre-dominant) and dominant (tension that asks for the tonic).',
      'Subdominant to tonic, IV to I, is the plagal cadence: soft, like an "amen". Dominant to tonic, V to I, is the authentic cadence: decisive. Putting the three together, IV to V to I, gives the complete cadence, which is behind an enormous share of songs.',
      'Chords can also stand in for each other inside a function. In a major key, iii and vi share notes with I and work as tonic colours, while ii shares notes with IV and works as a subdominant, which is why ii to V to I sounds so natural.',
    ],
    fields: [
      'The harmonic field is the set of chords you get by stacking thirds on every note of a scale. Starting the major field on its sixth degree gives the natural minor field, and the minor chord becomes the place you land on, so the same progressions feel darker.',
      'Seventh chords give each degree more colour: Imaj7, iim7, iiim7, IVmaj7, V7, vim7 and viim7♭5. The half-diminished chord on the seventh degree is built from the same notes as a dominant ninth without its root (B, D, F, A is G9 without the G), which is why it pulls so strongly.',
      'The diminished seventh chord is symmetrical, made only of minor thirds. Every one of its four notes can be named as the root, so one shape repeats every three frets. In the harmonic minor field it appears on the seventh degree.',
      'Inversions: the same chord with another note in the bass, written as a slash chord (C/E means C major with E in the bass). Passing basses such as C, C/B, Am make a line that walks down while the harmony stays still.',
    ],
    dominants: [
      'Any chord of the key can be approached by its own dominant. These are secondary dominants: A7 leads to Dm, E7 to Am, D7 to G. Chaining them around the circle gives the extended dominants, A7, D7, G7, C.',
      'The tritone substitution swaps a dominant for the dominant a tritone away. G7 and D♭7 share the same tritone (B and F, with C♭ written as B), so D♭7 can resolve to C just as well and the bass moves by a half step. This is the sub V.',
      'Each sub V can have its own ii. Dm7, G7, Cmaj7 becomes Dm7, D♭7, Cmaj7, or A♭m7, D♭7, Cmaj7. Alterations such as ♭9, ♯9 and ♯5 make the tension bigger, which is where the 7♭9, 7♯9 and augmented 7 chords of this dictionary come from.',
    ],
    color: [
      'Borrowed chords come from the key that shares your tonic but has a different mode. In C major you can borrow from C minor: Fm, B♭ and A♭ add a darker colour and then resolve home.',
      'Modes work as new keys over the same notes: D Dorian uses C major notes but treats D as home. In modal harmony the chord that gives the mode its identity matters more than the cadence, for example the major IV in Dorian or the flat second in Phrygian.',
      'Chromatic mediants are chords a third apart, such as C, E and A♭. They share one note or none and make cinematic jumps. Moving by major thirds is also the heart of Giant Steps.',
    ],
    standards: [
      'These are the same ideas heard in songs that appear in the book Standards do Jazz. They are summaries of the chord patterns, not the full charts.',
    ],
    practice: [
      'Write every exercise in all twelve keys. It takes time, but writing, hearing and playing together is what makes it stay. Play a progression, change the key, then play something you have never played before.',
      'Left hand: keep one finger per fret, fingers 1, 2, 3 and 4 on four neighbouring frets, up and down, with the thumb behind the neck and the fingers close to the frets.',
      'Right hand: alternate picking means strict down and up. Use a metronome and practise the same notes in quarter notes, eighths, triplets and sixteenths. For sweep picking, one smooth motion across adjacent strings, one note per string.',
      'Scales and CAGED: the five boxes of the pentatonic scale lock onto the five CAGED chord shapes. Use the scale diagram above to see which box holds each chord shape.',
    ],
    sources: [
      'The concepts here are based on the course and e-book "Segredos da Harmonia" by Kiko Loureiro, the Toolbox sheets from Kiko Loureiro Guitar Academy and the book "Standards do Jazz" by Ted Gioia.',
      'All text and examples are our own summaries. For the full lessons, exercises and tablature, use the original materials.',
    ],
  },
  pt: {
    tension: [
      'A harmonia nasce da tensão e do repouso. Tudo começa na física: uma nota soa com uma série de harmônicos, e os primeiros são a oitava, depois a quinta, depois a terça maior e a sétima menor. Por isso tônica e quinta soam tão ligadas ao ouvido, e por isso um acorde construído no quinto grau puxa de volta para a tônica.',
      'A atração mais forte vem do trítono, intervalo de três tons inteiros que divide a oitava ao meio. No acorde de sétima dominante ele fica entre a terça e a sétima (Si e Fá no G7). O Si quer subir para Dó e o Fá quer descer para Mi, e essas duas notas são a terça e a fundamental do acorde de tônica. Resolver é pousar nesse som de repouso.',
      'Experimente: escolha um acorde dominante abaixo e toque-o seguido do acorde uma quarta acima da sua fundamental. Fazer isso nos doze tons, seguindo o ciclo das quintas, é o primeiro exercício do curso.',
    ],
    cadences: [
      'Cadência é uma sequência curta de acordes que fecha uma frase. As três funções são tônica (repouso), subdominante (um passo para longe de casa, também chamado de pré-dominante) e dominante (tensão que pede a tônica).',
      'Subdominante para tônica, IV para I, é a cadência plagal: suave, como um "amém". Dominante para tônica, V para I, é a cadência autêntica: decidida. Juntando as três, IV para V para I, temos a cadência completa, que está por trás de uma enorme parte das músicas.',
      'Os acordes também podem trocar de lugar dentro de uma função. Em tom maior, iii e vi dividem notas com o I e funcionam como cores de tônica, enquanto o ii divide notas com o IV e funciona como subdominante, por isso ii, V, I soa tão natural.',
    ],
    fields: [
      'O campo harmônico é o conjunto de acordes que se forma empilhando terças sobre cada nota da escala. Começar o campo maior pelo sexto grau dá o campo menor natural, e o acorde menor passa a ser o ponto de chegada, então as mesmas progressões ficam mais escuras.',
      'Os acordes com sétima dão mais cor a cada grau: Imaj7, iim7, iiim7, IVmaj7, V7, vim7 e viim7♭5. O meio-diminuto do sétimo grau tem as mesmas notas de um dominante com nona sem a fundamental (Si, Ré, Fá, Lá é o G9 sem o Sol), por isso puxa tanto.',
      'O acorde diminuto com sétima é simétrico, formado só por terças menores. Qualquer uma das quatro notas pode ser a fundamental, então uma mesma forma se repete a cada três casas. No campo harmônico menor ele aparece no sétimo grau.',
      'Inversões: o mesmo acorde com outra nota no baixo, escrito como acorde com barra (C/E é Dó maior com Mi no baixo). Baixos de passagem como C, C/B, Am formam uma linha que desce enquanto a harmonia fica parada.',
    ],
    dominants: [
      'Qualquer acorde do tom pode ser preparado pelo seu próprio dominante. São os dominantes secundários: A7 leva ao Dm, E7 ao Am, D7 ao G. Encadeando-os pelo ciclo, temos os dominantes estendidos: A7, D7, G7, C.',
      'A substituição por trítono troca um dominante pelo dominante a um trítono de distância. G7 e D♭7 têm o mesmo trítono (Si e Fá, com o Dó♭ escrito como Si), então o D♭7 também resolve em C e o baixo anda por semitom. É o sub V.',
      'Cada sub V pode ter o seu próprio ii. Dm7, G7, Cmaj7 vira Dm7, D♭7, Cmaj7, ou A♭m7, D♭7, Cmaj7. Alterações como ♭9, ♯9 e ♯5 aumentam a tensão, e é daí que vêm os acordes 7♭9, 7♯9 e aumentado com sétima deste dicionário.',
    ],
    color: [
      'Acordes emprestados vêm do tom que divide a mesma tônica mas tem outro modo. Em Dó maior dá para emprestar de Dó menor: Fm, B♭ e A♭ trazem uma cor mais escura e depois resolvem em casa.',
      'Os modos funcionam como tons novos sobre as mesmas notas: Ré dórico usa as notas de Dó maior mas trata o Ré como casa. Na harmonia modal, o acorde que dá identidade ao modo importa mais que a cadência, como o IV maior no dórico ou o segundo grau bemol no frígio.',
      'Mediantes cromáticas são acordes a uma terça de distância, como C, E e A♭. Dividem uma nota ou nenhuma e criam saltos cinematográficos. Andar por terças maiores também é o coração de Giant Steps.',
    ],
    standards: [
      'São as mesmas ideias que se ouvem em músicas do livro Standards do Jazz. São resumos dos padrões de acordes, não as cifras completas.',
    ],
    practice: [
      'Escreva cada exercício nos doze tons. Dá trabalho, mas escrever, ouvir e tocar juntos é o que fixa. Toque uma progressão, troque o tom e depois toque algo que você nunca tocou.',
      'Mão esquerda: um dedo por casa, dedos 1, 2, 3 e 4 em quatro casas vizinhas, subindo e descendo, com o polegar atrás do braço e os dedos perto dos trastes.',
      'Mão direita: palhetada alternada é descer e subir sem falhar. Use metrônomo e pratique as mesmas notas em semínimas, colcheias, tercinas e semicolcheias. No sweep, um movimento fluido por cordas vizinhas, uma nota por corda.',
      'Escalas e CAGED: as cinco caixas da pentatônica encaixam nas cinco formas de acorde do CAGED. Use o diagrama de escala acima para ver qual caixa guarda cada forma.',
    ],
    sources: [
      'Os conceitos daqui se baseiam no curso e e-book "Segredos da Harmonia", de Kiko Loureiro, nas folhas Toolbox da Kiko Loureiro Guitar Academy e no livro "Standards do Jazz", de Ted Gioia.',
      'Todos os textos e exemplos são resumos nossos. Para as aulas completas, exercícios e tablaturas, use os materiais originais.',
    ],
  },
};

// Progressions per topic. Offsets are semitones above the key (major key) or above the relative minor tonic.
// `std` names a song from Standards do Jazz that uses the pattern.
export const EXAMPLES = {
  tension: [
    { name: { en: 'V7 to I', pt: 'V7 para I' }, chords: [c(7, 'dom7'), c(0, 'major')] },
    { name: { en: 'V7 to i (minor)', pt: 'V7 para i (menor)' }, minor: true, chords: [c(7, 'dom7'), c(0, 'minor')] },
    { name: { en: 'Dominant 9th and 13th colours', pt: 'Cores de dominante com 9ª e 13ª' }, chords: [c(7, 'dom9'), c(7, 'dom13'), c(0, 'maj9')] },
  ],
  cadences: [
    { name: { en: 'Plagal: IV to I', pt: 'Plagal: IV para I' }, chords: [c(5, 'major'), c(0, 'major')] },
    { name: { en: 'Complete: IV V I', pt: 'Completa: IV V I' }, chords: [c(5, 'major'), c(7, 'dom7'), c(0, 'major')] },
    { name: { en: 'ii V I', pt: 'ii V I' }, chords: [c(2, 'min7'), c(7, 'dom7'), c(0, 'maj7')] },
    { name: { en: 'Minor ii V i', pt: 'ii V i menor' }, minor: true, chords: [c(2, 'halfdim'), c(7, 'dom7'), c(0, 'min7')] },
  ],
  fields: [
    { name: { en: 'Seventh chords of the major key', pt: 'Acordes com sétima do tom maior' }, chords: [c(0, 'maj7'), c(2, 'min7'), c(4, 'min7'), c(5, 'maj7'), c(7, 'dom7'), c(9, 'min7'), c(11, 'halfdim')] },
    { name: { en: 'Diminished passing chord', pt: 'Diminuto de passagem' }, chords: [c(0, 'maj7'), c(1, 'dim7'), c(2, 'min7'), c(7, 'dom7')] },
  ],
  dominants: [
    { name: { en: 'Secondary dominant: V7 of ii', pt: 'Dominante secundário: V7 do ii' }, chords: [c(9, 'dom7'), c(2, 'min7'), c(7, 'dom7'), c(0, 'maj7')] },
    { name: { en: 'Extended dominants', pt: 'Dominantes estendidos' }, chords: [c(9, 'dom7'), c(2, 'dom7'), c(7, 'dom7'), c(0, 'major')] },
    { name: { en: 'Tritone substitution (sub V)', pt: 'Substituição por trítono (sub V)' }, chords: [c(2, 'min7'), c(1, 'dom7'), c(0, 'maj7')] },
    { name: { en: 'Altered dominants', pt: 'Dominantes alterados' }, chords: [c(2, 'min7'), c(7, 'dom7b9'), c(0, 'maj7')] },
    { name: { en: 'Sharp nine and augmented', pt: 'Nona aumentada e aumentado' }, chords: [c(7, 'dom7s9'), c(7, 'aug7'), c(0, 'maj9')] },
  ],
  color: [
    { name: { en: 'Borrowed from the parallel minor', pt: 'Emprestados do menor paralelo' }, chords: [c(0, 'major'), c(5, 'minor'), c(10, 'major'), c(8, 'major'), c(0, 'major')] },
    { name: { en: 'Minor with a major seventh', pt: 'Menor com sétima maior' }, minor: true, chords: [c(0, 'mmaj7'), c(0, 'min7'), c(0, 'minor6'), c(5, 'dom7')] },
    { name: { en: 'Chromatic mediants', pt: 'Mediantes cromáticas' }, chords: [c(0, 'major'), c(4, 'major'), c(8, 'major'), c(0, 'major')] },
    { name: { en: 'Suspended colours', pt: 'Cores suspensas' }, chords: [c(7, 'sus7'), c(7, 'dom7'), c(0, 'six9')] },
  ],
  standards: [
    { std: 'C Jam Blues', name: { en: 'Twelve-bar blues pattern: I7, IV7, V7', pt: 'Padrão de blues de 12 compassos: I7, IV7, V7' }, chords: [c(0, 'dom7'), c(5, 'dom7'), c(0, 'dom7'), c(7, 'dom7'), c(5, 'dom7'), c(0, 'dom7')] },
    { std: 'Autumn Leaves', name: { en: 'A cycle of ii V I, then ii V i in the relative minor', pt: 'Ciclo de ii V I e depois ii V i no relativo menor' }, chords: [c(2, 'min7'), c(7, 'dom7'), c(0, 'maj7'), c(5, 'maj7'), c(11, 'halfdim'), c(4, 'dom7'), c(9, 'min7')] },
    { std: 'Fly Me to the Moon', name: { en: 'Diatonic circle of fifths, starting on vi', pt: 'Ciclo de quintas diatônico, começando no vi' }, chords: [c(9, 'min7'), c(2, 'min7'), c(7, 'dom7'), c(0, 'maj7'), c(5, 'maj7'), c(11, 'halfdim'), c(4, 'dom7'), c(9, 'min7')] },
    { std: 'I Got Rhythm', name: { en: '"Rhythm changes" turnaround: I vi ii V', pt: 'Turnaround "rhythm changes": I vi ii V' }, chords: [c(0, 'major'), c(9, 'min7'), c(2, 'min7'), c(7, 'dom7')] },
    { std: 'Garota de Ipanema', name: { en: 'Uses the tritone substitute for a surprise colour', pt: 'Usa o substituto de trítono como cor de surpresa' }, chords: [c(0, 'maj7'), c(2, 'dom7'), c(2, 'min7'), c(1, 'dom7')] },
    { std: 'Giant Steps', name: { en: 'Roots move by major thirds, each approached by its dominant', pt: 'Fundamentais andam por terças maiores, cada uma precedida do seu dominante' }, chords: [c(0, 'major'), c(3, 'dom7'), c(8, 'major'), c(11, 'dom7'), c(4, 'major')] },
  ],
};

// Resolve the examples for a key: returns [{ name, std, chords: [{pc, type}] }]
export function examplesFor(topic, majorPc, lang) {
  const minorPc = mod12(majorPc + 9);
  return (EXAMPLES[topic] || []).map((ex) => ({
    std: ex.std,
    name: ex.name[lang] || ex.name.en,
    minor: !!ex.minor,
    chords: ex.chords.map((x) => ({ pc: mod12((ex.minor ? minorPc : majorPc) + x.off), type: x.type })),
  }));
}
