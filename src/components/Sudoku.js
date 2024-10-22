import React, { useState, useEffect } from 'react';
import './Sudoku.css';

import SudokuGenerator from './SudokuGenerator';

const N = 9;
const K = 40;

const Sudoku = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [lockedCells, setLockedCells] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });

  const generateNewPuzzle = () => {
    const sudoku = new SudokuGenerator(N, K);
    const generatedPuzzle = sudoku.fillValues();
    
    const initialLockedCells = generatedPuzzle.map(row => row.map(cell => cell !== 0));
    
    setPuzzle(generatedPuzzle);
    setLockedCells(initialLockedCells);
    setSelectedCell({ row: null, col: null }); // Reset the selected cell when generating a new puzzle
  }  
  
  useEffect(() => {
    generateNewPuzzle();
  }, []);

  const handleInputChange = (row, col, value) => {
    // Only allow changing unlocked cells
    if (!lockedCells[row][col]) {
      const newPuzzle = [...puzzle];
      if (/^[1-9]$/.test(value)) {
        newPuzzle[row][col] = Number(value);
      } else {
        newPuzzle[row][col] = null;
      }
      setPuzzle(newPuzzle);
    }
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
      ${(rowIndex + 1) % 3 === 0 && (rowIndex + 1) !== 9 ? 'right-border' : ''}
      ${(colIndex + 1) % 3 === 0 && (colIndex + 1) !== 9 ? 'bottom-border' : ''}
      ${(selectedCell.row !== null && rowIndex === selectedCell.row && colIndex === selectedCell.col) ? 'selected-cell' : ''}
      ${(selectedCell.row !== null && (rowIndex === selectedCell.row || colIndex === selectedCell.col)) ? 'highlight-row-col' : ''}
      ${(selectedCell.row !== null && cell === puzzle[selectedCell.row][selectedCell.col] && cell !== 0) ? 'highlight-same-number' : ''}`}  // Highlight matching numbers
    type="text"
    maxLength="1"
    value={cell || ''}
    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)} // Handle change for unlocked cells only
    onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })} // Allow any cell to be selected
    readOnly={lockedCells[rowIndex][colIndex]}  // Use readOnly instead of disabled for locked cells
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
