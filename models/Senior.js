const mongoose = require("mongoose");

const seniorSchema = new mongoose.Schema({
  basicInfo: {
    seniorProfileImage: { type: String, required: false },
    name: { type: String, required: true },
    birthDate: { type: Date, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["남", "여"], required: true },
    address: { type: [String], required: true },
    tel: { type: String, required: true, unique: true },
  },
  careInfo: {
    weight: { type: Number, required: true },
    hasCohabitant: { type: Boolean, required: true },
  },
  schedule: {
    workingSchedule: [
      {
        day: { type: String, required: true },
        hours: {
          type: [Number],
          required: true,
          validate: {
            validator: function (v) {
              return (
                v.length === 4 &&
                v[0] >= 0 &&
                v[0] <= 23 &&
                v[1] >= 0 &&
                v[1] <= 59 &&
                v[2] >= 0 &&
                v[2] <= 23 &&
                v[3] >= 0 &&
                v[3] <= 59
              );
            },
            message: (props) =>
              `${props.value}은 옳지 않음. [시작 시간, 시작 분, 끝 시간, 끝 분].`,
          },
        },
      },
    ],
  },
  care: {
    medicalConditions: { type: [String] },
    reqServices: { type: [String], required: true },
    specificRequirements: { type: String },
  },
  reqCarer: {
    reqWorkingSchedule: [
      {
        day: { type: String, required: true },
        hours: {
          type: [Number],
          required: true,
          validate: {
            validator: function (v) {
              return (
                v.length === 4 &&
                v[0] >= 0 &&
                v[0] <= 23 &&
                v[1] >= 0 &&
                v[1] <= 59 &&
                v[2] >= 0 &&
                v[2] <= 23 &&
                v[3] >= 0 &&
                v[3] <= 59
              );
            },
            message: (props) =>
              `${props.value}은 옳지 않음. [시작 시간, 시작 분, 끝 시간, 끝 분].`,
          },
        },
      },
    ],
    expectedStartDate: { type: Date },
    desiredSalary: {
      type: Number,
      min: 12000,
    },
  },
  plus: {
    managerTel: { type: String, required: true },
    managerEmail: { type: String, required: true },
  },
});

seniorSchema.pre("save", function (next) {
  const currentYear = new Date().getFullYear();
  const birthYear = this.basicInfo.birthDate.getFullYear();
  this.age = currentYear - birthYear + 1;
  next();
});

module.exports = mongoose.model("Senior", seniorSchema);

// 기본 정보: 프로필, 이름, 생년월일, 나이(연 나이 자동 계산), 성별, 주소(시/구/동), 전화번호
// 요양 정보: 몸무게, 동거인 여부(집에 있음 또는 자리 비움), 장기 요양 등급
// 일정 정보: 요일 + 시작시간~끝시간
// -> 요일마다 저장 시간 다르게 ex) [9,20,17,30],[10,0,17,0]
// 케어 필요 항목: 건강 상태/질환, 필요 서비스, 상세요구사항
// 요양 보호사 모집 조건: 날짜(예상 근무시작일), 요일 + 시작시간~끝시간, 시간, 희망 급여(12000 이상)

// 피그마 필요 데이터: 담당자 연락처(전화번호/메일)
