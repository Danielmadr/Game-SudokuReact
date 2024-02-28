import React from "react";

const Board = ({ grid, onClick, selectedSquare }) => {
  return (
    <div className="board">
      {Array.isArray(grid) &&
        grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.isArray(row) &&
              row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${cell.isInitial ? "initial" : ""} ${
                    selectedSquare &&
                    selectedSquare.row === rowIndex &&
                    selectedSquare.col === colIndex
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => onClick(rowIndex, colIndex)}
                >
                  {cell.value !== 0 ? cell.value : ""}
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default Board;
