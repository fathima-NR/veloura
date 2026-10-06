import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function setField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register(form);
      navigate("/account");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (user) {
    return (
      <div className="wrap page empty">
        <h1>You already have an account open.</h1>
        <Link className="btn" to="/account">
          View account
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap page auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <p className="eyebrow">Account</p>
        <h1>Join the house.</h1>
        <label className="field">
          Name
          <input name="name" required value={form.name} onChange={setField} />
        </label>
        <label className="field">
          Email
          <input name="email" type="email" required value={form.email} onChange={setField} />
        </label>
        <label className="field">
          Password
          <input name="password" type="password" minLength={6} required value={form.password} onChange={setField} />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-fill" type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create account"}
        </button>
        <p className="hint">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
