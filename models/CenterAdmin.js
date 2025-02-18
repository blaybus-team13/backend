const mongoose = require("mongoose");

// 주소 스키마 정의
const addressSchema = new mongoose.Schema({
  city: { type: String, required: true }, // 시
  subCity: { type: String, required: true }, // 구
  subSubCity: { type: String, required: true }, // 동
});

const centerAdminSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  tel: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  address: { type: addressSchema, required: true },
  profileImage: { type: String, required: false },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center",
    required: true,
  },
});

centerAdminSchema.index({
  "address.city": 1,
  "address.subCity": 1,
  "address.subSubCity": 1,
});

module.exports = mongoose.model("CenterAdmin", centerAdminSchema);
