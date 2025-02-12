const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  carerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carer",
    required: true,
  },
  seniorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Senior",
    required: true,
  },
  requestedBy: { type: String, required: true },
  status: { type: String, required: true },
  requestedAt: { type: Date, required: true },
  respondedAt: { type: Date, required: false },
});

module.exports = mongoose.model("Match", matchSchema);
