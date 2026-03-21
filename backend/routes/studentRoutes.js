const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// ADD STUDENT (TPO only)
router.post("/add", async (req, res) => {
  try {
    const { name, email, password, cgpa, department, semester } = req.body;

    // check existing
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
      cgpa,
      department,
      semester
    });

    await student.save();

    res.json({ message: "Student added successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding student" });
  }
});

module.exports = router;