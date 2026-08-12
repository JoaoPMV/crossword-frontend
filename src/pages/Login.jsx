import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { useAuth } from "../context/authContext"; // Importa o hook
import { FaGithub } from "react-icons/fa";
import "./pages.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const { setUser } = useAuth(); // Pega a função do contexto
  const navigate = useNavigate();

  const loginData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);

      if (response.token && response.user) {
        localStorage.setItem("authToken", response.token);
        setUser(response.user);

        setTimeout(() => {
          navigate("/crossword");
        }, 0);
      } else {
        setMessage("Nenhum token ou usuário recebido na resposta.");
      }
    } catch (error) {
      setMessage(error.message || "Erro ao fazer login.");
    }
  };

  return (
    <div>
      <div className="container-login-register">
        <header className="header-login-register">
          <a href="/register">Sign Up</a>
        </header>
        <main className="main-login">
          <form onSubmit={loginSubmit} className="form-login">
            <p className="error-login">{message}</p>

            <input
              className=""
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={formData.email}
              onChange={loginData}
              required
            />

            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={loginData}
              required
            />

            <button type="submit" className="button-login-register">
              Sign In
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
    </div>
  );
};

export default Login;
