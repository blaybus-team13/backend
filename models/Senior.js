const mongoose = require("mongoose");

const seniorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tel: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  profileImage: { type: String, required: false },
  services: { type: [String], required: true },
  workingDays: { type: [String], required: true },
  workingHours: { type: [Number], required: true },
  address: { type: String, required: true },
  minSalary: { type: Number, required: true },
});

module.exports = mongoose.model("Senior", seniorSchema);
