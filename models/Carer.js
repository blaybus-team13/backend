const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carer = sequelize.define("Carer", {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
  },
  userid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tel: {
    type: DataTypes.STRING,
    unique: true,
  },
});

module.exports = Carer;
