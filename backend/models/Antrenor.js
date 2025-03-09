const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Club = require("./Club");

const Antrenor = sequelize.define("Antrenor", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  parola: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ClubId: { 
    type: DataTypes.INTEGER,
    references: {
      model: Club,
      key: "id",
    },
    allowNull: false, // Un antrenor trebuie să fie asociat unui club
  },
}, { timestamps: true });

Antrenor.belongsTo(Club, { foreignKey: "ClubId", onDelete: "CASCADE" });

module.exports = Antrenor;
