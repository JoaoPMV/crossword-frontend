import { useRef, useState, useEffect } from "react";
import "./AudioPlayer.css";

function formatTime(time) {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// O Crossword usa <AudioPlayer audio={level?.audio} />
function AudioPlayer({ audio }) {
  const playerAudio = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function seek(seconds) {
    const el = playerAudio.current;
    if (!el || !Number.isFinite(el.duration)) return;

    el.currentTime = Math.min(
      el.duration,
      Math.max(0, el.currentTime + seconds),
    );
  }

  async function togglePlay() {
    const el = playerAudio.current;
    if (!el) return;

    if (el.paused) {
      try {
        await el.play();
      } catch (error) {
        console.error("Erro ao reproduzir áudio:", error);
      }
    } else {
      el.pause();
    }
  }

  // Ao trocar de nível: para o áudio e zera o estado
  useEffect(() => {
    const el = playerAudio.current;
    if (!el) return;

    el.pause();
    el.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audio]);

  return (
    <div className="player-container">
      <audio
        ref={playerAudio}
        src={audio}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="buttons-audio">
        <button
          type="button"
          onClick={() => seek(-5)}
          disabled={!audio}
          aria-label="Voltar 5 segundos"
        >
          <span className="material-symbols-outlined">replay_5</span>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          disabled={!audio}
          aria-label={isPlaying ? "Pausar" : "Tocar"}
        >
          <span className="material-symbols-outlined">
            {isPlaying ? "pause_circle" : "play_circle"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => seek(5)}
          disabled={!audio}
          aria-label="Avançar 5 segundos"
        >
          <span className="material-symbols-outlined">forward_5</span>
        </button>
      </div>

      <p className="time-player">
        {formatTime(currentTime)} / {formatTime(duration)}
      </p>
    </div>
  );
}

export default AudioPlayer;
