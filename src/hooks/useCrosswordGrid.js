import { useCallback, useEffect, useMemo, useState } from "react";
import { placeWordsIntoGrid } from "../utils/crosswordGrid";

export function useCrosswordGrid({ words, rows, cols }) {
  const initialGrid = useMemo(() => {
    return placeWordsIntoGrid(rows, cols, words);
  }, [rows, cols, words]);

  const [gridCells, setGridCells] = useState(initialGrid);

  useEffect(() => {
    setGridCells(initialGrid);
  }, [initialGrid]);

  const updateGridCells = useCallback((value) => {
    setGridCells((currentGrid) => {
      return typeof value === "function" ? value(currentGrid) : value;
    });
  }, []);

  const isAllCorrect = useMemo(() => {
    if (!gridCells.length) {
      return false;
    }

    const hasUserInput = gridCells.some((cell) => cell.letter !== "");

    return (
      hasUserInput &&
      gridCells.every((cell) => !cell.solution || cell.status === "correct")
    );
  }, [gridCells]);

  return {
    gridCells,
    setGridCells: updateGridCells,
    isAllCorrect,
  };
}
