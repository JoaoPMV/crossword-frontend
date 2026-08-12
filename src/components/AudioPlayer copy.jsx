import React, { useRef, useState, useEffect } from "react";

const AudioPlayer = ({ src }) => {
  const playerAudio = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 a 100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const audio = playerAudio.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = playerAudio.current;
    if (!audio) return;

    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleSeek = (e) => {
    const audio = playerAudio.current;
    if (!audio) return;

    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audio.duration;
    audio.currentTime = newTime;
  };

  useEffect(() => {
    if (playerAudio.current) {
      playerAudio.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [src]);

  return (
    <div className="audio-player" style={{ width: "100%", padding: "10px" }}>
      <audio ref={playerAudio} src={src} onTimeUpdate={handleTimeUpdate} />

      <button onClick={togglePlay} style={{ marginBottom: "10px" }}>
        {isPlaying ? "Stop Audio" : "Play Audio"}
      </button>

      {/* Barra de progresso com bolinha */}
      <div
        className="progress-bar"
        onClick={handleSeek}
        style={{
          width: "100%",
          height: "8px",
          background: "#ccc",
          borderRadius: "4px",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#007bff",
            borderRadius: "4px",
          }}
        />
        {/* Bolinha */}
        <div
          style={{
            position: "absolute",
            left: `${progress}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#fff",
            border: "2px solid #007bff",
            pointerEvents: "none", // para não atrapalhar o clique na barra
          }}
        />
      </div>

      <div style={{ marginTop: "4px", fontSize: "12px" }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default AudioPlayer;
