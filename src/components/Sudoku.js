import React, { useState } from 'react';
import './Sudoku.css';

const generateSudokuPuzzle = () => {
  return [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ];
};

const Sudoku = () => {
  const [puzzle, setPuzzle] = useState(generateSudokuPuzzle());

  const handleInputChange = (row, col, value) => {
    const newPuzzle = [...puzzle];
    if (/^[1-9]$/.test(value)) {
      newPuzzle[row][col] = Number(value);
    } else {
      newPuzzle[row][col] = null;
    }
    setPuzzle(newPuzzle);
  };

  return (
    <div class="container">
        <div className="sudoku-grid">
        {puzzle.map((row, rowIndex) => (
            <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
                <input
                key={`${rowIndex}-${colIndex}`}
                className="sudoku-cell"
                type="text"
                maxLength="1"
                value={cell || ''}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                disabled={cell !== null} // Disable pre-filled cells
                />
            ))}
            </div>
        ))}
        </div>
        <button onClick={() => setPuzzle(generateSudokuPuzzle())}>New Puzzle</button>
    </div>
  );
};

export default Sudoku;
