import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/users";
import "./Data.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Email is required");
      return;
    }

    if (!password) {
      setMessage("Password is required");
      return;
    }

    try {
      const token = await loginUser({
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", token);

      navigate("/levels");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <div className="levels-blur"></div>
      <div className="data-container">
        <form className="data-form" onSubmit={handleSubmit} noValidate>
          <h1>Login</h1>
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

          <button type="submit">Enter</button>

          <div className="data-result">
            {message && <p className="msg-error">{message}</p>}
          </div>
        </form>

        <div className="data-navigators">
          <button type="button" onClick={() => navigate("/register")}>
            Create User
          </button>
          <button type="button" onClick={() => navigate("/forgot-password")}>
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
