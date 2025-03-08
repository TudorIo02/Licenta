require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secrettoken123";

// 🛡 Middleware pentru protecția rutelor
const autentificare = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extrage token-ul din "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: "Acces interzis! Token lipsă." });
  }

  try {
    const verificare = jwt.verify(token, JWT_SECRET);
    req.utilizator = verificare; // Adaugă datele utilizatorului în `req`
    next(); // Trecem la următoarea funcție
  } catch (error) {
    res.status(403).json({ error: "Token invalid!" });
  }
};

module.exports = autentificare;
