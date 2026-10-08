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
            Instead of reading clues for across and down, you'll listen to an
            audio track. The audio contains all the words you need to complete
            the puzzle. You can also view the audio transcript if you need it.
          </p>

          <div className="div-help-modal">
            <span className="material-symbols-outlined">play_circle</span>
            <p>Click to play the audio</p>
          </div>
          <div className="div-help-modal">
            <span className="material-symbols-outlined">pause_circle</span>
            <p>Click to pause the audio</p>
          </div>
          <div className="div-help-modal">
            <span className="material-symbols-outlined">replay_5</span>
            <p>Click to go back five seconds</p>
          </div>
          <div className="div-help-modal">
            <span className="material-symbols-outlined">forward_5</span>
            <p>Click to go forward five seconds</p>
          </div>

          <div className="div-help-modal">
            <span className="material-symbols-outlined">change_circle</span>
            <p>Click to switch between the board and the audio transcript</p>
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
