import { useEffect, useState } from "react";
import { fetchLevel } from "../services/levels";
import { getUserIdFromToken } from "../services/users";
import { fetchProgress, saveProgressRequest } from "../services/progress";

function useCrossword(id) {
  const [level, setLevel] = useState(null);
  const [error, setError] = useState("");
  const [progressId, setProgressId] = useState(null);

  const [userBoard, setUserBoard] = useState(
    Array.from({ length: 15 }, () => Array(15).fill("")),
  );

  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);

  useEffect(() => {
    async function loadData() {
      setError("");

      let data;

      try {
        data = await fetchLevel(id);
      } catch (err) {
        setError(err.message);
        return;
      }

      if (!data) return;

      setLevel(data);

      const userId = getUserIdFromToken();

      if (!userId) return;

      const progress = await fetchProgress(userId, id);

      if (progress) {
        setProgressId(progress.id);

        if (progress.answers) {
          try {
            const answers = JSON.parse(progress.answers);

            const savedBoard = Array.from({ length: 15 }, () =>
              Array(15).fill(""),
            );

            Object.entries(answers).forEach(([position, letter]) => {
              const [row, col] = position.split(",").map(Number);

              if (row >= 0 && row < 15 && col >= 0 && col < 15) {
                savedBoard[row][col] = letter;
              }
            });

            setUserBoard(savedBoard);
          } catch {
            console.error("Não foi possível carregar as respostas salvas.");
          }
        }
      }
    }

    loadData();
  }, [id]);

  const words = level?.words || [];

  const board = Array.from({ length: 15 }, () => Array(15).fill(null));

  words.forEach(({ word, row, col, direction }) => {
    [...word].forEach((letter, index) => {
      const currentRow = direction === "horizontal" ? row : row + index;

      const currentCol = direction === "horizontal" ? col + index : col;

      board[currentRow][currentCol] = letter;
    });
  });

  async function saveProgress(newBoard) {
    const userId = getUserIdFromToken();

    if (!userId) return;

    const answers = {};

    newBoard.forEach((row, rowIndex) => {
      row.forEach((letter, colIndex) => {
        if (letter !== "") {
          answers[`${rowIndex},${colIndex}`] = letter;
        }
      });
    });

    const progress = {
      userId: Number(userId),
      levelId: Number(id),
      answers: JSON.stringify(answers),
      completed: false,
    };

    if (progressId) {
      progress.id = progressId;
    }

    const savedProgress = await saveProgressRequest(progress);

    if (savedProgress && !progressId) {
      setProgressId(savedProgress.id);
    }
  }

  function handleChange(rowIndex, colIndex, value) {
    if (
      userBoard[rowIndex][colIndex] !== "" &&
      userBoard[rowIndex][colIndex].toUpperCase() ===
        board[rowIndex][colIndex]?.toUpperCase()
    ) {
      return;
    }

    const newBoard = userBoard.map((row) => [...row]);

    const currentValue = userBoard[rowIndex][colIndex];
    const letter = value.toUpperCase().slice(0, 1);

    newBoard[rowIndex][colIndex] = letter;

    setUserBoard(newBoard);

    saveProgress(newBoard);

    if (letter !== "") {
      moveToNextCell(rowIndex, colIndex);
    } else if (currentValue === "") {
      moveToPreviousCell(rowIndex, colIndex);
    }
  }

  function handleKeyDown(rowIndex, colIndex, event) {
    if (event.key === "Backspace" && userBoard[rowIndex][colIndex] === "") {
      moveToPreviousCell(rowIndex, colIndex);
    }
  }

  function moveToNextCell(rowIndex, colIndex) {
    let nextRow = rowIndex;
    let nextCol = colIndex;

    while (true) {
      if (selectedDirection === "horizontal") {
        nextCol++;
      } else if (selectedDirection === "vertical") {
        nextRow++;
      }

      if (board[nextRow]?.[nextCol] === undefined) {
        return;
      }

      if (board[nextRow][nextCol] === null) {
        return;
      }

      const isCorrect =
        userBoard[nextRow][nextCol].toUpperCase() ===
        board[nextRow][nextCol].toUpperCase();

      if (isCorrect) {
        continue;
      }

      document
        .querySelector(`input[data-row="${nextRow}"][data-col="${nextCol}"]`)
        ?.focus();

      setSelectedCell({
        row: nextRow,
        col: nextCol,
      });

      return;
    }
  }

  function moveToPreviousCell(rowIndex, colIndex) {
    let previousRow = rowIndex;
    let previousCol = colIndex;

    while (true) {
      if (selectedDirection === "horizontal") {
        previousCol--;
      } else if (selectedDirection === "vertical") {
        previousRow--;
      }

      if (board[previousRow]?.[previousCol] === undefined) {
        return;
      }

      if (board[previousRow][previousCol] === null) {
        return;
      }

      const isCorrect =
        userBoard[previousRow][previousCol].toUpperCase() ===
        board[previousRow][previousCol].toUpperCase();

      if (isCorrect) {
        continue;
      }

      document
        .querySelector(
          `input[data-row="${previousRow}"][data-col="${previousCol}"]`,
        )
        ?.focus();

      setSelectedCell({
        row: previousRow,
        col: previousCol,
      });

      return;
    }
  }

  function handleVirtualKey(letter) {
    if (!selectedCell) return;

    handleChange(selectedCell.row, selectedCell.col, letter);
  }

  function handleVirtualBackspace() {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    if (userBoard[row][col] !== "") {
      handleChange(row, col, "");
    } else {
      moveToPreviousCell(row, col);
    }
  }

  function handleCellClick(rowIndex, colIndex) {
    setSelectedCell({
      row: rowIndex,
      col: colIndex,
    });

    const horizontalWord = words.find(({ row, col, word, direction }) => {
      if (direction !== "horizontal") return false;

      return [...word].some((_, index) => {
        const currentRow = row;
        const currentCol = col + index;

        return currentRow === rowIndex && currentCol === colIndex;
      });
    });

    const verticalWord = words.find(({ row, col, word, direction }) => {
      if (direction !== "vertical") return false;

      return [...word].some((_, index) => {
        const currentRow = row + index;
        const currentCol = col;

        return currentRow === rowIndex && currentCol === colIndex;
      });
    });

    const isHorizontalFirstCell =
      horizontalWord &&
      horizontalWord.row === rowIndex &&
      horizontalWord.col === colIndex;

    const isVerticalFirstCell =
      verticalWord &&
      verticalWord.row === rowIndex &&
      verticalWord.col === colIndex;

    if (isHorizontalFirstCell) {
      setSelectedDirection("horizontal");
    } else if (isVerticalFirstCell) {
      setSelectedDirection("vertical");
    } else if (horizontalWord) {
      setSelectedDirection("horizontal");
    } else if (verticalWord) {
      setSelectedDirection("vertical");
    }
  }

  return {
    level,
    error,
    board,
    userBoard,
    selectedCell,
    handleCellClick,
    handleChange,
    handleKeyDown,
    handleVirtualKey,
    handleVirtualBackspace,
  };
}

export default useCrossword;
