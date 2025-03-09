const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Sportiv, Club } = require("../models");
const autentificare = require("../middleware/authMiddleware");

// ✅ Înregistrare sportiv nou
router.post("/register", async (req, res) => {
  try {
    const { nume, email, parola, ClubId } = req.body;

    // Verificăm dacă utilizatorul există deja
    const sportivExistent = await Sportiv.findOne({ where: { email } });
    if (sportivExistent) {
      return res.status(400).json({ error: "Email-ul este deja folosit!" });
    }

    // Verifică dacă clubul selectat există
    const clubExistent = await Club.findByPk(ClubId);
    if (!clubExistent) {
      return res.status(400).json({ error: "Clubul selectat nu există!" });
    }

    // Criptăm parola
    const hashedPassword = await bcrypt.hash(parola, 10);

    // Creăm utilizatorul
    const sportiv = await Sportiv.create({ nume, email, parola: hashedPassword, ClubId });

    res.status(201).json({ mesaj: "Sportiv creat cu succes!" });
  } catch (error) {
    res.status(500).json({ error: "Eroare la înregistrare!" });
  }
});

// ✅ Obținerea profilului sportivului autentificat
router.get("/profil", autentificare, async (req, res) => {
  try {
    const sportiv = await Sportiv.findByPk(req.utilizator.id, {
      attributes: { exclude: ["parola"] },
      include: { model: Club, attributes: ["nume", "locatie"] }, // Include detalii despre club
    });

    if (!sportiv) {
      return res.status(404).json({ error: "Sportivul nu a fost găsit!" });
    }

    res.json(sportiv);
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea profilului!" });
  }
});

// ✅ Actualizarea profilului sportivului (inclusiv schimbarea clubului)
router.put("/profil", autentificare, async (req, res) => {
  try {
    const { nume, email, ClubId } = req.body;
    const sportiv = await Sportiv.findByPk(req.utilizator.id);

    if (!sportiv) {
      return res.status(404).json({ error: "Sportivul nu a fost găsit!" });
    }

    // Dacă utilizatorul vrea să schimbe clubul, verificăm dacă clubul există
    if (ClubId) {
      const clubExistent = await Club.findByPk(ClubId);
      if (!clubExistent) {
        return res.status(400).json({ error: "Clubul selectat nu există!" });
      }
      sportiv.ClubId = ClubId;
    }

    sportiv.nume = nume || sportiv.nume;
    sportiv.email = email || sportiv.email;

    await sportiv.save();
    res.json({ mesaj: "Profil actualizat cu succes!", sportiv });
  } catch (error) {
    res.status(500).json({ error: "Eroare la actualizarea profilului!" });
  }
});

module.exports = router;
