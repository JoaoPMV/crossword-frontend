import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLevels } from "./levels";
import { logoutUser } from "./users";
import "./Levels.css";

function List() {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    fetchLevels().then((data) => {
      console.log(data);
      setLevels(data);
    });
  }, []);

  return (
    <div className="levels-container">
      <header>
        <button onClick={logoutUser}>Logout</button>
      </header>

      <main>
        {levels.map((level) => (
          <div className="chapter" key={level.id}>
            <Link className="crossword-card" to={`/crossword/${level.id}`}>
              {level.name}
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}

export default List;
