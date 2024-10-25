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
  const [isMobile, setIsMobile] = useState(false); // Track if device is mobile

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
  };

  useEffect(() => {
    generateNewPuzzle();

    // Check if the user is on a mobile device
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
      handleInputChange(row, col, number.toString());
    }
  };

  const handleInputChange = (row, col, value) => {
    if (gameOver || lockedCells[row][col]) return;

    const newPuzzle = [...puzzle];
    const newIncorrectCells = [...incorrectCells];

    if (/^[1-9]$/.test(value)) {
      newPuzzle[row][col] = Number(value);
      
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

  return (
    <div className="sudoku-container">
      <div className="sudoku-grid">
        {puzzle.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={`sudoku-cell 
                  ${lockedCells[rowIndex][colIndex] ? 'locked-cell' : ''} 
                  ${incorrectCells[rowIndex][colIndex] ? 'incorrect-cell' : ''}
                  ${(rowIndex + 1) % 3 === 0 && (rowIndex + 1) !== 9 ? 'right-border' : ''} 
                  ${(colIndex + 1) % 3 === 0 && (colIndex + 1) !== 9 ? 'bottom-border' : ''} 
                  ${selectedCell.row === rowIndex && selectedCell.col === colIndex ? 'selected-cell' : ''}
                  ${selectedCell.row === rowIndex || selectedCell.col === colIndex ? 'highlight-row-col' : ''}
                  ${cell === puzzle[selectedCell.row]?.[selectedCell.col] && cell !== 0 ? 'highlight-same-number' : ''}`}
                type="text"
                maxLength="1"
                value={cell || ''}
                readOnly={isMobile || lockedCells[rowIndex][colIndex]} // Set readOnly for mobile and locked cells
                onClick={() => handleCellClick(rowIndex, colIndex)} 
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)} // Allow direct input on non-mobile
              />
            ))}
          </div>
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
