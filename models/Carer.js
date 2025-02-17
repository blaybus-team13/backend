const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true }, //시
  subCity: { type: String, required: true }, //구
  subSubCity: { type: String, required: true }, //동
});

//주요 경력
const MainCareerSchema = new mongoose.Schema({
  institutionName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  roleDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  periodStart: {
    type: Date,
    required: true,
  },
  periodEnd: {
    type: Date,
    required: true,
  },
});

// 근무 조건
const workScheduleSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    required: true,
    enum: ["월", "화", "수", "목", "금", "토", "일"],
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

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
  address: {
    type: addressSchema,
    required: true,
  },

  workingArea: {
    type: [addressSchema],
    required: true,
  },
  jobCondition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobCondition",
    default: null,
  },
  workConditions: {
    preferredWorkTime: [workScheduleSchema],
    desiredSalary: { type: Number, min: 15000 },
    availableStartDate: { type: Date },
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

carerSchema.index({
  "address.city": 1,
  "address.subCity": 1,
  "address.subSubCity": 1,
});
carerSchema.index({
  "workingArea.city": 1,
  "workingArea.subCity": 1,
  "workingArea.subSubCity": 1,
});

carerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Carer", carerSchema);
