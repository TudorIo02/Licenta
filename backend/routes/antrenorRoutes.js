const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Antrenor, Club } = require("../models");
const autentificare = require("../middleware/authMiddleware");

// ✅ Înregistrare antrenor nou
router.post("/register", async (req, res) => {
  try {
    const { nume, email, parola, ClubId } = req.body;

    // Verificăm dacă utilizatorul există deja
    const antrenorExistent = await Antrenor.findOne({ where: { email } });
    if (antrenorExistent) {
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
    const antrenor = await Antrenor.create({ nume, email, parola: hashedPassword, ClubId });

    res.status(201).json({ mesaj: "Antrenor creat cu succes!" });
  } catch (error) {
    res.status(500).json({ error: "Eroare la înregistrare!" });
  }
});

// ✅ Obținerea profilului antrenorului autentificat
router.get("/profil", autentificare, async (req, res) => {
  try {
    const antrenor = await Antrenor.findByPk(req.utilizator.id, {
      attributes: { exclude: ["parola"] },
      include: { model: Club, attributes: ["nume", "locatie"] }, // Include detalii despre club
    });

    if (!antrenor) {
      return res.status(404).json({ error: "Antrenorul nu a fost găsit!" });
    }

    res.json(antrenor);
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea profilului!" });
  }
});

// ✅ Actualizarea profilului antrenorului (inclusiv schimbarea clubului)
router.put("/profil", autentificare, async (req, res) => {
  try {
    const { nume, email, ClubId } = req.body;
    const antrenor = await Antrenor.findByPk(req.utilizator.id);

    if (!antrenor) {
      return res.status(404).json({ error: "Antrenorul nu a fost găsit!" });
    }

    // Dacă utilizatorul vrea să schimbe clubul, verificăm dacă clubul există
    if (ClubId) {
      const clubExistent = await Club.findByPk(ClubId);
      if (!clubExistent) {
        return res.status(400).json({ error: "Clubul selectat nu există!" });
      }
      antrenor.ClubId = ClubId;
    }

    antrenor.nume = nume || antrenor.nume;
    antrenor.email = email || antrenor.email;

    await antrenor.save();
    res.json({ mesaj: "Profil actualizat cu succes!", antrenor });
  } catch (error) {
    res.status(500).json({ error: "Eroare la actualizarea profilului!" });
  }
});

module.exports = router;
