// models/dashboardModel.js
const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema(
  {
    FilePath: { type: String, required: true }, // URL to the uploaded file
    Student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    studentStatus: { type: Boolean, default: false },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dashboard", dashboardSchema);
