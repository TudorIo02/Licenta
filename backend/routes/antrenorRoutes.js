const express = require("express");
const router = express.Router();
const { Antrenor } = require("../models");
const autentificare = require("../middleware/authMiddleware");

// ✅ API pentru a adăuga un antrenor nou
router.post("/", async (req, res) => {
  try {
    const { nume, email, parola } = req.body;
    const antrenor = await Antrenor.create({ nume, email, parola });
    res.status(201).json(antrenor);
  } catch (error) {
    res.status(500).json({ error: "Eroare la crearea antrenorului" });
  }
});

// ✅ API pentru a obține lista tuturor antrenorilor
router.get("/", async (req, res) => {
  try {
    const antrenori = await Antrenor.findAll();
    res.json(antrenori);
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea antrenorilor" });
  }
});

// ✅ API pentru a obține un antrenor după ID
router.get("/:id", async (req, res) => {
  try {
    const antrenor = await Antrenor.findByPk(req.params.id);
    if (!antrenor) return res.status(404).json({ error: "Antrenorul nu există!" });
    res.json(antrenor);
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea antrenorului" });
  }
});

// ✅ API pentru actualizarea datelor unui antrenor (autentificare necesară)
router.put("/:id", autentificare, async (req, res) => {
  try {
    const { nume, email } = req.body;
    const antrenor = await Antrenor.findByPk(req.params.id);

    if (!antrenor) return res.status(404).json({ error: "Antrenorul nu există!" });

    // Actualizare date
    antrenor.nume = nume || antrenor.nume;
    antrenor.email = email || antrenor.email;

    await antrenor.save();
    res.json(antrenor);
  } catch (error) {
    res.status(500).json({ error: "Eroare la actualizarea antrenorului" });
  }
});

// ✅ API pentru ștergerea unui antrenor (autentificare necesară)
router.delete("/:id", autentificare, async (req, res) => {
  try {
    const antrenor = await Antrenor.findByPk(req.params.id);
    if (!antrenor) return res.status(404).json({ error: "Antrenorul nu există!" });

    await antrenor.destroy();
    res.json({ mesaj: "Antrenor șters cu succes!" });
  } catch (error) {
    res.status(500).json({ error: "Eroare la ștergerea antrenorului" });
  }
});

module.exports = router;
