import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../services/users";
import "./Data.css";

const PROFICIENCY_LEVELS = [
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
];

// Lê o id do usuário dentro do JWT. Ajuste o nome do claim se for diferente.
function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload.id ?? payload.userId ?? null;
  } catch {
    return null;
  }
}

function validateProfile({ firstName, lastName, email, proficiency }) {
  if (!firstName.trim()) return "First name is required.";
  if (!lastName.trim()) return "Last name is required.";
  if (!email.trim()) return "E-mail is required.";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid e-mail.";
  if (!proficiency) return "Selecione seu nível de inglês";
  return null;
}

function UserProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    async function loadUser() {
      try {
        const user = await getUserById(userId);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setProficiency(user.proficiency);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    const error = validateProfile({ firstName, lastName, email, proficiency });

    if (error) {
      setMessage(error);
      return;
    }

    try {
      await updateUser(userId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        proficiency,
      });

      setSuccess(true);
      setMessage("Perfil atualizado com sucesso");
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (loading) {
    return (
      <div className="data-container">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="data-container">
      <form className="data-form" onSubmit={handleSubmit} noValidate>
        <h1>Your Profile</h1>

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

        <fieldset className="proficiency-group">
          <legend>English Level</legend>
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

        <button type="submit">Save</button>

        <div className="data-result">
          {message && (
            <p className={success ? "msg-success" : "msg-error"}>{message}</p>
          )}
        </div>
      </form>

      <div className="data-navigators">
        <button type="button" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
