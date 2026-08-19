import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VirtualKeyboard from "../components/VirtualKeyboard";
import CrosswordGrid from "../components/CrosswordGrid";
import { useCrosswordKeyboard } from "../hooks/useCrosswordKeyboard";
import {
  useCrosswordGrid,
  placeWordsIntoGrid,
} from "../hooks/useCrosswordGrid";

import { fetchGames } from "../api";
import { saveProgress } from "../api";

import { getProgress } from "../api";
import AudioPlayer from "../components/AudioPlayer";

import "./crossword.css";

// Declara a função manual para decodificar JWT
const decodeTokenManualmente = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Segmento do payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Ajusta caracteres
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    // Retorna o conteúdo do payload como objeto JSON decodificado
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar token manualmente:", error);
    return null; // Retorna null caso não consiga decodificar
  }
};

export default function Teste({ rows = 11, cols = 11 }) {
  const navigate = useNavigate();
  const { level } = useParams();

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [inputDirection, setInputDirection] = useState("across"); // ou "down"
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const [activeCellIdx, setActiveCellIdx] = useState(null);
  const inputRefs = useRef([]);

  const { gridCells, setGridCells, isAllCorrect } = useCrosswordGrid({
    levels,
    currentLevelIdx,
    rows,
    cols,
  });

  const getUserId = () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Token não encontrado. O usuário precisa fazer login.");
      }

      // Agora usamos decodeTokenManualmente
      const decodedToken = decodeTokenManualmente(token);

      // Verifica se o token contém o userId
      if (!decodedToken?.id) {
        throw new Error("Token não contém userId válido");
      }

      return decodedToken.id; // Retorna o userId do payload
    } catch (error) {
      console.error("Erro ao obter userId:", error.message);
      return null; // Retorna null caso não consiga decodificar
    }
  };

  const handleSaveProgress = async (customIdx) => {
    try {
      const userId = getUserId();
      if (!userId) {
        alert(
          "Não foi possível salvar o progresso. O usuário não está autenticado.",
        );
        return;
      }

      const idxToSave =
        typeof customIdx === "number" ? customIdx : currentLevelIdx;
      const completedPuzzle = levels[idxToSave]?.level;
      const token = localStorage.getItem("authToken");

      await saveProgress(userId, completedPuzzle, token);
    } catch (error) {
      console.error("Erro ao salvar progresso:", error.message);
      alert(
        error.message ||
          "Erro ao salvar progresso. Por favor, tente novamente.",
      );
    }
  };

  const { handleVirtualKeyPress, handleKeyboardAndBackspace, moveFocus } =
    useCrosswordKeyboard({
      gridCells,
      setGridCells,
      inputRefs,
      inputDirection,
      setActiveCellIdx,
      activeCellIdx,
      cols,
    });

  useEffect(() => {
    const loadLevels = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login"); // Redireciona imediatamente se não houver token
        return;
      }
      try {
        const data = await fetchGames(level);
        setLevels(data); // Armazena os níveis no estado
        if (data.length > 0) {
          const { grid } = placeWordsIntoGrid(rows, cols, data[0].words);
          setGridCells(grid); // Inicializa o grid
        }
      } catch (err) {
        setError(err.message || "Erro ao carregar níveis");
      } finally {
        setLoading(false);
      }
    };

    loadLevels();
  }, [rows, cols, navigate, level]);

  useEffect(() => {
    const loadProgress = async () => {
      const token = localStorage.getItem("authToken");
      const userId = getUserId();

      if (!userId || !token) {
        console.error("Erro: usuário ou token não existem");
        return;
      }

      const progress = await getProgress(userId, token);

      const idx = levels.findIndex(
        (level) => level.level === progress.currentLevel,
      );

      if (progress?.currentLevel && levels.length > 0) {
        if (idx !== -1) {
          setCurrentLevelIdx(idx); // Atualiza o nível
        } else {
          console.warn("Nível não encontrado:", progress.currentLevel);
        }
      }
    };

    if (levels.length > 0) loadProgress();
  }, [levels]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <>
      <div id="grid-crossword">
        <div className="blur-background"></div>
        <div>
          {showHowToPlay && (
            <p className="rules">
              Click the "Play Audio" button. You will hear a short dialogue
              containing all the words you need to complete the crossword
              puzzle.
            </p>
          )}
        </div>

        <main className="main-crossword">
          <div className="box-crossword-grid">
            <CrosswordGrid
              gridCells={gridCells || []}
              rows={rows}
              cols={cols}
              inputRefs={inputRefs}
              inputDirection={inputDirection}
              setInputDirection={setInputDirection}
              setActiveCellIdx={setActiveCellIdx}
              setGridCells={setGridCells}
              handleKeyboardAndBackspace={handleKeyboardAndBackspace}
              moveFocus={moveFocus}
            />
          </div>
        </main>

        <p className="level-crossword">
          {levels[currentLevelIdx]?.title || "Nível desconhecido"}
        </p>

        <div className="buttons-crossword">
          <AudioPlayer src={levels[currentLevelIdx]?.audio || ""} />

          <button
            className={`${isAllCorrect ? "correct" : ""}`}
            onClick={() => {
              if (!isAllCorrect) return; // Bloqueia o clique se o botão estiver desabilitado
              const nextIdx = (currentLevelIdx + 1) % levels.length;
              setCurrentLevelIdx(nextIdx);
              handleSaveProgress(nextIdx); // Salva progresso
            }}
          >
            <p>Next</p>
          </button>
          <button onClick={() => setShowHowToPlay(!showHowToPlay)}>
            <p>Rules</p>
          </button>
        </div>

        <VirtualKeyboard onKeyPress={handleVirtualKeyPress} />
      </div>
    </>
  );
}
