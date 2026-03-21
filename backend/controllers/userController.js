const User = require("../models/User");

/* GET PROFILE */
exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* UPDATE PROFILE */
exports.updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.department = req.body.department || user.department;
    user.cgpa = req.body.cgpa || user.cgpa;
    user.semester = req.body.semester || user.semester;

    // 🔥 IMPORTANT (skills fix)
    if (req.body.skills) {
      user.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(",");
    }

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ✅ MARK PLACED */
exports.markPlaced = async (req, res) => {
  try {

    if (req.user.role !== "tpo") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (user.role !== "student") {
      return res.status(400).json({ message: "Invalid user" });
    }

    user.isPlaced = true;
    user.status = "placed";

    await user.save();

    res.json({ message: "Marked as placed", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ✅ MARK UNPLACED */
exports.markUnplaced = async (req, res) => {
  try {

    if (req.user.role !== "tpo") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    user.isPlaced = false;
    user.status = "open";

    await user.save();

    res.json({ message: "Marked as unplaced", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};