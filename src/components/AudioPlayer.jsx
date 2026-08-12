import React, { useRef, useState, useEffect } from "react";

const AudioPlayer = ({ src }) => {
  const playerAudio = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const audio = playerAudio.current;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (playerAudio.current) {
      playerAudio.current.pause(); // Pausar o áudio ao trocar de nível
      setIsPlaying(false); // Atualizar o estado para 'parado'
    }
  }, [src]);

  return (
    <>
      <audio ref={playerAudio} src={src} className="border border-primary" />
      <button className="" onClick={togglePlay}>
        {isPlaying ? <p>Stop Audio</p> : <p>Play Audio</p>}
      </button>
    </>
  );
};

export default AudioPlayer;
