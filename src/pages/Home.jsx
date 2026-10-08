import { useNavigate } from "react-router-dom";
import "./Home.css";

const CARDS = [
  {
    type: "Progresso",
    title:
      "Your progress is saved so you can continue learning where you left off.",
  },
  {
    type: "Níveis",
    title: "Content organized by proficiency level.",
  },
  {
    type: "Crossword",
    title:
      "A creative game to study English, with audios, texts, and much more.",
  },
];

export default function PopularCards({ cards = CARDS }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="ct-root">
        <p className="typing"> Boost your English with Creative Technology.</p>

        <div className="cards">
          {cards.map((card) => (
            <article className="card">
              <div className="meta">
                <p>{card.type}</p>
              </div>
              <p>{card.title}</p>
            </article>
          ))}
        </div>
        <div className="footer-home">
          <button className="button-login" onClick={() => navigate("/login")}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
