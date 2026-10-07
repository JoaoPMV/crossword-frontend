import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { fetchLevels } from "../services/levels";
import HelpModal from "../components/crossword/HelpLevels";

import { getUserById, getUserIdFromToken } from "../services/users";
import "./Levels.css";

function List() {
  const [levels, setLevels] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLevels()
      .then(setLevels)
      .catch(() => setLevels([]))
      .finally(() => setLoading(false));

    const userId = getUserIdFromToken();

    if (userId) {
      getUserById(userId)
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <div>
      <div className="levels-blur"></div>
      <div className="levels-container">
        <header className="levels-container-header">
          <div className="level-student">{user?.proficiency}</div>
          <div className="how-to-play" onClick={() => setShowHelp(true)}>
            How to Play
          </div>
          <button
            className="profile-student"
            type="button"
            onClick={() => navigate("/profile")}
          >
            <span className="material-symbols-outlined span-account">
              account_circle
            </span>
          </button>
        </header>

        <main className="levels-container-main">
          {user && (
            <p className="welcome-message">
              Hello, {user.firstName}. If you need help, click on the button
              "How to Play" above.
            </p>
          )}

          {!loading && levels.length === 0 && (
            <p>Nenhum nível disponível para o seu nível de inglês ainda.</p>
          )}

          <div className="crossword-levels">
            {levels.map((level) => (
              <div key={level.id} className="crossword-card">
                <Link to={`/crossword/${level.id}`}>
                  {level.image && (
                    <img
                      className="crossword-card-image"
                      src={level.image}
                      alt={level.name}
                    />
                  )}
                  <span>{level.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </main>
        <footer class="levels-container-fotter"></footer>
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </div>
    </div>
  );
}

export default List;
