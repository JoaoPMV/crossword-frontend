import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AudioPlayer from "../components/AudioPlayer";
import CrosswordGrid from "../components/CrosswordGrid";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { fetchLevel } from "../api";
import { useCrosswordGrid } from "../hooks/useCrosswordGrid";
import { useCrosswordKeyboard } from "../hooks/useCrosswordKeyboard";

import "./crossword.css";

const EMPTY_WORDS = [];

export default function Crossword({ rows = 11, cols = 11 }) {
  const navigate = useNavigate();
  const { level } = useParams();

  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inputDirection, setInputDirection] = useState("across");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [activeCellIdx, setActiveCellIdx] = useState(null);

  const inputRefs = useRef([]);
  const previousCorrect = useRef(false);

  const registerInput = (idx, element) => {
    inputRefs.current[idx] = element;
  };

  const words = levelData?.words ?? EMPTY_WORDS;

  const { gridCells, setGridCells, isAllCorrect } = useCrosswordGrid({
    words,
    rows,
    cols,
  });

  const {
    handleCellChange,
    handleCellClick,
    handleKeyboardAndBackspace,
    handleVirtualKeyPress,
  } = useCrosswordKeyboard({
    gridCells,
    setGridCells,
    inputRefs,
    inputDirection,
    setInputDirection,
    setActiveCellIdx,
    activeCellIdx,
    cols,
  });

  const goToNextLevel = () => {
    const nextLevel = Number(level) + 1;

    setShowCompletionModal(false);
    setActiveCellIdx(null);
    previousCorrect.current = false;

    navigate(`/crossword/${nextLevel}`);
  };

  useEffect(() => {
    if (isAllCorrect && !previousCorrect.current) {
      setShowCompletionModal(true);
    }

    previousCorrect.current = isAllCorrect;
  }, [isAllCorrect]);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadLevel = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/");
        return;
      }

      setLoading(true);
      setError("");
      setLevelData(null);
      setActiveCellIdx(null);
      setShowCompletionModal(false);
      previousCorrect.current = false;
      inputRefs.current = [];

      try {
        const levels = await fetchLevel(level);

        if (!isCurrentRequest) {
          return;
        }

        setLevelData(levels[0] ?? null);
      } catch (err) {
        if (isCurrentRequest) {
          setError(err.message || "Erro ao carregar nível");
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    };

    loadLevel();

    return () => {
      isCurrentRequest = false;
    };
  }, [level, navigate]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <div id="grid-crossword">
      <div className="blur-background"></div>

      <main className="main-crossword">
        <div className="box-crossword-grid">
          <CrosswordGrid
            gridCells={gridCells}
            rows={rows}
            cols={cols}
            registerInput={registerInput}
            onCellClick={handleCellClick}
            onCellChange={handleCellChange}
            onKeyDown={handleKeyboardAndBackspace}
          />
        </div>
      </main>

      <p className="level-crossword">
        {levelData?.title || "Nível desconhecido"}
      </p>

      <div className="buttons-crossword">
        <AudioPlayer src={levelData?.audio || ""} />
      </div>

      <VirtualKeyboard onKeyPress={handleVirtualKeyPress} />

      {showCompletionModal && (
        <div className="completion-modal">
          <div className="completion-content">
            <h2>Congratulations!</h2>
            <p>You completed this level!</p>
            <p>Ready for the next challenge?</p>

            <button type="button" onClick={goToNextLevel}>
              Next Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
