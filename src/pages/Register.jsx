import { useState } from "react";
import { createUser } from "../services/users";
import { useNavigate } from "react-router-dom";
import "./Data.css";

const PROFICIENCY_LEVELS = [
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
];

function validateUser({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  proficiency,
}) {
  if (!firstName.trim()) return "First name is required.";
  if (!lastName.trim()) return "Last name is required.";
  if (!email.trim()) return "E-mail is required.";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid e-mail.";
  if (password.length < 6 || password.length > 64) {
    return "A senha deve ter entre 6 e 64 caracteres";
  }
  if (password !== confirmPassword) return "As senhas não coincidem";
  if (!proficiency) return "Selecione seu nível de inglês";

  return null;
}

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [proficiency, setProficiency] = useState("");
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
      proficiency,
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
        proficiency,
      });

      setSuccess(true);
      setMessage("Usuário criado com sucesso");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setProficiency("");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <div className="levels-blur"></div>
      <div className="data-container">
        <form className="data-form" onSubmit={handleSubmit} noValidate>
          <p>Cadastro</p>
          <input
            type="text"
            placeholder="Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Last Name"
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <fieldset className="proficiency-group">
            <legend>Nível de inglês</legend>
            {PROFICIENCY_LEVELS.map((level) => (
              <label key={level.value} className="proficiency-option">
                <input
                  type="radio"
                  name="proficiency"
                  value={level.value}
                  checked={proficiency === level.value}
                  onChange={(e) => setProficiency(e.target.value)}
                />
                {level.label}
              </label>
            ))}
          </fieldset>

          <button type="submit">Register</button>

          <div className="data-result">
            {message && (
              <p className={success ? "msg-success" : "msg-error"}>{message}</p>
            )}
          </div>
        </form>

        <div className="data-navigators">
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>
          <button type="button" onClick={() => navigate("/forgot-password")}>
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
