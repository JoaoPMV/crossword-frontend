import { useState } from "react";
import { createUser } from "./users";
import { useNavigate } from "react-router-dom";
import "./Data.css";

function validateUser({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}) {
  if (!firstName.trim()) return "First name is required.";
  if (!lastName.trim()) return "Last name is required.";
  if (!email.trim()) return "E-mail is required.";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid e-mail.";
  if (password.length < 6 || password.length > 64) {
    return "A senha deve ter entre 6 e 64 caracteres";
  }
  if (password !== confirmPassword) return "As senhas não coincidem";
  return null;
}

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    const error = validateUser({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (error) {
      setMessage(error);
      return;
    }

    try {
      await createUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(true);
      setMessage("Usuário criado com sucesso");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="data-container">
      <form className="data-form" onSubmit={handleSubmit} noValidate>
        <h1>Cadastro</h1>
        <input
          type="text"
          placeholder="Nome"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Sobrenome"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Cadastrar</button>

        <div className="data-result">
          {message && (
            <p className={success ? "msg-success" : "msg-error"}>{message}</p>
          )}
        </div>
      </form>

      <div className="data-navigators">
        <button type="button" onClick={() => navigate("/")}>
          Login
        </button>
        <button type="button" onClick={() => navigate("/forgot-password")}>
          Forgot Password
        </button>
      </div>
    </div>
  );
}

export default Register;
