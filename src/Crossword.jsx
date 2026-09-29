import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLevel } from "./levels";
import AudioPlayer from "./components/AudioPlayer";
import VirtualKeyboard from "./components/VirtualKeyboard";
import "./Crossword.css";

function Crossword() {
  const { id } = useParams();
  const [level, setLevel] = useState(null);
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    fetchLevel(id).then((data) => {
      setLevel(data);
    });
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

  const [userBoard, setUserBoard] = useState(
    Array.from({ length: 15 }, () => Array(15).fill("")),
  );

  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);

  function handleChange(rowIndex, colIndex, value) {
    const newBoard = userBoard.map((row) => [...row]);

    const currentValue = userBoard[rowIndex][colIndex];
    const letter = value.toUpperCase().slice(0, 1);

    newBoard[rowIndex][colIndex] = letter;

    setUserBoard(newBoard);

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
      // tem letra: só apaga
      handleChange(row, col, "");
    } else {
      // célula vazia: volta e apaga a anterior
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
