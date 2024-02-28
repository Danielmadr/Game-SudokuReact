// App.js
import React, { useState } from "react";
import Board from "./components/Board";
import "./App.css";

// Função para verificar se é seguro inserir um número em uma determinada posição
const isSafe = (grid, row, col, num) => {
  // Verifica se o número não está presente na mesma linha e coluna
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) {
      return false;
    }
  }

  // Verifica se o número não está presente na subgrade 3x3
  const subgridRowStart = Math.floor(row / 3) * 3;
  const subgridColStart = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[subgridRowStart + i][subgridColStart + j] === num) {
        return false;
      }
    }
  }

  return true;
};

// Função para resolver o Sudoku usando backtracking
const solveSudoku = (grid) => {
  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) {
    // Se não há mais células vazias, o Sudoku está resolvido
    return true;
  }

  const { row, col } = emptyCell;

  // Tentativa de inserir números de 1 a 9
  for (let num = 1; num <= 9; num++) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;

      // Recursivamente tenta resolver o restante do tabuleiro
      if (solveSudoku(grid)) {
        return true;
      }

      // Se a tentativa atual não levou a uma solução, faz o backtracking
      grid[row][col] = 0;
    }
  }

  // Se nenhum número pode ser inserido na célula atual, retorna false
  return false;
};

// Função para encontrar uma célula vazia no tabuleiro
const findEmptyCell = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return { row, col };
      }
    }
  }
  return null;
};

// Função para gerar um jogo de Sudoku aleatório
const generateRandomSudoku = () => {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  // Tenta resolver o Sudoku para gerar um jogo inicial
  solveSudoku(grid);

  // Remove alguns números para torná-lo jogável
  const emptyCells = 40; // Ajuste conforme desejado
  for (let i = 0; i < emptyCells; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    grid[row][col] = 0;
  }

  return grid;
};

const App = () => {
  const [initialGrid, setInitialGrid] = useState([]);
  const [userGrid, setUserGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [solutionGrid, setSolutionGrid] = useState(null);

  const generateRandomGame = () => {
    // Atualiza o estado inicial do tabuleiro com um jogo de Sudoku aleatório
    const newInitialGrid = generateRandomSudoku();
    setInitialGrid(newInitialGrid);

    // Atualiza o estado do tabuleiro do usuário com base no jogo inicial
    setUserGrid(
      newInitialGrid.map((row) =>
        row.map((cell) => ({ value: cell, isInitial: cell !== 0 }))
      )
    );
  };

  const handleCellClick = (row, col) => {
    // Se a célula clicada for vazia, atualiza o estado da célula selecionada
    if (userGrid[row][col].value === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberButtonClick = (num) => {
    // Se uma célula estiver selecionada, atualiza o valor dessa célula
    if (selectedCell) {
      setUserGrid((prevGrid) => {
        const updatedGrid = [...prevGrid];
        updatedGrid[selectedCell.row][selectedCell.col] = {
          value: num,
          isInitial: false,
        };
        return updatedGrid;
      });
    }
  };

  const getSolution = (grid) => {
    const gridCopy = grid.map((row) => row.slice()); // Cria uma cópia do grid antes de resolver
    const solution = solveSudoku(gridCopy);
    return solution ? gridCopy : null;
  };

  const handleSolveButtonClick = () => {
    if (initialGrid && initialGrid.length > 0) {
      const initialGridCopy = initialGrid.map((row) => row.slice()); // Cria uma cópia do grid inicial
      const solution = getSolution(initialGridCopy);

      if (solution) {
        setUserGrid(solution);
        setSolutionGrid(initialGridCopy); // Armazena a solução encontrada
      } else {
        console.log("Não foi possível resolver o Sudoku.");
      }
    }
  };

  return (
    <div className="app">
      <h1>Sudoku React</h1>
      <button onClick={generateRandomGame}>Começar/Reiniciar</button>
      <button onClick={handleSolveButtonClick}>Resolver</button>
      <Board grid={userGrid} onClick={handleCellClick} />

      {selectedCell && (
        <div className="number-buttons">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button key={num} onClick={() => handleNumberButtonClick(num)}>
              {num}
            </button>
          ))}
        </div>
      )}

      {/* Exibe a solução se estiver disponível */}
      {solutionGrid && (
        <div className="solution">
          <h2>Solução:</h2>
          <Board grid={solutionGrid} />
        </div>
      )}
    </div>
  );
};

export default App;
