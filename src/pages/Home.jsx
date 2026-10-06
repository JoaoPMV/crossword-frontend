import { useNavigate } from "react-router-dom";
import "./Home.css";

const CARDS = [
  {
    type: "Progresso",
    title: "Seu progresso é salvo para continuar os estudos.",
  },
  {
    type: "Níveis",
    title: "Conteúdo dividido por níveis de proficiência.",
  },
  {
    type: "Crossword",
    title: "Jogo criativo para estudar inglês, com áudios, texto e muito mais.",
  },
  {
    type: "Crossword",
    title: "Jogo criativo para estudar inglês, com áudios, texto e muito mais.",
  },
];

export default function PopularCards({ cards = CARDS }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="levels-blur"></div>
      <div className="ct-root">
        <div className="footer-home">
          <button className="button-login" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

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
      </div>
    </div>
  );
}
