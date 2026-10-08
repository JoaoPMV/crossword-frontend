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
            This is a crossword game like nothing you've seen before. It's ideal
            for learning and memorizing vocabulary, and for practicing your
            listening and reading skills.
          </p>
          <p>
            To start the game, simply select a level from the list and click on
            it. The games are organized by English proficiency level. To change
            your proficiency level, go to your account.
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
