import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Home from './components/Home';
import JigsawPuzzle from './components/JigsawPuzzle';
import Hangman from './components/Hangman';
import Certifications from './components/Certifications';
import Sudoku from './components/Sudoku';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/puzzle" element={<JigsawPuzzle />} />
        <Route path="/projects" element={<JigsawPuzzle />} />
        <Route path="/hangman" element={<Hangman />} />
        <Route path="/certificates" element={<Certifications />} />
        <Route path="/sudoku" element={<Sudoku />} />
      </Routes>
    </Router>
  );
}

export default App;
