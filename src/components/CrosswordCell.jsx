import React, { useEffect } from "react";

export default function CrosswordCell({
  cell,
  idx,
  cols,
  inputRefs,
  inputDirection,
  setInputDirection,
  setActiveCellIdx,
  gridCells,
  setGridCells,
  moveFocus,
  handleKeyboardAndBackspace,
  handleAutoSave,
}) {
  const cls = [
    "cell",
    cell.solution ? "in-word" : "",
    cell.status === "correct" ? "correct" : "",
    cell.status === "wrong" ? "wrong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const assignInputRef = (el) => {
    if (el && inputRefs.current) {
      inputRefs.current[idx] = el;
    }
  };

  return (
    <div data-cell={idx} className={cls}>
      {cell.status === "correct" ? (
        <span className="cell-letter">{cell.letter}</span>
      ) : cell.solution ? (
        <input
          type="text"
          maxLength={1}
          className="cell-input"
          value={cell.letter}
          inputMode="none"
          ref={assignInputRef} // Use a função de atribuição
          onKeyDown={(e) => handleKeyboardAndBackspace(idx, e)}
          onClick={() => {
            setActiveCellIdx(idx);

            if (cell.isPartOfAcrossWord) setInputDirection("across");
            else if (cell.isPartOfDownWord) setInputDirection("down");
          }}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            const newGrid = [...gridCells];

            newGrid[idx].letter = value;

            if (value === cell.solution) newGrid[idx].status = "correct";
            else if (value) newGrid[idx].status = "wrong";
            else newGrid[idx].status = "default";

            setGridCells(newGrid);

            if (value) {
              moveFocus(
                idx,
                inputDirection === "down" ? (i) => i + cols : (i) => i + 1
              );
            }

            handleAutoSave();
          }}
        />
      ) : null}
    </div>
  );
}
