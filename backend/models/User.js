// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  adm_no: String,
  name: String,
  email: String,
  phone: String,
  gender: String,

  password: String,

  role: {
    type: String,
    enum: ["student", "tpo"],   // ❌ removed "hod"
    default: "student"
  },

  department: {
    type: String,
    enum: ["IT", "MECH", "ENTC", "ELECTRICAL", "CIVIL"]
  },

  cgpa: Number,
  year: Number,
  semester: Number,

  skills: [String],

  resume: {
    type: String,
    default: ""
  },

  otp: {
    type: String
  },

  otpExpire: {
    type: Date
  },
  isPlaced: {
  type: Boolean,
  default: false
},
status: {
  type: String,
  default: "open" // open | placed
}
  
});

module.exports = mongoose.model("User", userSchema);