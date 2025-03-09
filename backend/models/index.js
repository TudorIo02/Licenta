const sequelize = require("../config/database");
const Sportiv = require("./Sportiv");
const Antrenor = require("./Antrenor");
const Club = require("./Club");

// Relații
Club.hasMany(Sportiv, { foreignKey: "ClubId" });
Club.hasMany(Antrenor, { foreignKey: "ClubId" });

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Baza de date sincronizată!");
  } catch (error) {
    console.error("❌ Eroare la sincronizarea bazei de date:", error);
  }
};

module.exports = { sequelize, syncDB, Sportiv, Antrenor, Club };
