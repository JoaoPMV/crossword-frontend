import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import { registerUser } from "../api"; // Função da API
import { FaGithub } from "react-icons/fa";
import "./pages.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Inicializa o hook para redirecionar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);

      setMessage("Registro concluído com sucesso!");

      navigate("/");
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error.message);
      setMessage(error.message || "Erro ao registrar o usuário.");
    }
  };

  return (
    <div className="container-login-register">
      <header className="header-login-register">
        <a href="/">Sign In</a>
      </header>
      <main className="main-login">
        <form onSubmit={handleSubmit} className="form-register">
          <div className="error-message">
            {message && <span>{message}</span>}
          </div>

          <input
            className=""
            type="text"
            placeholder="Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            className=""
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            id="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="button-login-register">
            Sign Up
          </button>
        </form>
      </main>
      <footer className="footer-login-register">
        <a
          href="https://github.com/JoaoPMV"
          target="_blank"
          rel="noopener noreferrer"
          className="dev-info"
        >
          <FaGithub className="git-icon" />
          <span>JoãoP Dev</span>
        </a>
      </footer>
    </div>
  );
};

export default Register;
