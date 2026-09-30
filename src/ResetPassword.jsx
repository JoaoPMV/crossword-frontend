import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "./users";
import "./Data.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      await resetPassword(token, password);
      navigate("/");
    } catch {
      setError("Unable to reset password");
    }
  }

  return (
    <div className="data-container">
      <form className="data-form" onSubmit={handleSubmit}>
        <p>Please enter your new password.</p>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
        />

        {error && <p>{error}</p>}

        <button type="submit">Reset password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
