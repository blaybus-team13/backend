const mongoose = require("mongoose");

// 주소 스키마 정의
const addressSchema = new mongoose.Schema({
  city: { type: String, required: true }, // 시
  subCity: { type: String, required: true }, // 구
  subSubCity: { type: String, required: true }, // 동
});

const centerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tel: { type: String, required: true },
  address: { type: addressSchema, required: true },
  hasVehicle: { type: Boolean, required: true },
  operatingEntity: { type: String, required: true },
  currentWorkers: { type: String, required: true },
  centerGrade: { type: Number, required: false },
  operationYears: { type: Number, required: false },
  shortBio: { type: String, required: false },
});

centerSchema.index({
  "address.city": 1,
  "address.subCity": 1,
  "address.subSubCity": 1,
});

module.exports = mongoose.model("Center", centerSchema);
