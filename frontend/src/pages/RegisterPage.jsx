import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [cluburi, setCluburi] = useState([]);
  const [formData, setFormData] = useState({
    nume: "",
    email: "",
    parola: "",
    tip: "sportiv",
    ClubId: "", // ID-ul clubului ales
  });

  // ✅ Fetch cluburi din backend la încărcarea paginii
  useEffect(() => {
    axios.get("http://localhost:5001/api/cluburi")
      .then((res) => setCluburi(res.data))
      .catch((err) => console.error("Eroare la încărcarea cluburilor:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data Trimisa:", formData); // Debugging

    try {
      const response = await axios.post(
        "http://localhost:5001/api/autentificare/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Înregistrare reușită!");
      navigate("/login");
    } catch (error) {
      console.error("Eroare la înregistrare:", error.response?.data?.error || error.message);
      alert(`Eroare: ${error.response?.data?.error || "A apărut o problemă!"}`);
    }
  };

  return (
    <div className="register-container">
      <h2>Înregistrare</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nume:
          <input type="text" name="nume" value={formData.nume} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Parolă:
          <input type="password" name="parola" value={formData.parola} onChange={handleChange} required />
        </label>
        <label>
          Tip utilizator:
          <select name="tip" value={formData.tip} onChange={handleChange}>
            <option value="sportiv">Sportiv</option>
            <option value="antrenor">Antrenor</option>
          </select>
        </label>
        <label>
          Club:
          <select name="ClubId" value={formData.ClubId} onChange={handleChange} required>
            <option value="">Alege un club...</option>
            {cluburi.map((club) => (
              <option key={club.id} value={club.id}>
                {club.nume}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Înregistrează-te</button>
      </form>
    </div>
  );
};

export default RegisterPage;
