const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sportiv, Antrenor } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "secrettoken123";

// ✅ API pentru înregistrarea utilizatorilor (Sportiv sau Antrenor)
router.post("/register", async (req, res) => {
  try {
    const { nume, email, parola, tip } = req.body;

    // Verificăm dacă toate câmpurile necesare sunt completate
    if (!nume || !email || !parola || !tip) {
      return res.status(400).json({ error: "Toate câmpurile sunt obligatorii!" });
    }

    // Verificăm dacă utilizatorul există deja
    let utilizatorExistent = await Sportiv.findOne({ where: { email } });
    if (!utilizatorExistent) {
      utilizatorExistent = await Antrenor.findOne({ where: { email } });
    }

    if (utilizatorExistent) {
      return res.status(400).json({ error: "Email-ul este deja folosit!" });
    }

    // 🔑 Criptăm parola înainte de salvare
    const hashedPassword = await bcrypt.hash(parola, 10);

    // Alegem unde salvăm utilizatorul în funcție de `tip`
    let utilizatorNou;
    if (tip === "sportiv") {
      utilizatorNou = await Sportiv.create({ nume, email, parola: hashedPassword });
    } else if (tip === "antrenor") {
      utilizatorNou = await Antrenor.create({ nume, email, parola: hashedPassword });
    } else {
      return res.status(400).json({ error: "Tipul utilizatorului trebuie să fie 'sportiv' sau 'antrenor'!" });
    }

    res.status(201).json({ mesaj: "Utilizator creat cu succes!" });
  } catch (error) {
    res.status(500).json({ error: "Eroare la înregistrare!" });
  }
});

// ✅ API pentru autentificare (Login)
router.post("/login", async (req, res) => {
  try {
    const { email, parola } = req.body;

    // 🔍 Căutăm utilizatorul în baza de date
    let utilizator = await Sportiv.findOne({ where: { email } });
    let tipUtilizator = "sportiv";
    if (!utilizator) {
      utilizator = await Antrenor.findOne({ where: { email } });
      tipUtilizator = "antrenor";
    }

    if (!utilizator) {
      return res.status(404).json({ error: "Utilizatorul nu există!" });
    }

    // 🔑 Comparăm parola introdusă cu cea din DB
    const parolaCorecta = await bcrypt.compare(parola, utilizator.parola);
    if (!parolaCorecta) {
      return res.status(401).json({ error: "Parolă incorectă!" });
    }

    // 🎟 Generăm un token JWT
    const token = jwt.sign(
      { id: utilizator.id, email: utilizator.email, tip: tipUtilizator },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ mesaj: "Autentificare reușită!", token, tip: tipUtilizator });
  } catch (error) {
    res.status(500).json({ error: "Eroare la autentificare!" });
  }
});

module.exports = router;
