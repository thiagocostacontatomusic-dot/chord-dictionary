import { keyNames, romanFor, spellScale, scaleByKey, fifthsIndex, pcAtIndex, SCALES } from './theory';
import { searchChords, getChord, stats } from './chordData';

test('fifths index round-trips', () => {
  for (let pc = 0; pc < 12; pc += 1) expect(pcAtIndex(fifthsIndex(pc))).toBe(pc);
});

test('every scale has matching degrees and semitones', () => {
  SCALES.forEach((s) => expect(s.degs.length).toBe(s.semis.length));
});

test('spells C major and D major correctly', () => {
  expect(spellScale('C', 0, scaleByKey('ionian'))).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  expect(spellScale('D', 2, scaleByKey('ionian'))).toEqual(['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯']);
});

test('F# and Db keys use consistent spelling', () => {
  expect(keyNames(6)[0]).toBe('F♯');
  expect(keyNames(1)[0]).toBe('D♭');
});

test('chord data: lookups and search', () => {
  expect(getChord('C_major').symbol).toBe('C');
  expect(stats.totalChords).toBeGreaterThanOrEqual(300);
  expect(searchChords({ search: 'Am7' }).some((c) => c.id === 'A_min7')).toBe(true);
  expect(getChord('G_dom9')).toBeTruthy();
});

test('roman numerals exist', () => {
  expect(typeof romanFor).toBe('function');
});

test('study examples resolve to real chords in any key', () => {
  const { TOPICS, examplesFor } = require('./study');
  const { chordFor } = require('./chordData');
  for (let pc = 0; pc < 12; pc += 1) {
    TOPICS.forEach((topic) => {
      ['en', 'pt'].forEach((lang) => {
        examplesFor(topic, pc, lang).forEach((ex) =>
          ex.chords.forEach((x) => expect(chordFor(x.pc, x.type)).toBeTruthy())
        );
      });
    });
  }
});

test('extended chords carry CAGED forms', () => {
  const { getChord } = require('./chordData');
  expect(getChord('C_dom9').caged.length).toBe(5);
  expect(getChord('F_min11').caged.length).toBe(5);
});
