import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./Auth.css";

function ForgotPasswordPage() {
  const { resetPassword } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await resetPassword(email);

      setMessage(
        "Password reset email sent! Please check your inbox."
      );
    } catch (err) {
      console.log(err);
      setError("Unable to send password reset email.");
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        {message && (
          <p style={{ color: "green", marginBottom: "15px" }}>
            {message}
          </p>
        )}

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <div className="form-group">
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          className="auth-btn"
          type="submit"
        >
          Send Reset Email
        </button>

        <p className="auth-switch">
          <Link to="/login">
            Back to Login
          </Link>
        </p>
      </form>
    </section>
  );
}

export default ForgotPasswordPage;