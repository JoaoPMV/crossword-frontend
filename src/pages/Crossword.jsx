import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AudioPlayer from "../components/AudioPlayer";
import CrosswordGrid from "../components/CrosswordGrid";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { fetchLevel, loadProgress, saveProgress } from "../api";
import { useCrosswordGrid } from "../hooks/useCrosswordGrid";
import { useCrosswordKeyboard } from "../hooks/useCrosswordKeyboard";

import "./crossword.css";

const EMPTY_WORDS = [];

const EMPTY_PROGRESS = {
  completedPuzzles: [],
  currentLevel: 1,
  currentState: {},
};

export default function Crossword({ rows = 11, cols = 11 }) {
  const navigate = useNavigate();
  const { level } = useParams();

  const currentLevelNumber = Number(level);

  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inputDirection, setInputDirection] = useState("across");
  const [activeCellIdx, setActiveCellIdx] = useState(null);

  const [restoredState, setRestoredState] = useState({});

  const inputRefs = useRef([]);
  const previousCorrect = useRef(false);
  const progressRef = useRef(EMPTY_PROGRESS);

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

  const updateProgressState = (newProgress) => {
    progressRef.current = newProgress;
  };

  const handleCellChangeAndSave = (idx, value) => {
    handleCellChange(idx, value);

    const letter = value.toUpperCase();

    const newState = {
      ...progressRef.current.currentState,
      [idx]: letter,
    };

    const newProgress = {
      ...progressRef.current,
      currentLevel: currentLevelNumber,
      currentState: newState,
    };

    updateProgressState(newProgress);

    saveProgress({
      completedPuzzles: newProgress.completedPuzzles,
      currentLevel: currentLevelNumber,
      currentState: newState,
    }).catch((err) => {
      console.error("Erro ao salvar progresso:", err);
    });
  };

  // Carrega o nível e o progresso do usuário
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
      setRestoredState({});
      setActiveCellIdx(null);

      previousCorrect.current = false;
      inputRefs.current = [];

      try {
        const [levels, userProgress] = await Promise.all([
          fetchLevel(currentLevelNumber),
          loadProgress(),
        ]);

        if (!isCurrentRequest) {
          return;
        }

        const loadedLevel = levels[0] ?? null;

        if (!loadedLevel) {
          throw new Error("Nível não encontrado");
        }

        const savedProgress = userProgress || EMPTY_PROGRESS;

        const isSavedProgressFromCurrentLevel =
          Number(savedProgress.currentLevel) === currentLevelNumber;

        const currentState = isSavedProgressFromCurrentLevel
          ? savedProgress.currentState || {}
          : {};

        const loadedProgress = {
          completedPuzzles: savedProgress.completedPuzzles || [],
          currentLevel: currentLevelNumber,
          currentState,
        };

        setLevelData(loadedLevel);
        setRestoredState(currentState);
        updateProgressState(loadedProgress);
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
  }, [currentLevelNumber, navigate]);

  // Restaura as letras salvas no grid
  useEffect(() => {
    if (!levelData || !restoredState) {
      return;
    }

    setGridCells((previousCells) =>
      previousCells.map((cell, idx) => {
        if (!Object.prototype.hasOwnProperty.call(restoredState, idx)) {
          return cell;
        }

        const letter = restoredState[idx];

        const status = !letter
          ? "default"
          : letter === cell.solution
            ? "correct"
            : "wrong";

        return {
          ...cell,
          letter,
          status,
        };
      }),
    );
  }, [levelData, restoredState, setGridCells]);

  // Salva o nível como concluído
  useEffect(() => {
    if (!levelData || levelData.level !== currentLevelNumber) {
      return;
    }

    if (!isAllCorrect || previousCorrect.current) {
      previousCorrect.current = isAllCorrect;
      return;
    }

    const completedPuzzles = Array.from(
      new Set([...progressRef.current.completedPuzzles, currentLevelNumber]),
    );

    const newProgress = {
      ...progressRef.current,
      completedPuzzles,
      currentLevel: currentLevelNumber,
    };

    updateProgressState(newProgress);

    saveProgress({
      completedPuzzles,
      currentLevel: currentLevelNumber,
      currentState: progressRef.current.currentState,
    }).catch((err) => {
      console.error("Erro ao salvar conclusão do nível:", err);
    });

    previousCorrect.current = true;
  }, [isAllCorrect, currentLevelNumber, levelData]);

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
            onCellChange={handleCellChangeAndSave}
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
    </div>
  );
}
