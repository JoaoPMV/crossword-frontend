import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

import "./Data.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

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

        setTimeout(() => {
          navigate("/list");
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
      <div className="dataContainer">
        <form onSubmit={loginSubmit} className="dataForm">
          <p className="error-login">{message}</p>
          <input
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

          <button type="submit">Login</button>
        </form>
        <div className="dataNavigation">
          <a href="/register">Register</a>
          <a href="/forgot-password">Forgot Password</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
