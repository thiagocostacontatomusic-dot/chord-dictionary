# Contributing

Thanks for helping make this a better guitar chord dictionary. All contributions are welcome: chord shapes, fixes, translations, accessibility and ideas.

## Run it

```
cd frontend && npm install && npm start      # the site
cd backend  && npm test                      # chord data tests
cd frontend && CI=true npm test              # app tests
```

## The data is generated, never edited by hand

`backend/chords.json` is produced by `backend/scripts/generate-chords.js` from the rules in `backend/scripts/chord-theory.js`. After changing the rules run `npm run generate` in `backend`, then run the tests. Every voicing, CAGED form and inversion is checked: the notes each string really sounds in standard tuning must spell the chord.

### Add a chord type
1. Add an entry to `TYPES` in `chord-theory.js` (movable E and A shapes, as fret offsets from the root fret).
2. Add its tones to `TONES` (semitones, degree label, letter step) and a Portuguese name to `NAMES_PT`.
3. Add its CAGED shapes to `CAGED_SHAPES` if you want all five forms.
4. Add English and Portuguese labels to `TYPE_LABELS` in `frontend/src/i18n.js` and the type to `FAMILY` in `frontend/src/theory.js`.
5. Update the counts in the tests and run them.

## Writing and music theory content

- Write it in your own words. Do not copy text, tablature or exercises from books, courses or sheets; summarise the idea and credit the source in the study guide.
- Keep English and Portuguese in step (`frontend/src/i18n.js`, `frontend/src/study.js`).
- Musical terms are translated on purpose so browser auto-translate does not change them.

## Pull requests

Keep changes small and focused, add or update a test when behaviour changes, and check the page in the light and dark themes and at phone width. Interface changes should keep the page free of accessibility errors (we use axe-core).
