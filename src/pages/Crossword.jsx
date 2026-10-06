import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HelpModal from "../components/crossword/HelpModal";
import AudioPlayer from "../components/AudioPlayer";
import VirtualKeyboard from "../components/VirtualKeyboard";
import CrosswordBoard from "../components/crossword/CrosswordBoard";
import useCrossword from "../hooks/useCrossword";
import "./Crossword.css";

function Crossword() {
  const { id } = useParams();
  const [showAlternate, setShowAlternate] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  const {
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
  } = useCrossword(id);

  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  if (error) {
    return (
      <div className="board-container">
        <p>{error}</p>
        <Link to="/levels">Voltar para a lista</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="crossword-blur"></div>
      <div className="board-container">
        <header>
          <button
            className="button-help"
            onClick={() => navigate("/levels")}
            aria-label="Como jogar"
          >
            <span className="material-symbols-outlined span-help">
              arrow_circle_left
            </span>
          </button>

          <h1 className="level-name">{level?.name}</h1>
          <button
            className="button-help"
            onClick={() => setShowHelp(true)}
            aria-label="Como jogar"
          >
            <span className="material-symbols-outlined span-help">help</span>
          </button>
        </header>

        <main>
          {showAlternate ? (
            <div className="alternate">{level.description}</div>
          ) : (
            <CrosswordBoard
              board={board}
              userBoard={userBoard}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          )}
        </main>

        <footer>
          <AudioPlayer audio={level?.audio} />
          <button
            className="button-board"
            onClick={() => setShowAlternate((prev) => !prev)}
            aria-label={showAlternate ? "Voltar ao tabuleiro" : "Ver dicas"}
          >
            <span className="material-symbols-outlined span-board">
              {showAlternate ? "change_circle" : "change_circle"}
            </span>
          </button>
        </footer>

        {isTouch && !showAlternate && (
          <VirtualKeyboard
            onKeyPress={handleVirtualKey}
            onBackspace={handleVirtualBackspace}
          />
        )}
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </div>
    </div>
  );
}

export default Crossword;
