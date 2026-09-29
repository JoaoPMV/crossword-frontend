import "./VirtualKeyboard.css";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

/**
 * Teclado virtual para a grade de palavras cruzadas.
 *
 * Props:
 *  - onKeyPress(letra)  chamada ao tocar em uma letra (ex.: "A")
 *  - onBackspace()      chamada ao tocar em apagar
 *  - disabled           desativa todas as teclas
 *  - fixed              fixa o teclado no rodapé da tela (padrão: true)
 */
export default function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  disabled = false,
  fixed = true,
}) {
  function handlePress(e, key) {
    // Impede que o toque tire o foco da célula selecionada
    e.preventDefault();
    if (disabled) return;

    if (key === "BACKSPACE") onBackspace?.();
    else onKeyPress?.(key);
  }

  return (
    <div
      className={`keyboard ${fixed ? "keyboard--fixed" : ""}`}
      role="group"
      aria-label="Teclado virtual"
    >
      {ROWS.map((row, i) => (
        <div className="keyboard-row" key={i}>
          {row.map((key) => {
            const isBackspace = key === "BACKSPACE";
            return (
              <button
                key={key}
                type="button"
                className={`vk__key ${isBackspace ? "vk__key--wide" : ""}`}
                onPointerDown={(e) => handlePress(e, key)}
                onClick={(e) => e.preventDefault()}
                disabled={disabled}
                aria-label={isBackspace ? "Apagar" : `Letra ${key}`}
              >
                {isBackspace ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
