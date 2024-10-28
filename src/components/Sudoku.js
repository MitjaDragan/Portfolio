import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.css';
import SudokuGenerator from './SudokuGenerator';

const N = 9;
const K = 40;

const Sudoku = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [lockedCells, setLockedCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [solution, setSolution] = useState([]);
  const [incorrectCells, setIncorrectCells] = useState([]);
  const [errors, setErrors] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [noteMode, setNoteMode] = useState(false);
  const [notes, setNotes] = useState(
    Array(N).fill().map(() => Array(N).fill().map(() => new Set()))
  );

  const maxErrors = 3;

  const generateNewPuzzle = () => {
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
  };

  useEffect(() => {
    generateNewPuzzle();

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    setIsMobile(isMobileDevice);
  }, []);

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
    const newNotes = [...notes];
    if (newNotes[row][col].has(number)) {
      newNotes[row][col].delete(number);
    } else {
      newNotes[row][col].add(number);
    }
    setNotes(newNotes);
  };

  const handleInputChange = (row, col, value) => {
    if (gameOver || lockedCells[row][col]) return;

    const newPuzzle = [...puzzle];
    const newIncorrectCells = [...incorrectCells];

    if (/^[1-9]$/.test(value)) {
      newPuzzle[row][col] = Number(value);
      notes[row][col].clear();
      
      if (Number(value) !== solution[row][col]) {
        newIncorrectCells[row][col] = true;
        const newErrors = errors + 1;
        setErrors(newErrors);

        if (newErrors >= maxErrors) {
          setGameOver(true);
          alert("Game Over! You made 3 mistakes.");
          return;
        }
      } else {
        newIncorrectCells[row][col] = false;
      }

      setPuzzle(newPuzzle);
      setIncorrectCells(newIncorrectCells);

      if (checkVictory(newPuzzle)) {
        setGameOver(true);
        alert("Congratulations! You have won the game!");
      }
    }
  };

  const handleCellClick = (row, col) => {
    if (gameOver) return;
    setSelectedCell({ row, col });
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
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, lockedCells, noteMode]);

  return (
    <div className="sudoku-container">
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
        <button className="tool-button"><i className="fa fa-undo"></i></button>
        <button className="tool-button"><i className="fa fa-trash"></i></button>
        <button className="tool-button"><i className="fa fa-lightbulb"></i></button>
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

      <div className="status-bar">
        <div className="error-container">
          <div className="error-progress">
            <div className="error-bar" style={{ width: `${(errors / maxErrors) * 100}%` }}></div>
          </div>
        </div>
        <button className="reset-button" onClick={generateNewPuzzle}>New Puzzle</button>
      </div>
    </div>
  );
};

export default Sudoku;
