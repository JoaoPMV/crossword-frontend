import { useState, useEffect, useRef, useMemo } from "react";

/* helpers do grid */
function idxToRC(idx, cols) {
  return { r: Math.floor(idx / cols), c: idx % cols };
}

function rcToIdx(r, c, cols) {
  return r * cols + c;
}

function getIndicesForWord(startCell, dir, length, rows, cols) {
  const startIdx = startCell - 1;
  const { r, c } = idxToRC(startIdx, cols);
  const indices = [];

  if (dir === "across") {
    for (let i = 0; i < length; i++) {
      indices.push(rcToIdx(r, c + i, cols));
    }
  }

  if (dir === "down") {
    for (let i = 0; i < length; i++) {
      indices.push(rcToIdx(r + i, c, cols));
    }
  }

  return indices;
}

export function placeWordsIntoGrid(rows, cols, words) {
  const grid = Array.from({ length: rows * cols }).map(() => ({
    letter: "",
    solution: null,
    status: "default",
    number: null,
    isPartOfAcrossWord: false,
    isPartOfDownWord: false,
  }));

  (words || []).forEach((w) => {
    const answer = w.answer.toUpperCase();
    const indices = getIndicesForWord(
      w.startCell,
      w.dir,
      answer.length,
      rows,
      cols
    );

    indices.forEach((idx, i) => {
      grid[idx].solution = answer[i];
      if (w.dir === "across") grid[idx].isPartOfAcrossWord = true;
      if (w.dir === "down") grid[idx].isPartOfDownWord = true;
    });
  });

  return grid;
}

/* HOOK */
export function useCrosswordGrid({ levels, currentLevelIdx, rows, cols }) {
  const congratsAudioRef = useRef(new Audio("/audios/congratulation.mp3"));

  const initialGrid = useMemo(() => {
    // garante que levels seja sempre array
    const safeLevels = Array.isArray(levels) ? levels : [];
    // garante que currentLevelIdx seja um índice válido
    const level =
      safeLevels[currentLevelIdx] &&
      typeof safeLevels[currentLevelIdx] === "object"
        ? safeLevels[currentLevelIdx]
        : { words: [] };
    // garante que words seja sempre array
    const words = Array.isArray(level.words) ? level.words : [];
    return placeWordsIntoGrid(rows, cols, words);
  }, [levels, currentLevelIdx, rows, cols]);

  // Estado mutável para edições pelo usuário
  const [gridCells, setGridCells] = useState(initialGrid);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  // Atualiza o estado quando muda o nível ou levels
  useEffect(() => {
    setGridCells(initialGrid);
  }, [initialGrid]);

  // Verifica se todas as células estão corretas
  useEffect(() => {
    if (!Array.isArray(gridCells) || !gridCells.length) return;

    const allCorrect = gridCells.every(
      (cell) => !cell.solution || cell.status === "correct"
    );

    setIsAllCorrect(allCorrect);

    if (allCorrect) {
      congratsAudioRef.current.play().catch(() => {});
    }
  }, [gridCells]);

  return {
    gridCells,
    setGridCells,
    isAllCorrect,
  };
}
