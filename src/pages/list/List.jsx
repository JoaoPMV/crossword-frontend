import React, { useEffect, useState } from "react";
import { fetchLevels } from "../../api";
import { Link } from "react-router-dom";
import "./List.css";

const List = () => {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        const data = await fetchLevels();
        console.log(data);
        setLevels(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadLevels();
  }, []);

  return (
    <div>
      <div className="grid-list">
        <div className="header-list"></div>

        <div className="main-list">
          {levels.map((item) => (
            <Link
              to={`/crossword/${item.level}`}
              className="crossword-box"
              key={item.level}
            >
              <p>{item.title}</p>
              <img src={item.image} alt={item.title} />
            </Link>
          ))}
        </div>

        <div className="footer-list"></div>
      </div>
    </div>
  );
};

export default List;
