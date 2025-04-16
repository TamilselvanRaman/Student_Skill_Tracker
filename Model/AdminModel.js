const mongoose = require("mongoose")
const AdminDetail = new mongoose.Schema(
  {
    Username: {
      type: String,
      required: [true, "Please add a Username"],
    },
    email: {
      type: String,
      required: [true, "Please add a Email"],
      unique: true 
    },
    password: {
      type: String,
      required: [true, "Please add a start date"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminDetail);
