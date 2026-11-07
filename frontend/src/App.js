import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ChordList from './components/ChordList';
import ChordDetail from './components/ChordDetail';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function App() {
  const [chords, setChords] = useState([]);
  const [selectedChord, setSelectedChord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load filter options once
  useEffect(() => {
    fetchNotes();
    fetchTypes();
  }, []);

  // Fetch chords whenever a filter changes (search is debounced)
  useEffect(() => {
    const timer = setTimeout(fetchChords, 200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedNote, selectedType]);

  const fetchChords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (selectedNote) params.append('note', selectedNote);
      if (selectedType) params.append('type', selectedType);

      const response = await axios.get(`${API_URL}/chords?${params}`);
      setChords(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching chords:', err);
      setError('Failed to load chords');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/types`);
      setTypes(response.data);
    } catch (err) {
      console.error('Error fetching types:', err);
    }
  };

  const handleSelectChord = (chord) => {
    setSelectedChord(chord);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedNote('');
    setSelectedType('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎸 Chord Dictionary</h1>
        <p>Guitar chord reference: 12 keys, 15 chord types, CAGED shapes, every voicing checked</p>
      </header>

      <main className="App-main">
        <div className="left-panel">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <FilterBar
            notes={notes}
            types={types}
            selectedNote={selectedNote}
            selectedType={selectedType}
            onNoteChange={setSelectedNote}
            onTypeChange={setSelectedType}
            onClearFilters={handleClearFilters}
          />

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading chords...</div>
          ) : (
            <ChordList
              chords={chords}
              selectedChord={selectedChord}
              onSelectChord={handleSelectChord}
            />
          )}
        </div>

        <div className="right-panel">
          {selectedChord ? (
            <ChordDetail key={selectedChord.id} chord={selectedChord} />
          ) : (
            <div className="no-selection">
              <p>Select a chord to view details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
