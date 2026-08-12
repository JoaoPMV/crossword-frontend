import React from "react";
import CrosswordCell from "./CrosswordCell";

export default function CrosswordGrid({
  gridCells,
  rows,
  cols,
  inputRefs,
  inputDirection,
  setInputDirection,
  setActiveCellIdx,
  setGridCells,
  moveFocus,
  handleKeyboardAndBackspace,
}) {
  return (
    <div
      className="crossword-grid"
      role="grid"
      aria-label={`Palavras cruzadas ${rows}x${cols}`}
    >
      {gridCells.map((cell, idx) => (
        <CrosswordCell
          key={idx}
          cell={cell}
          idx={idx}
          cols={cols}
          inputRefs={inputRefs}
          inputDirection={inputDirection}
          setInputDirection={setInputDirection}
          setActiveCellIdx={setActiveCellIdx}
          gridCells={gridCells}
          setGridCells={setGridCells}
          moveFocus={moveFocus}
          handleKeyboardAndBackspace={handleKeyboardAndBackspace}
        />
      ))}
    </div>
  );
}
