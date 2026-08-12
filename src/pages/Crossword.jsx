import React, { useEffect, useState, useRef } from "react";
import VirtualKeyboard from "../components/VirtualKeyboard";
import CrosswordGrid from "../components/CrosswordGrid";
import { useCrosswordKeyboard } from "../hooks/useCrosswordKeyboard";
import {
  useCrosswordGrid,
  placeWordsIntoGrid,
} from "../hooks/useCrosswordGrid";

import { useNavigate } from "react-router-dom";
import { fetchGames } from "../api";
import { saveProgress } from "../api";
import { useAuth } from "../context/authContext";
import { getProgress } from "../api";
import { FaUserCircle } from "react-icons/fa";
import AudioPlayer from "../components/AudioPlayer";
import { TbHexagonNumber1Filled } from "react-icons/tb";
import { TbHexagonNumber2Filled } from "react-icons/tb";
import { TbHexagonNumber3Filled } from "react-icons/tb";
import { TbHexagonNumber4Filled } from "react-icons/tb";
import { TbHexagonNumber5Filled } from "react-icons/tb";

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
        .join("")
    );

    // Retorna o conteúdo do payload como objeto JSON decodificado
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar token manualmente:", error);
    return null; // Retorna null caso não consiga decodificar
  }
};

export default function Teste({ rows = 11, cols = 11 }) {
  const { user } = useAuth();
  // Estados

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [inputDirection, setInputDirection] = useState("across"); // ou "down"
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeCellIdx, setActiveCellIdx] = useState(null);
  const inputRefs = useRef([]);
  const audioRef = useRef(null);

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
          "Não foi possível salvar o progresso. O usuário não está autenticado."
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
        error.message || "Erro ao salvar progresso. Por favor, tente novamente."
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

  const navigate = useNavigate();

  useEffect(() => {
    const loadLevels = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login"); // Redireciona imediatamente se não houver token
        return;
      }
      try {
        const data = await fetchGames();
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
  }, [rows, cols, navigate]);

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
        (level) =>
          level.level.trim().toLowerCase() ===
          progress.currentLevel.trim().toLowerCase()
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

  useEffect(() => {
    if (!levels.length) return;

    const level = levels[currentLevelIdx];
    if (!level?.slug) return;

    if (audioRef.current) {
      console.log("Atualizando áudio para:", level.slug);
      audioRef.current.src = `/audios/${level.slug}.mp3`;
      audioRef.current.load();

      audioRef.current
        .play()
        .then(() => console.log("Áudio reproduzido automaticamente"))
        .catch((error) =>
          console.error("Erro ao tentar reproduzir o áudio:", error)
        );
    }
  }, [currentLevelIdx, levels]);

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
        <header className="header-crossword" onClick={() => setOpen(!open)}>
          <div className="user-wrapper">
            <p>
              <FaUserCircle className="user-icon" />
            </p>
            <p>{user ? user.name : "usuário"}</p>

            <div className={`user-panel ${open ? "open" : ""}`}>
              <a className="" href="/logout">
                Sair
              </a>
            </div>
          </div>
        </header>

        <p className="level-crossword level-class">
          {levels[currentLevelIdx]?.level || "Nível desconhecido"}
        </p>

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

          <div>
            {showHowToPlay && (
              <div className="how-to-play-box">
                <p>
                  <TbHexagonNumber1Filled className="numbers-icons" />
                  Listen to the audio about daily routines.
                </p>
                <p>
                  <TbHexagonNumber2Filled className="numbers-icons" />
                  Audios provide the words to solve the puzzle.
                </p>
                <p>
                  <TbHexagonNumber3Filled className="numbers-icons" />
                  Each level has a different audio.
                </p>
                <p>
                  <TbHexagonNumber4Filled className="numbers-icons" />
                  Letters must be typed from top to bottom.
                </p>
                <p>
                  <TbHexagonNumber5Filled className="numbers-icons" />
                  Letters must be typed from left to right.
                </p>
              </div>
            )}
          </div>
        </main>

        <section className="buttons-crossword">
          <AudioPlayer
            src={
              levels[currentLevelIdx]?.slug
                ? `/audios/${levels[currentLevelIdx].slug}.mp3`
                : ""
            }
          />

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
            <p>How to play</p>
          </button>
        </section>

        <VirtualKeyboard onKeyPress={handleVirtualKeyPress} />
      </div>
    </>
  );
}
