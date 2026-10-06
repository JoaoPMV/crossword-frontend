import { useState } from "react";
import { forgotPassword } from "../services/users";
import { useNavigate } from "react-router-dom";
import "./Data.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      setSuccess("");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);

      console.log(response);

      setEmail("");
      setSuccess("Password reset link sent successfully.");
    } catch {
      setError("Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="levels-blur"></div>
      <div className="data-container">
        <form className="data-form" onSubmit={handleSubmit}>
          <p>
            Please enter your email address. You will receive an email with a
            link to reset your password.
          </p>

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setSuccess("");
            }}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send link"}
          </button>

          <div className="data-result">
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
          </div>
        </form>

        <div className="data-navigators">
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>

          <button type="button" onClick={() => navigate("/register")}>
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
