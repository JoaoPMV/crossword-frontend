export function useCrosswordKeyboard({
  gridCells,
  setGridCells,
  inputRefs,
  inputDirection,
  setActiveCellIdx,
  activeCellIdx,
  cols,
  handleAutoSave,
}) {
  const moveFocus = (currentIdx, directionCallback) => {
    let nextIndex = currentIdx;

    while (true) {
      nextIndex = directionCallback(nextIndex);

      if (nextIndex < 0 || nextIndex >= gridCells.length) return;

      if (
        gridCells[nextIndex]?.solution &&
        gridCells[nextIndex]?.status !== "correct"
      ) {
        inputRefs.current[nextIndex]?.focus();
        return;
      }
    }
  };

  const handleKeyboardNavigation = (idx, e) => {
    if (!gridCells[idx]?.solution) return;

    if (e.key === "ArrowRight") moveFocus(idx, (i) => i + 1);
    if (e.key === "ArrowLeft") moveFocus(idx, (i) => i - 1);
    if (e.key === "ArrowDown") moveFocus(idx, (i) => i + cols);
    if (e.key === "ArrowUp") moveFocus(idx, (i) => i - cols);
  };

  const handleKeyboardAndBackspace = (idx, e) => {
    if (gridCells[idx]?.status === "correct") {
      e.preventDefault();
      return;
    }

    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
      handleKeyboardNavigation(idx, e);
      return;
    }

    if (e.key === "Backspace") {
      if (!gridCells[idx]?.letter) {
        let prevIdx = inputDirection === "down" ? idx - cols : idx - 1;

        while (
          prevIdx >= 0 &&
          (!gridCells[prevIdx]?.solution ||
            gridCells[prevIdx].status === "correct")
        ) {
          prevIdx = inputDirection === "down" ? prevIdx - cols : prevIdx - 1;
        }

        if (prevIdx >= 0) {
          const newGrid = [...gridCells];
          newGrid[prevIdx].letter = "";
          newGrid[prevIdx].status = "default";
          setGridCells(newGrid);
          inputRefs.current[prevIdx]?.focus();
          e.preventDefault();
        }
      }
    }
  };

  const handleVirtualKeyPress = (button) => {
    if (activeCellIdx === null) return;

    const cell = gridCells[activeCellIdx];
    if (!cell?.solution || cell.status === "correct") return;

    const newGrid = [...gridCells];

    if (button === "{bksp}") {
      if (newGrid[activeCellIdx].letter) {
        newGrid[activeCellIdx].letter = "";
        newGrid[activeCellIdx].status = "default";
        setGridCells(newGrid);
        return;
      }

      let prevIdx =
        inputDirection === "down" ? activeCellIdx - cols : activeCellIdx - 1;

      while (
        prevIdx >= 0 &&
        (!gridCells[prevIdx]?.solution ||
          gridCells[prevIdx].status === "correct")
      ) {
        prevIdx = inputDirection === "down" ? prevIdx - cols : prevIdx - 1;
      }

      if (prevIdx >= 0) {
        newGrid[prevIdx].letter = "";
        newGrid[prevIdx].status = "default";
        setGridCells(newGrid);
        setActiveCellIdx(prevIdx);
        inputRefs.current[prevIdx]?.focus();
      }

      return;
    }

    const letter = button.toUpperCase();
    newGrid[activeCellIdx].letter = letter;
    newGrid[activeCellIdx].status =
      letter === cell.solution ? "correct" : "wrong";

    setGridCells(newGrid);

    const nextIdx =
      inputDirection === "down" ? activeCellIdx + cols : activeCellIdx + 1;

    if (
      nextIdx < gridCells.length &&
      gridCells[nextIdx]?.solution &&
      gridCells[nextIdx].status !== "correct"
    ) {
      setActiveCellIdx(nextIdx);
      inputRefs.current[nextIdx]?.focus();
    }

    handleAutoSave();
  };

  return {
    moveFocus,
    handleKeyboardAndBackspace,
    handleVirtualKeyPress,
  };
}
