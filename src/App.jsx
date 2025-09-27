import React, { useState, useEffect } from 'react';

const SudokuSolver = () => {
  const [gridSize, setGridSize] = useState(9);
  const [grid, setGrid] = useState(() =>
    Array(gridSize).fill().map(() => Array(gridSize).fill(0))
  );
  const [isSolving, setIsSolving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setGrid(Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
    setMessage('');
  }, [gridSize]);

  // Handle cell input
  const handleCellChange = (row, col, value) => {
    const num = parseInt(value) || 0;
    const maxValue = gridSize;
    if (num >= 0 && num <= maxValue) {
      const newGrid = grid.map(row => [...row]);
      newGrid[row][col] = num;
      setGrid(newGrid);
    }
  };

  // Validate Sudoku rules
  const isValid = (board, row, col, num) => {
    // Check row
    for (let x = 0; x < gridSize; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < gridSize; x++) {
      if (board[x][col] === num) return false;
    }

    // Check sub-grid
    const boxSize = Math.sqrt(gridSize);
    const boxStartRow = row - (row % boxSize);
    const boxStartCol = col - (col % boxSize);

    for (let i = 0; i < boxSize; i++) {
      for (let j = 0; j < boxSize; j++) {
        if (board[boxStartRow + i][boxStartCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  };

  // Find empty cell
  const findEmptyCell = (board) => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  };

  // Backtracking algorithm
  const solveSudoku = (board) => {
    const emptyCell = findEmptyCell(board);

    if (!emptyCell) return true;

    const [row, col] = emptyCell;

    for (let num = 1; num <= gridSize; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;

        if (solveSudoku(board)) {
          return true;
        }

        board[row][col] = 0;
      }
    }

    return false;
  };

  // Solve button handler
  const handleSolve = () => {
    setIsSolving(true);
    setMessage('Solving...');

    const gridCopy = grid.map(row => [...row]);

    setTimeout(() => {
      if (solveSudoku(gridCopy)) {
        setGrid(gridCopy);
        setMessage('Puzzle solved successfully! 🎉');
      } else {
        setMessage('No solution exists for this puzzle 😕');
      }
      setIsSolving(false);
    }, 10);
  };

  // Clear grid
  const handleClear = () => {
    setGrid(Array(gridSize).fill().map(() => Array(gridSize).fill(0)));
    setMessage('');
  };

  // Load sample puzzle
  const loadSamplePuzzle = () => {
    if (gridSize === 9) {
      const sample = [
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 6, 0, 0, 0, 0, 0],
        [0, 7, 0, 0, 9, 0, 2, 0, 0],
        [0, 5, 0, 0, 0, 7, 0, 0, 0],
        [0, 0, 0, 0, 4, 5, 7, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 3, 0],
        [0, 0, 1, 0, 0, 0, 0, 6, 8],
        [0, 0, 8, 5, 0, 0, 0, 1, 0],
        [0, 9, 0, 0, 0, 0, 4, 0, 0]
      ];
      setGrid(sample);
    } else {
      const sample = [
        [0, 2, 4, 0],
        [1, 0, 0, 3],
        [4, 0, 0, 2],
        [0, 1, 3, 0]
      ];
      setGrid(sample);
    }
    setMessage('Sample puzzle loaded');
  };

  const boxSize = Math.sqrt(gridSize);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        Sudoku Solver - Backtracking Algorithm
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Grid Size:
          <select
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="4">4x4 (Mini Sudoku)</option>
            <option value="9">9x9 (Standard Sudoku)</option>
          </select>
        </label>
      </div>

      <div
        style={{
          display: 'inline-block',
          border: '2px solid black',
          marginBottom: '20px'
        }}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={cell === 0 ? '' : cell}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                disabled={isSolving}
                style={{
                  width: '40px',
                  height: '40px',
                  textAlign: 'center',
                  fontSize: '18px',
                  borderRight: (colIndex + 1) % boxSize === 0 && colIndex !== gridSize - 1
                    ? '2px solid black' : '1px solid #ccc',
                  borderBottom: (rowIndex + 1) % boxSize === 0 && rowIndex !== gridSize - 1
                    ? '2px solid black' : '1px solid #ccc',
                  borderLeft: colIndex === 0 ? 'none' : '1px solid #ccc',
                  borderTop: rowIndex === 0 ? 'none' : '1px solid #ccc',
                  backgroundColor: cell === 0 ? 'white' : '#f0f0f0'
                }}
                maxLength="1"
              />
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleSolve}
          disabled={isSolving}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            fontSize: '16px',
            cursor: isSolving ? 'not-allowed' : 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {isSolving ? 'Solving...' : 'Solve'}
        </button>

        <button
          onClick={handleClear}
          disabled={isSolving}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            fontSize: '16px',
            cursor: isSolving ? 'not-allowed' : 'pointer',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Clear
        </button>

        <button
          onClick={loadSamplePuzzle}
          disabled={isSolving}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: isSolving ? 'not-allowed' : 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Load Sample
        </button>
      </div>

      {message && (
        <div style={{
          padding: '10px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SudokuSolver;