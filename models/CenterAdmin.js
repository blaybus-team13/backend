const mongoose = require("mongoose");

const centerAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userid: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  tel: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  centerAddress: {
    centerCity: { type: String, required: true }, // 센터주소 시
    centerDistrict: { type: String, required: true }, // 센터주소 구
    centerNeighborhood: { type: String, required: true }, // 센터주소 동
  },
  profileImage: { type: String, required: false },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center",
    required: true,
  },
});

module.exports = mongoose.model("centerAdmin", centerAdminSchema);
