import React, { useState, useEffect } from 'react';
import './Sudoku.css';

import SudokuGenerator from './SudokuGenerator';

const N = 9;
const K = 40;

const Sudoku = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [lockedCells, setLockedCells] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);

  const generateNewPuzzle = () => {
    const sudoku = new SudokuGenerator(N, K);
    const generatedPuzzle = sudoku.fillValues();
    
    // Create a lockedCells array to mark which cells are initially filled
    const initialLockedCells = generatedPuzzle.map(row => row.map(cell => cell !== 0));
    
    setPuzzle(generatedPuzzle);
    setLockedCells(initialLockedCells); // Set the locked cells
  };

  useEffect(() => {
    generateNewPuzzle();
  }, []);

  const handleInputChange = (row, col, value) => {
    const newPuzzle = [...puzzle];
    if (/^[1-9]$/.test(value)) {
      newPuzzle[row][col] = Number(value);
      setSelectedNumber(Number(value));  // Set the selected number
    } else {
      newPuzzle[row][col] = null;
      setSelectedNumber(null);  // Reset selected number if input is invalid
    }
    setPuzzle(newPuzzle);
  };
  

  return (
    <div className="container">
      <div className="sudoku-grid">
        {puzzle.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={`sudoku-cell 
                  ${lockedCells[rowIndex][colIndex] ? 'locked-cell' : ''} 
                  ${(rowIndex + 1) % 3 === 0 ? 'right-border' : ''}
                  ${cell === selectedNumber ? 'highlight' : ''}`}  // Add highlight class if selected
                type="text"
                maxLength="1"
                value={cell || ''}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                disabled={lockedCells[rowIndex][colIndex]} // Disable only initially generated cells
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={generateNewPuzzle}>New Puzzle</button>
    </div>
  );
  
  
};

export default Sudoku;
