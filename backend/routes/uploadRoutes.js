const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const upload = multer({ dest: "uploads/" });

router.post("/students", upload.single("file"), async (req, res) => {

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {

      for (let row of results) {

        const hashedPassword = await bcrypt.hash("123456",10);

        await User.create({
          adm_no: row.adm_no,
          name: row.name,
          email: row.email,
          phone: row.phone,
          gender: row.gender,
          department: row.department,
          password: hashedPassword,
          role: "student"
        });

      }

      fs.unlinkSync(req.file.path);

      res.json({
        message: "Students Imported Successfully",
        count: results.length
      });

    });

});

module.exports = router;