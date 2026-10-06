function CrosswordBoard({
  board,
  userBoard,
  selectedCell,
  onCellClick,
  onChange,
  onKeyDown,
}) {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected =
            selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

          const isCorrect =
            cell !== null &&
            userBoard[rowIndex][colIndex] !== "" &&
            userBoard[rowIndex][colIndex].toLowerCase() === cell.toLowerCase();

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
              onClick={() => cell !== null && onCellClick(rowIndex, colIndex)}
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
                  onKeyDown={(event) => onKeyDown(rowIndex, colIndex, event)}
                  onChange={(event) =>
                    onChange(rowIndex, colIndex, event.target.value)
                  }
                  maxLength={1}
                />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}

export default CrosswordBoard;
