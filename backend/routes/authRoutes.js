const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sportiv, Antrenor } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "secrettoken123";

// ✅ API pentru înregistrarea utilizatorilor (Sportiv sau Antrenor)
router.post("/register", async (req, res) => {
  try {
    console.log("Date primite la înregistrare:", req.body); // Debugging

    const { nume, email, parola, tip, ClubId } = req.body;
    if (!nume || !email || !parola || !tip || !ClubId) {
      return res.status(400).json({ error: "Toate câmpurile sunt obligatorii!" });
    }

    // Verifică dacă utilizatorul există deja
    let utilizatorExistent = await Sportiv.findOne({ where: { email } });
    if (!utilizatorExistent) {
      utilizatorExistent = await Antrenor.findOne({ where: { email } });
    }
    if (utilizatorExistent) {
      return res.status(400).json({ error: "Email-ul este deja folosit!" });
    }

    // Criptăm parola
    const hashedPassword = await bcrypt.hash(parola, 10);

    // Creăm utilizatorul în funcție de tip
    let utilizatorNou;
    if (tip === "sportiv") {
      utilizatorNou = await Sportiv.create({ nume, email, parola: hashedPassword, ClubId });
    } else if (tip === "antrenor") {
      utilizatorNou = await Antrenor.create({ nume, email, parola: hashedPassword, ClubId });
    } else {
      return res.status(400).json({ error: "Tip invalid!" });
    }

    res.status(201).json({ mesaj: "Utilizator creat cu succes!" });
  } catch (error) {
    console.error("Eroare la înregistrare:", error);
    res.status(500).json({ error: "Eroare la înregistrare!" });
  }
});

module.exports = router;
