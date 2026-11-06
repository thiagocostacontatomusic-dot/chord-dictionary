# 🎸 Chord Dictionary

A complete, interactive guitar chord reference web application. Browse, search, and learn how to play any guitar chord with a visual fretboard diagram.

## Features

- **Complete Chord Database**: 100+ guitar chords including major, minor, diminished, augmented, suspended, and 7th variations
- **Interactive Fretboard**: Visual representation of chord positions on a guitar neck
- **Search & Filter**: Find chords by name, note, or chord type
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Open Source**: Contribute and improve the chord database

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chord-dictionary.git
   cd chord-dictionary
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (from `backend/` directory)
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:8000`

2. **Start the frontend** (from `frontend/` directory, in a new terminal)
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## API Endpoints

### Get All Chords
```
GET /api/chords
```

### Get Chord by ID
```
GET /api/chords/:id
```

### Search Chords
```
GET /api/chords?search=Am&note=A&type=Minor
```

### Get All Notes
```
GET /api/notes
```

### Get All Chord Types
```
GET /api/types
```

### Get Statistics
```
GET /api/stats
```

## Project Structure

```
chord-dictionary/
├── backend/
│   ├── server.js          # Express server
│   ├── chords-db.js       # Chord database
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS files
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## Available Chords

The database includes chords for all 12 notes with multiple variations:

### Chord Types
- **Major** - Bright, happy sound
- **Minor** - Dark, sad sound
- **Diminished** - Tense, dissonant
- **Augmented** - Raised, unstable
- **Suspended 2** - Open, ringing
- **Suspended 4** - Open, ringing
- **Major 7** - Jazzy major
- **Minor 7** - Jazzy minor
- **Dominant 7** - Blues-y, bluesy

### Notes
C, C#, D, D#, E, F, F#, G, G#, A, A#, B

## How to Read the Fretboard

- **O** - Open string (play without pressing)
- **●** - Fretted note (press your finger on the fret)
- **✕** - Muted string (don't play)

## Contributing

Contributions are welcome! To add more chords or improve the app:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Created as a community contribution to help musicians learn guitar chords.

---

🎸 Happy strumming! 🎸

## Deployment

### Deploy Frontend to GitHub Pages
```bash
cd frontend
npm run build
# Follow GitHub Pages setup instructions
```

### Deploy Backend to Heroku/Vercel
The backend can be deployed to any Node.js hosting provider:
- Heroku
- Vercel
- Railway
- Render

## Support

If you find any issues or have suggestions, please open an issue on GitHub.
