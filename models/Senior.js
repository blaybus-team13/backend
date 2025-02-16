const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const seniorSchema = new Schema(
  {
    seniorId: {
      type: Number,
      required: true,
      unique: true,
    },
    basicInfo: {
      name: {
        type: String,
        required: true,
      },
      birthDate: {
        type: Date,
        required: true,
      },
      gender: {
        type: String,
        enum: ["남성", "여성성"],
        required: true,
      },
    },
    careInfo: {
      careGrade: {
        type: String,
        enum: [
          "등급없음",
          "1등급",
          "2등급",
          "3등급",
          "4등급",
          "5등급",
          "인적지원 등급",
        ],
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      diseaseInfo: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: true,
      },
    },
    schedule: {
      careDays: {
        type: [
          {
            type: String,
            enum: ["월", "화", "수", "목", "금", "토", "일"],
          },
        ],
        required: true,
      },
      careStartTime: {
        type: Date,
        required: true,
      },
      careEndTime: {
        type: Date,
        required: true,
      },
    },

    additionalInfo: {
      type: [
        {
          type: String,
          enum: [
            "가사도우미 있음",
            "주차가능",
            "반려동물 있음",
            "집 평수 30평 이상",
          ],
        },
      ],
      required: false,
    },
    mealAssistance: {
      type: [
        {
          type: String,
          enum: [
            "스스로 식사 가능",
            "식사 차려드리기",
            "죽, 반찬 등 조리 필요",
            "경관식 보조",
          ],
        },
      ],
      required: true,
    },
    toiletAssistance: {
      type: [
        {
          type: String,
          enum: [
            "스스로 배변 가능",
            "가끔 대소변 실수 시 도움",
            "기저귀 케어 필요",
            "유치도뇨/방광루/장루 관리",
          ],
        },
      ],
      required: true,
    },
    mobilityAssistance: {
      type: [
        {
          type: String,
          enum: [
            "스스로 거동 가능",
            "이동시 부축 도움",
            "휠체어 이동 보조",
            "거동 불가",
          ],
        },
      ],
      required: true,
    },
    dailyLifeService: {
      type: [
        {
          type: String,
          enum: [
            "청소, 빨래 보조",
            "목욕 보조",
            "병원 동행행",
            "산책, 간단한 운동",
            "말벗 등 정서지원",
            "인지자극 활동",
          ],
        },
      ],
      required: true,
    },
    additionalService: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "seniors",
  }
);

const Senior = mongoose.model("Senior", seniorSchema);

module.exports = Senior;
