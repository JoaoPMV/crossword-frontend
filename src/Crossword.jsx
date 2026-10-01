import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLevel } from "./levels";
import AudioPlayer from "./components/AudioPlayer";
import VirtualKeyboard from "./components/VirtualKeyboard";
import "./Crossword.css";

const API_URL = import.meta.env.VITE_API_URL;

function getUserIdFromToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );

    return payload.userId;
  } catch {
    return null;
  }
}

function Crossword() {
  const { id } = useParams();
  const [level, setLevel] = useState(null);
  const [progressId, setProgressId] = useState(null);

  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const [userBoard, setUserBoard] = useState(
    Array.from({ length: 15 }, () => Array(15).fill("")),
  );

  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchLevel(id);
      setLevel(data);

      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();

      if (!token || !userId) return;

      const response = await fetch(`${API_URL}/progress/${userId}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const progress = await response.json();

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
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();

    if (!token || !userId) return;

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

    const response = await fetch(`${API_URL}/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(progress),
    });

    if (response.ok) {
      const savedProgress = await response.json();

      if (!progressId) {
        setProgressId(savedProgress.id);
      }
    }
  }

  function handleChange(rowIndex, colIndex, value) {
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

    if (selectedDirection === "horizontal") {
      nextCol++;
    } else if (selectedDirection === "vertical") {
      nextRow++;
    }

    if (board[nextRow]?.[nextCol] !== null) {
      document
        .querySelector(`input[data-row="${nextRow}"][data-col="${nextCol}"]`)
        ?.focus();

      setSelectedCell({
        row: nextRow,
        col: nextCol,
      });
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

  function moveToPreviousCell(rowIndex, colIndex) {
    let previousRow = rowIndex;
    let previousCol = colIndex;

    if (selectedDirection === "horizontal") {
      previousCol--;
    } else if (selectedDirection === "vertical") {
      previousRow--;
    }

    if (board[previousRow]?.[previousCol] !== null) {
      document
        .querySelector(
          `input[data-row="${previousRow}"][data-col="${previousCol}"]`,
        )
        ?.focus();

      setSelectedCell({
        row: previousRow,
        col: previousCol,
      });
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

  return (
    <div className="board-container">
      <h1 className="level-name">{level?.name}</h1>

      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

            const isCorrect =
              cell !== null &&
              userBoard[rowIndex][colIndex] !== "" &&
              userBoard[rowIndex][colIndex].toLowerCase() ===
                cell.toLowerCase();

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={
                  cell === null
                    ? "cell"
                    : isCorrect
                      ? "cell active correct"
                      : isSelected
                        ? "cell active selected"
                        : "cell active"
                }
                onClick={() =>
                  cell !== null && handleCellClick(rowIndex, colIndex)
                }
              >
                {cell !== null && (
                  <input
                    data-row={rowIndex}
                    data-col={colIndex}
                    value={userBoard[rowIndex][colIndex]}
                    inputMode="none"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    onKeyDown={(event) =>
                      handleKeyDown(rowIndex, colIndex, event)
                    }
                    onChange={(event) =>
                      handleChange(rowIndex, colIndex, event.target.value)
                    }
                    maxLength={1}
                  />
                )}
              </div>
            );
          }),
        )}
      </div>

      <div className="level-audio">
        <AudioPlayer audio={level?.audio} />
      </div>

      {isTouch && (
        <VirtualKeyboard
          onKeyPress={handleVirtualKey}
          onBackspace={handleVirtualBackspace}
        />
      )}
    </div>
  );
}

export default Crossword;
