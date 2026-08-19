import React, { useRef, useState, useEffect } from "react";

const AudioPlayer = ({ src }) => {
  const playerAudio = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      <audio ref={playerAudio} src={src} onEnded={() => setIsPlaying(false)} />

      <button onClick={togglePlay}>
        {isPlaying ? <p>Stop Audio</p> : <p>Play Audio</p>}
      </button>
    </>
  );
};

export default AudioPlayer;
