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

import AudioPlayer from "../components/AudioPlayer";

import "./crossword.css";

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
        navigate("/"); // Redireciona imediatamente se não houver token
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
            }}
          >
            Next
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
