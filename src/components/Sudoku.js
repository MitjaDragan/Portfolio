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
  const [errors, setErrors] = useState(0); // Track number of errors
  const [gameOver, setGameOver] = useState(false); // Track game over state
  const inputRefs = useRef([]); // Keep track of input refs for focusing

  const maxErrors = 3; // Max allowed errors before game over

  const generateNewPuzzle = () => {
    const sudoku = new SudokuGenerator(N, K);
    const generatedPuzzle = sudoku.fillValues();
    
    const initialLockedCells = generatedPuzzle.map(row => row.map(cell => cell !== 0));
    
    setPuzzle(generatedPuzzle);
    setLockedCells(initialLockedCells);
    setSolution(sudoku.solution); // Save the correct solution
    setIncorrectCells(Array(N).fill().map(() => Array(N).fill(false))); // Initialize incorrect cells tracking
    setSelectedCell({ row: null, col: null }); // Reset selected cell
    setErrors(0); // Reset error counter
    setGameOver(false); // Reset game over state
  };  
  
  useEffect(() => {
    generateNewPuzzle();
  }, []);

  const handleInputChange = (row, col, value) => {
    // Do nothing if the game is over or if the cell is locked
    if (gameOver || lockedCells[row][col]) return;

    const newPuzzle = [...puzzle];
    const newIncorrectCells = [...incorrectCells];

    if (/^[1-9]$/.test(value)) {
      newPuzzle[row][col] = Number(value);
      
      // Validate against the correct solution
      if (Number(value) !== solution[row][col]) {
        newIncorrectCells[row][col] = true; // Mark the cell as incorrect
        const newErrors = errors + 1;
        setErrors(newErrors); // Increment the error counter

        // Check if the game should be over
        if (newErrors >= maxErrors) {
          setGameOver(true);
          alert("Game Over! You made 3 mistakes.");
        }
      } else {
        newIncorrectCells[row][col] = false; // Clear the incorrect state if correct
      }
    } else {
      newPuzzle[row][col] = null; // Clear the cell if the input is not valid
      newIncorrectCells[row][col] = false; // Clear incorrect status when cleared
    }

    setPuzzle(newPuzzle);
    setIncorrectCells(newIncorrectCells); // Update incorrect cells
  };

  const handleCellClick = (row, col) => {
    if (gameOver) return; // Prevent further interaction if the game is over
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
      <div className="status-bar">
        <div className="error-container">
          <div className="error-progress">
            <div className="error-bar" style={{ width: `${(errors / maxErrors) * 100}%` }}></div>
          </div>
        </div>
        <button className="reset-button" onClick={generateNewPuzzle}>New Puzzle</button>
      </div>
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
                disabled={gameOver} // Disable inputs if the game is over
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sudoku;
