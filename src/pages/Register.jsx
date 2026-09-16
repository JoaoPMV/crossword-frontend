import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import { registerUser } from "../api"; // Função da API
import { FaGithub } from "react-icons/fa";
import "./Data.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    <div className="dataContainer">
      <form onSubmit={handleSubmit} className="dataForm">
        <div className="error-message">{message && <span>{message}</span>}</div>

        <input
          type="text"
          placeholder="First Name"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
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
          Register
        </button>
      </form>
      <div className="dataNavigation">
        <a href="/">Login</a>
        <a href="/forgot-password">Forgot Password</a>
      </div>
    </div>
  );
};

export default Register;
