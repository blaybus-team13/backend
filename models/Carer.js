const mongoose = require("mongoose");

const carerSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  tel: { type: String, required: true, unique: true },
  careAssitantCert: {
    type: {
      certNumber: { type: String, required: true },
      certImage: { type: String, required: true },
      isCertified: { type: Boolean, required: true },
    },
    required: true,
  },
  socialWorkerCert: {
    type: {
      certNumber: { type: String, required: true },
      certImage: { type: String, required: true },
      isCertified: { type: Boolean, required: true },
    },
    required: false,
  },
  nursingAssistantCert: {
    type: {
      certNumber: { type: String, required: true },
      certImage: { type: String, required: true },
      isCertified: { type: Boolean, required: true },
    },
    required: false,
  },
  profileImage: { type: String, required: false },
  hasVehicle: { type: Boolean, required: true },
  hasDementiaTraining: { type: Boolean, required: true },
  address: { type: String, required: true },
  workingArea: { type: String, required: true },
  jobCondition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobCondition",
    default: null,
  },
  images: { type: [String], required: false },
  workExperiences: {
    type: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "WorkExperience",
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Carer", carerSchema);
