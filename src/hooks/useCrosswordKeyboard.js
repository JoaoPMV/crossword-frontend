export function useCrosswordKeyboard({
  gridCells,
  setGridCells,
  inputRefs,
  inputDirection,
  setInputDirection,
  setActiveCellIdx,
  activeCellIdx,
  cols,
}) {
  const updateCell = (index, changes) => {
    setGridCells((currentGrid) =>
      currentGrid.map((cell, cellIndex) =>
        cellIndex === index
          ? {
              ...cell,
              ...changes,
            }
          : cell,
      ),
    );
  };

  const moveFocus = (currentIdx, directionCallback) => {
    let nextIndex = currentIdx;

    while (true) {
      nextIndex = directionCallback(nextIndex);

      if (nextIndex < 0 || nextIndex >= gridCells.length) {
        return;
      }

      const nextCell = gridCells[nextIndex];

      if (nextCell?.solution && nextCell.status !== "correct") {
        inputRefs.current[nextIndex]?.focus();
        return;
      }
    }
  };

  const handleCellClick = (idx) => {
    const cell = gridCells[idx];

    if (!cell?.solution) {
      return;
    }

    setActiveCellIdx(idx);

    if (cell.isPartOfAcrossWord) {
      setInputDirection("across");
      return;
    }

    if (cell.isPartOfDownWord) {
      setInputDirection("down");
    }
  };

  const handleCellChange = (idx, value) => {
    const cell = gridCells[idx];

    if (!cell?.solution || cell.status === "correct") {
      return;
    }

    const letter = value.toUpperCase();
    const status = !letter
      ? "default"
      : letter === cell.solution
        ? "correct"
        : "wrong";

    updateCell(idx, {
      letter,
      status,
    });

    if (letter) {
      moveFocus(
        idx,
        inputDirection === "down"
          ? (index) => index + cols
          : (index) => index + 1,
      );
    }
  };

  const handleKeyboardNavigation = (idx, event) => {
    if (!gridCells[idx]?.solution) {
      return;
    }

    if (event.key === "ArrowRight") {
      moveFocus(idx, (index) => index + 1);
    }

    if (event.key === "ArrowLeft") {
      moveFocus(idx, (index) => index - 1);
    }

    if (event.key === "ArrowDown") {
      moveFocus(idx, (index) => index + cols);
    }

    if (event.key === "ArrowUp") {
      moveFocus(idx, (index) => index - cols);
    }
  };

  const handleKeyboardAndBackspace = (idx, event) => {
    if (gridCells[idx]?.status === "correct") {
      event.preventDefault();
      return;
    }

    if (
      ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      handleKeyboardNavigation(idx, event);
      return;
    }

    if (event.key !== "Backspace" || gridCells[idx]?.letter) {
      return;
    }

    let previousIdx = inputDirection === "down" ? idx - cols : idx - 1;

    while (
      previousIdx >= 0 &&
      (!gridCells[previousIdx]?.solution ||
        gridCells[previousIdx].status === "correct")
    ) {
      previousIdx =
        inputDirection === "down" ? previousIdx - cols : previousIdx - 1;
    }

    if (previousIdx < 0) {
      return;
    }

    updateCell(previousIdx, {
      letter: "",
      status: "default",
    });

    inputRefs.current[previousIdx]?.focus();
    event.preventDefault();
  };

  const handleVirtualKeyPress = (button) => {
    if (activeCellIdx === null) {
      return;
    }

    const currentCell = gridCells[activeCellIdx];

    if (!currentCell?.solution || currentCell.status === "correct") {
      return;
    }

    if (button === "{bksp}") {
      if (currentCell.letter) {
        updateCell(activeCellIdx, {
          letter: "",
          status: "default",
        });

        return;
      }

      let previousIdx =
        inputDirection === "down" ? activeCellIdx - cols : activeCellIdx - 1;

      while (
        previousIdx >= 0 &&
        (!gridCells[previousIdx]?.solution ||
          gridCells[previousIdx].status === "correct")
      ) {
        previousIdx =
          inputDirection === "down" ? previousIdx - cols : previousIdx - 1;
      }

      if (previousIdx >= 0) {
        updateCell(previousIdx, {
          letter: "",
          status: "default",
        });

        setActiveCellIdx(previousIdx);
        inputRefs.current[previousIdx]?.focus();
      }

      return;
    }

    const letter = button.toUpperCase();
    const status = letter === currentCell.solution ? "correct" : "wrong";

    updateCell(activeCellIdx, {
      letter,
      status,
    });

    const nextIdx =
      inputDirection === "down" ? activeCellIdx + cols : activeCellIdx + 1;

    const nextCell = gridCells[nextIdx];

    if (
      nextIdx < gridCells.length &&
      nextCell?.solution &&
      nextCell.status !== "correct"
    ) {
      setActiveCellIdx(nextIdx);
      inputRefs.current[nextIdx]?.focus();
    }
  };

  return {
    handleCellChange,
    handleCellClick,
    handleKeyboardAndBackspace,
    handleVirtualKeyPress,
  };
}
