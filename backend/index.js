const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Încarcă fișierele de configurare și variabilele de mediu

const app = express();
const port = process.env.PORT || 5001;

app.use(cors()); // Permite cereri de la frontend
app.use(express.json()); // Permite procesarea datelor JSON

// ✅ Import modele și sincronizare baza de date
const { syncDB } = require("./models");
syncDB(); // Sincronizează modelele înainte de a porni serverul

// ✅ Import rute
const sportivRoutes = require("./routes/sportivRoutes");
const antrenorRoutes = require("./routes/antrenorRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ Definim rutele
app.use("/api/sportivi", sportivRoutes);
app.use("/api/antrenori", antrenorRoutes);
app.use("/api/autentificare", authRoutes);

// ✅ Rută de test
app.get("/", (req, res) => {
  res.send("Hello from Backend!");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Serverul rulează pe portul ${port}`);
});
