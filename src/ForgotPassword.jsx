import { useState } from "react";
import { forgotPassword } from "./users";
import { useNavigate } from "react-router-dom";
import "./Data.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await forgotPassword(email);

    console.log(response);
  }

  return (
    <div className="data-container">
      <form className="data-form" onSubmit={handleSubmit}>
        <p>
          Please enter your email address. You will receive an email with a link
          to reset your password.
        </p>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send link</button>
      </form>

      <div className="data-navigators">
        <button type="button" onClick={() => navigate("/")}>
          Login
        </button>
        <button type="button" onClick={() => navigate("/register")}>
          Forgot Password
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
