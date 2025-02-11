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
  careAssitantCert: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  socialWorkerCert: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nursingAssistantCert: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hasVehicle: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasDementiaTraining: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workingArea: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workingHours: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expectedSalary: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Carer;
