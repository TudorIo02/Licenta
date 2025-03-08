const sequelize = require("../config/database");
const Sportiv = require("./Sportiv");
const Antrenor = require("./Antrenor");

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Modelele au fost sincronizate cu baza de date!");
  } catch (error) {
    console.error("❌ Eroare la sincronizarea modelelor:", error);
  }
};

module.exports = { Sportiv, Antrenor, syncDB };
