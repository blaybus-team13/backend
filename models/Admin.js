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
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hasVehicle: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  centerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  centerGrade: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  operationYears: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  shortBio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Carer;
