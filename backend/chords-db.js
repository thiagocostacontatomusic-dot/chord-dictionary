// Complete guitar chord database for all notes and variations
const chordsDatabase = [
  // C chords
  {
    id: 'C_major',
    name: 'C Major',
    note: 'C',
    type: 'Major',
    notes: ['C', 'E', 'G'],
    positions: [
      { string: 1, fret: 0 }, // e (open)
      { string: 2, fret: 3 }, // B
      { string: 3, fret: 2 }, // G
      { string: 4, fret: 0 }, // D (open)
      { string: 5, fret: 3 }, // A
      { string: 6, fret: null } // E (muted)
    ]
  },
  {
    id: 'C_minor',
    name: 'C Minor',
    note: 'C',
    type: 'Minor',
    notes: ['C', 'Eb', 'G'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 3 },
      { string: 3, fret: 2 },
      { string: 4, fret: 2 },
      { string: 5, fret: 3 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'C_diminished',
    name: 'C Diminished',
    note: 'C',
    type: 'Diminished',
    notes: ['C', 'Eb', 'Gb'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 3 },
      { string: 3, fret: 2 },
      { string: 4, fret: 1 },
      { string: 5, fret: 3 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'C_augmented',
    name: 'C Augmented',
    note: 'C',
    type: 'Augmented',
    notes: ['C', 'E', 'G#'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 3 },
      { string: 3, fret: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: 4 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'C_sus2',
    name: 'C Suspended 2',
    note: 'C',
    type: 'Suspended',
    notes: ['C', 'D', 'G'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: 3 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'C_sus4',
    name: 'C Suspended 4',
    note: 'C',
    type: 'Suspended',
    notes: ['C', 'F', 'G'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 3 },
      { string: 3, fret: 2 },
      { string: 4, fret: 3 },
      { string: 5, fret: 3 },
      { string: 6, fret: null }
    ]
  },

  // C# chords
  {
    id: 'Csharp_major',
    name: 'C# Major',
    note: 'C#',
    type: 'Major',
    notes: ['C#', 'F', 'G#'],
    positions: [
      { string: 1, fret: 1 },
      { string: 2, fret: 4 },
      { string: 3, fret: 3 },
      { string: 4, fret: 1 },
      { string: 5, fret: 4 },
      { string: 6, fret: 4 }
    ]
  },
  {
    id: 'Csharp_minor',
    name: 'C# Minor',
    note: 'C#',
    type: 'Minor',
    notes: ['C#', 'E', 'G#'],
    positions: [
      { string: 1, fret: 1 },
      { string: 2, fret: 4 },
      { string: 3, fret: 3 },
      { string: 4, fret: 3 },
      { string: 5, fret: 4 },
      { string: 6, fret: 4 }
    ]
  },

  // D chords
  {
    id: 'D_major',
    name: 'D Major',
    note: 'D',
    type: 'Major',
    notes: ['D', 'F#', 'A'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 3 },
      { string: 3, fret: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'D_minor',
    name: 'D Minor',
    note: 'D',
    type: 'Minor',
    notes: ['D', 'F', 'A'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 3 },
      { string: 3, fret: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'D_diminished',
    name: 'D Diminished',
    note: 'D',
    type: 'Diminished',
    notes: ['D', 'F', 'Ab'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 2 },
      { string: 3, fret: 1 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'D_augmented',
    name: 'D Augmented',
    note: 'D',
    type: 'Augmented',
    notes: ['D', 'F#', 'A#'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 3 },
      { string: 3, fret: 3 },
      { string: 4, fret: 0 },
      { string: 5, fret: 1 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'D_sus2',
    name: 'D Suspended 2',
    note: 'D',
    type: 'Suspended',
    notes: ['D', 'E', 'A'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'D_sus4',
    name: 'D Suspended 4',
    note: 'D',
    type: 'Suspended',
    notes: ['D', 'G', 'A'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 3 },
      { string: 3, fret: 3 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
      { string: 6, fret: null }
    ]
  },

  // D# chords
  {
    id: 'Dsharp_major',
    name: 'D# Major',
    note: 'D#',
    type: 'Major',
    notes: ['D#', 'G', 'A#'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 4 },
      { string: 3, fret: 3 },
      { string: 4, fret: 1 },
      { string: 5, fret: 1 },
      { string: 6, fret: 1 }
    ]
  },
  {
    id: 'Dsharp_minor',
    name: 'D# Minor',
    note: 'D#',
    type: 'Minor',
    notes: ['D#', 'F#', 'A#'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 4 },
      { string: 3, fret: 3 },
      { string: 4, fret: 1 },
      { string: 5, fret: 1 },
      { string: 6, fret: 1 }
    ]
  },

  // E chords
  {
    id: 'E_major',
    name: 'E Major',
    note: 'E',
    type: 'Major',
    notes: ['E', 'G#', 'B'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'E_minor',
    name: 'E Minor',
    note: 'E',
    type: 'Minor',
    notes: ['E', 'G', 'B'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'E_diminished',
    name: 'E Diminished',
    note: 'E',
    type: 'Diminished',
    notes: ['E', 'G', 'Bb'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 1 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'E_augmented',
    name: 'E Augmented',
    note: 'E',
    type: 'Augmented',
    notes: ['E', 'G#', 'C'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'E_sus2',
    name: 'E Suspended 2',
    note: 'E',
    type: 'Suspended',
    notes: ['E', 'F#', 'B'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'E_sus4',
    name: 'E Suspended 4',
    note: 'E',
    type: 'Suspended',
    notes: ['E', 'A', 'B'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },

  // F chords
  {
    id: 'F_major',
    name: 'F Major',
    note: 'F',
    type: 'Major',
    notes: ['F', 'A', 'C'],
    positions: [
      { string: 1, fret: 1 },
      { string: 2, fret: 1 },
      { string: 3, fret: 2 },
      { string: 4, fret: 3 },
      { string: 5, fret: 3 },
      { string: 6, fret: 1 }
    ]
  },
  {
    id: 'F_minor',
    name: 'F Minor',
    note: 'F',
    type: 'Minor',
    notes: ['F', 'Ab', 'C'],
    positions: [
      { string: 1, fret: 1 },
      { string: 2, fret: 1 },
      { string: 3, fret: 1 },
      { string: 4, fret: 3 },
      { string: 5, fret: 3 },
      { string: 6, fret: 1 }
    ]
  },
  {
    id: 'F_diminished',
    name: 'F Diminished',
    note: 'F',
    type: 'Diminished',
    notes: ['F', 'Ab', 'Cb'],
    positions: [
      { string: 1, fret: 1 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1 },
      { string: 4, fret: 2 },
      { string: 5, fret: 3 },
      { string: 6, fret: 1 }
    ]
  },
  {
    id: 'F_augmented',
    name: 'F Augmented',
    note: 'F',
    type: 'Augmented',
    notes: ['F', 'A', 'C#'],
    positions: [
      { string: 1, fret: 1 },
      { string: 2, fret: 1 },
      { string: 3, fret: 3 },
      { string: 4, fret: 3 },
      { string: 5, fret: 3 },
      { string: 6, fret: 1 }
    ]
  },

  // F# chords
  {
    id: 'Fsharp_major',
    name: 'F# Major',
    note: 'F#',
    type: 'Major',
    notes: ['F#', 'A#', 'C#'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 2 },
      { string: 3, fret: 3 },
      { string: 4, fret: 4 },
      { string: 5, fret: 4 },
      { string: 6, fret: 2 }
    ]
  },
  {
    id: 'Fsharp_minor',
    name: 'F# Minor',
    note: 'F#',
    type: 'Minor',
    notes: ['F#', 'A', 'C#'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 2 },
      { string: 3, fret: 2 },
      { string: 4, fret: 4 },
      { string: 5, fret: 4 },
      { string: 6, fret: 2 }
    ]
  },

  // G chords
  {
    id: 'G_major',
    name: 'G Major',
    note: 'G',
    type: 'Major',
    notes: ['G', 'B', 'D'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 2 },
      { string: 6, fret: 3 }
    ]
  },
  {
    id: 'G_minor',
    name: 'G Minor',
    note: 'G',
    type: 'Minor',
    notes: ['G', 'Bb', 'D'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 3 },
      { string: 6, fret: 3 }
    ]
  },
  {
    id: 'G_diminished',
    name: 'G Diminished',
    note: 'G',
    type: 'Diminished',
    notes: ['G', 'Bb', 'Db'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 2 },
      { string: 6, fret: 2 }
    ]
  },
  {
    id: 'G_augmented',
    name: 'G Augmented',
    note: 'G',
    type: 'Augmented',
    notes: ['G', 'B', 'D#'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1 },
      { string: 4, fret: 0 },
      { string: 5, fret: 2 },
      { string: 6, fret: 3 }
    ]
  },
  {
    id: 'G_sus2',
    name: 'G Suspended 2',
    note: 'G',
    type: 'Suspended',
    notes: ['G', 'A', 'D'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 2 },
      { string: 6, fret: 3 }
    ]
  },
  {
    id: 'G_sus4',
    name: 'G Suspended 4',
    note: 'G',
    type: 'Suspended',
    notes: ['G', 'C', 'D'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 3 },
      { string: 6, fret: 3 }
    ]
  },

  // G# chords
  {
    id: 'Gsharp_major',
    name: 'G# Major',
    note: 'G#',
    type: 'Major',
    notes: ['G#', 'C', 'D#'],
    positions: [
      { string: 1, fret: 4 },
      { string: 2, fret: 1 },
      { string: 3, fret: 1 },
      { string: 4, fret: 1 },
      { string: 5, fret: 3 },
      { string: 6, fret: 4 }
    ]
  },
  {
    id: 'Gsharp_minor',
    name: 'G# Minor',
    note: 'G#',
    type: 'Minor',
    notes: ['G#', 'B', 'D#'],
    positions: [
      { string: 1, fret: 4 },
      { string: 2, fret: 1 },
      { string: 3, fret: 1 },
      { string: 4, fret: 1 },
      { string: 5, fret: 4 },
      { string: 6, fret: 4 }
    ]
  },

  // A chords
  {
    id: 'A_major',
    name: 'A Major',
    note: 'A',
    type: 'Major',
    notes: ['A', 'C#', 'E'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'A_minor',
    name: 'A Minor',
    note: 'A',
    type: 'Minor',
    notes: ['A', 'C', 'E'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 2 },
      { string: 5, fret: 1 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'A_diminished',
    name: 'A Diminished',
    note: 'A',
    type: 'Diminished',
    notes: ['A', 'C', 'Eb'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1 },
      { string: 4, fret: 2 },
      { string: 5, fret: 1 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'A_augmented',
    name: 'A Augmented',
    note: 'A',
    type: 'Augmented',
    notes: ['A', 'C#', 'F'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 3 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'A_sus2',
    name: 'A Suspended 2',
    note: 'A',
    type: 'Suspended',
    notes: ['A', 'B', 'E'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 2 },
      { string: 5, fret: 0 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'A_sus4',
    name: 'A Suspended 4',
    note: 'A',
    type: 'Suspended',
    notes: ['A', 'D', 'E'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 3 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },

  // A# chords
  {
    id: 'Asharp_major',
    name: 'A# Major',
    note: 'A#',
    type: 'Major',
    notes: ['A#', 'D', 'F'],
    positions: [
      { string: 1, fret: 1 },
      { string: 2, fret: 1 },
      { string: 3, fret: 3 },
      { string: 4, fret: 3 },
      { string: 5, fret: 3 },
      { string: 6, fret: 1 }
    ]
  },
  {
    id: 'Asharp_minor',
    name: 'A# Minor',
    note: 'A#',
    type: 'Minor',
    notes: ['A#', 'C#', 'F'],
    positions: [
      { string: 1, fret: 1 },
      { string: 2, fret: 1 },
      { string: 3, fret: 3 },
      { string: 4, fret: 3 },
      { string: 5, fret: 2 },
      { string: 6, fret: 1 }
    ]
  },

  // B chords
  {
    id: 'B_major',
    name: 'B Major',
    note: 'B',
    type: 'Major',
    notes: ['B', 'D#', 'F#'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 2 },
      { string: 3, fret: 4 },
      { string: 4, fret: 4 },
      { string: 5, fret: 4 },
      { string: 6, fret: 2 }
    ]
  },
  {
    id: 'B_minor',
    name: 'B Minor',
    note: 'B',
    type: 'Minor',
    notes: ['B', 'D', 'F#'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 2 },
      { string: 3, fret: 4 },
      { string: 4, fret: 4 },
      { string: 5, fret: 3 },
      { string: 6, fret: 2 }
    ]
  },
  {
    id: 'B_diminished',
    name: 'B Diminished',
    note: 'B',
    type: 'Diminished',
    notes: ['B', 'D', 'F'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 1 },
      { string: 3, fret: 3 },
      { string: 4, fret: 3 },
      { string: 5, fret: 3 },
      { string: 6, fret: 2 }
    ]
  },
  {
    id: 'B_augmented',
    name: 'B Augmented',
    note: 'B',
    type: 'Augmented',
    notes: ['B', 'D#', 'G'],
    positions: [
      { string: 1, fret: 2 },
      { string: 2, fret: 2 },
      { string: 3, fret: 5 },
      { string: 4, fret: 4 },
      { string: 5, fret: 4 },
      { string: 6, fret: 2 }
    ]
  },

  // 7th chords
  {
    id: 'C_major7',
    name: 'C Major 7',
    note: 'C',
    type: 'Major 7',
    notes: ['C', 'E', 'G', 'B'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 2 },
      { string: 3, fret: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: 3 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'C_minor7',
    name: 'C Minor 7',
    note: 'C',
    type: 'Minor 7',
    notes: ['C', 'Eb', 'G', 'Bb'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 3 },
      { string: 3, fret: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: 3 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'C_dominant7',
    name: 'C Dominant 7',
    note: 'C',
    type: 'Dominant 7',
    notes: ['C', 'E', 'G', 'Bb'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 3 },
      { string: 3, fret: 2 },
      { string: 4, fret: 3 },
      { string: 5, fret: 3 },
      { string: 6, fret: null }
    ]
  },
  {
    id: 'G_major7',
    name: 'G Major 7',
    note: 'G',
    type: 'Major 7',
    notes: ['G', 'B', 'D', 'F#'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 2 },
      { string: 6, fret: 2 }
    ]
  },
  {
    id: 'G_minor7',
    name: 'G Minor 7',
    note: 'G',
    type: 'Minor 7',
    notes: ['G', 'Bb', 'D', 'F'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 3 },
      { string: 6, fret: 3 }
    ]
  },
  {
    id: 'G_dominant7',
    name: 'G Dominant 7',
    note: 'G',
    type: 'Dominant 7',
    notes: ['G', 'B', 'D', 'F'],
    positions: [
      { string: 1, fret: 3 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 2 },
      { string: 6, fret: 3 }
    ]
  },
  {
    id: 'A_major7',
    name: 'A Major 7',
    note: 'A',
    type: 'Major 7',
    notes: ['A', 'C#', 'E', 'G#'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 1 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'A_minor7',
    name: 'A Minor 7',
    note: 'A',
    type: 'Minor 7',
    notes: ['A', 'C', 'E', 'G'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: 1 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'A_dominant7',
    name: 'A Dominant 7',
    note: 'A',
    type: 'Dominant 7',
    notes: ['A', 'C#', 'E', 'G'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'E_major7',
    name: 'E Major 7',
    note: 'E',
    type: 'Major 7',
    notes: ['E', 'G#', 'B', 'D#'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1 },
      { string: 4, fret: 1 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'E_minor7',
    name: 'E Minor 7',
    note: 'E',
    type: 'Minor 7',
    notes: ['E', 'G', 'B', 'D'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
  {
    id: 'E_dominant7',
    name: 'E Dominant 7',
    note: 'E',
    type: 'Dominant 7',
    notes: ['E', 'G#', 'B', 'D'],
    positions: [
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
      { string: 6, fret: 0 }
    ]
  },
];

module.exports = chordsDatabase;
