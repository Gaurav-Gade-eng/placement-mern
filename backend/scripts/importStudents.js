const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

// connect database
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const students = [];

fs.createReadStream("data/civil_students.csv")
.pipe(csv())
.on("data", (row) => {

  students.push({
    adm_no: row.Adm_no,
    name: row["Student Name"],
    email: row.Email || "",

    phone: row.Phone || "",          // NEW FIELD
    gender: row.Gender || "",        // NEW FIELD

    password: bcrypt.hashSync(row.Adm_no, 10),

    role: "student",

    department: "Civil",                // since these are IT students

    cgpa: 0,
    year: 3,
    semester: 6,

    skills:row.Skills ? row.Skills.split(",") : [],
    resume: ""
  });

})
.on("end", async () => {

  try {

    await User.insertMany(students);

    console.log("Students Imported Successfully");
    console.log("Total students:", students.length);

    process.exit();

  } catch (error) {

    console.log(error);

  }

});