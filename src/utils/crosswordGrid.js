function createEmptyCell() {
  return {
    letter: "",
    solution: null,
    status: "default",
    number: null,
    isPartOfAcrossWord: false,
    isPartOfDownWord: false,
  };
}

function createEmptyGrid(rows, cols) {
  return Array.from({ length: rows * cols }, createEmptyCell);
}

function idxToRowAndColumn(index, cols) {
  return {
    row: Math.floor(index / cols),
    column: index % cols,
  };
}

function rowAndColumnToIdx(row, column, cols) {
  return row * cols + column;
}

function getWordIndices({ startCell, direction, length, rows, cols }) {
  const startIndex = startCell - 1;

  if (
    !Number.isInteger(startCell) ||
    startIndex < 0 ||
    startIndex >= rows * cols
  ) {
    return null;
  }

  if (!["across", "down"].includes(direction) || length === 0) {
    return null;
  }

  const { row, column } = idxToRowAndColumn(startIndex, cols);

  if (direction === "across" && column + length > cols) {
    return null;
  }

  if (direction === "down" && row + length > rows) {
    return null;
  }

  return Array.from({ length }, (_, offset) => {
    const targetRow = direction === "down" ? row + offset : row;
    const targetColumn = direction === "across" ? column + offset : column;

    return rowAndColumnToIdx(targetRow, targetColumn, cols);
  });
}

function canPlaceWord(grid, indices, answer) {
  return indices.every((index, position) => {
    const existingSolution = grid[index].solution;

    return !existingSolution || existingSolution === answer[position];
  });
}

function placeWordInGrid(grid, word, indices, answer) {
  indices.forEach((index, position) => {
    const currentCell = grid[index];

    currentCell.solution = answer[position];

    if (word.dir === "across") {
      currentCell.isPartOfAcrossWord = true;
    }

    if (word.dir === "down") {
      currentCell.isPartOfDownWord = true;
    }
  });
}

export function placeWordsIntoGrid(rows, cols, words) {
  const grid = createEmptyGrid(rows, cols);

  if (!Array.isArray(words)) {
    return grid;
  }

  words.forEach((word) => {
    const answer = String(word?.answer || "")
      .trim()
      .toUpperCase();

    const indices = getWordIndices({
      startCell: word?.startCell,
      direction: word?.dir,
      length: answer.length,
      rows,
      cols,
    });

    if (!indices) {
      console.warn("Palavra ignorada: posição inválida no grid.", word);
      return;
    }

    if (!canPlaceWord(grid, indices, answer)) {
      console.warn("Palavra ignorada: conflito de letras no grid.", word);
      return;
    }

    placeWordInGrid(grid, word, indices, answer);
  });

  return grid;
}
