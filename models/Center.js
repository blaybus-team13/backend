const mongoose = require("mongoose");

const centerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tel: { type: String, required: true },
  address: { type: [String], required: true },
  hasVehicle: { type: Boolean, required: true },
  operatingEntity: { type: String, required: true },
  currentWorkers: { type: String, required: true },
  centerGrade: { type: Number, required: false },
  operationYears: { type: Number, required: false },
  shortBio: { type: String, required: false },
});

module.exports = mongoose.model("Center", centerSchema);
