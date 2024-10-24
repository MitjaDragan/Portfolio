import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.css';

import SudokuGenerator from './SudokuGenerator';

const N = 9;
const K = 40;

const Sudoku = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [lockedCells, setLockedCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [solution, setSolution] = useState([]); // Store the correct solution
  const [incorrectCells, setIncorrectCells] = useState([]); // Track incorrect cells
  const inputRefs = useRef([]); // Keep track of input refs for focusing

  const generateNewPuzzle = () => {
    const sudoku = new SudokuGenerator(N, K);
    const generatedPuzzle = sudoku.fillValues();
    
    const initialLockedCells = generatedPuzzle.map(row => row.map(cell => cell !== 0));
    
    setPuzzle(generatedPuzzle);
    setLockedCells(initialLockedCells);
    setSolution(sudoku.solution); // Save the correct solution
    setIncorrectCells(Array(N).fill().map(() => Array(N).fill(false))); // Initialize incorrect cells tracking
    setSelectedCell({ row: null, col: null }); // Reset selected cell
  };  
  
  useEffect(() => {
    generateNewPuzzle();
  }, []);

  const handleInputChange = (row, col, value) => {
    // Only allow changing unlocked cells
    if (!lockedCells[row][col]) {
      const newPuzzle = [...puzzle];
      const newIncorrectCells = [...incorrectCells];

      if (/^[1-9]$/.test(value)) {
        newPuzzle[row][col] = Number(value);
        
        // Validate against the correct solution
        if (Number(value) !== solution[row][col]) {
          newIncorrectCells[row][col] = true; // Mark the cell as incorrect
        } else {
          newIncorrectCells[row][col] = false; // Clear the incorrect state if correct
        }
      } else {
        newPuzzle[row][col] = null; // Clear the cell if the input is not valid
        newIncorrectCells[row][col] = false; // Clear incorrect status when cleared
      }

      setPuzzle(newPuzzle);
      setIncorrectCells(newIncorrectCells); // Update incorrect cells
    }
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col }); // Select the clicked cell
    if (inputRefs.current[`${row}-${col}`]) {
      inputRefs.current[`${row}-${col}`].focus(); // Auto-focus the clicked cell
    }
  };

  const handleCellKeyPress = (row, col, e) => {
    // Only clear the cell when a new number is typed
    if (!lockedCells[row][col] && /^[1-9]$/.test(e.key)) {
      const newPuzzle = [...puzzle];
      newPuzzle[row][col] = ''; // Clear the cell for new input
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
                ref={(el) => inputRefs.current[`${rowIndex}-${colIndex}`] = el} // Save ref for auto-focus
                className={`sudoku-cell 
                  ${lockedCells[rowIndex][colIndex] ? 'locked-cell' : ''} 
                  ${incorrectCells[rowIndex][colIndex] ? 'incorrect-cell' : ''}  // Highlight incorrect cells
                  ${(rowIndex + 1) % 3 === 0 && (rowIndex + 1) !== 9 ? 'right-border' : ''}
                  ${(colIndex + 1) % 3 === 0 && (colIndex + 1) !== 9 ? 'bottom-border' : ''}
                  ${(selectedCell.row !== null && rowIndex === selectedCell.row && colIndex === selectedCell.col) ? 'selected-cell' : ''}
                  ${(selectedCell.row !== null && (rowIndex === selectedCell.row || colIndex === selectedCell.col)) ? 'highlight-row-col' : ''}
                  ${(selectedCell.row !== null && cell === puzzle[selectedCell.row][selectedCell.col] && cell !== 0) ? 'highlight-same-number' : ''}`}  // Highlight matching numbers
                type="text"
                maxLength="1"
                value={cell || ''}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)} // Handle change for unlocked cells only
                onClick={() => handleCellClick(rowIndex, colIndex)} // Allow any cell to be selected
                onKeyDown={(e) => handleCellKeyPress(rowIndex, colIndex, e)} // Clear only when typing a valid number
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
