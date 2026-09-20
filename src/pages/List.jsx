import React, { useEffect, useState } from "react";
import { fetchLevelsList, logoutUser } from "../api";
import { Link, useNavigate } from "react-router-dom";
import "./List.css";

const List = () => {
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("authToken");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const loadLevels = async () => {
      try {
        const data = await fetchLevelsList();
        console.log(data);
        setLevels(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadLevels();
  }, []);

  return (
    <div className="grid-list">
      <header className="header-list">
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="main-list">
        {levels.map((item) => (
          <Link
            to={`/crossword/${item.level}`}
            className="crossword-card"
            key={item.level}
          >
            <p>{item.title}</p>
          </Link>
        ))}
      </main>
    </div>
  );
};

export default List;
