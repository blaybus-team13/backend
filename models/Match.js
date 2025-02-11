const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Match = sequelize.define("Match", {
  carerId: {
    type: DataTypes.INTEGER,
    references: { model: Carer, key: "id" },
  },
  seniorId: {
    type: DataTypes.INTEGER,
    references: { model: Senior, key: "id" },
  },
  requestedBy: {
    type: DataTypes.ENUM("CARER", "SENIOR"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED", "CANCELED"),
    defaultValue: "PENDING",
  },
  requestedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  respondedAt: {
    type: DataTypes.DATE,
  },
});

module.exports = Match;
