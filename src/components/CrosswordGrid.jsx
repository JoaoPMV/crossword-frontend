import CrosswordCell from "./CrosswordCell";

export default function CrosswordGrid({
  gridCells,
  rows,
  cols,
  registerInput,
  onCellClick,
  onCellChange,
  onKeyDown,
}) {
  return (
    <div
      className="crossword-grid"
      role="grid"
      aria-label={`Palavras cruzadas ${rows}x${cols}`}
    >
      {gridCells.map((cell, idx) => (
        <CrosswordCell
          key={idx}
          cell={cell}
          idx={idx}
          registerInput={registerInput}
          onCellClick={onCellClick}
          onCellChange={onCellChange}
          onKeyDown={onKeyDown}
        />
      ))}
    </div>
  );
}
