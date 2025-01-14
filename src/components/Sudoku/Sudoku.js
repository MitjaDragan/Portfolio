import React, { useState, useEffect, useRef } from 'react';
import SudokuGenerator from './SudokuGenerator';

import './Sudoku.css';

const N = 9;

const Sudoku = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [lockedCells, setLockedCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [solution, setSolution] = useState([]);
  const [incorrectCells, setIncorrectCells] = useState([]);
  const [errors, setErrors] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [noteMode, setNoteMode] = useState(false);
  const [notes, setNotes] = useState(() => Array(N).fill().map(() => Array(N).fill().map(() => new Set())));
  const [history, setHistory] = useState([]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const maxErrors = 3;

  const generateNewPuzzle = () => {
    let K;

    switch (difficulty) {
      case 'Insane':
        K = 60;
        break;
      case 'Hard':
        K = 50;
        break;
      case 'Medium':
        K = 40;
        break;
      case 'Easy':
        K = 30;
        break;
      default:
        K = 40;
    }
    const sudoku = new SudokuGenerator(N, K);
    const generatedPuzzle = sudoku.fillValues();
    const initialLockedCells = generatedPuzzle.map(row => row.map(cell => cell !== 0));
    
    setPuzzle(generatedPuzzle);
    setLockedCells(initialLockedCells);
    setSolution(sudoku.solution);
    setIncorrectCells(Array(N).fill().map(() => Array(N).fill(false)));
    setSelectedCell({ row: null, col: null });
    setErrors(0);
    setGameOver(false);
    setNotes(Array(N).fill().map(() => Array(N).fill().map(() => new Set())));
    setHistory([]);
    setTimer(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    generateNewPuzzle();
  }, [difficulty]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const checkVictory = (puzzle) => {
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        if (puzzle[row][col] !== solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleNumberClick = (number) => {
    const { row, col } = selectedCell;
    if (row !== null && col !== null && !lockedCells[row][col]) {
      if (noteMode) {
        toggleNote(row, col, number);
      } else {
        handleInputChange(row, col, number.toString());
      }
    }
  };

  const toggleNote = (row, col, number) => {
    const newNotes = notes.map(row => row.map(cell => new Set(cell)));
    if (newNotes[row][col].has(number)) {
      newNotes[row][col].delete(number);
    } else {
      newNotes[row][col].add(number);
    }
    setNotes(newNotes);
  };

  const clearNotesForNumber = (row, col, number, currentNotes) => {
    const newNotes = currentNotes.map(row => row.map(cell => new Set(cell)));
  
    for (let c = 0; c < N; c++) {
      if (c !== col) {
        newNotes[row][c].delete(number);
      }
    }
  
    for (let r = 0; r < N; r++) {
      if (r !== row) {
        newNotes[r][col].delete(number);
      }
    }
  
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
      for (let c = boxColStart; c < boxColStart + 3; c++) {
        if (r !== row || c !== col) {
          newNotes[r][c].delete(number);
        }
      }
    }
  
    return newNotes;
  };

  const handleInputChange = (row, col, value) => {
    if (gameOver || lockedCells[row][col]) return;
  
    setHistory([...history, { 
      puzzle: JSON.parse(JSON.stringify(puzzle)), 
      notes: notes.map(row => row.map(cell => Array.from(cell))) 
    }]);
  
    const newPuzzle = [...puzzle];
    const newIncorrectCells = [...incorrectCells];
    let newNotes = notes.map(row => row.map(cell => new Set(cell)));
  
    if (/^[1-9]$/.test(value)) {
      const num = Number(value);
      newPuzzle[row][col] = num;
      newNotes[row][col].clear();
  
      newNotes = clearNotesForNumber(row, col, num, newNotes);
  
      if (num !== solution[row][col]) {
        newIncorrectCells[row][col] = true;
        const newErrors = errors + 1;
        setErrors(newErrors);
  
        if (newErrors >= maxErrors) {
          setGameOver(true);
          clearInterval(timerRef.current);
          alert("Game Over! You made 3 mistakes.");
          return;
        }
      } else {
        newIncorrectCells[row][col] = false;
      }
  
      setPuzzle(newPuzzle);
      setIncorrectCells(newIncorrectCells);
      setNotes(newNotes);
  
      if (checkVictory(newPuzzle)) {
        setGameOver(true);
        clearInterval(timerRef.current);
        alert("Congratulations! You have won the game!");
      }
    }
  };

  const handleCellClick = (row, col) => {
    if (gameOver) return;
    setSelectedCell({ row, col });
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setPuzzle(lastState.puzzle);
      setNotes(lastState.notes.map(row => row.map(cell => new Set(cell))));
      setHistory(history.slice(0, -1));
    }
  };

  const handleDelete = () => {
    const { row, col } = selectedCell;
    if (row !== null && col !== null && !lockedCells[row][col]) {
      setHistory([...history, { puzzle: JSON.parse(JSON.stringify(puzzle)), notes: notes.map(row => row.map(cell => Array.from(cell))) }]);

      const newPuzzle = [...puzzle];
      const newIncorrectCells = [...incorrectCells];
      const newNotes = notes.map(row => row.map(cell => new Set(cell)));
      
      newPuzzle[row][col] = null;
      newIncorrectCells[row][col] = false;
      newNotes[row][col].clear();

     


      setPuzzle(newPuzzle);
      setIncorrectCells(newIncorrectCells);
    }
  };

  const handleHint = () => {
    const { row, col } = selectedCell;
    if (row !== null && col !== null && !lockedCells[row][col]) {
      setHistory([...history, JSON.parse(JSON.stringify(puzzle))]);
  
      const newPuzzle = [...puzzle];
      let newNotes = [...notes];
      const hintNumber = solution[row][col];
  
      newPuzzle[row][col] = hintNumber;
      newNotes[row][col].clear();
      newNotes = clearNotesForNumber(row, col, hintNumber, newNotes);
  
      setPuzzle(newPuzzle);
      setNotes(newNotes);
    }
  };

  const handleKeyDown = (e) => {
    const { row, col } = selectedCell;
    if (row === null || col === null || lockedCells[row][col]) return;
  
    if (/^[1-9]$/.test(e.key)) {
      const number = parseInt(e.key, 10);
      if (noteMode) {
        toggleNote(row, col, number);
      } else {
        handleInputChange(row, col, e.key);
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleDelete();
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, lockedCells, noteMode]);

  return (
    <div className="sudoku-container">
      <div className="difficulty-selection">
        {['Easy', 'Medium', 'Hard', 'Insane'].map(level => (
          <button key={level} onClick={() => setDifficulty(level)} className={`difficulty-button ${difficulty === level ? 'active' : ''}`}>
            {level}
          </button>
        ))}
        <div className="timer">{formatTime(timer)}</div>
      </div>
      <div className="sudoku-grid">
        {puzzle.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`sudoku-cell 
                  ${lockedCells[rowIndex][colIndex] ? 'locked-cell' : ''} 
                  ${incorrectCells[rowIndex][colIndex] ? 'incorrect-cell' : ''}
                  ${(rowIndex + 1) % 3 === 0 && (rowIndex + 1) !== 9 ? 'right-border' : ''} 
                  ${(colIndex + 1) % 3 === 0 && (colIndex + 1) !== 9 ? 'bottom-border' : ''} 
                  ${selectedCell.row === rowIndex && selectedCell.col === colIndex ? 'selected-cell' : ''}
                  ${selectedCell.row === rowIndex || selectedCell.col === colIndex ? 'highlight-row-col' : ''}
                  ${cell === puzzle[selectedCell.row]?.[selectedCell.col] && cell !== 0 ? 'highlight-same-number' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell ? (
                  <span>{cell}</span>
                ) : (
                  <div className="notes">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <span
                        key={num}
                        className={`note ${notes[rowIndex][colIndex].has(num) ? 'active-note' : ''}`}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="tool-bar">
        <div className="error-container">
          <div className="error-progress">
            <div className="error-bar" style={{ width: `${(errors / maxErrors) * 100}%` }}></div>
          </div>
        </div>
        <button onClick={handleUndo} className="tool-button"><i className="fa fa-undo"></i></button>
        <button onClick={handleDelete} className="tool-button"><i className="fa fa-trash"></i></button>
        <button onClick={handleHint} className="tool-button"><i className="fa fa-lightbulb"></i></button>
        <button onClick={() => setNoteMode(!noteMode)} className="tool-button">
          <i className={`fa fa-pencil ${noteMode ? 'active' : ''}`}></i>
        </button>
      </div>

      <div className="number-selection">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className="number-button"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </button>
        ))}
      </div>

    </div>
  );
};

export default Sudoku;
