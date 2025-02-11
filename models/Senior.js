const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Senior = sequelize.define("Senior", {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true,
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

module.exports = Senior;
