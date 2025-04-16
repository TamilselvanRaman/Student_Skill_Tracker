const mongoess = require("mongoose");

const StudentDetail = new mongoess.Schema({
  Username: {
    type: String,
    required: [true, "Please add a Username"],
  },
  email: {
    type: String,
    required: [true, "Please add a Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
  },
});

module.exports = mongoess.model("Student", StudentDetail);
