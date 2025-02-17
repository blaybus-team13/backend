const mongoose = require("mongoose");

const carerJobConditionSchema = new mongoose.Schema({
  // 근무 희망 지역
  city: { type: String, required: true }, // 시
  subCity: { type: String, required: true }, // 구
  subSubCity: { type: String, required: true }, // 동
  cityDetail: { type: String, required: true }, // 상세주소

  // 근무 요일
  workingDays: {
    monday: { type: Boolean, default: false },
    tuesday: { type: Boolean, default: false },
    wednesday: { type: Boolean, default: false },
    thursday: { type: Boolean, default: false },
    friday: { type: Boolean, default: false },
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false },
  },

  // 근무 시간
  workingTime: {
    morning: { type: Boolean, default: false },
    afternoon: { type: Boolean, default: false },
    night: { type: Boolean, default: false },
  },

  // 희망 급여
  desiredSalary: {
    type: Number,
    required: true,
    min: [100020, "최저 시급은 10,020원 입니다."],
  },
});

// 인덱스 설정
jobConditionSchema.index({ city: 1, subCity: 1, subSubCity: 1 });

module.exports = mongoose.model("CarerJobCondition", carerJobConditionSchema);
