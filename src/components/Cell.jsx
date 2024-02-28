// components/Cell.js
import React from "react";

const Cell = ({ value, onClick, isInitial }) => {
  const handleClick = () => {
    if (!isInitial) {
      onClick();
    }
  };

  return (
    <div className={`cell ${isInitial ? "initial" : ""}`} onClick={handleClick}>
      {value !== 0 && value}
    </div>
  );
};

export default Cell;
