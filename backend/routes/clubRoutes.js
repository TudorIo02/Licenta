const express = require("express");
const router = express.Router();
const { Club } = require("../models");

// ✅ API pentru obținerea tuturor cluburilor
router.get("/", async (req, res) => {
  try {
    const cluburi = await Club.findAll();
    res.json(cluburi);
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea cluburilor" });
  }
});

// ✅ API pentru a adăuga un club nou
router.post("/", async (req, res) => {
  try {
    const { nume } = req.body;
    if (!nume) {
      return res.status(400).json({ error: "Numele clubului este obligatoriu!" });
    }

    const club = await Club.create({ nume });
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: "Eroare la crearea clubului!" });
  }
});

module.exports = router;
