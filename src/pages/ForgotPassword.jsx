import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api";
import "./Data.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email.trim());
      alert("E-mail de recuperação enviado!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  return (
    <div className="dataContainer">
      <form className="dataForm" onSubmit={handleSubmit}>
        <p>You willl receibe an email with a link to reset your password</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
      <div className="dataNavigation">
        <Link to="/">Login</Link> <Link to="/register">Register</Link>
      </div>
    </div>
  );
};
export default ForgotPassword;
