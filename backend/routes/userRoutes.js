const express = require("express");
const router = express.Router();

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

const {
  markPlaced,
  markUnplaced
} = require("../controllers/userController");

/* ✅ ROUTES */
router.put("/mark-placed/:id", protect, markPlaced);
router.put("/mark-unplaced/:id", protect, markUnplaced);

/* GET STUDENTS */
router.get("/students", protect, async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;