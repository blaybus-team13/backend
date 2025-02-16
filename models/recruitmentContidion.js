const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workScheduleSchema = new Schema({
  days: [
    {
      type: String,
      enum: ["월", "화", "수", "목", "금"],
      required: true,
    },
  ],
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/,
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/,
  },
});

const caregiverRecruitmentSchema = new Schema(
  {
    // Senior 참조 추가
    senior: {
      type: Schema.Types.ObjectId,
      ref: "Senior",
      required: true,
    },
    recruitmentId: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    schedule: {
      type: workScheduleSchema,
      required: true,
    },
    hourlyWage: {
      type: Number,
      required: true,
      min: 0,
    },
    // Senior의 요구사항과 매칭되는 필드들
    requiredQualifications: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    matchingCareRequirements: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed"],
      default: "open",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    totalHoursPerDay: {
      type: Number,
      required: true,
    },
    estimatedMonthlyWage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "caregiver_recruitments",
  }
);
