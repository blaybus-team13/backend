const mongoose = require("mongoose");

const centerAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userid: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  tel: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  address: { type: String, required: true },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center",
    required: true,
  },
});

module.exports = mongoose.model("centerAdmin", centerAdminSchema);
