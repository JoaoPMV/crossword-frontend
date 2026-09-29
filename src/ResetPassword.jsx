import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "./users";
import "./Data.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const response = await resetPassword(token, password);

    console.log(response);
  }

  return (
    <div className="data-container">
      <form className="data-form" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <p>Please enter your new password.</p>
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Redefinir senha</button>
      </form>
    </div>
  );
}

export default ResetPassword;
