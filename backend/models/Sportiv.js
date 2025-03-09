const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Club = require("./Club");

const Sportiv = sequelize.define("Sportiv", {
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
    allowNull: false, // Un sportiv trebuie să fie afiliat unui club
  },
}, { timestamps: true });

Sportiv.belongsTo(Club, { foreignKey: "ClubId", onDelete: "CASCADE" });

module.exports = Sportiv;
