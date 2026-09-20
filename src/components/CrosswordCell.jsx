export default function CrosswordCell({
  cell,
  idx,
  registerInput,
  onCellClick,
  onCellChange,
  onKeyDown,
}) {
  const className = [
    "cell",
    cell.solution ? "in-word" : "",
    cell.status === "correct" ? "correct" : "",
    cell.status === "wrong" ? "wrong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div data-cell={idx} className={className}>
      {cell.status === "correct" ? (
        <span className="cell-letter">{cell.letter}</span>
      ) : cell.solution ? (
        <input
          type="text"
          maxLength={1}
          className="cell-input"
          value={cell.letter}
          inputMode="none"
          ref={(element) => registerInput(idx, element)}
          onClick={() => onCellClick(idx)}
          onChange={(event) => onCellChange(idx, event.target.value)}
          onKeyDown={(event) => onKeyDown(idx, event)}
        />
      ) : null}
    </div>
  );
}
