import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Crossword from "./pages/Crossword";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout"; // ajuste o caminho!

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      {/* Rota para a página de palavras cruzadas */}

      <Route path="/crossword" element={<Crossword />} />
    </Routes>
  );
}
