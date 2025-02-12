const mongoose = require("mongoose");

const jobConditionSchema = new mongoose.Schema({
    workingDays: { type: [String], required: true },
    workingHours: { type: [Number], required: true },
    minSalary: { type: Number, required: true },
});

module.exports = mongoose.model("JobCondition", jobConditionSchema);