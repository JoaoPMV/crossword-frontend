import { useEffect } from "react";
import "./HelpModal.css";

function HelpModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">Como jogar</h2>
        </div>

        <div className="modal-body">
          <p>
            Este é um jogo de palavras-cruzadas como você nunca viu antes. Ideal
            para aprender e memorizar vocabulários e também praticar listening e
            reading.
          </p>
          <p>
            Em vez de ler as dicas na horizontal e vertical, você vai ouvir um
            áudio. O áudio contém todas as palavras necessárias para você
            completar as palavras. Você também pode acessar o texto de descrição
            do áudio.
          </p>

          <div className="div-help-modal">
            <span className="material-symbols-outlined">play_circle</span>
            <p>Clique para tocar o áudio</p>
          </div>
          <div className="div-help-modal">
            <span className="material-symbols-outlined">pause_circle</span>
            <p>Clique para pausar o áudio</p>
          </div>
          <div className="div-help-modal">
            <span className="material-symbols-outlined">replay_5</span>
            <p>Clique para voltar cinco segundos do áudio</p>
          </div>
          <div className="div-help-modal">
            <span className="material-symbols-outlined">forward_5</span>
            <p>Clique para avançar cinco segundos do áudio</p>
          </div>

          <div className="div-help-modal">
            <span className="material-symbols-outlined">change_circle</span>
            <p>Clique para alternar entre o tabuleiro e descrição do áudio</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
