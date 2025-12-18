import React, { useState } from "react";
import api from "../api";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/login", form);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="brand-name">🛒 ShoppingApp</h1>
        <p className="subtitle">SignUp to shopping</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="✉ Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required/>

          <input type="password"  placeholder="🔑Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}  required/>

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <div className="extra-links">
          <a href="/forgot-password">Forgot Password?</a>
          <p>
            New here? <a href="/signup">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}
