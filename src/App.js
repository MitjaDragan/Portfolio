import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Home from './components/Homepage/Home';
import JigsawPuzzle from './components/Jigsaw Puzzle/JigsawPuzzle';
import Hangman from './components/Hangman/Hangman';
import Certifications from './components/Certifications/Certifications';
import Sudoku from './components/Sudoku/Sudoku';
import Projects from './components/Projects/Projects';
import WorkDiary from './components/WorkDiary/WorkDiary';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jigsaw" element={<JigsawPuzzle />} />
        <Route path="/hangman" element={<Hangman />} />
        <Route path="/sudoku" element={<Sudoku />} />
        <Route path="/certificates" element={<Certifications />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/work-diary" element={<WorkDiary />} />
      </Routes>
    </Router>
  );
}

export default App;
