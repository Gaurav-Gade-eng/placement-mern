const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

  console.log("MongoDB Connected");

  await User.deleteMany({ role: "student" });

  console.log("All students deleted successfully");

  process.exit();

})
.catch(err => console.log(err));