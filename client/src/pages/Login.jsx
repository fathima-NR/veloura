import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      navigate(location.state?.from || "/account");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (user) {
    return (
      <div className="wrap page empty">
        <h1>You are signed in.</h1>
        <Link className="btn btn-fill" to="/account">
          Go to account
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap page auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <p className="eyebrow">Account</p>
        <h1>Welcome back.</h1>
        <label className="field">
          Email
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="field">
          Password
          <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-fill" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        <p className="hint">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
