const { Sequelize } = require("sequelize");
require("dotenv").config(); // Pentru a încărca variabilele din .env

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false, // Dezactivează logurile SQL în consolă
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectat la baza de date!");
  } catch (error) {
    console.error("❌ Eroare la conectarea la baza de date:", error);
  }
})();

module.exports = sequelize;
