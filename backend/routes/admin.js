const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* Get all students (TPO only) */

router.get("/students", async (req, res) => {

  try {

    const role = req.query.role;

    // Only TPO allowed
    if (role !== "tpo") {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await User.find({ role: "student" });

    res.json(students);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;