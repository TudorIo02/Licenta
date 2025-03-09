const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Club = sequelize.define("Club", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nume: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  locatie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { timestamps: true });

module.exports = Club;
