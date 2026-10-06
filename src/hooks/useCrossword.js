import { useEffect, useRef, useState } from "react";
import { fetchLevel } from "../services/levels";
import { getUserIdFromToken } from "../services/users";
import { fetchProgress, saveProgressRequest } from "../services/progress";

function createEmptyBoard() {
  return Array.from({ length: 15 }, () => Array(15).fill(""));
}

function useCrossword(id) {
  const [level, setLevel] = useState(null);
  const [error, setError] = useState("");

  // O id do progresso agora fica em um ref: sempre tem o valor atual,
  // mesmo dentro de funções assíncronas criadas em renders anteriores.
  const progressIdRef = useRef(null);

  // Fila de salvamentos: garante que as requisições rodem em ordem
  // e que o primeiro salvamento termine (e defina o id) antes do próximo.
  const saveQueueRef = useRef(Promise.resolve());

  const [userBoard, setUserBoard] = useState(createEmptyBoard);

  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);

  useEffect(() => {
    async function loadData() {
      setError("");

      // Reseta o estado ao trocar de fase, para não salvar a fase B
      // em cima do registro de progresso da fase A.
      progressIdRef.current = null;
      saveQueueRef.current = Promise.resolve();
      setUserBoard(createEmptyBoard());

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

      let progress;

      try {
        progress = await fetchProgress(userId, id);
      } catch (err) {
        console.error("Erro ao buscar progresso:", err);
        setError("Não foi possível carregar seu progresso salvo.");
        return;
      }

      if (progress) {
        progressIdRef.current = progress.id;

        if (progress.answers) {
          try {
            const answers = JSON.parse(progress.answers);

            const savedBoard = createEmptyBoard();

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

  function saveProgress(newBoard) {
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

    // Encadeia este salvamento na fila: ele só começa quando o anterior terminar.
    saveQueueRef.current = saveQueueRef.current
      .then(async () => {
        const progress = {
          userId: Number(userId),
          levelId: Number(id),
          answers: JSON.stringify(answers),
          completed: false,
        };

        // Lê o id no momento da execução, não no momento do clique.
        if (progressIdRef.current) {
          progress.id = progressIdRef.current;
        }

        const saved = await saveProgressRequest(progress);

        if (saved?.id) {
          progressIdRef.current = saved.id;
        }
      })
      .catch((err) => {
        // O catch mantém a fila viva mesmo se um salvamento falhar.
        console.error("Erro ao salvar progresso:", err);
      });
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
