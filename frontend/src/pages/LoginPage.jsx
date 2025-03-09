import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", parola: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5001/api/autentificare/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data.utilizator)); // Salvează user-ul în localStorage
      setUser(data.utilizator); // Actualizează state-ul
      navigate("/"); // Redirecționează la homepage
    } else {
      alert(`Eroare: ${data.error}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Autentificare</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Parolă:</label>
        <input type="password" name="parola" value={formData.parola} onChange={handleChange} required />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
