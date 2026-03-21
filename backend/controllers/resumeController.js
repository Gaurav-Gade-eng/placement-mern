const User = require("../models/User");

exports.uploadResume = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.body.userId, {
      resume: filePath
    });

    res.json({
      message: "Resume uploaded",
      url: filePath
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};