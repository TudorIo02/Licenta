const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sportiv, Antrenor } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "secrettoken123";

// ✅ API pentru înregistrarea utilizatorilor (Sportiv sau Antrenor)
router.post("/register", async (req, res) => {
  try {
    console.log("🔍 [DEBUG] Date primite la înregistrare:", req.body);

    const { nume, email, parola, tip, ClubId } = req.body;
    
    // 📌 Verifică dacă toate câmpurile sunt completate
    if (!nume || !email || !parola || !tip || !ClubId) {
      return res.status(400).json({ error: "Toate câmpurile sunt obligatorii!" });
    }

    // 🔎 Căutăm utilizatorul în baza de date
    let utilizatorExistent = await Sportiv.findOne({ where: { email } });
    if (!utilizatorExistent) {
      utilizatorExistent = await Antrenor.findOne({ where: { email } });
    }
    if (utilizatorExistent) {
      return res.status(400).json({ error: "Email-ul este deja folosit!" });
    }

    // 🔑 Criptăm parola
    const hashedPassword = await bcrypt.hash(parola, 10);

    // ✨ Creăm utilizatorul în funcție de tip
    let utilizatorNou;
    if (tip === "sportiv") {
      utilizatorNou = await Sportiv.create({ nume, email, parola: hashedPassword, ClubId });
    } else if (tip === "antrenor") {
      utilizatorNou = await Antrenor.create({ nume, email, parola: hashedPassword, ClubId });
    } else {
      return res.status(400).json({ error: "Tip invalid! Alege 'sportiv' sau 'antrenor'." });
    }

    console.log("✅ [DEBUG] Utilizator creat cu succes:", utilizatorNou);

    res.status(201).json({ mesaj: "Utilizator creat cu succes!", utilizator: utilizatorNou });
  } catch (error) {
    console.error("❌ [EROARE] La înregistrare:", error);
    res.status(500).json({ error: "Eroare la înregistrare!" });
  }
});

// ✅ API pentru autentificare (Login)
router.post("/login", async (req, res) => {
  try {
    console.log("🔍 [DEBUG] Date primite la login:", req.body);

    const { email, parola } = req.body;

    if (!email || !parola) {
      return res.status(400).json({ error: "Email și parolă sunt necesare!" });
    }

    // 🔍 Căutăm utilizatorul în baza de date
    let utilizator = await Sportiv.findOne({ where: { email } });
    if (!utilizator) {
      utilizator = await Antrenor.findOne({ where: { email } });
    }

    if (!utilizator) {
      return res.status(404).json({ error: "Utilizatorul nu există!" });
    }

    // 🔑 Comparăm parola introdusă cu cea criptată din DB
    const parolaCorecta = await bcrypt.compare(parola, utilizator.parola);
    if (!parolaCorecta) {
      return res.status(401).json({ error: "Parolă incorectă!" });
    }

    // 🎟 Generăm un token JWT
    const token = jwt.sign(
      { id: utilizator.id, email: utilizator.email, tip: utilizator.constructor.name, ClubId: utilizator.ClubId },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("✅ [DEBUG] Autentificare reușită pentru:", utilizator.email);

    res.json({ mesaj: "Autentificare reușită!", token, utilizator });
  } catch (error) {
    console.error("❌ [EROARE] La autentificare:", error);
    res.status(500).json({ error: "Eroare la autentificare!" });
  }
});

module.exports = router;
