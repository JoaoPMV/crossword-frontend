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
            Para iniciar o jogo, basta selecionar um nível na lista e clicar
            sobre ele. Os jogos estão organizados de acordo com os níveis de
            proficiência em inglês. Para alterar seu nível de proficiência,
            acesse sua conta.
          </p>
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
