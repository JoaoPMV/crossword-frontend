import React, { useRef, useState, useEffect } from "react";

const AudioPlayer = ({ src }) => {
  const playerAudio = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const seek = (seconds) => {
    const audio = playerAudio.current;
    if (!audio) return;
    audio.currentTime = Math.min(
      audio.duration,
      Math.max(0, audio.currentTime + seconds),
    );
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = async () => {
    const audio = playerAudio.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Erro ao reproduzir áudio:", error);
      }
    }
  };

  useEffect(() => {
    const audio = playerAudio.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }, [src]);

  return (
    <>
      <div className="playAudio">
        <audio
          ref={playerAudio}
          src={src}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onEnded={() => setIsPlaying(false)}
        />
        <div className="buttons-audio">
          <span className="material-symbols-outlined" onClick={() => seek(-5)}>
            replay_5
          </span>
          <span className="material-symbols-outlined" onClick={() => seek(5)}>
            forward_5
          </span>
          <span className="material-symbols-outlined" onClick={togglePlay}>
            {isPlaying ? "pause_circle" : "play_circle"}
          </span>
        </div>

        <p>
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
      </div>
    </>
  );
};

export default AudioPlayer;
