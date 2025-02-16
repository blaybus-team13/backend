const mongoose = require("mongoose");

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

module.exports = mongoose.model("centerAdmin", centerAdminSchema);
