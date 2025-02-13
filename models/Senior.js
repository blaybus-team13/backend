const mongoose = require("mongoose");

const seniorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tel: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  profileImage: { type: String, required: false },
  services: { type: [String], required: true },
  workingDays: { type: [String], required: true },
  workingHours: { type: [Number], required: true },
  minSalary: { type: Number, required: true },
  info: {
    gender: { type: String, required: true },
    weight: { type: Number, required: true },
    hasCohabitant: { type: Boolean, required: true },
  },
});

module.exports = mongoose.model("Senior", seniorSchema);

// 나이, 등급, 등급 정보, 근무지, 담당자 연락처(tel은 어르신 연락처)
