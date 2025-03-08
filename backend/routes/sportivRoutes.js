const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Sportiv } = require("../models");
const autentificare = require("../middleware/authMiddleware");

// ✅ API pentru înregistrarea unui sportiv nou (cu parola criptată)
router.post("/register", async (req, res) => {
  try {
    const { nume, email, parola } = req.body;

    // Verifică dacă utilizatorul există deja
    const sportivExistent = await Sportiv.findOne({ where: { email } });
    if (sportivExistent) {
      return res.status(400).json({ error: "Email-ul este deja folosit!" });
    }

    // 🔑 Criptăm parola înainte de salvare
    const hashedPassword = await bcrypt.hash(parola, 10);

    // Creăm utilizatorul în baza de date
    const sportiv = await Sportiv.create({ nume, email, parola: hashedPassword });

    res.status(201).json({ mesaj: "Sportiv creat cu succes!" });
  } catch (error) {
    res.status(500).json({ error: "Eroare la înregistrare!" });
  }
});

// ✅ API pentru obținerea profilului sportivului autentificat
router.get("/profil", autentificare, async (req, res) => {
  try {
    const sportiv = await Sportiv.findByPk(req.utilizator.id, { attributes: { exclude: ["parola"] } });

    if (!sportiv) {
      return res.status(404).json({ error: "Sportivul nu a fost găsit!" });
    }

    res.json(sportiv);
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea profilului!" });
  }
});

// ✅ API pentru actualizarea profilului sportivului autentificat
router.put("/profil", autentificare, async (req, res) => {
  try {
    const { nume, email } = req.body;

    const sportiv = await Sportiv.findByPk(req.utilizator.id);
    if (!sportiv) {
      return res.status(404).json({ error: "Sportivul nu a fost găsit!" });
    }

    // Actualizăm doar câmpurile trimise
    sportiv.nume = nume || sportiv.nume;
    sportiv.email = email || sportiv.email;

    await sportiv.save();
    res.json({ mesaj: "Profil actualizat cu succes!", sportiv });
  } catch (error) {
    res.status(500).json({ error: "Eroare la actualizarea profilului!" });
  }
});

// ✅ API pentru ștergerea contului sportivului autentificat
router.delete("/profil", autentificare, async (req, res) => {
  try {
    const sportiv = await Sportiv.findByPk(req.utilizator.id);
    if (!sportiv) {
      return res.status(404).json({ error: "Sportivul nu a fost găsit!" });
    }

    await sportiv.destroy();
    res.json({ mesaj: "Contul a fost șters!" });
  } catch (error) {
    res.status(500).json({ error: "Eroare la ștergerea contului!" });
  }
});

module.exports = router;
