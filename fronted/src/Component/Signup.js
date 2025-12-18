import React, { useState } from "react";
import api from "../api";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null); // for error handling
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-main">
      <form onSubmit={handleSubmit} className="form">
        <div className="signup-heading">
          <h2 id="signup">
            <b>📝 Sign Up</b>
          </h2>
        </div>

        <div className="signup-content"> 
          <input  id="name" placeholder="👤 Name" onChange={(e) => setForm({ ...form, name: e.target.value })}  required/>
          <input  id="email" type="email" placeholder="📧 Email"  onChange={(e) => setForm({ ...form, email: e.target.value })}  required/>
          <input id="password"  type="password" placeholder="🔑 Password" onChange={(e) => setForm({ ...form, password: e.target.value })}  required/>
          <button type="submit">✅ Sign Up</button>

          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </div>
  );
}
